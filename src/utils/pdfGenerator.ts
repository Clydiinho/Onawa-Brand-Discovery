import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { BrandQuestionnaireState } from "../types";
import { BRAND_ARCHETYPES } from "../data/archetypes";

/**
 * Justification text mapping for logo structure choices
 */
const LOGO_JUSTIFICATIONS: Record<string, string> = {
  logomark:
    "A standalone abstract or iconic symbol provides maximum cross-platform scalability, high memorability, and instant app icon recognition. Ideal for established digital products and ecosystem brands.",
  logotype:
    "A wordmark-centric visual identity anchors full focus directly on brand name recall and typographic authority. Excellent for pioneering startups and editorial/media brands establishing market name equity.",
  combination:
    "Combining a distinct mark with a wordmark offers the ultimate operational versatility. The brand can deploy the full mark or isolate the icon for small-format icons, favicons, and merchandise.",
  emblem:
    "A enclosed badge emblem conveys heritage, prestige, institutional authority, and craftsmanship. Perfect for premium luxury goods, universities, artisan brands, and athletic clubs.",
};

export async function generateBrandStyleGuidePDF(
  state: BrandQuestionnaireState,
  onProgress?: (msg: string) => void
): Promise<void> {
  onProgress?.("Preparing Brand Style Guide layout...");

  const primaryArch = BRAND_ARCHETYPES.find((a) => a.id === state.primaryArchetype);
  const secondaryArch = BRAND_ARCHETYPES.find((a) => a.id === state.secondaryArchetype);
  const brandTitle = state.brandName.trim() || "Brand Strategy";

  // Create temporary offscreen container for PDF rendering
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "800px";
  container.style.fontFamily = "system-ui, -apple-system, sans-serif";
  container.style.color = "#0f172a";
  container.style.backgroundColor = "#ffffff";

  // HTML content for multi-page style guide
  container.innerHTML = `
    <!-- PAGE 1: COVER PAGE -->
    <div class="pdf-page" style="width: 800px; height: 1130px; padding: 60px; background: #090d16; color: #f8fafc; box-sizing: border-box; display: flex; flex-direction: column; justify-between; position: relative;">
      <div style="border: 2px solid #f59e0b; position: absolute; inset: 24px; pointer-events: none; opacity: 0.3;"></div>
      
      <div>
        <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em; color: #f59e0b; margin-bottom: 24px;">
          The Onawa Studio Brand Blueprint
        </div>
        <h1 style="font-size: 36px; font-weight: 900; line-height: 1.2; color: #ffffff; margin: 0 0 16px 0; letter-spacing: -0.02em;">
          Curated for ${escapeHtml(brandTitle)}
        </h1>
        <div style="font-size: 20px; color: #f59e0b; font-weight: 700; margin-bottom: 24px;">
          Strategy by Clyde Strydom
        </div>
        <div style="font-size: 15px; color: #94a3b8; font-weight: 500; margin-bottom: 40px;">
          ${escapeHtml(state.industry || "General Industry")} • ${state.projectType === "rebrand" ? "Strategic Rebrand" : "New Brand Launch"}
        </div>
      </div>

      <div style="padding: 32px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 16px; margin-top: auto; margin-bottom: 40px;">
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #f59e0b; margin-bottom: 8px;">
          Positioning Statement Preview
        </div>
        <div style="font-size: 15px; font-style: italic; color: #e2e8f0; line-height: 1.6;">
          "Our ${escapeHtml(state.uvp.offering || "[offering]")} is the only ${escapeHtml(state.uvp.category || "[category]")} that ${escapeHtml(state.uvp.benefit || "[benefit]")} for ${escapeHtml(state.uvp.targetAudience || "[audience]")}."
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #1e293b; padding-top: 24px; font-size: 11px; color: #94a3b8;">
        <div>
          <strong>Document Ref:</strong> ONAWA-${Math.floor(1000 + Math.random() * 9000)}<br/>
          <strong>Date:</strong> ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </div>
        <div style="text-align: right;">
          <strong>Onawa Architecture:</strong> Sinek, Heart, 12 Archetypes, Ifrán<br/>
          <strong>Author:</strong> Clyde Strydom (17+ Yrs Visual Strategy)
        </div>
      </div>

      <div style="position: absolute; bottom: 20px; left: 60px; right: 60px; font-size: 10px; color: #64748b; font-family: monospace; text-align: center;">
        © 2026 Onawa Studio | Strategy by Clyde Strydom
      </div>
    </div>

    <!-- PAGE 2: BRAND HEART & GOLDEN CIRCLE -->
    <div class="pdf-page" style="width: 800px; height: 1130px; padding: 50px 60px 80px 60px; background: #ffffff; color: #0f172a; box-sizing: border-box; position: relative;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 30px;">
        <span style="font-size: 16px; font-weight: 900; color: #0f172a; letter-spacing: -0.01em;">The Onawa Studio Brand Blueprint: Curated for ${escapeHtml(brandTitle)} by Clyde Strydom</span>
        <span style="font-size: 11px; font-weight: 700; color: #f59e0b; text-transform: uppercase;">Section 01</span>
      </div>

      <!-- Column Five Brand Heart -->
      <div style="margin-bottom: 36px;">
        <h3 style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #d97706; margin: 0 0 16px 0;">
          The Brand Heart (Column Five Framework)
        </h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
          <div style="padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 4px;">Purpose (Why We Exist)</div>
            <div style="font-size: 12px; color: #1e293b; line-height: 1.5; font-weight: 500;">${escapeHtml(state.brandHeart.purpose || "Not defined")}</div>
          </div>
          <div style="padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 4px;">Vision (Future Impact)</div>
            <div style="font-size: 12px; color: #1e293b; line-height: 1.5; font-weight: 500;">${escapeHtml(state.brandHeart.vision || "Not defined")}</div>
          </div>
        </div>

        <div style="padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 16px;">
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 4px;">Mission (How We Deliver Daily)</div>
          <div style="font-size: 12px; color: #1e293b; line-height: 1.5; font-weight: 500;">${escapeHtml(state.brandHeart.mission || "Not defined")}</div>
        </div>

        <div style="padding: 16px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px;">
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #b45309; margin-bottom: 8px;">Core Operating Values</div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${
              state.brandHeart.values.length > 0
                ? state.brandHeart.values
                    .map(
                      (v) =>
                        `<span style="padding: 4px 10px; background: #fef3c7; color: #92400e; font-size: 11px; font-weight: 700; border-radius: 20px;">${escapeHtml(v)}</span>`
                    )
                    .join("")
                : '<span style="font-size: 12px; color: #94a3b8; italic;">No core values specified</span>'
            }
          </div>
        </div>
      </div>

      <!-- Simon Sinek Golden Circle -->
      <div>
        <h3 style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #2563eb; margin: 0 0 16px 0;">
          Simon Sinek's Golden Circle Alignment
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px;">
          <div style="padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px;">
            <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #15803d; margin-bottom: 6px;">1. WHY (The Core Belief)</div>
            <div style="font-size: 11px; color: #166534; line-height: 1.5;">${escapeHtml(state.goldenCircle.why || "Not defined")}</div>
          </div>
          <div style="padding: 16px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px;">
            <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #1d4ed8; margin-bottom: 6px;">2. HOW (The Process)</div>
            <div style="font-size: 11px; color: #1e40af; line-height: 1.5;">${escapeHtml(state.goldenCircle.how || "Not defined")}</div>
          </div>
          <div style="padding: 16px; background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 12px;">
            <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #7e22ce; margin-bottom: 6px;">3. WHAT (The Offerings)</div>
            <div style="font-size: 11px; color: #6b21a8; line-height: 1.5;">${escapeHtml(state.goldenCircle.what || "Not defined")}</div>
          </div>
        </div>
      </div>

      <div style="position: absolute; bottom: 20px; left: 60px; right: 60px; font-size: 10px; color: #64748b; font-family: monospace; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px;">
        © 2026 Onawa Studio | Strategy by Clyde Strydom
      </div>
    </div>

    <!-- STRATEGIC POSITIONING, VILLAIN & EXPERIENCE ROADMAP PAGE -->
    <div class="pdf-page" style="width: 800px; height: 1130px; padding: 50px 60px 80px 60px; background: #ffffff; color: #0f172a; box-sizing: border-box; position: relative;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 24px;">
        <span style="font-size: 16px; font-weight: 900; color: #0f172a; letter-spacing: -0.01em;">The Onawa Studio Brand Blueprint: Curated for ${escapeHtml(brandTitle)} by Clyde Strydom</span>
        <span style="font-size: 11px; font-weight: 700; color: #2563eb; text-transform: uppercase;">Strategic Positioning</span>
      </div>

      <!-- Defined Enemy Card -->
      <div style="margin-bottom: 24px; padding: 20px; background: #fff1f2; border: 2px solid #f43f5e; border-radius: 16px;">
        <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #e11d48; margin-bottom: 6px;">
          The Strategic "Villain" (Defined Enemy)
        </div>
        <div style="font-size: 15px; font-weight: 800; color: #881337; line-height: 1.4;">
          ${escapeHtml(state.strategicEnemy || "Status Quo & Inefficiency")}
        </div>
        <div style="font-size: 11px; font-style: italic; color: #be123c; margin-top: 8px;">
          "Clyde's Perspective: To be a hero to your customers, you must first define the villain you are rescuing them from."
        </div>
      </div>

      <!-- Market Positioning Matrix -->
      <div style="margin-bottom: 28px;">
        <h3 style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #0284c7; margin: 0 0 12px 0;">
          Market Positioning Matrix
        </h3>

        <div style="display: grid; grid-template-columns: 200px 1fr; gap: 20px; align-items: center; background: #090d16; padding: 20px; border-radius: 16px; color: #ffffff;">
          <!-- Mini SVG Representation -->
          <div style="width: 180px; height: 180px; border: 1px solid #334155; position: relative; background: #020617; border-radius: 12px; margin: 0 auto;">
            <div style="position: absolute; left: 50%; top: 10px; bottom: 10px; width: 1px; background: #00FFC2; opacity: 0.5;"></div>
            <div style="position: absolute; top: 50%; left: 10px; right: 10px; height: 1px; background: #00FFC2; opacity: 0.5;"></div>
            <div style="position: absolute; left: ${90 + ((state.positioningMatrix?.x || 50) / 100) * 70 - 8}px; top: ${90 - ((state.positioningMatrix?.y || 50) / 100) * 70 - 8}px; width: 16px; height: 16px; background: #C1FF00; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 0 12px #C1FF00;"></div>
            <div style="position: absolute; top: 4px; width: 100%; text-align: center; font-size: 8px; font-family: monospace; color: #00FFC2; font-weight: bold;">PROGRESSIVE</div>
            <div style="position: absolute; bottom: 4px; width: 100%; text-align: center; font-size: 8px; font-family: monospace; color: #64748b;">TRADITIONAL</div>
            <div style="position: absolute; left: 4px; top: 80px; font-size: 8px; font-family: monospace; color: #64748b;">CORP</div>
            <div style="position: absolute; right: 4px; top: 80px; font-size: 8px; font-family: monospace; color: #C1FF00; font-weight: bold;">DISRUPT</div>
          </div>

          <div>
            <div style="font-size: 11px; font-weight: 800; color: #C1FF00; text-transform: uppercase; font-family: monospace; margin-bottom: 6px;">
              Identified Quadrant Focus
            </div>
            <div style="font-size: 18px; font-weight: 900; color: #ffffff; margin-bottom: 8px;">
              ${escapeHtml(state.positioningMatrix?.quadrant || "Blue Ocean Gap")}
            </div>
            <div style="font-size: 12px; color: #94a3b8; line-height: 1.5; font-family: monospace;">
              Coordinates: X = ${state.positioningMatrix?.x || 50} (${(state.positioningMatrix?.x || 50) > 0 ? "Disruptive" : "Corporate"}), Y = ${state.positioningMatrix?.y || 50} (${(state.positioningMatrix?.y || 50) > 0 ? "Progressive" : "Traditional"})
            </div>
          </div>
        </div>
      </div>

      <!-- Experience Roadmap Touchpoints -->
      <div>
        <h3 style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #0d9488; margin: 0 0 12px 0;">
          Experience Roadmap (Customer Lifecycle)
        </h3>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          ${renderPdfRoadmapPhase("1. Discovery", state.experienceRoadmap?.phaseAssignments?.discovery, "#16a34a", "#f0fdf4")}
          ${renderPdfRoadmapPhase("2. Engagement", state.experienceRoadmap?.phaseAssignments?.engagement, "#0284c7", "#f0f9ff")}
          ${renderPdfRoadmapPhase("3. Purchase", state.experienceRoadmap?.phaseAssignments?.purchase, "#2563eb", "#eff6ff")}
          ${renderPdfRoadmapPhase("4. Advocacy", state.experienceRoadmap?.phaseAssignments?.advocacy, "#9333ea", "#faf5ff")}
        </div>
      </div>

      <!-- Mandatory Section Footer -->
      <div style="position: absolute; bottom: 20px; left: 60px; right: 60px; font-size: 10px; color: #64748b; font-family: monospace; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px;">
        Proprietary Strategic Framework by Clyde Strydom for Onawa Studio.
      </div>
    </div>

    <!-- PAGE 3: ARCHETYPE & PERSONALITY SPECTRUM -->
    <div class="pdf-page" style="width: 800px; height: 1130px; padding: 50px 60px 80px 60px; background: #ffffff; color: #0f172a; box-sizing: border-box; position: relative;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 30px;">
        <span style="font-size: 16px; font-weight: 900; color: #0f172a; letter-spacing: -0.01em;">The Onawa Studio Brand Blueprint: Curated for ${escapeHtml(brandTitle)} by Clyde Strydom</span>
        <span style="font-size: 11px; font-weight: 700; color: #f59e0b; text-transform: uppercase;">Section 02</span>
      </div>

      <!-- Archetype Card -->
      <div style="margin-bottom: 36px;">
        <h3 style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #7c3aed; margin: 0 0 16px 0;">
          Willow Marketing's 12 Brand Archetypes
        </h3>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <!-- Primary Archetype -->
          <div style="padding: 20px; background: #fcf5ff; border: 2px solid #a855f7; border-radius: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; padding: 2px 8px; background: #a855f7; color: #ffffff; border-radius: 10px;">Primary Archetype</span>
            </div>
            <div style="font-size: 20px; font-weight: 900; color: #581c87; margin-bottom: 4px;">
              ${escapeHtml(primaryArch?.name || "Not Selected")}
            </div>
            ${
              primaryArch
                ? `
                <div style="font-size: 12px; font-style: italic; font-weight: 700; color: #7e22ce; margin-bottom: 10px;">
                  "${escapeHtml(primaryArch.motto)}"
                </div>
                <div style="font-size: 11px; color: #3b0764; line-height: 1.5; margin-bottom: 12px;">
                  ${escapeHtml(primaryArch.traitSummary)}
                </div>
                <div style="font-size: 10px; font-weight: 700; color: #6b21a8;">
                  Core Fear: <span style="font-weight: 500; color: #4c1d95;">${escapeHtml(primaryArch.fear)}</span>
                </div>
              `
                : `<div style="font-size: 12px; color: #94a3b8;">No archetype chosen</div>`
            }
          </div>

          <!-- Secondary Archetype -->
          <div style="padding: 20px; background: #f0fdfa; border: 1px solid #2dd4bf; border-radius: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; padding: 2px 8px; background: #0d9488; color: #ffffff; border-radius: 10px;">Secondary Archetype</span>
            </div>
            <div style="font-size: 20px; font-weight: 900; color: #115e59; margin-bottom: 4px;">
              ${escapeHtml(secondaryArch?.name || "None")}
            </div>
            ${
              secondaryArch
                ? `
                <div style="font-size: 12px; font-style: italic; font-weight: 700; color: #0d9488; margin-bottom: 10px;">
                  "${escapeHtml(secondaryArch.motto)}"
                </div>
                <div style="font-size: 11px; color: #134e4a; line-height: 1.5; margin-bottom: 12px;">
                  ${escapeHtml(secondaryArch.traitSummary)}
                </div>
              `
                : `<div style="font-size: 12px; color: #94a3b8;">No secondary archetype selected</div>`
            }
          </div>
        </div>
      </div>

      <!-- Personality Spectrum Sliders -->
      <div>
        <h3 style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #059669; margin: 0 0 16px 0;">
          Brand Personality Spectrum Sliders
        </h3>

        <div style="display: flex; flex-direction: column; gap: 16px; background: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0;">
          ${renderPdfSlider("Traditional", "Progressive", state.personality.traditionalVsProgressive)}
          ${renderPdfSlider("Corporate", "Disruptive", state.personality.corporateVsDisruptive)}
          ${renderPdfSlider("Low-key / Reserved", "Bold / Expressive", state.personality.reservedVsBold)}
          ${renderPdfSlider("Luxury / Exclusive", "Accessible / Inclusive", state.personality.exclusiveVsAccessible)}
          ${renderPdfSlider("Playful / Witty", "Serious / Authoritative", state.personality.playfulVsSerious)}
        </div>
      </div>

      <div style="position: absolute; bottom: 20px; left: 60px; right: 60px; font-size: 10px; color: #64748b; font-family: monospace; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px;">
        © 2026 Onawa Studio | Strategy by Clyde Strydom
      </div>
    </div>

    <!-- PAGE 4: VISUAL & VERBAL IDENTITY -->
    <div class="pdf-page" style="width: 800px; height: 1130px; padding: 50px 60px 80px 60px; background: #ffffff; color: #0f172a; box-sizing: border-box; position: relative;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 24px;">
        <span style="font-size: 16px; font-weight: 900; color: #0f172a; letter-spacing: -0.01em;">The Onawa Studio Brand Blueprint: Curated for ${escapeHtml(brandTitle)} by Clyde Strydom</span>
        <span style="font-size: 11px; font-weight: 700; color: #f59e0b; text-transform: uppercase;">Section 03</span>
      </div>

      <!-- Logo Strategy -->
      <div style="margin-bottom: 32px;">
        <h3 style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #d97706; margin: 0 0 12px 0;">
          Visual Strategy: Logo Architecture
        </h3>

        <div style="padding: 20px; background: #fffbeb; border: 1px solid #fcd34d; border-radius: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 16px; font-weight: 900; color: #78350f; text-transform: uppercase; letter-spacing: 0.05em;">
              Chosen Format: ${escapeHtml(state.logoType)}
            </span>
          </div>
          <div style="font-size: 12px; color: #92400e; line-height: 1.6; font-weight: 500;">
            <strong>Category Fit Justification:</strong><br/>
            ${LOGO_JUSTIFICATIONS[state.logoType] || "Provides a balanced visual anchor for multichannel brand touchpoints."}
          </div>
        </div>
      </div>

      <!-- Verbal Identity & UVP -->
      <div style="margin-bottom: 32px;">
        <h3 style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #2563eb; margin: 0 0 12px 0;">
          Verbal Identity & Unique Value Proposition
        </h3>

        <div style="padding: 20px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 16px; margin-bottom: 16px;">
          <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #0369a1; margin-bottom: 6px;">
            Core Value Proposition Statement
          </div>
          <div style="font-size: 14px; font-weight: 700; color: #0c4a6e; line-height: 1.5; font-style: italic;">
            "Our ${escapeHtml(state.uvp.offering || "[offering]")} is the only ${escapeHtml(state.uvp.category || "[category]")} that ${escapeHtml(state.uvp.benefit || "[benefit]")} for ${escapeHtml(state.uvp.targetAudience || "[audience]")}."
          </div>
        </div>

        <!-- Fernando Ifran Love/Hate Matrix -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div style="padding: 16px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px;">
            <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #15803d; margin-bottom: 6px;">
              Traits to Embrace ("That's Us")
            </div>
            <div style="font-size: 11px; color: #166534; font-weight: 600; line-height: 1.5;">
              ${state.keywords.love.length > 0 ? state.keywords.love.map((k) => escapeHtml(k)).join(", ") : "None specified"}
            </div>
          </div>

          <div style="padding: 16px; background: #fef2f2; border: 1px solid #fca5a5; border-radius: 12px;">
            <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #b91c1c; margin-bottom: 6px;">
              Traits to Avoid ("Definitely Not Us")
            </div>
            <div style="font-size: 11px; color: #991b1b; font-weight: 600; line-height: 1.5;">
              ${state.keywords.hate.length > 0 ? state.keywords.hate.map((k) => escapeHtml(k)).join(", ") : "None specified"}
            </div>
          </div>
        </div>
      </div>

      ${
        state.aiAnalysis
          ? `
        <div>
          <h3 style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #9333ea; margin: 0 0 12px 0;">
            Gemini AI Brand Manifesto & Taglines
          </h3>
          <div style="padding: 16px; background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 12px; font-size: 11px; color: #581c87; line-height: 1.6; font-style: italic; white-space: pre-line;">
            ${escapeHtml(state.aiAnalysis.brandManifesto)}
          </div>
        </div>
      `
          : ""
      }

      <!-- Strategist Sign-off -->
      <div style="margin-top: 20px; padding: 18px 24px; background: #0f172a; color: #ffffff; border-radius: 16px; border: 2px solid #10b981;">
        <div style="font-size: 13px; font-weight: 800; color: #10b981; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">
          Alignment Complete.
        </div>
        <div style="font-size: 13px; font-style: italic; color: #f8fafc;">
          "I look forward to bringing your vision to life. — Clyde Strydom"
        </div>
      </div>

      <div style="position: absolute; bottom: 20px; left: 60px; right: 60px; font-size: 10px; color: #64748b; font-family: monospace; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px;">
        © 2026 Onawa Studio | Strategy by Clyde Strydom
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const pdf = new jsPDF({
      orientation: "p",
      unit: "px",
      format: [800, 1130],
      hotfixes: ["px_scaling"],
    });

    const pages = container.querySelectorAll<HTMLElement>(".pdf-page");

    for (let i = 0; i < pages.length; i++) {
      onProgress?.(`Rendering Style Guide Page ${i + 1} of ${pages.length}...`);
      const pageEl = pages[i];

      const canvas = await html2canvas(pageEl, {
        scale: 2, // High resolution crisp rendering
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      if (i > 0) {
        pdf.addPage([800, 1130]);
      }

      pdf.addImage(imgData, "JPEG", 0, 0, 800, 1130);
    }

    onProgress?.("Downloading Style Guide PDF...");
    const fileName = `${brandTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_style_guide.pdf`;
    pdf.save(fileName);
  } finally {
    document.body.removeChild(container);
  }
}

function renderPdfSlider(leftLabel: string, rightLabel: string, value: number): string {
  return `
    <div>
      <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; color: #334155; margin-bottom: 4px;">
        <span>${escapeHtml(leftLabel)}</span>
        <span style="color: #d97706; font-family: monospace;">${value}%</span>
        <span>${escapeHtml(rightLabel)}</span>
      </div>
      <div style="height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; position: relative;">
        <div style="position: absolute; left: 0; top: 0; bottom: 0; width: ${value}%; background: linear-gradient(90deg, #f59e0b, #06b6d4); border-radius: 4px;"></div>
      </div>
    </div>
  `;
}

function renderPdfRoadmapPhase(
  title: string,
  touchpointIds: string[] = [],
  color: string,
  bgColor: string
): string {
  const touchpointNames: Record<string, string> = {
    website: "Website & Web App",
    social_media: "Social Media Channels",
    unboxing: "Unboxing & Packaging",
    customer_service: "Customer Service & Support",
    retail: "Retail & Physical Space",
    email_marketing: "Email Newsletters",
    mobile_app: "Mobile Application",
    sales_deck: "Sales Deck & Pitch",
    events_expos: "Pop-Up Events & Expos",
    community: "VIP Community Portal",
    word_of_mouth: "Referral & Word of Mouth",
    product_ux: "Product Quality & UX",
  };

  const labels = touchpointIds.map((id) => touchpointNames[id] || id);

  return `
    <div style="padding: 12px; background: ${bgColor}; border: 1px solid ${color}; border-radius: 12px;">
      <div style="font-size: 11px; font-weight: 800; color: ${color}; text-transform: uppercase; margin-bottom: 6px;">
        ${escapeHtml(title)}
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 4px;">
        ${
          labels.length > 0
            ? labels
                .map(
                  (l) =>
                    `<span style="font-size: 9px; font-weight: 700; padding: 2px 6px; background: #ffffff; color: #0f172a; border-radius: 6px; border: 1px solid #cbd5e1;">${escapeHtml(
                      l
                    )}</span>`
                )
                .join("")
            : `<span style="font-size: 10px; color: #94a3b8; font-style: italic;">None assigned</span>`
        }
      </div>
    </div>
  `;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
