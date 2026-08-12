import { BrandQuestionnaireState } from "../types";
import { BRAND_ARCHETYPES } from "../data/archetypes";
import { EMAIL_CONFIG } from "../config/emailConfig";

const WEB3FORMS_API = "https://api.web3forms.com/submit";

export interface SendEmailOptions {
  strategistEmail: string;
  clientEmail?: string;
  senderName?: string;
  senderEmail?: string;
  notes?: string;
}

export interface EmailResult {
  success: boolean;
  message: string;
  sentTo: string[];
}

/**
 * Send Brand Blueprint email via Web3Forms
 * Sends to both strategist and client
 */
export async function sendBrandDiscoveryEmail(
  state: BrandQuestionnaireState,
  options: SendEmailOptions
): Promise<EmailResult> {
  const accessKey = EMAIL_CONFIG.WEB3FORMS_ACCESS_KEY;
  const strategistEmail = EMAIL_CONFIG.STRATEGIST_EMAIL;
  const clientEmail = options.clientEmail || state.clientProfile?.email || "";
  const senderName = options.senderName || state.clientProfile?.fullName || state.brandName || "Brand Client";
  const senderEmail = options.senderEmail || state.clientProfile?.email || "";
  const notes = options.notes || "";

  const primaryArchInfo = BRAND_ARCHETYPES.find((a) => a.id === state.primaryArchetype);
  const secondaryArchInfo = BRAND_ARCHETYPES.find((a) => a.id === state.secondaryArchetype);
  const brandName = state.brandName.trim() || "Unnamed Brand";

  // Build the email subject
  const subject = `The Onawa Studio Brand Blueprint: ${brandName}`;

  // Build comprehensive HTML email body
  const htmlBody = buildBlueprintHtmlEmail(state, {
    senderName,
    notes,
    primaryArchInfo,
    secondaryArchInfo,
    brandName,
  });

  // Build the payload for Web3Forms
  const payload = {
    access_key: accessKey,
    subject: subject,
    from_name: "Onawa Studio Discovery Portal",
    to: strategistEmail, // Primary recipient
    reply_to: senderEmail || strategistEmail,
    
    // Brand data fields for Web3Forms dashboard
    brand_name: brandName,
    industry: state.industry || "Unspecified",
    project_type: state.projectType === "rebrand" ? "Strategic Rebrand" : "New Brand Launch",
    
    // Golden Circle
    golden_why: state.goldenCircle.why || "N/A",
    golden_how: state.goldenCircle.how || "N/A",
    golden_what: state.goldenCircle.what || "N/A",
    
    // Brand Heart
    purpose: state.brandHeart.purpose || "N/A",
    vision: state.brandHeart.vision || "N/A",
    mission: state.brandHeart.mission || "N/A",
    values: state.brandHeart.values.join(", ") || "None specified",
    
    // Archetypes
    primary_archetype: primaryArchInfo ? `${primaryArchInfo.name} ("${primaryArchInfo.motto}")` : "None",
    secondary_archetype: secondaryArchInfo ? `${secondaryArchInfo.name} ("${secondaryArchInfo.motto}")` : "None",
    
    // Positioning
    strategic_enemy: state.strategicEnemy || "Not defined",
    positioning_matrix: `X: ${state.positioningMatrix.x}, Y: ${state.positioningMatrix.y} — ${state.positioningMatrix.quadrant}`,
    
    // Visual & Verbal
    logo_type: state.logoType.toUpperCase(),
    uvp_statement: `Our ${state.uvp.offering || "[offering]"} is the only ${state.uvp.category || "[category]"} that ${state.uvp.benefit || "[benefit]"} for ${state.uvp.targetAudience || "[audience]"}.`,
    love_keywords: state.keywords.love.join(", ") || "None",
    hate_keywords: state.keywords.hate.join(", ") || "None",
    
    // Client info
    client_name: senderName,
    client_email: senderEmail,
    notes: notes || "No additional notes",
    
    // HTML body (Web3Forms supports this)
    html: htmlBody,
  };

  const sentTo: string[] = [];

  try {
    // Send to strategist
    const strategistResponse = await fetch(WEB3FORMS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, to: strategistEmail }),
    });

    const strategistResult = await strategistResponse.json();

    if (strategistResult.success) {
      sentTo.push(strategistEmail);
    } else {
      console.error("Failed to send to strategist:", strategistResult);
    }

    // Send to client if email provided and different from strategist
    if (clientEmail && clientEmail !== strategistEmail) {
      const clientResponse = await fetch(WEB3FORMS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          to: clientEmail,
          subject: `Your Brand Blueprint from Onawa Studio: ${brandName}`,
        }),
      });

      const clientResult = await clientResponse.json();

      if (clientResult.success) {
        sentTo.push(clientEmail);
      } else {
        console.error("Failed to send to client:", clientResult);
      }
    }

    if (sentTo.length > 0) {
      return {
        success: true,
        message: `Brand Blueprint successfully dispatched to ${sentTo.join(" and ")}!`,
        sentTo,
      };
    } else {
      return {
        success: false,
        message: "Failed to dispatch Brand Blueprint. Please try again.",
        sentTo: [],
      };
    }
  } catch (err: any) {
    console.error("Email dispatch error:", err);
    return {
      success: false,
      message: err.message || "Network error. Please check your connection and try again.",
      sentTo: [],
    };
  }
}

