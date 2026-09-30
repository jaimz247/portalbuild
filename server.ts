import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import {
  sendPreviewNotification,
  sendPartnerReferralNotification,
  sendPartnerSignupNotification,
  sendTestNotification,
} from "./server/notifier";
import {
  recordSubmission,
  getAllSubmissions,
  updateSubmissionStatus,
} from "./server/store";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON requests
  app.use(express.json());

  // API route: Preview Request Instant Notification & Store
  app.post("/api/notify-preview", async (req, res) => {
    try {
      const { email, programUrl, cohortStartDate, ref, a, createdAt, id } = req.body;
      if (!email || !programUrl) {
        return res.status(400).json({ error: "Email and programUrl are required." });
      }

      const stored = recordSubmission("preview_request", {
        id,
        email,
        programUrl,
        cohortStartDate: cohortStartDate || "Not specified",
        ref,
        a,
        createdAt: createdAt || new Date().toISOString(),
        status: "pending_preview",
      });

      const result = await sendPreviewNotification({
        email,
        programUrl,
        cohortStartDate: cohortStartDate || "Not specified",
        ref,
        a,
        createdAt: stored.createdAt,
        id: stored.id,
      });

      return res.json({ success: true, id: stored.id, notification: result });
    } catch (err: any) {
      console.error("Preview notification error:", err);
      return res.status(500).json({ error: err.message || "Failed to dispatch notification." });
    }
  });

  // API route: Partner Client Referral Submission & Notification
  app.post("/api/partner-referral", async (req, res) => {
    try {
      const { name, email, clientProgramUrl, referralCode, cohortDate, notes, previewRecipient, id, createdAt } = req.body;
      if (!name || !email || !clientProgramUrl) {
        return res.status(400).json({ error: "Name, email and clientProgramUrl are required." });
      }

      const stored = recordSubmission("partner_referral", {
        id,
        name,
        email,
        clientProgramUrl,
        referralCode: referralCode || "",
        cohortDate: cohortDate || "Not specified",
        notes: notes || "",
        previewRecipient: previewRecipient || "to_me",
        createdAt: createdAt || new Date().toISOString(),
        status: "pending_partner_review",
      });

      console.log(`[Partner Referral] Stored #${stored.id} from ${name} (${email}) for client ${clientProgramUrl}`);

      const result = await sendPartnerReferralNotification({
        id: stored.id,
        name,
        email,
        clientProgramUrl,
        referralCode,
        cohortDate,
        notes,
        previewRecipient,
        createdAt: stored.createdAt,
      });

      return res.json({ success: true, id: stored.id, notification: result });
    } catch (err: any) {
      console.error("Partner referral error:", err);
      return res.status(500).json({ error: err.message || "Failed to process partner referral." });
    }
  });

  // API route: Partner Signup / Partner Code Request & Notification
  app.post("/api/partner-signup", async (req, res) => {
    try {
      const { name, email, whatYouDo, groupClientsCount, websiteOrLinkedIn, id, createdAt } = req.body;
      if (!name || !email || !whatYouDo || !groupClientsCount) {
        return res.status(400).json({ error: "Name, email, whatYouDo, and groupClientsCount are required." });
      }

      const stored = recordSubmission("partner_signup", {
        id,
        name,
        email,
        whatYouDo,
        groupClientsCount,
        websiteOrLinkedIn: websiteOrLinkedIn || "",
        createdAt: createdAt || new Date().toISOString(),
        status: "pending_partner_approval",
      });

      console.log(`[Partner Signup] Stored #${stored.id} for ${name} (${email}) - ${whatYouDo}`);

      const result = await sendPartnerSignupNotification({
        id: stored.id,
        name,
        email,
        whatYouDo,
        groupClientsCount,
        websiteOrLinkedIn,
        createdAt: stored.createdAt,
      });

      return res.json({ success: true, id: stored.id, notification: result });
    } catch (err: any) {
      console.error("Partner signup error:", err);
      return res.status(500).json({ error: err.message || "Failed to process partner signup." });
    }
  });

  // API route: Admin retrieve all submissions (cohort preview leads, partner referrals, partner signups)
  app.get("/api/admin/submissions", (req, res) => {
    try {
      const type = (req.query.type as string) || "all";
      const submissions = getAllSubmissions(type);
      const counts = {
        total: getAllSubmissions().length,
        preview_requests: getAllSubmissions("preview_request").length,
        partner_referrals: getAllSubmissions("partner_referral").length,
        partner_signups: getAllSubmissions("partner_signup").length,
      };
      return res.json({ success: true, counts, submissions });
    } catch (err: any) {
      console.error("Fetch submissions error:", err);
      return res.status(500).json({ error: "Failed to fetch submissions." });
    }
  });

  // API route: Admin update status of a submission
  app.post("/api/admin/submissions/status", (req, res) => {
    try {
      const { id, status } = req.body;
      if (!id || !status) {
        return res.status(400).json({ error: "id and status are required." });
      }
      const updated = updateSubmissionStatus(id, status);
      return res.json({ success: updated });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to update submission status." });
    }
  });

  // API route: Admin Test Notification Dispatch
  app.post("/api/admin/test-notification", async (req, res) => {
    try {
      const { targetEmail } = req.body;
      const result = await sendTestNotification(targetEmail);
      return res.json({ success: true, result });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Test dispatch failed." });
    }
  });

  // API route: AI Notes Analysis
  app.post("/api/notes/analyze", async (req, res) => {
    try {
      const { notes } = req.body;
      if (!notes || typeof notes !== "string" || !notes.trim()) {
        return res.status(400).json({ error: "No notes provided to analyze." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "GEMINI_API_KEY is not defined in the server environment. Please configure it in your Secrets settings." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `Analyze the following administrative note. Categorize it with topic tags/keywords and a sentiment rating.
Note: "${notes}"`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an AI-powered notes categorization system. Analyze the administrative notes structure. Determine the sentiment ('Positive', 'Neutral', 'Negative') and a list of specific topic keywords/tags (e.g. 'Technical Support', 'Billing Inquiry', 'Workflow Setup', 'Coaching', 'Business Development', 'Integration Requested', 'Urgent'). Always provide your response in JSON format matching the schema.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sentiment: {
                type: Type.STRING,
                description: "The primary sentiment of the note: 'Positive', 'Neutral', or 'Negative'."
              },
              keywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A list of 2 to 4 precise classification topic labels."
              },
              summary: {
                type: Type.STRING,
                description: "A quick, single-sentence summary of the evaluation."
              }
            },
            required: ["sentiment", "keywords", "summary"]
          }
        }
      });

      const parsedData = JSON.parse(response.text || "{}");
      res.json(parsedData);
    } catch (err: any) {
      console.error("AI notes analysis error:", err);
      res.status(500).json({ error: err.message || "Failed to analyze notes." });
    }
  });

  // API route: External Sync (mock testing endpoint for webhook simulation or health)
  app.all("/api/test-webhook", (req, res) => {
    res.json({
      success: true,
      received: {
        method: req.method,
        headers: req.headers,
        body: req.body,
        query: req.query
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: any, res: any) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start fullstack server:", err);
});
