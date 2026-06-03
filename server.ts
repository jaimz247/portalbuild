import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON requests
  app.use(express.json());

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
        model: "gemini-3.5-flash",
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