/**
 * Build comprehensive HTML email for Brand Blueprint
 */
function buildBlueprintHtmlEmail(
  state: BrandQuestionnaireState,
  options: {
    senderName: string;
    notes: string;
    primaryArchInfo: any;
    secondaryArchInfo: any;
    brandName: string;
  }
): string {
  const { senderName, notes, primaryArchInfo, secondaryArchInfo, brandName } = options;

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

    <!-- Client Info -->
    <div style="background-color:#1e293b; border-left:4px solid #C1FF00; border-radius:8px; padding:16px 20px; margin-bottom:24px;">
      <div style="font-size:11px; font-weight:700; color:#C1FF00; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">
        Submitted By
      </div>
      <div style="color:#e2e8f0; font-size:14px;">
        <strong>${senderName}</strong> &bull; ${state.clientProfile?.email || "N/A"}
      </div>
    </div>

    <!-- Notes if provided -->
    ${notes ? `
    <div style="background-color:#1e293b; border-left:4px solid #00FFC2; border-radius:8px; padding:16px 20px; margin-bottom:24px;">
      <div style="font-size:11px; font-weight:700; color:#00FFC2; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">
        Client Notes / Instructions for Clyde
      </div>
      <div style="color:#e2e8f0; font-size:14px; font-style:italic;">
        "${notes}"
      </div>
    </div>
    ` : ""}

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
          primaryArchInfo ? `${primaryArchInfo.name} ("${primaryArchInfo.motto}")` : "Not selected"
        }
      </p>
      <p style="margin:0 0 8px 0; font-size:14px; color:#e2e8f0;">
        <strong style="color:#00FFC2;">Secondary Archetype:</strong> ${
          secondaryArchInfo ? `${secondaryArchInfo.name} ("${secondaryArchInfo.motto}")` : "None"
        }
      </p>
      <p style="margin:0 0 16px 0; font-size:14px; color:#e2e8f0;">
        <strong style="color:#FF002B;">Strategic Enemy:</strong> ${state.strategicEnemy || "Not defined"}
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

    <!-- Positioning Matrix -->
    <div style="background-color:#0f172a; border:1px solid #334155; border-radius:16px; padding:24px; margin-bottom:20px;">
      <h2 style="color:#C1FF00; font-size:18px; font-weight:800; margin-top:0; border-bottom:1px solid #1e293b; padding-bottom:10px;">
        4. Positioning Matrix & Visual Identity
      </h2>
      <p style="margin:0 0 8px 0; font-size:14px; color:#e2e8f0;">
        <strong style="color:#00FFC2;">Positioning Coordinates:</strong> X: ${state.positioningMatrix.x}, Y: ${state.positioningMatrix.y}
      </p>
      <p style="margin:0 0 16px 0; font-size:14px; color:#e2e8f0;">
        <strong style="color:#00FFC2;">Quadrant:</strong> ${state.positioningMatrix.quadrant}
      </p>
      <p style="margin:0 0 8px 0; font-size:14px; color:#e2e8f0;">
        <strong style="color:#00FFC2;">Logo Type:</strong> ${state.logoType.toUpperCase()}
      </p>
    </div>

    <!-- Keywords -->
    <div style="background-color:#0f172a; border:1px solid #334155; border-radius:16px; padding:24px; margin-bottom:20px;">
      <h2 style="color:#C1FF00; font-size:18px; font-weight:800; margin-top:0; border-bottom:1px solid #1e293b; padding-bottom:10px;">
        5. Brand Keywords
      </h2>
      <p style="margin:0 0 8px 0; font-size:14px; color:#e2e8f0;">
        <strong style="color:#10b981;">Embrace:</strong> ${state.keywords.love.join(", ") || "None"}
      </p>
      <p style="margin:0; font-size:14px; color:#e2e8f0;">
        <strong style="color:#FF002B;">Avoid:</strong> ${state.keywords.hate.join(", ") || "None"}
      </p>
    </div>

    <!-- Mood Board Note -->
    <div style="background-color:#022c22; border:2px solid #00FFC2; border-radius:16px; padding:24px; text-align:center; margin-bottom:24px;">
      <div style="font-size:11px; font-weight:900; color:#00FFC2; text-transform:uppercase; letter-spacing:2px; margin-bottom:6px;">
        Visual Mood Board
      </div>
      <p style="color:#e2e8f0; font-size:14px; margin:0;">
        ${state.moodBoard?.elements?.length || 0} visual elements saved in the Discovery Portal.
        <br/>Access the full interactive mood board via the Onawa Studio Discovery Portal.
      </p>
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
      <p style="margin:0; font-size:11px; color:#475569;">Sent via Onawa Studio Discovery Experience</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
