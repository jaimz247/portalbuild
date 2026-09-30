import nodemailer from "nodemailer";

export interface PreviewSubmission {
  email: string;
  programUrl: string;
  cohortStartDate: string;
  ref?: string;
  a?: string;
  createdAt?: string;
  id?: string;
}

export interface PartnerReferralSubmission {
  id?: string;
  name: string;
  email: string;
  referralCode?: string;
  clientProgramUrl: string;
  cohortDate?: string;
  notes?: string;
  previewRecipient?: string; // 'to_me' | 'to_client'
  createdAt?: string;
}

export interface PartnerSignupSubmission {
  id?: string;
  name: string;
  email: string;
  whatYouDo: string;
  groupClientsCount: string;
  websiteOrLinkedIn?: string;
  createdAt?: string;
}

export interface DispatchResult {
  success: boolean;
  message: string;
  method?: "resend" | "smtp" | "webhook" | "logged";
  recipients?: string[];
}

function getRecipients(): string[] {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const defaultRecipients = ["jaimzz247@gmail.com", "teamlead@getportalbuild.com"];

  const envRecipients = (process.env.NOTIFICATION_EMAILS || "")
    .split(",")
    .map((e) => e.trim())
    .filter((e) => emailRegex.test(e));

  return envRecipients.length > 0 ? envRecipients : defaultRecipients;
}

/**
 * Core dispatch engine handling Resend API, SMTP Nodemailer, and Webhooks
 */
