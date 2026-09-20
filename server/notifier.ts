import nodemailer from "nodemailer";

interface PreviewSubmission {
  email: string;
  programUrl: string;
  cohortStartDate: string;
  ref?: string;
  a?: string;
  createdAt?: string;
  id?: string;
}

export async function sendPreviewNotification(submission: PreviewSubmission): Promise<{ success: boolean; message: string }> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const defaultRecipients = ["jaimzz247@gmail.com", "teamlead@getportalbuild.com"];

  const envRecipients = (process.env.NOTIFICATION_EMAILS || "")
    .split(",")
    .map((e) => e.trim())
    .filter((e) => emailRegex.test(e));

  const recipients = envRecipients.length > 0 ? envRecipients : defaultRecipients;

  const subject = `🚀 New Portal Preview Request: ${submission.programUrl || submission.email}`;
  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #0b0f17; color: #e2e8f0; border-radius: 12px; border: 1px solid #1e293b;">
      <div style="border-bottom: 1px solid #334155; padding-bottom: 16px; margin-bottom: 20px;">
        <h2 style="color: #f97316; margin: 0 0 6px 0; font-size: 20px; font-weight: 700;">New Portal Preview Lead</h2>
        <p style="color: #94a3b8; margin: 0; font-size: 13px;">A prospect has submitted their curriculum and timeline for a 24-hour custom preview build.</p>
      </div>

      <div style="background-color: #111827; border-radius: 8px; padding: 18px; border: 1px solid #1f2937; margin-bottom: 20px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; width: 140px; font-weight: 600;">Work Email:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: 600;">
              <a href="mailto:${submission.email}" style="color: #38bdf8; text-decoration: none;">${submission.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Program URL:</td>
            <td style="padding: 8px 0; color: #ffffff;">
              <a href="${submission.programUrl.startsWith("http") ? submission.programUrl : "https://" + submission.programUrl}" target="_blank" style="color: #f97316; text-decoration: underline;">
                ${submission.programUrl}
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Next Cohort Starts:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: 500;">
              <span style="background-color: #f97316; color: #ffffff; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 700;">
                ${submission.cohortStartDate}
              </span>
            </td>
          </tr>
          ${submission.ref ? `
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Referral Ref:</td>
            <td style="padding: 8px 0; color: #cbd5e1; font-family: monospace;">${submission.ref}</td>
          </tr>
          ` : ""}
          ${submission.a ? `
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Attribution Tag:</td>
            <td style="padding: 8px 0; color: #cbd5e1; font-family: monospace;">${submission.a}</td>
          </tr>
          ` : ""}
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Submitted At:</td>
            <td style="padding: 8px 0; color: #94a3b8; font-size: 12px;">${submission.createdAt || new Date().toISOString()}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #1e293b;">
        <a href="mailto:${submission.email}?subject=Your%20Custom%20Portal%20Preview%20Build" style="display: inline-block; background-color: #f97316; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: 600;">
          Reply to ${submission.email}
        </a>
      </div>
    </div>
  `;

  // 1. Resend API support (if RESEND_API_KEY is provided)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const fromAddress = process.env.EMAIL_FROM || "PortalBuild Notifications <notifications@getportalbuild.com>";
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddress,
          to: recipients,
          subject,
          html: htmlContent,
        }),
      });

      if (response.ok) {
        console.log(`[Notifier] Notification email sent via Resend to: ${recipients.join(", ")}`);
        return { success: true, message: `Notification delivered to ${recipients.join(", ")}` };
      } else {
        const errJson = await response.json().catch(() => null);
        console.warn("[Notifier] Resend API returned error:", errJson);

        // If Resend is restricted to the sandbox registered account (e.g. jaxx700@gmail.com)
        if (errJson?.statusCode === 403 && errJson?.message?.includes("send testing emails to your own email address")) {
          const match = errJson.message.match(/\(([^)]+)\)/);
          const sandboxAccount = match ? match[1] : "jaxx700@gmail.com";

          console.log(`[Notifier] Sandbox restriction detected. Forwarding immediate alert to Resend account (${sandboxAccount}) so lead is captured.`);
          const fallbackRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "PortalBuild Notifications <onboarding@resend.dev>",
              to: [sandboxAccount],
              subject: `[LEAD ALERT] ${subject} (Intended for: ${recipients.join(", ")})`,
              html: `<div style="padding: 10px; background: #fff3cd; color: #856404; margin-bottom: 15px; border-radius: 6px;">
                <strong>Notice:</strong> To send directly to <code>${recipients.join(", ")}</code>, verify your domain <code>getportalbuild.com</code> at <a href="https://resend.com/domains">resend.com/domains</a> and set <code>EMAIL_FROM=notifications@getportalbuild.com</code>.
              </div>` + htmlContent,
            }),
          });

          if (fallbackRes.ok) {
            return {
              success: true,
              message: `Notification captured and delivered to sandbox inbox (${sandboxAccount}). Verify domain getportalbuild.com in Resend to enable direct delivery to ${recipients.join(", ")}.`,
            };
          }
        }
      }
    } catch (err) {
      console.error("[Notifier] Resend dispatch failed:", err);
    }
  }

  // 2. SMTP Transport (e.g., Gmail App Password or custom SMTP host)
  const smtpHost = process.env.SMTP_HOST || (process.env.GMAIL_USER ? "smtp.gmail.com" : "");
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT || 465),
        secure: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) === 465 : true,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM || `"PortalBuild Notifications" <${smtpUser}>`,
        to: recipients.join(", "),
        subject,
        html: htmlContent,
        text: `New Portal Preview Request\n\nWork Email: ${submission.email}\nProgram URL: ${submission.programUrl}\nCohort Start: ${submission.cohortStartDate}\nSubmitted At: ${submission.createdAt || new Date().toISOString()}`,
      });

      console.log(`[Notifier] Notification email sent via SMTP to: ${recipients.join(", ")}`);
      return { success: true, message: `Notification delivered via SMTP to ${recipients.join(", ")}` };
    } catch (err: any) {
      console.error("[Notifier] SMTP dispatch failed:", err.message || err);
    }
  }

  // 3. Webhook Dispatch (if NOTIFICATION_WEBHOOK_URL is configured, e.g. Zapier / Make / Slack / Discord)
  const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "preview_requested",
          submission,
          recipients,
          timestamp: new Date().toISOString(),
        }),
      });
      console.log(`[Notifier] Webhook dispatched to ${webhookUrl}`);
      return { success: true, message: "Notification delivered via Webhook" };
    } catch (err) {
      console.error("[Notifier] Webhook dispatch failed:", err);
    }
  }

  console.log(`[Notifier] Recipient list prepared (${recipients.join(", ")}). Configure SMTP_PASS/GMAIL_APP_PASSWORD or RESEND_API_KEY to activate live delivery.`);
  return {
    success: true,
    message: `Captured submission. Configure email credentials in environment to route live to ${recipients.join(", ")}.`,
  };
}
