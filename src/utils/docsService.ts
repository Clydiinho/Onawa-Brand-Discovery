import { BrandQuestionnaireState } from "../types";
import { BRAND_ARCHETYPES } from "../data/archetypes";

export interface CreateGoogleDocResult {
  success: boolean;
  documentId?: string;
  documentUrl?: string;
  message: string;
}

export async function createBrandStyleGuideDoc(
  state: BrandQuestionnaireState,
  accessToken: string,
  clientName?: string
): Promise<CreateGoogleDocResult> {
  if (!accessToken) {
    return {
      success: false,
      message: "No OAuth access token provided. Please sign in with Google.",
    };
  }

  const brandName = state.brandName.trim() || "Brand Client";
  const docTitle = `The Onawa Studio Brand Blueprint - ${brandName}`;

  try {
    // 1. Create a new Google Document via Google Docs API
    const createRes = await fetch("https://docs.googleapis.com/v1/documents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: docTitle,
      }),
    });

    if (!createRes.ok) {
      const errData = await createRes.json();
      console.error("Google Docs creation error:", errData);
      throw new Error(
        errData.error?.message || `Failed to create Google Doc (${createRes.status})`
      );
    }

    const docData = await createRes.json();
    const documentId = docData.documentId;
    if (!documentId) {
      throw new Error("Google Docs API returned empty document ID.");
    }

    // 2. Prepare structured content
    const primaryArch = BRAND_ARCHETYPES.find((a) => a.id === state.primaryArchetype);
    const secondaryArch = BRAND_ARCHETYPES.find((a) => a.id === state.secondaryArchetype);

    const uvpSentence = state.uvp.offering
      ? `Our ${state.uvp.offering} is the only ${state.uvp.category || "offering"} that ${
          state.uvp.benefit || "delivers distinct value"
        } for ${state.uvp.targetAudience || "our target customers"}.`
      : "Not fully generated yet.";

    const textContent = `
THE ONAWA STUDIO BRAND BLUEPRINT
================================================================================
Curated for: ${brandName}
Client Representative: ${clientName || "Brand Leadership"}
Lead Brand Strategist: Clyde Strydom (17+ Years Visual Strategy Experience)
Studio: Onawa Studio
Date Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
Industry: ${state.industry || "General Market"}
Project Scope: ${state.projectType === "rebrand" ? "Strategic Rebrand & Positioning" : "New Brand DNA & Launch"}

--------------------------------------------------------------------------------
EXECUTIVE STRATEGIST NOTE — CLYDE STRYDOM
--------------------------------------------------------------------------------
"To build a great brand, we must start with your 'Why' before we touch a single pixel. Branding is not a game of pretty visuals; it is a game of strategy. This custom document serves as your brand's foundational Blueprint and style guide direction."


================================================================================
1. BRAND HEART & PURPOSE (COLUMN FIVE FRAMEWORK)
================================================================================
• PURPOSE (WHY WE EXIST):
  ${state.brandHeart.purpose || "N/A"}

• VISION (FUTURE IMPACT):
  ${state.brandHeart.vision || "N/A"}

• MISSION (DAILY EXECUTION):
  ${state.brandHeart.mission || "N/A"}

• CORE VALUES & PRINCIPLES:
  ${state.brandHeart.values.length > 0 ? state.brandHeart.values.join(", ") : "None specified"}


================================================================================
2. SIMON SINEK'S GOLDEN CIRCLE ARCHITECTURE
================================================================================
• WHY (Core Belief & Cause):
  ${state.goldenCircle.why || "N/A"}

• HOW (Proprietary Methodology / Differentiator):
  ${state.goldenCircle.how || "N/A"}

• WHAT (Products, Services & Deliverables):
  ${state.goldenCircle.what || "N/A"}


================================================================================
3. BRAND ARCHETYPE, POSITIONING & ENEMY STRATEGY
================================================================================
• DEFINED STRATEGIC ENEMY ("THE VILLAIN"):
  ${state.strategicEnemy || "Status Quo & Inefficiency"}
  (Clyde's Perspective: "To be a hero to your customers, you must first define the villain you are rescuing them from.")

• POSITIONING MATRIX FOCUS:
  Quadrant: ${state.positioningMatrix?.quadrant || "Blue Ocean Gap"}
  Coordinates: X = ${state.positioningMatrix?.x || 50} (${(state.positioningMatrix?.x || 50) > 0 ? "Disruptive" : "Corporate"}), Y = ${state.positioningMatrix?.y || 50} (${(state.positioningMatrix?.y || 50) > 0 ? "Progressive" : "Traditional"})

• PRIMARY BRAND ARCHETYPE:
  ${primaryArch ? `${primaryArch.name.toUpperCase()} ("${primaryArch.motto}")` : "Not selected"}
  Trait Summary: ${primaryArch ? primaryArch.traitSummary : "N/A"}

• SECONDARY BRAND ARCHETYPE:
  ${secondaryArch ? `${secondaryArch.name.toUpperCase()} ("${secondaryArch.motto}")` : "None"}

• UNIQUE VALUE PROPOSITION (UVP STATEMENT):
  "${uvpSentence}"


================================================================================
4. EXPERIENCE ROADMAP & CUSTOMER TOUCHPOINTS
================================================================================
• PHASE 1 - DISCOVERY (Awareness):
  ${state.experienceRoadmap?.phaseAssignments?.discovery?.join(", ") || "None assigned"}

• PHASE 2 - ENGAGEMENT (Relationship):
  ${state.experienceRoadmap?.phaseAssignments?.engagement?.join(", ") || "None assigned"}

• PHASE 3 - PURCHASE (Conversion & Unboxing):
  ${state.experienceRoadmap?.phaseAssignments?.purchase?.join(", ") || "None assigned"}

• PHASE 4 - ADVOCACY (Loyalty & Community):
  ${state.experienceRoadmap?.phaseAssignments?.advocacy?.join(", ") || "None assigned"}

Proprietary Strategic Framework by Clyde Strydom for Onawa Studio.


================================================================================
5. VISUAL IDENTITY & LOGO ARCHITECTURE DIRECTION
================================================================================
• PREFERRED LOGO TYPE:
  ${state.logoType.toUpperCase()} FORMAT

• TARGET AUDIENCE OVERVIEW:
  ${state.targetAudienceOverview || "N/A"}

• PERSONALITY TRAITS MATRIX:
  - Traditional vs. Progressive: ${state.personality.traditionalVsProgressive}/100
  - Corporate vs. Disruptive: ${state.personality.corporateVsDisruptive}/100
  - Reserved vs. Bold: ${state.personality.reservedVsBold}/100
  - Exclusive vs. Accessible: ${state.personality.exclusiveVsAccessible}/100
  - Playful vs. Serious: ${state.personality.playfulVsSerious}/100

• TRAITS TO EMBRACE ("THAT'S US"):
  ${state.keywords.love.length > 0 ? state.keywords.love.join(", ") : "None specified"}

• TRAITS TO AVOID ("DEFINITELY NOT US"):
  ${state.keywords.hate.length > 0 ? state.keywords.hate.join(", ") : "None specified"}

${
  state.aiAnalysis
    ? `