async function dispatchEmailNotification({
  subject,
  htmlContent,
  textContent,
  eventType,
  metadata,
}: {
  subject: string;
  htmlContent: string;
  textContent: string;
  eventType: string;
  metadata: Record<string, any>;
}): Promise<DispatchResult> {
  const recipients = getRecipients();

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
        console.log(`[Notifier] Email sent via Resend to: ${recipients.join(", ")}`);
        return { success: true, message: `Delivered via Resend to ${recipients.join(", ")}`, method: "resend", recipients };
      } else {
        const errJson = await response.json().catch(() => null);
        console.warn("[Notifier] Resend API returned error:", errJson);

        // If Resend is in free/sandbox mode and restricted to account owner email
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
                <strong>Notice:</strong> To send directly to <code>${recipients.join(", ")}</code>, verify domain <code>getportalbuild.com</code> at <a href="https://resend.com/domains">resend.com/domains</a>.
              </div>` + htmlContent,
            }),
          });

          if (fallbackRes.ok) {
            return {
              success: true,
              message: `Captured and delivered to Resend account inbox (${sandboxAccount}). Intended for: ${recipients.join(", ")}.`,
              method: "resend",
              recipients: [sandboxAccount],
            };
          }
        }
      }
    } catch (err) {
      console.error("[Notifier] Resend dispatch failed:", err);
    }
  }

  // 2. SMTP Transport (Gmail or custom SMTP)
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
        text: textContent,
      });

      console.log(`[Notifier] Notification email sent via SMTP to: ${recipients.join(", ")}`);
      return { success: true, message: `Notification delivered via SMTP to ${recipients.join(", ")}`, method: "smtp", recipients };
    } catch (err: any) {
      console.error("[Notifier] SMTP dispatch failed:", err.message || err);
    }
  }

  // 3. Webhook Dispatch (Zapier, Make, Slack, Discord, etc.)
  const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: eventType,
          subject,
          metadata,
          recipients,
          timestamp: new Date().toISOString(),
        }),
      });
      console.log(`[Notifier] Webhook dispatched to ${webhookUrl}`);
      return { success: true, message: "Notification delivered via Webhook", method: "webhook", recipients };
    } catch (err) {
      console.error("[Notifier] Webhook dispatch failed:", err);
    }
  }

  // Fallback logging: logged into memory & server console
  console.log(`[Notifier Logged] Recipient queue ready (${recipients.join(", ")}). Subject: "${subject}".`);
  return {
    success: true,
    message: `Captured and logged. Target recipients: ${recipients.join(", ")}.`,
    method: "logged",
    recipients,
  };
}

/**
 * 1. Dispatch Notification for Free Preview Requests (Home modal)
 */
export async function sendPreviewNotification(submission: PreviewSubmission): Promise<DispatchResult> {
  const subject = `🚀 New Portal Preview Request: ${submission.programUrl || submission.email}`;
  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #0b0f17; color: #e2e8f0; border-radius: 12px; border: 1px solid #1e293b;">
      <div style="border-bottom: 1px solid #334155; padding-bottom: 16px; margin-bottom: 20px;">
        <span style="display: inline-block; background-color: rgba(249, 115, 22, 0.15); color: #f97316; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 4px 8px; border-radius: 4px; margin-bottom: 8px;">Portal Preview Lead</span>
        <h2 style="color: #ffffff; margin: 0 0 6px 0; font-size: 20px; font-weight: 700;">New Cohort Preview Request</h2>
        <p style="color: #94a3b8; margin: 0; font-size: 13px;">A cohort operator submitted their curriculum for a 24-hour custom preview build.</p>
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
            <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Cohort Start:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: 500;">
              <span style="background-color: #ea580c; color: #ffffff; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 700;">
                ${submission.cohortStartDate}
              </span>
            </td>
          </tr>
          ${submission.ref ? `
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Partner Ref Code:</td>
            <td style="padding: 8px 0; color: #fb923c; font-family: monospace; font-weight: 700;">${submission.ref}</td>
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

      <div style="text-align: center; margin-top: 20px; padding-top: 16px; border-top: 1px solid #1e293b;">
        <a href="mailto:${submission.email}?subject=Your%20Custom%20Portal%20Preview%20Build" style="display: inline-block; background-color: #f97316; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: 600;">
          Reply to ${submission.email}
        </a>
      </div>
    </div>
  `;

  const textContent = `New Portal Preview Request\n\nWork Email: ${submission.email}\nProgram URL: ${submission.programUrl}\nCohort Start: ${submission.cohortStartDate}\nPartner Ref: ${submission.ref || "None"}\nSubmitted At: ${submission.createdAt || new Date().toISOString()}`;

  return dispatchEmailNotification({
    subject,
    htmlContent,
    textContent,
    eventType: "preview_requested",
    metadata: submission,
  });
}

/**
 * 2. Dispatch Notification for Partner Client Referrals (/partners form 1)
 */
export async function sendPartnerReferralNotification(referral: PartnerReferralSubmission): Promise<DispatchResult> {
  const recipientModeLabel = referral.previewRecipient === "to_client" 
    ? "Send preview directly to Client (cc Partner)" 
    : "Send preview to Partner to hand over";

  const subject = `💼 Partner Referral: ${referral.name} referred ${referral.clientProgramUrl}`;
  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #0b0f17; color: #e2e8f0; border-radius: 12px; border: 1px solid #1e293b;">
      <div style="border-bottom: 1px solid #334155; padding-bottom: 16px; margin-bottom: 20px;">
        <span style="display: inline-block; background-color: rgba(56, 189, 248, 0.15); color: #38bdf8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 4px 8px; border-radius: 4px; margin-bottom: 8px;">Partner Programme Referral</span>
        <h2 style="color: #ffffff; margin: 0 0 6px 0; font-size: 20px; font-weight: 700;">New Client Referral Submitted</h2>
        <p style="color: #94a3b8; margin: 0; font-size: 13px;">A registered partner has introduced an eligible cohort client to PortalBuild.</p>
      </div>

      <div style="background-color: #111827; border-radius: 8px; padding: 18px; border: 1px solid #1f2937; margin-bottom: 20px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; width: 140px; font-weight: 600;">Partner Name:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: 600;">${referral.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Partner Email:</td>
            <td style="padding: 8px 0; color: #ffffff;">
              <a href="mailto:${referral.email}" style="color: #38bdf8; text-decoration: none;">${referral.email}</a>
            </td>
          </tr>
          ${referral.referralCode ? `
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Referral Code:</td>
            <td style="padding: 8px 0; color: #fb923c; font-family: monospace; font-weight: 700;">${referral.referralCode}</td>
          </tr>
          ` : ""}
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Client Program URL:</td>
            <td style="padding: 8px 0; color: #ffffff;">
              <a href="${referral.clientProgramUrl.startsWith("http") ? referral.clientProgramUrl : "https://" + referral.clientProgramUrl}" target="_blank" style="color: #f97316; text-decoration: underline; font-weight: 600;">
                ${referral.clientProgramUrl}
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Cohort Start Date:</td>
            <td style="padding: 8px 0; color: #cbd5e1;">${referral.cohortDate || "Not specified"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Delivery Route:</td>
            <td style="padding: 8px 0; color: #10b981; font-weight: 600;">${recipientModeLabel}</td>
          </tr>
          ${referral.notes ? `
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; vertical-align: top; font-weight: 600;">Partner Notes:</td>
            <td style="padding: 8px 0; color: #e2e8f0; line-height: 1.5; background: #0b0f17; border-radius: 6px; padding: 10px; margin-top: 4px;">
              ${referral.notes}
            </td>
          </tr>
          ` : ""}
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Submission Time:</td>
            <td style="padding: 8px 0; color: #94a3b8; font-size: 12px;">${referral.createdAt || new Date().toISOString()}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin-top: 20px; padding-top: 16px; border-top: 1px solid #1e293b;">
        <a href="mailto:${referral.email}?subject=Re:%20Your%20PortalBuild%20Client%20Referral%20(${referral.clientProgramUrl})" style="display: inline-block; background-color: #f97316; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: 600;">
          Reply to Partner (${referral.name})
        </a>
      </div>
    </div>
  `;

  const textContent = `New Partner Client Referral\n\nPartner: ${referral.name} (${referral.email})\nReferral Code: ${referral.referralCode || "None"}\nClient URL: ${referral.clientProgramUrl}\nCohort Date: ${referral.cohortDate || "N/A"}\nDelivery Route: ${recipientModeLabel}\nNotes: ${referral.notes || "None"}`;

  return dispatchEmailNotification({
    subject,
    htmlContent,
    textContent,
    eventType: "partner_referral_submitted",
    metadata: referral,
  });
}

