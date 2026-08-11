import { BrandQuestionnaireState } from "../types";
import { BRAND_ARCHETYPES } from "../data/archetypes";

export interface SendGmailOptions {
  clientEmail: string;
  strategistEmail: string;
  accessToken: string;
  senderName?: string;
  notes?: string;
  docUrl?: string;
}

export interface GmailSendResult {
  success: boolean;
  message: string;
  messageId?: string;
}

function encodeBase64Url(str: string): string {
  // UTF-8 base64 encoding safe for URL
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function generateBlueprintHtmlEmail(
  state: BrandQuestionnaireState,
  options: { senderName?: string; notes?: string; docUrl?: string }
): string {
  const brandName = state.brandName.trim() || "Brand Client";
  const primaryArch = BRAND_ARCHETYPES.find((a) => a.id === state.primaryArchetype);
  const secondaryArch = BRAND_ARCHETYPES.find((a) => a.id === state.secondaryArchetype);

  const uvpSentence = state.uvp.offering
    ? `Our ${state.uvp.offering} is the only ${state.uvp.category || "offering"} that ${
        state.uvp.benefit || "delivers distinct value"
      } for ${state.uvp.targetAudience || "our target customers"}.`
    : "Not fully generated yet.";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>The Onawa Studio Brand Blueprint</title>
</head>
<body style="margin:0; padding:0; background-color:#090d16; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; color:#f8fafc;">
  <div style="max-width:680px; margin:0 auto; padding:32px 20px;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); border:2px solid #00FFC2; border-radius:20px; padding:32px; text-align:center; margin-bottom:24px; box-shadow:0 20px 40px rgba(0,255,194,0.15);">
      <div style="display:inline-block; padding:4px 12px; background-color:#C1FF00; color:#020617; font-size:11px; font-weight:900; letter-spacing:2px; border-radius:12px; text-transform:uppercase; margin-bottom:12px;">
        ONAWA STUDIO DISCOVERY PORTAL
      </div>
      <h1 style="color:#ffffff; font-size:28px; font-weight:900; margin:0 0 8px 0; line-height:1.2;">
        The Onawa Studio Brand Blueprint
      </h1>
      <p style="color:#C1FF00; font-size:16px; font-weight:700; margin:0 0 16px 0;">
        Curated for ${brandName} by Clyde Strydom
      </p>
      <p style="color:#94a3b8; font-size:13px; margin:0;">
        Industry: ${state.industry || "General"} &bull; Type: ${state.projectType === "rebrand" ? "Strategic Rebrand" : "New Brand Launch"}
      </p>
    </div>

    <!-- Google Doc Link Callout if available -->
    ${
      options.docUrl
        ? `
    <div style="background-color:#022c22; border:2px solid #00FFC2; border-radius:16px; padding:24px; text-align:center; margin-bottom:24px;">
      <div style="font-size:11px; font-weight:900; color:#00FFC2; text-transform:uppercase; letter-spacing:2px; margin-bottom:6px;">
        Interactive Google Doc Brand Style Guide Created
      </div>
      <p style="color:#e2e8f0; font-size:14px; margin:0 0 16px 0;">
        A live Google Document for <strong>${brandName}</strong> has been created and attached to your Google Drive workspace.
      </p>
      <a href="${options.docUrl}" target="_blank" style="display:inline-block; padding:12px 28px; background-color:#C1FF00; color:#020617; font-size:14px; font-weight:900; text-decoration:none; border-radius:12px; box-shadow:0 10px 20px rgba(193,255,0,0.2);">
        📄 Open Google Doc Style Guide
      </a>
    </div>
    `
        : ""
    }

    <!-- Notes if provided -->
    ${
      options.notes
        ? `
    <div style="background-color:#1e293b; border-left:4px solid #00FFC2; border-radius:8px; padding:16px 20px; margin-bottom:24px;">
      <div style="font-size:11px; font-weight:700; color:#00FFC2; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">
        Client Notes / Instructions for Clyde
      </div>
      <div style="color:#e2e8f0; font-size:14px; font-style:italic;">
        "${options.notes}"
      </div>
    </div>
    `
        : ""
    }

    <!-- Brand Heart -->
    <div style="background-color:#0f172a; border:1px solid #334155; border-radius:16px; padding:24px; margin-bottom:20px;">
      <h2 style="color:#C1FF00; font-size:18px; font-weight:800; margin-top:0; border-bottom:1px solid #1e293b; padding-bottom:10px;">
        1. Brand Heart & Purpose
      </h2>
      <table style="width:100%; border-collapse:collapse; font-size:14px; color:#cbd5e1;">
        <tr>
          <td style="padding:8px 0; font-weight:bold; color:#00FFC2; width:120px;">Purpose:</td>
          <td style="padding:8px 0;">${state.brandHeart.purpose || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding:8px 0; font-weight:bold; color:#00FFC2;">Vision:</td>
          <td style="padding:8px 0;">${state.brandHeart.vision || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding:8px 0; font-weight:bold; color:#00FFC2;">Mission:</td>
          <td style="padding:8px 0;">${state.brandHeart.mission || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding:8px 0; font-weight:bold; color:#00FFC2;">Core Values:</td>
          <td style="padding:8px 0;">${state.brandHeart.values.join(", ") || "None specified"}</td>
        </tr>
      </table>
    </div>

    <!-- Golden Circle -->
    <div style="background-color:#0f172a; border:1px solid #334155; border-radius:16px; padding:24px; margin-bottom:20px;">
      <h2 style="color:#C1FF00; font-size:18px; font-weight:800; margin-top:0; border-bottom:1px solid #1e293b; padding-bottom:10px;">
        2. Simon Sinek's Golden Circle
      </h2>
      <div style="margin-bottom:12px;">
        <span style="color:#f59e0b; font-weight:bold;">WHY (Core Belief):</span>
        <p style="margin:4px 0 0 0; color:#e2e8f0; font-size:14px;">${state.goldenCircle.why || "N/A"}</p>
      </div>
      <div style="margin-bottom:12px;">
        <span style="color:#06b6d4; font-weight:bold;">HOW (Differentiating Process):</span>
        <p style="margin:4px 0 0 0; color:#e2e8f0; font-size:14px;">${state.goldenCircle.how || "N/A"}</p>
      </div>
      <div>
        <span style="color:#a855f7; font-weight:bold;">WHAT (Products & Offerings):</span>
        <p style="margin:4px 0 0 0; color:#e2e8f0; font-size:14px;">${state.goldenCircle.what || "N/A"}</p>
      </div>
    </div>

    <!-- Archetype & Positioning -->
    <div style="background-color:#0f172a; border:1px solid #334155; border-radius:16px; padding:24px; margin-bottom:20px;">
      <h2 style="color:#C1FF00; font-size:18px; font-weight:800; margin-top:0; border-bottom:1px solid #1e293b; padding-bottom:10px;">
        3. Archetype & Positioning Strategy
      </h2>
      <p style="margin:0 0 8px 0; font-size:14px; color:#e2e8f0;">
        <strong style="color:#00FFC2;">Primary Archetype:</strong> ${
          primaryArch ? `${primaryArch.name} ("${primaryArch.motto}")` : "Not selected"
        }
      </p>
      <p style="margin:0 0 16px 0; font-size:14px; color:#e2e8f0;">
        <strong style="color:#00FFC2;">Secondary Archetype:</strong> ${
          secondaryArch ? `${secondaryArch.name} ("${secondaryArch.motto}")` : "None"
        }
      </p>
      <div style="background-color:#1e293b; border-radius:12px; padding:16px;">
        <div style="font-size:12px; font-weight:bold; color:#C1FF00; text-transform:uppercase; margin-bottom:8px;">
          Unique Value Proposition (UVP)
        </div>
        <p style="margin:0; font-size:14px; color:#ffffff; font-style:italic; line-height:1.5;">
          "${uvpSentence}"
        </p>
      </div>
    </div>

    <!-- Strategist Sign-off -->
    <div style="background:linear-gradient(135deg, #064e3b 0%, #022c22 100%); border:2px solid #10b981; border-radius:16px; padding:24px; text-align:center; margin-bottom:24px;">
      <div style="font-size:12px; font-weight:800; color:#10b981; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">
        Alignment Complete
      </div>
      <p style="font-size:16px; font-style:italic; color:#ffffff; margin:0 0 8px 0;">
        "Alignment Complete. I look forward to bringing your vision to life."
      </p>
      <div style="font-size:14px; font-weight:bold; color:#C1FF00;">
        &mdash; Clyde Strydom, Onawa Studio
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center; font-size:12px; color:#64748b; border-top:1px solid #1e293b; padding-top:20px;">
      <p style="margin:0 0 4px 0;">&copy; 2026 Onawa Studio | Strategy by Clyde Strydom</p>
      <p style="margin:0; font-size:11px; color:#475569;">Sent automatically via Onawa Studio Discovery Experience &bull; Gmail Integration</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export async function sendBlueprintViaGmail(
  state: BrandQuestionnaireState,
  options: SendGmailOptions
): Promise<GmailSendResult> {
  const { clientEmail, strategistEmail, accessToken, senderName, notes, docUrl } = options;

  if (!accessToken) {
    return {
      success: false,
      message: "No Gmail OAuth access token provided. Please sign in with Google.",
    };
  }

  const htmlBody = generateBlueprintHtmlEmail(state, { senderName, notes, docUrl });
  const brandName = state.brandName.trim() || "Brand Client";

  // Recipients list: strategist and client (if client email provided and different)
  const recipients = Array.from(
    new Set(
      [strategistEmail, clientEmail]
        .filter(Boolean)
        .map((e) => e.trim().toLowerCase())
    )
  );

  let sentCount = 0;
  let lastMessageId = "";

  for (const recipient of recipients) {
    const rawSubject = `The Onawa Studio Brand Blueprint: Curated for ${brandName}`;
    // RFC 2822 email format
    const emailLines = [
      `To: ${recipient}`,
      `Subject: ${rawSubject}`,
      `Content-Type: text/html; charset=utf-8`,
      `MIME-Version: 1.0`,
      ``,
      htmlBody,
    ];

    const rawEmail = emailLines.join("\r\n");
    const encodedEmail = encodeBase64Url(rawEmail);

    try {
      const response = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            raw: encodedEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Gmail API error sending to", recipient, data);
        throw new Error(
          data.error?.message || `Gmail API error (${response.status})`
        );
      }

      sentCount++;
      lastMessageId = data.id;
    } catch (err: any) {
      console.error(`Failed sending to ${recipient}:`, err);
      // If one recipient fails, continue or throw
      if (recipients.length === 1) {
        return {
          success: false,
          message: `Gmail API Error: ${err.message || "Failed to send email."}`,
        };
      }
    }
  }

  if (sentCount > 0) {
    return {
      success: true,
      message: `The Onawa Studio Brand Blueprint was successfully sent via Gmail to ${recipients.join(
        " and "
      )}!`,
      messageId: lastMessageId,
    };
  } else {
    return {
      success: false,
      message: "Failed to dispatch email via Gmail API.",
    };
  }
}