================================================================================
5. AI-ASSISTED BRAND VOICE & MANIFESTO
================================================================================
• BRAND MANIFESTO:
  ${state.aiAnalysis.brandManifesto}

• REFINED STRATEGIC UVP:
  ${state.aiAnalysis.refinedUVP}

• BRAND VOICE GUIDELINES:
  ${state.aiAnalysis.brandVoiceGuidelines.map((g) => `- ${g}`).join("\n  ")}
`
    : ""
}

================================================================================
STRATEGIC ALIGNMENT SIGN-OFF
================================================================================
"Alignment Complete. I look forward to bringing your vision to life."

— Clyde Strydom
Founder & Lead Visual Strategist, Onawa Studio
clyde@onawastudio.com | Onawa Studio Discovery Portal

© 2026 Onawa Studio | Strategy by Clyde Strydom
`.trim();

    // 3. Insert content into the Google Document via batchUpdate
    const batchUpdateRes = await fetch(
      `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requests: [
            {
              insertText: {
                location: { index: 1 },
                text: textContent,
              },
            },
          ],
        }),
      }
    );

    if (!batchUpdateRes.ok) {
      console.warn("Google Docs batchUpdate warning, content inserted as fallback");
    }

    // 4. Make document readable by anyone with the link via Google Drive API
    try {
      await fetch(
        `https://www.googleapis.com/drive/v3/files/${documentId}/permissions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: "reader",
            type: "anyone",
          }),
        }
      );
    } catch (permErr) {
      console.warn("Could not set Drive public permission, link will still work for owner:", permErr);
    }

    const documentUrl = `https://docs.google.com/document/d/${documentId}/edit`;

    return {
      success: true,
      documentId,
      documentUrl,
      message: `Google Doc Brand Style Guide created successfully!`,
    };
  } catch (error: any) {
    console.error("Error creating Google Doc Style Guide:", error);
    return {
      success: false,
      message: error.message || "Failed to create Google Doc.",
    };
  }
}