/**
 * 3. Dispatch Notification for Partner Signups / Kit Requests (/partners form 2)
 */
export async function sendPartnerSignupNotification(signup: PartnerSignupSubmission): Promise<DispatchResult> {
  const subject = `🤝 New Partner Application: ${signup.name} (${signup.whatYouDo})`;
  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #0b0f17; color: #e2e8f0; border-radius: 12px; border: 1px solid #1e293b;">
      <div style="border-bottom: 1px solid #334155; padding-bottom: 16px; margin-bottom: 20px;">
        <span style="display: inline-block; background-color: rgba(16, 185, 129, 0.15); color: #10b981; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 4px 8px; border-radius: 4px; margin-bottom: 8px;">Partner Onboarding</span>
        <h2 style="color: #ffffff; margin: 0 0 6px 0; font-size: 20px; font-weight: 700;">Partner Code & Kit Requested</h2>
        <p style="color: #94a3b8; margin: 0; font-size: 13px;">A new agency, consultant, or operator requested their referral code and partner deck.</p>
      </div>

      <div style="background-color: #111827; border-radius: 8px; padding: 18px; border: 1px solid #1f2937; margin-bottom: 20px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; width: 140px; font-weight: 600;">Applicant Name:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: 600;">${signup.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Email Address:</td>
            <td style="padding: 8px 0; color: #ffffff;">
              <a href="mailto:${signup.email}" style="color: #38bdf8; text-decoration: none;">${signup.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Role / Service:</td>
            <td style="padding: 8px 0; color: #fb923c; font-weight: 600;">${signup.whatYouDo}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Group Clients Count:</td>
            <td style="padding: 8px 0; color: #ffffff;">${signup.groupClientsCount}</td>
          </tr>
          ${signup.websiteOrLinkedIn ? `
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Website / LinkedIn:</td>
            <td style="padding: 8px 0; color: #38bdf8;">
              <a href="${signup.websiteOrLinkedIn.startsWith("http") ? signup.websiteOrLinkedIn : "https://" + signup.websiteOrLinkedIn}" target="_blank" style="color: #38bdf8; text-decoration: underline;">
                ${signup.websiteOrLinkedIn}
              </a>
            </td>
          </tr>
          ` : ""}
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Requested At:</td>
            <td style="padding: 8px 0; color: #94a3b8; font-size: 12px;">${signup.createdAt || new Date().toISOString()}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin-top: 20px; padding-top: 16px; border-top: 1px solid #1e293b;">
        <a href="mailto:${signup.email}?subject=Welcome%20to%20PortalBuild%20Partner%20Programme%20%E2%80%94%20Your%20Partner%20Code" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: 600;">
          Issue Partner Code to ${signup.name}
        </a>
      </div>
    </div>
  `;

  const textContent = `New Partner Application\n\nName: ${signup.name}\nEmail: ${signup.email}\nWhat they do: ${signup.whatYouDo}\nGroup Clients: ${signup.groupClientsCount}\nWebsite: ${signup.websiteOrLinkedIn || "None"}`;

  return dispatchEmailNotification({
    subject,
    htmlContent,
    textContent,
    eventType: "partner_signup_submitted",
    metadata: signup,
  });
}

/**
 * 4. Dispatch a Test Notification for admin verification
 */
export async function sendTestNotification(targetEmail?: string): Promise<DispatchResult> {
  const recipients = targetEmail ? [targetEmail] : getRecipients();
  const subject = `🔔 PortalBuild Notification System Verification — [OK]`;
  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #0b0f17; color: #e2e8f0; border-radius: 12px; border: 1px solid #1e293b;">
      <div style="border-bottom: 1px solid #334155; padding-bottom: 16px; margin-bottom: 20px;">
        <span style="display: inline-block; background-color: rgba(16, 185, 129, 0.15); color: #10b981; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 4px 8px; border-radius: 4px; margin-bottom: 8px;">System Test</span>
        <h2 style="color: #ffffff; margin: 0 0 6px 0; font-size: 20px; font-weight: 700;">Notification Pipeline is Operational</h2>
        <p style="color: #94a3b8; margin: 0; font-size: 13px;">This test confirms your notification dispatch pipeline is active and delivering alerts.</p>
      </div>
      <div style="background-color: #111827; border-radius: 8px; padding: 18px; border: 1px solid #1f2937; margin-bottom: 20px; font-size: 13px; color: #cbd5e1;">
        <p style="margin: 0 0 10px 0;"><strong>Active Notification Inboxes:</strong> ${recipients.join(", ")}</p>
        <p style="margin: 0 0 10px 0;"><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p style="margin: 0;"><strong>Monitored Forms:</strong> Free Preview Leads, Partner Client Referrals, Partner Code Requests.</p>
      </div>
    </div>
  `;
  const textContent = `PortalBuild Notification System Verification Test\nTimestamp: ${new Date().toISOString()}\nTarget Recipients: ${recipients.join(", ")}`;

  return dispatchEmailNotification({
    subject,
    htmlContent,
    textContent,
    eventType: "system_test_notification",
    metadata: { test: true, timestamp: new Date().toISOString() },
  });
}
