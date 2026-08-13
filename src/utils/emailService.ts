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
<body style="margin:0; padding:0; background-color:#0A0A0A; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; color:#F5F0E8;">
  <div style="max-width:680px; margin:0 auto; padding:32px 20px;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg, #141414 0%, #1e1b4b 100%); border:2px solid #F5F0E8; border-radius:20px; padding:32px; text-align:center; margin-bottom:24px; box-shadow:0 20px 40px rgba(0,255,194,0.15);">
      <div style="display:inline-block; padding:4px 12px; background-color:#D4A574; color:#0A0A0A; font-size:11px; font-weight:900; letter-spacing:2px; border-radius:12px; text-transform:uppercase; margin-bottom:12px;">
        ONAWA STUDIO DISCOVERY PORTAL
      </div>
      <h1 style="color:#F5F0E8; font-size:28px; font-weight:900; margin:0 0 8px 0; line-height:1.2;">
        The Onawa Studio Brand Blueprint
      </h1>
      <p style="color:#D4A574; font-size:16px; font-weight:700; margin:0 0 16px 0;">
        Curated for ${brandName} by Clyde Strydom
      </p>
      <p style="color:#8A8478; font-size:13px; margin:0;">
        Industry: ${state.industry || "General"} &bull; Type: ${state.projectType === "rebrand" ? "Strategic Rebrand" : "New Brand Launch"}
      </p>
    </div>

    <!-- Client Info -->
    <div style="background-color:#1E1E1E; border-left:4px solid #D4A574; border-radius:8px; padding:16px 20px; margin-bottom:24px;">
      <div style="font-size:11px; font-weight:700; color:#D4A574; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">
        Submitted By
      </div>
      <div style="color:#C0B8A8; font-size:14px;">
        <strong>${senderName}</strong> &bull; ${state.clientProfile?.email || "N/A"}
      </div>
    </div>

    <!-- Notes if provided -->
    ${notes ? `
    <div style="background-color:#1E1E1E; border-left:4px solid #F5F0E8; border-radius:8px; padding:16px 20px; margin-bottom:24px;">
      <div style="font-size:11px; font-weight:700; color:#F5F0E8; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">
        Client Notes / Instructions for Clyde
      </div>
      <div style="color:#C0B8A8; font-size:14px; font-style:italic;">
        "${notes}"
      </div>
    </div>
    ` : ""}

    <!-- Brand Heart -->
    <div style="background-color:#141414; border:1px solid #2a2a2a; border-radius:16px; padding:24px; margin-bottom:20px;">
      <h2 style="color:#D4A574; font-size:18px; font-weight:800; margin-top:0; border-bottom:1px solid #1E1E1E; padding-bottom:10px;">
        1. Brand Heart & Purpose
      </h2>
      <table style="width:100%; border-collapse:collapse; font-size:14px; color:#C0B8A8;">
        <tr>
          <td style="padding:8px 0; font-weight:bold; color:#F5F0E8; width:120px;">Purpose:</td>
          <td style="padding:8px 0;">${state.brandHeart.purpose || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding:8px 0; font-weight:bold; color:#F5F0E8;">Vision:</td>
          <td style="padding:8px 0;">${state.brandHeart.vision || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding:8px 0; font-weight:bold; color:#F5F0E8;">Mission:</td>
          <td style="padding:8px 0;">${state.brandHeart.mission || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding:8px 0; font-weight:bold; color:#F5F0E8;">Core Values:</td>
          <td style="padding:8px 0;">${state.brandHeart.values.join(", ") || "None specified"}</td>
        </tr>
      </table>
    </div>

    <!-- Golden Circle -->
    <div style="background-color:#141414; border:1px solid #2a2a2a; border-radius:16px; padding:24px; margin-bottom:20px;">
      <h2 style="color:#D4A574; font-size:18px; font-weight:800; margin-top:0; border-bottom:1px solid #1E1E1E; padding-bottom:10px;">
        2. Simon Sinek's Golden Circle
      </h2>
      <div style="margin-bottom:12px;">
        <span style="color:#f59e0b; font-weight:bold;">WHY (Core Belief):</span>
        <p style="margin:4px 0 0 0; color:#C0B8A8; font-size:14px;">${state.goldenCircle.why || "N/A"}</p>
      </div>
      <div style="margin-bottom:12px;">
        <span style="color:#06b6d4; font-weight:bold;">HOW (Differentiating Process):</span>
        <p style="margin:4px 0 0 0; color:#C0B8A8; font-size:14px;">${state.goldenCircle.how || "N/A"}</p>
      </div>
      <div>
        <span style="color:#a855f7; font-weight:bold;">WHAT (Products & Offerings):</span>
        <p style="margin:4px 0 0 0; color:#C0B8A8; font-size:14px;">${state.goldenCircle.what || "N/A"}</p>
      </div>
    </div>

    <!-- Archetype & Positioning -->
    <div style="background-color:#141414; border:1px solid #2a2a2a; border-radius:16px; padding:24px; margin-bottom:20px;">
      <h2 style="color:#D4A574; font-size:18px; font-weight:800; margin-top:0; border-bottom:1px solid #1E1E1E; padding-bottom:10px;">
        3. Archetype & Positioning Strategy
      </h2>
      <p style="margin:0 0 8px 0; font-size:14px; color:#C0B8A8;">
        <strong style="color:#F5F0E8;">Primary Archetype:</strong> ${
          primaryArchInfo ? `${primaryArchInfo.name} ("${primaryArchInfo.motto}")` : "Not selected"
        }
      </p>
      <p style="margin:0 0 8px 0; font-size:14px; color:#C0B8A8;">
        <strong style="color:#F5F0E8;">Secondary Archetype:</strong> ${
          secondaryArchInfo ? `${secondaryArchInfo.name} ("${secondaryArchInfo.motto}")` : "None"
        }
      </p>
      <p style="margin:0 0 16px 0; font-size:14px; color:#C0B8A8;">
        <strong style="color:#FF002B;">Strategic Enemy:</strong> ${state.strategicEnemy || "Not defined"}
      </p>
      <div style="background-color:#1E1E1E; border-radius:12px; padding:16px;">
        <div style="font-size:12px; font-weight:bold; color:#D4A574; text-transform:uppercase; margin-bottom:8px;">
          Unique Value Proposition (UVP)
        </div>
        <p style="margin:0; font-size:14px; color:#F5F0E8; font-style:italic; line-height:1.5;">
          "${uvpSentence}"
        </p>
      </div>
    </div>

    <!-- Positioning Matrix -->
    <div style="background-color:#141414; border:1px solid #2a2a2a; border-radius:16px; padding:24px; margin-bottom:20px;">
      <h2 style="color:#D4A574; font-size:18px; font-weight:800; margin-top:0; border-bottom:1px solid #1E1E1E; padding-bottom:10px;">
        4. Positioning Matrix & Visual Identity
      </h2>
      <p style="margin:0 0 8px 0; font-size:14px; color:#C0B8A8;">
        <strong style="color:#F5F0E8;">Positioning Coordinates:</strong> X: ${state.positioningMatrix.x}, Y: ${state.positioningMatrix.y}
      </p>
      <p style="margin:0 0 16px 0; font-size:14px; color:#C0B8A8;">
        <strong style="color:#F5F0E8;">Quadrant:</strong> ${state.positioningMatrix.quadrant}
      </p>
      <p style="margin:0 0 8px 0; font-size:14px; color:#C0B8A8;">
        <strong style="color:#F5F0E8;">Logo Type:</strong> ${state.logoType.toUpperCase()}
      </p>
    </div>

    <!-- Keywords -->
    <div style="background-color:#141414; border:1px solid #2a2a2a; border-radius:16px; padding:24px; margin-bottom:20px;">
      <h2 style="color:#D4A574; font-size:18px; font-weight:800; margin-top:0; border-bottom:1px solid #1E1E1E; padding-bottom:10px;">
        5. Brand Keywords
      </h2>
      <p style="margin:0 0 8px 0; font-size:14px; color:#C0B8A8;">
        <strong style="color:#10b981;">Embrace:</strong> ${state.keywords.love.join(", ") || "None"}
      </p>
      <p style="margin:0; font-size:14px; color:#C0B8A8;">
        <strong style="color:#FF002B;">Avoid:</strong> ${state.keywords.hate.join(", ") || "None"}
      </p>
    </div>

    <!-- Mood Board Note -->
    <div style="background-color:#022c22; border:2px solid #F5F0E8; border-radius:16px; padding:24px; text-align:center; margin-bottom:24px;">
      <div style="font-size:11px; font-weight:900; color:#F5F0E8; text-transform:uppercase; letter-spacing:2px; margin-bottom:6px;">
        Visual Mood Board
      </div>
      <p style="color:#C0B8A8; font-size:14px; margin:0;">
        ${state.moodBoard?.elements?.length || 0} visual elements saved in the Discovery Portal.
        <br/>Access the full interactive mood board via the Onawa Studio Discovery Portal.
      </p>
    </div>

    <!-- Strategist Sign-off -->
    <div style="background:linear-gradient(135deg, #064e3b 0%, #022c22 100%); border:2px solid #10b981; border-radius:16px; padding:24px; text-align:center; margin-bottom:24px;">
      <div style="font-size:12px; font-weight:800; color:#10b981; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">
        Alignment Complete
      </div>
      <p style="font-size:16px; font-style:italic; color:#F5F0E8; margin:0 0 8px 0;">
        "Alignment Complete. I look forward to bringing your vision to life."
      </p>
      <div style="font-size:14px; font-weight:bold; color:#D4A574;">
        &mdash; Clyde Strydom, Onawa Studio
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center; font-size:12px; color:#64748b; border-top:1px solid #1E1E1E; padding-top:20px;">
      <p style="margin:0 0 4px 0;">&copy; 2026 Onawa Studio | Strategy by Clyde Strydom</p>
      <p style="margin:0; font-size:11px; color:#475569;">Sent via Onawa Studio Discovery Experience</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Send a welcome email to a newly registered client
 */
export async function sendWelcomeEmail(
  clientEmail: string,
  clientName: string
): Promise<{ success: boolean; message: string }> {
  const accessKey = EMAIL_CONFIG.WEB3FORMS_ACCESS_KEY;

  if (!clientEmail || !accessKey) {
    return { success: false, message: "Missing email or access key." };
  }

  const subject = `Welcome to Onawa Studio, ${clientName}!`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to Onawa Studio</title>
</head>
<body style="margin:0; padding:0; background-color:#0A0A0A; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; color:#F5F0E8;">
  <div style="max-width:600px; margin:0 auto; padding:32px 20px;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg, #141414 0%, #1e1b4b 100%); border:2px solid #D4A574; border-radius:20px; padding:40px 32px; text-align:center; margin-bottom:24px; box-shadow:0 20px 40px rgba(193,255,0,0.15);">
      <div style="display:inline-block; padding:4px 12px; background-color:#D4A574; color:#0A0A0A; font-size:11px; font-weight:900; letter-spacing:2px; border-radius:12px; text-transform:uppercase; margin-bottom:16px;">
        ONAWA STUDIO
      </div>
      <h1 style="color:#F5F0E8; font-size:28px; font-weight:900; margin:0 0 12px 0; line-height:1.2;">
        Welcome, ${clientName}!
      </h1>
      <p style="color:#D4A574; font-size:16px; font-weight:700; margin:0 0 8px 0;">
        Your Brand Discovery Journey Begins Now
      </p>
      <p style="color:#8A8478; font-size:13px; margin:0;">
        Curated by Clyde Strydom &bull; Onawa Studio
      </p>
    </div>

    <!-- Body -->
    <div style="background-color:#1E1E1E; border-radius:16px; padding:28px; margin-bottom:24px;">
      <h2 style="color:#F5F0E8; font-size:18px; font-weight:800; margin:0 0 16px 0;">
        Your Private Discovery Portal is Live
      </h2>
      <p style="color:#C0B8A8; font-size:14px; line-height:1.7; margin:0 0 16px 0;">
        You now have exclusive access to the <strong style="color:#D4A574;">Onawa Studio Discovery Portal</strong> &mdash; a strategic brand workshop built on Simon Sinek's Golden Circle framework and refined over 17+ years of elite brand strategy by Clyde Strydom.
      </p>
      <p style="color:#C0B8A8; font-size:14px; line-height:1.7; margin:0 0 20px 0;">
        Inside, you will define your brand's soul, archetype, positioning, and visual direction through 12 curated stages &mdash; each designed to extract clarity before a single pixel is designed.
      </p>

      <div style="background-color:#141414; border:1px solid #2a2a2a; border-radius:12px; padding:20px; margin-bottom:20px;">
        <div style="font-size:11px; font-weight:900; color:#D4A574; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:12px;">
          What Awaits You
        </div>
        <div style="color:#C0B8A8; font-size:13px; line-height:1.8;">
          &#10003;&nbsp; Golden Circle Purpose Workshop<br/>
          &#10003;&nbsp; Brand Heart &amp; Core Values Definition<br/>
          &#10003;&nbsp; 12 Brand Archetype Selection<br/>
          &#10003;&nbsp; Strategic Positioning Matrix<br/>
          &#10003;&nbsp; Interactive Visual Mood Board<br/>
          &#10003;&nbsp; Dynamic UVP Builder<br/>
          &#10003;&nbsp; AI-Enhanced Brand Strategy Report
        </div>
      </div>

      <p style="color:#8A8478; font-size:13px; font-style:italic; margin:0;">
        "To build a great brand, we must start with your 'Why' before we touch a single pixel."
      </p>
      <p style="color:#D4A574; font-size:12px; font-weight:bold; margin:8px 0 0 0;">
        &mdash; Clyde Strydom, Onawa Studio
      </p>
    </div>

    <!-- CTA -->
    <div style="text-align:center; margin-bottom:24px;">
      <a href="${window.location?.origin || 'https://onawastudio.co.za'}" style="display:inline-block; padding:14px 32px; background-color:#D4A574; color:#0A0A0A; font-size:13px; font-weight:900; text-transform:uppercase; letter-spacing:1px; border-radius:12px; text-decoration:none; box-shadow:0 8px 24px rgba(193,255,0,0.3);">
        Launch Your Discovery Portal &rarr;
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align:center; font-size:12px; color:#64748b; border-top:1px solid #1E1E1E; padding-top:20px;">
      <p style="margin:0 0 4px 0;">&copy; 2026 Onawa Studio | Strategy by Clyde Strydom</p>
      <p style="margin:0; font-size:11px; color:#475569;">This account was created via the Onawa Studio Discovery Portal</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  try {
    const response = await fetch(WEB3FORMS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        subject,
        from_name: "Onawa Studio",
        to: clientEmail,
        reply_to: EMAIL_CONFIG.STRATEGIST_EMAIL,
        html: htmlBody,
      }),
    });

    const result = await response.json();

    if (result.success) {
      return { success: true, message: "Welcome email sent." };
    } else {
      console.warn("Welcome email failed:", result);
      return { success: false, message: "Failed to send welcome email." };
    }
  } catch (err: any) {
    console.warn("Welcome email error:", err);
    return { success: false, message: err.message || "Network error." };
  }
}
