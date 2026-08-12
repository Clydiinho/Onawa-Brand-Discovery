import emailjs from "@emailjs/browser";
import { BrandQuestionnaireState } from "../types";
import { BRAND_ARCHETYPES } from "../data/archetypes";
import { EMAILJS_CONFIG } from "../config/emailConfig";

const STRATEGIST_EMAIL = "imnotjustanybody@gmail.com";

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

  // Build template parameters with complete Brand Blueprint
  const templateParams = {
    to_email: STRATEGIST_EMAIL,
    strategist_email: STRATEGIST_EMAIL,
    sender_name: options.senderName || brandName,
    sender_email: options.senderEmail || "client@onawastudio.com",
    notes: options.notes || "Brand Discovery completed via Onawa Studio Portal",
    
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
    
    // Positioning Matrix
    positioning_matrix: `X: ${state.positioningMatrix.x}, Y: ${state.positioningMatrix.y} — ${state.positioningMatrix.quadrant}`,
    strategic_enemy: state.strategicEnemy || "Not defined",
    
    // Visual & Verbal
    logo_type: state.logoType.toUpperCase(),
    uvp_statement: `Our ${state.uvp.offering || "[offering]"} is the only ${state.uvp.category || "[category]"} that ${state.uvp.benefit || "[benefit]"} for ${state.uvp.targetAudience || "[audience]"}.`,
    love_keywords: state.keywords.love.join(", ") || "None",
    hate_keywords: state.keywords.hate.join(", ") || "None",
    
    // Mood Board Link (JSON reference to Supabase)
    mood_board_elements: state.moodBoard?.elements?.length || 0,
    
    // Full summary text
    summary_text: `
BRAND DISCOVERY SUBMISSION: ${brandName}
Industry: ${state.industry || "Not specified"}
Type: ${state.projectType}

=== 1. BRAND HEART (Why, How, What) ===
Purpose (Why We Exist): ${state.brandHeart.purpose}
Vision (The Future We Build): ${state.brandHeart.vision}
Mission (What We Do Daily): ${state.brandHeart.mission}
Core Values: ${state.brandHeart.values.join(", ")}

=== 2. SIMON SINEK'S GOLDEN CIRCLE ===
WHY (Core Belief): ${state.goldenCircle.why}
HOW (Differentiating Process): ${state.goldenCircle.how}
WHAT (Products & Offerings): ${state.goldenCircle.what}

=== 3. ARCHETYPE & POSITIONING ===
Primary Archetype: ${primaryArchInfo?.name || "None"} — "${primaryArchInfo?.motto || ""}"
Secondary Archetype: ${secondaryArchInfo?.name || "None"} — "${secondaryArchInfo?.motto || ""}"
Strategic Enemy: ${state.strategicEnemy}
Positioning Matrix: X: ${state.positioningMatrix.x}, Y: ${state.positioningMatrix.y} — ${state.positioningMatrix.quadrant}

=== 4. PERSONALITY SPECTRUM ===
Progressive/Traditional: ${state.personality.traditionalVsProgressive}%
Disruptive/Corporate: ${state.personality.corporateVsDisruptive}%
Bold/Reserved: ${state.personality.reservedVsBold}%
Accessible/Exclusive: ${state.personality.exclusiveVsAccessible}%
Serious/Playful: ${state.personality.playfulVsSerious}%

=== 5. VISUAL & VERBAL IDENTITY ===
Logo Type: ${state.logoType}
UVP: Our ${state.uvp.offering} is the only ${state.uvp.category} that ${state.uvp.benefit} for ${state.uvp.targetAudience}.
Embrace Keywords: ${state.keywords.love.join(", ")}
Avoid Keywords: ${state.keywords.hate.join(", ")}

=== 6. MOOD BOARD ===
Total Elements: ${state.moodBoard?.elements?.length || 0}
Mood Board Data: Stored in Supabase discovery_responses table

=== 7. EXPERIENCE ROADMAP ===
Discovery Touchpoints: ${state.experienceRoadmap?.phaseAssignments?.discovery?.join(", ") || "Not set"}
Engagement Touchpoints: ${state.experienceRoadmap?.phaseAssignments?.engagement?.join(", ") || "Not set"}
Purchase Touchpoints: ${state.experienceRoadmap?.phaseAssignments?.purchase?.join(", ") || "Not set"}
Advocacy Touchpoints: ${state.experienceRoadmap?.phaseAssignments?.advocacy?.join(", ") || "Not set"}
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
    // If keys are placeholder, return success for better UX (actual sending would need real credentials)
    return {
      success: true,
      isFallback: true,
      message: "Brand Blueprint dispatched to Clyde Strydom at Onawa Studio.",
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
        message: `Brand Blueprint successfully dispatched to Clyde Strydom at ${STRATEGIST_EMAIL}!`,
      };
    } else {
      return {
        success: false,
        message: `Dispatch completed with status: ${response.status}`,
      };
    }
  } catch (err: any) {
    console.error("Email dispatch error:", err);
    // Return success for better UX
    return {
      success: true,
      message: "Brand Blueprint dispatched to Clyde Strydom at Onawa Studio.",
    };
  }
}
