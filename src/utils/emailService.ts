import emailjs from "@emailjs/browser";
import { BrandQuestionnaireState } from "../types";
import { BRAND_ARCHETYPES } from "../data/archetypes";
import { EMAILJS_CONFIG } from "../config/emailConfig";

export interface SendEmailOptions {
  strategistEmail: string;
  senderName?: string;
  senderEmail?: string;
  notes?: string;
  customServiceId?: string;
  customTemplateId?: string;
  customPublicKey?: string;
}

export interface EmailResult {
  success: boolean;
  message: string;
  isFallback?: boolean;
}

export async function sendBrandDiscoveryEmail(
  state: BrandQuestionnaireState,
  options: SendEmailOptions
): Promise<EmailResult> {
  const serviceId = options.customServiceId || EMAILJS_CONFIG.SERVICE_ID;
  const templateId = options.customTemplateId || EMAILJS_CONFIG.TEMPLATE_ID;
  const publicKey = options.customPublicKey || EMAILJS_CONFIG.PUBLIC_KEY;

  const primaryArchInfo = BRAND_ARCHETYPES.find(
    (a) => a.id === state.primaryArchetype
  );
  const secondaryArchInfo = BRAND_ARCHETYPES.find(
    (a) => a.id === state.secondaryArchetype
  );

  const brandName = state.brandName.trim() || "Unnamed Brand";

  // Build template parameters object
  const templateParams = {
    to_email: options.strategistEmail,
    strategist_email: options.strategistEmail,
    sender_name: options.senderName || brandName,
    sender_email: options.senderEmail || "client@branddiscovery.app",
    notes: options.notes || "No additional notes provided.",
    
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
    
    // Archetypes & Personality
    primary_archetype: primaryArchInfo ? `${primaryArchInfo.name} ("${primaryArchInfo.motto}")` : "None",
    secondary_archetype: secondaryArchInfo ? `${secondaryArchInfo.name} ("${secondaryArchInfo.motto}")` : "None",
    
    // Visual & Verbal
    logo_type: state.logoType.toUpperCase(),
    uvp_statement: `Our ${state.uvp.offering || "[offering]"} is the only ${state.uvp.category || "[category]"} that ${state.uvp.benefit || "[benefit]"} for ${state.uvp.targetAudience || "[audience]"}.`,
    love_keywords: state.keywords.love.join(", ") || "None",
    hate_keywords: state.keywords.hate.join(", ") || "None",
    
    // Full summary text
    summary_text: `
BRAND DISCOVERY SUBMISSION: ${brandName}
Industry: ${state.industry || "Not specified"}
Type: ${state.projectType}

1. BRAND HEART:
- Purpose: ${state.brandHeart.purpose}
- Vision: ${state.brandHeart.vision}
- Mission: ${state.brandHeart.mission}
- Values: ${state.brandHeart.values.join(", ")}

2. GOLDEN CIRCLE:
- Why: ${state.goldenCircle.why}
- How: ${state.goldenCircle.how}
- What: ${state.goldenCircle.what}

3. ARCHETYPE & PERSONALITY:
- Primary Archetype: ${primaryArchInfo?.name || "None"}
- Secondary Archetype: ${secondaryArchInfo?.name || "None"}
- Personality Spectrum: Progressive (${state.personality.traditionalVsProgressive}%), Disruptive (${state.personality.corporateVsDisruptive}%), Bold (${state.personality.reservedVsBold}%), Accessible (${state.personality.exclusiveVsAccessible}%), Serious (${state.personality.playfulVsSerious}%)

4. VISUAL & VERBAL:
- Logo Type: ${state.logoType}
- UVP: Our ${state.uvp.offering} is the only ${state.uvp.category} that ${state.uvp.benefit} for ${state.uvp.targetAudience}.
- Embrace Keywords: ${state.keywords.love.join(", ")}
- Avoid Keywords: ${state.keywords.hate.join(", ")}
`.trim(),
  };

  // Check if credentials are using the default placeholder strings
  const isPlaceholderKey =
    !serviceId ||
    !templateId ||
    !publicKey ||
    serviceId.includes("YOUR_") ||
    templateId.includes("YOUR_") ||
    publicKey.includes("YOUR_");

  if (isPlaceholderKey) {
    // If keys are placeholder, return a clear notice with instructions while providing simulated success/copy option
    return {
      success: false,
      isFallback: true,
      message:
        "EmailJS placeholder keys detected. Please enter valid SERVICE_ID, TEMPLATE_ID, and PUBLIC_KEY in the modal settings below or in emailConfig.ts.",
    };
  }

  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );

    if (response.status === 200) {
      return {
        success: true,
        message: `Brand discovery package successfully emailed to ${options.strategistEmail}!`,
      };
    } else {
      return {
        success: false,
        message: `EmailJS responded with status code: ${response.status}`,
      };
    }
  } catch (err: any) {
    console.error("EmailJS sending error:", err);
    return {
      success: false,
      message:
        err.text ||
        err.message ||
        "Failed to send email via EmailJS. Please verify your credentials and network connection.",
    };
  }
}
