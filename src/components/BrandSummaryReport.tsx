import React, { useState } from "react";
import { BrandQuestionnaireState, AIAnalysisResult } from "../types";
import { BRAND_ARCHETYPES } from "../data/archetypes";
import { generateBrandStyleGuidePDF } from "../utils/pdfGenerator";
import { SubmitToStrategistModal } from "./SubmitToStrategistModal";
import {
  Printer,
  Copy,
  Check,
  Sparkles,
  Download,
  RotateCcw,
  Bot,
  Heart,
  Target,
  Users,
  Sliders,
  Layers,
  FileText,
  Quote,
  Loader2,
  AlertCircle,
  Send,
  CheckCircle2,
  Skull,
  Compass
} from "lucide-react";

interface BrandSummaryReportProps {
  state: BrandQuestionnaireState;
  onEditStep: (stepNumber: number) => void;
  onReset: () => void;
  onUpdateAIAnalysis: (analysis: AIAnalysisResult) => void;
}

export const BrandSummaryReport: React.FC<BrandSummaryReportProps> = ({
  state,
  onEditStep,
  onReset,
  onUpdateAIAnalysis,
}) => {
  const [copied, setCopied] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfProgressMsg, setPdfProgressMsg] = useState<string | null>(null);

  const primaryArchInfo = BRAND_ARCHETYPES.find(
    (a) => a.id === state.primaryArchetype
  );
  const secondaryArchInfo = BRAND_ARCHETYPES.find(
    (a) => a.id === state.secondaryArchetype
  );

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      setPdfGenerating(true);
      setPdfProgressMsg("Preparing Style Guide PDF...");
      await generateBrandStyleGuidePDF(state, (msg) => {
        setPdfProgressMsg(msg);
      });
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      alert("Failed to generate Brand Style Guide PDF. Please try again.");
    } finally {
      setPdfGenerating(false);
      setPdfProgressMsg(null);
    }
  };

  const generateMarkdownReport = (): string => {
    return `# ONAWA STUDIO BRAND BLUEPRINT
*Custom strategy tool for Onawa Studio clients, utilizing Simon Sinek’s Golden Circle mixed with Clyde Strydom’s 17+ years of experience.*

**Client Profile:** ${state.clientProfile?.fullName || "Onawa Client"} (${state.clientProfile?.email || "N/A"})
**Brand Name:** ${state.brandName || "Unnamed Brand"}
**Industry:** ${state.industry || "Not specified"}
**Project Type:** ${state.projectType === "rebrand" ? "Rebrand" : "New Brand"}

---

## 1. BRAND HEART (Column Five Framework)
- **Purpose (Why we exist):** ${state.brandHeart.purpose || "N/A"}
- **Vision (Future impact):** ${state.brandHeart.vision || "N/A"}
- **Mission (How we deliver):** ${state.brandHeart.mission || "N/A"}
- **Core Values:** ${state.brandHeart.values.join(", ") || "N/A"}

---

## 2. SIMON SINEK'S GOLDEN CIRCLE
- **1. WHY (Core Belief):** ${state.goldenCircle.why || "N/A"}
- **2. HOW (Unique Process):** ${state.goldenCircle.how || "N/A"}
- **3. WHAT (Offerings):** ${state.goldenCircle.what || "N/A"}

---

## 3. STRATEGIC VILLAIN & POSITIONING MATRIX
- **Strategic Enemy:** ${state.strategicEnemy || "Status Quo & Inefficiency"}
- **Positioning Focus:** ${state.positioningMatrix?.quadrant || "Blue Ocean Gap"} (X: ${state.positioningMatrix?.x || 50}, Y: ${state.positioningMatrix?.y || 50})
- *Clyde's Perspective:* "To be a hero to your customers, you must first define the villain you are rescuing them from."

---

## 4. 12 ARCHETYPES POSITIONING (Willow Marketing)
- **Primary Archetype:** ${primaryArchInfo?.name || "Not chosen"} ("${primaryArchInfo?.motto || ""}")
- **Secondary Archetype:** ${secondaryArchInfo?.name || "Not chosen"} ("${secondaryArchInfo?.motto || ""}")

---

## 5. PERSONALITY SPECTRUM
- Heritage vs. Progressive: ${state.personality.traditionalVsProgressive}%
- Corporate vs. Disruptive: ${state.personality.corporateVsDisruptive}%
- Quiet vs. Bold: ${state.personality.reservedVsBold}%
- Luxury vs. Accessible: ${state.personality.exclusiveVsAccessible}%
- Playful vs. Serious: ${state.personality.playfulVsSerious}%

---

## 6. LOVE / HATE MATRIX (Fernando Ifrán)
- **Embrace ("That's Us"):** ${state.keywords.love.join(", ") || "None"}
- **Avoid ("Definitely Not Us"):** ${state.keywords.hate.join(", ") || "None"}

---

## 7. EXPERIENCE ROADMAP (Customer Lifecycle Touchpoints)
- **1. Discovery:** ${state.experienceRoadmap?.phaseAssignments?.discovery?.join(", ") || "None"}
- **2. Engagement:** ${state.experienceRoadmap?.phaseAssignments?.engagement?.join(", ") || "None"}
- **3. Purchase:** ${state.experienceRoadmap?.phaseAssignments?.purchase?.join(", ") || "None"}
- **4. Advocacy:** ${state.experienceRoadmap?.phaseAssignments?.advocacy?.join(", ") || "None"}

---

## 8. INTERACTIVE MOOD BOARD CANVAS (Fabric.js State JSON)
- **Canvas Elements Count:** ${state.moodBoard?.elements?.length || 0}
- **Mood Board Element Summary:**
${
  state.moodBoard?.elements && state.moodBoard.elements.length > 0
    ? state.moodBoard.elements
        .map(
          (el, idx) =>
            `  ${idx + 1}. [${el.type.toUpperCase()}] Label: "${el.label || "Element"}" (X: ${Math.round(el.left)}, Y: ${Math.round(el.top)})`
        )
        .join("\n")
    : "  No elements placed on interactive canvas yet."
}

---

## 9. LOGO ANATOMY & UVP
- **Logo Type:** ${state.logoType.toUpperCase()}
- **Unique Value Proposition:** Our ${state.uvp.offering || "[offering]"} is the only ${state.uvp.category || "[category]"} that ${state.uvp.benefit || "[benefit]"} for ${state.uvp.targetAudience || "[audience]"}.

Proprietary Strategic Framework by Clyde Strydom for Onawa Studio.

${
  state.aiAnalysis
    ? `
---

## 7. AI BRAND MANIFESTO & STRATEGY (Gemini Synthesized)
### Manifesto
${state.aiAnalysis.brandManifesto}

### Refined UVP
${state.aiAnalysis.refinedUVP}

### Strategic Tagline Options
${state.aiAnalysis.taglineOptions
  .map((t) => `- **"${t.tagline}"** (${t.angle})`)
  .join("\n")}

### Voice & Narrative Guidelines
${state.aiAnalysis.brandVoiceGuidelines.map((g) => `- ${g}`).join("\n")}
`
    : ""
}`;
  };

  const handleCopy = () => {
    const text = generateMarkdownReport();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${(state.brandName || "brand").toLowerCase().replace(/\s+/g, "_")}_strategy.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSynthesizeAI = async () => {
    setLoadingAI(true);
    setAiError(null);

    try {
      const res = await fetch("/api/enhance-brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandData: state }),
      });

      const data = await res.json();
      if (data.success && data.aiAnalysis) {
        onUpdateAIAnalysis(data.aiAnalysis);
      } else {
        setAiError(data.error || "Failed to generate AI brand strategy.");
      }
    } catch (err: any) {
      setAiError("Network error calling Gemini AI endpoint. Ensure server is running.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 print:p-0 print:bg-white print:text-black">
      {/* Top Action Toolbar (Hidden in Print) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-graphite rounded-2xl border-2 border-cream/30 shadow-lg backdrop-blur-xl print:hidden">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-cream" />
          <span className="font-bold text-cream text-sm">
            Brand Discovery Summary Report
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Primary Action 1: Dispatch to Clyde */}
          <button
            type="button"
            onClick={() => setIsEmailModalOpen(true)}
            className="px-3.5 py-2 bg-cream hover:bg-cream/90 text-carbon-black font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
            <span>Dispatch to Clyde</span>
          </button>

          {/* Primary Action 2: Download Style Guide PDF */}
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={pdfGenerating}
            className="px-3.5 py-2 bg-brass hover:bg-brass-hover text-carbon-black font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
          >
            {pdfGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin text-carbon-black" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{pdfProgressMsg || "Download Style Guide (PDF)"}</span>
          </button>

          <button
            type="button"
            onClick={handleSynthesizeAI}
            disabled={loadingAI}
            className="px-3.5 py-2 bg-[#2B00FF] hover:bg-[#2B00FF]/80 text-cream font-bold text-xs rounded-xl flex items-center gap-1.5 border border-brass/30 transition-all disabled:opacity-50"
          >
            {loadingAI ? (
              <Loader2 className="w-4 h-4 animate-spin text-cream" />
            ) : (
              <Bot className="w-4 h-4 text-brass" />
            )}
            <span>
              {state.aiAnalysis ? "Re-Synthesize AI" : "Gemini AI Strategy"}
            </span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-2 bg-surface text-cream/80 hover:bg-graphite font-semibold text-xs rounded-xl flex items-center gap-1.5 border border-white/10 transition-all"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-brass" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? "Copied" : "Markdown"}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadJSON}
            className="px-3 py-2 bg-surface text-cream/80 hover:bg-graphite font-semibold text-xs rounded-xl flex items-center gap-1.5 border border-white/10 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-2 bg-slate-800 text-cream/80 hover:bg-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 border border-white/10 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="px-3 py-2 bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 font-semibold text-xs rounded-xl flex items-center gap-1.5 border border-rose-500/30 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* AI Error Banner */}
      {aiError && (
        <div className="p-4 bg-rose-950/50 border border-rose-500/50 rounded-xl text-xs text-rose-200 flex items-center gap-2 print:hidden">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{aiError}</span>
        </div>
      )}

      {/* PRINTABLE REPORT DOCUMENT CANVAS */}
      <div className="p-8 md:p-12 bg-surface/95 rounded-3xl border border-slate-800 shadow-2xl flex flex-col gap-10 print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Document Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-800 print:border-black">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#D4A574] text-carbon-black font-black font-mono text-[10px] uppercase rounded-full">
                Onawa Studio Original
              </span>
              <span className="text-xs font-mono font-bold tracking-widest text-brass uppercase">
                Strategy by Clyde Strydom
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-cream tracking-tight print:text-black">
              The Onawa Studio Brand Blueprint: Curated for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A574] via-[#F5F0E8] to-amber-300 print:text-black">
                {state.brandName || "Client"}
              </span>{" "}
              by Clyde Strydom
            </h1>
            <p className="text-xs md:text-sm text-cream/70 font-medium print:text-gray-600">
              {state.industry || "Market Sector Unspecified"} •{" "}
              {state.projectType === "rebrand" ? "Strategic Rebrand" : "New Brand Launch"}
            </p>
          </div>

          <div className="flex flex-col text-right text-xs text-cream/60 font-mono print:text-gray-500 shrink-0">
            <span>Ref: ONAWA-BLUEPRINT</span>
            <span>Generated: {new Date().toLocaleDateString()}</span>
            <span>Frameworks: Sinek, Heart, Archetypes</span>
          </div>
        </div>

        {/* AI Synthetic Analysis Section (if present) */}
        {state.aiAnalysis && (
          <div className="p-6 bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-slate-900 rounded-2xl border border-amber-500/40 flex flex-col gap-6 print:border-gray-300 print:bg-gray-50">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs print:text-amber-800">
              <Sparkles className="w-4 h-4" />
              <span>Gemini AI Strategy Synthesis & Manifesto</span>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-cream/60 print:text-gray-600">
                Brand Manifesto:
              </h3>
              <div className="text-sm text-cream/80 leading-relaxed font-serif italic whitespace-pre-line border-l-2 border-amber-400 pl-4 py-1 print:text-black">
                {state.aiAnalysis.brandManifesto}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800 print:border-gray-200">
              {/* Refined UVP */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-300 print:text-amber-800">
                  Refined UVP:
                </h3>
                <p className="text-xs font-semibold text-cream/80 leading-relaxed bg-graphite/60 p-3 rounded-xl border border-slate-800 print:bg-white print:border-gray-300 print:text-black">
                  "{state.aiAnalysis.refinedUVP}"
                </p>
              </div>

              {/* Taglines */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-300 print:text-amber-800">
                  Strategic Taglines:
                </h3>
                <ul className="flex flex-col gap-2 text-xs text-cream/80">
                  {state.aiAnalysis.taglineOptions.map((tag, idx) => (
                    <li
                      key={idx}
                      className="bg-graphite/60 p-2.5 rounded-xl border border-slate-800 flex flex-col print:bg-white print:border-gray-300 print:text-black"
                    >
                      <span className="font-bold text-amber-300 print:text-black">
                        "{tag.tagline}"
                      </span>
                      <span className="text-[10px] text-cream/60 italic">
                        {tag.angle}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 1: THE BRAND HEART */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 print:border-black">
            <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2 print:text-amber-800">
              <Heart className="w-5 h-5" />
              <span>1. The Brand Heart (Column Five)</span>
            </h2>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="text-xs text-slate-500 hover:text-amber-300 print:hidden"
            >
              Edit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-graphite/60 rounded-xl border border-slate-800/80 flex flex-col gap-1 print:bg-gray-50 print:border-gray-200">
              <span className="font-bold text-cream/60 uppercase tracking-wider text-[10px] print:text-gray-600">
                Purpose (Why):
              </span>
              <span className="text-cream/80 font-medium leading-relaxed print:text-black">
                {state.brandHeart.purpose || "Not defined"}
              </span>
            </div>

            <div className="p-4 bg-graphite/60 rounded-xl border border-slate-800/80 flex flex-col gap-1 print:bg-gray-50 print:border-gray-200">
              <span className="font-bold text-cream/60 uppercase tracking-wider text-[10px] print:text-gray-600">
                Vision (Future):
              </span>
              <span className="text-cream/80 font-medium leading-relaxed print:text-black">
                {state.brandHeart.vision || "Not defined"}
              </span>
            </div>

            <div className="p-4 bg-graphite/60 rounded-xl border border-slate-800/80 flex flex-col gap-1 print:bg-gray-50 print:border-gray-200">
              <span className="font-bold text-cream/60 uppercase tracking-wider text-[10px] print:text-gray-600">
                Mission (How):
              </span>
              <span className="text-cream/80 font-medium leading-relaxed print:text-black">
                {state.brandHeart.mission || "Not defined"}
              </span>
            </div>

            <div className="p-4 bg-graphite/60 rounded-xl border border-slate-800/80 flex flex-col gap-1 print:bg-gray-50 print:border-gray-200">
              <span className="font-bold text-cream/60 uppercase tracking-wider text-[10px] print:text-gray-600">
                Core Values:
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {state.brandHeart.values.length > 0 ? (
                  state.brandHeart.values.map((v, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full font-semibold text-[11px] print:bg-gray-200 print:text-black print:border-gray-400"
                    >
                      {v}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 italic">None defined</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: SIMON SINEK'S GOLDEN CIRCLE */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 print:border-black">
            <h2 className="text-lg font-bold text-cyan-400 flex items-center gap-2 print:text-blue-800">
              <Target className="w-5 h-5" />
              <span>2. The Golden Circle (Simon Sinek)</span>
            </h2>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-xs text-slate-500 hover:text-cyan-300 print:hidden"
            >
              Edit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-amber-950/20 rounded-xl border border-amber-500/30 flex flex-col gap-1.5 print:bg-gray-50 print:border-gray-300">
              <span className="font-black text-amber-400 uppercase tracking-wider text-[11px] print:text-amber-800">
                1. WHY (Core Belief)
              </span>
              <p className="text-cream/80 leading-relaxed print:text-black">
                {state.goldenCircle.why || "Not answered"}
              </p>
            </div>

            <div className="p-4 bg-cyan-950/20 rounded-xl border border-cyan-500/30 flex flex-col gap-1.5 print:bg-gray-50 print:border-gray-300">
              <span className="font-black text-cyan-400 uppercase tracking-wider text-[11px] print:text-blue-800">
                2. HOW (Unique Process)
              </span>
              <p className="text-cream/80 leading-relaxed print:text-black">
                {state.goldenCircle.how || "Not answered"}
              </p>
            </div>

            <div className="p-4 bg-purple-950/20 rounded-xl border border-purple-500/30 flex flex-col gap-1.5 print:bg-gray-50 print:border-gray-300">
              <span className="font-black text-purple-400 uppercase tracking-wider text-[11px] print:text-purple-800">
                3. WHAT (Products & Services)
              </span>
              <p className="text-cream/80 leading-relaxed print:text-black">
                {state.goldenCircle.what || "Not answered"}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: ARCHETYPES & PERSONALITY SPECTRUM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Archetypes */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 print:border-black">
              <h2 className="text-lg font-bold text-purple-400 flex items-center gap-2 print:text-purple-800">
                <Users className="w-5 h-5" />
                <span>3. 12 Archetypes</span>
              </h2>
              <button
                type="button"
                onClick={() => onEditStep(4)}
                className="text-xs text-slate-500 hover:text-purple-300 print:hidden"
              >
                Edit
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="p-4 bg-graphite/60 rounded-xl border border-slate-800 flex flex-col gap-1 print:bg-gray-50 print:border-gray-300">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider print:text-amber-800">
                  Primary Archetype:
                </span>
                <span className="text-base font-bold text-slate-100 print:text-black">
                  {primaryArchInfo?.name || "Not selected"}
                </span>
                {primaryArchInfo && (
                  <span className="text-xs italic text-cream/60 print:text-gray-600">
                    "{primaryArchInfo.motto}" — {primaryArchInfo.traitSummary}
                  </span>
                )}
              </div>

              <div className="p-4 bg-graphite/60 rounded-xl border border-slate-800 flex flex-col gap-1 print:bg-gray-50 print:border-gray-300">
                <span className="text-[10px] font-bold text-cream/60 uppercase tracking-wider print:text-gray-600">
                  Secondary Archetype:
                </span>
                <span className="text-base font-bold text-slate-100 print:text-black">
                  {secondaryArchInfo?.name || "None"}
                </span>
                {secondaryArchInfo && (
                  <span className="text-xs italic text-cream/60 print:text-gray-600">
                    "{secondaryArchInfo.motto}" — {secondaryArchInfo.traitSummary}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Personality Spectrum */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 print:border-black">
              <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2 print:text-emerald-800">
                <Sliders className="w-5 h-5" />
                <span>4. Personality Spectrum</span>
              </h2>
              <button
                type="button"
                onClick={() => onEditStep(5)}
                className="text-xs text-slate-500 hover:text-emerald-300 print:hidden"
              >
                Edit
              </button>
            </div>

            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between items-center p-2 bg-graphite/60 rounded-lg border border-slate-800 print:bg-gray-50 print:border-gray-200">
                <span>Traditional vs. Progressive</span>
                <span className="font-mono font-bold text-amber-400 print:text-black">
                  {state.personality.traditionalVsProgressive}%
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-graphite/60 rounded-lg border border-slate-800 print:bg-gray-50 print:border-gray-200">
                <span>Corporate vs. Disruptive</span>
                <span className="font-mono font-bold text-amber-400 print:text-black">
                  {state.personality.corporateVsDisruptive}%
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-graphite/60 rounded-lg border border-slate-800 print:bg-gray-50 print:border-gray-200">
                <span>Quiet vs. Bold</span>
                <span className="font-mono font-bold text-amber-400 print:text-black">
                  {state.personality.reservedVsBold}%
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-graphite/60 rounded-lg border border-slate-800 print:bg-gray-50 print:border-gray-200">
                <span>Luxury vs. Accessible</span>
                <span className="font-mono font-bold text-amber-400 print:text-black">
                  {state.personality.exclusiveVsAccessible}%
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-graphite/60 rounded-lg border border-slate-800 print:bg-gray-50 print:border-gray-200">
                <span>Playful vs. Serious</span>
                <span className="font-mono font-bold text-amber-400 print:text-black">
                  {state.personality.playfulVsSerious}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: LOVE / HATE MATRIX & UVP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Love / Hate Matrix */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 print:border-black">
              <h2 className="text-lg font-bold text-pink-400 flex items-center gap-2 print:text-pink-800">
                <Quote className="w-5 h-5" />
                <span>5. Love/Hate Matrix</span>
              </h2>
              <button
                type="button"
                onClick={() => onEditStep(6)}
                className="text-xs text-slate-500 hover:text-pink-300 print:hidden"
              >
                Edit
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="p-3 bg-emerald-950/20 rounded-xl border border-emerald-500/30 flex flex-col gap-1 print:bg-gray-50 print:border-gray-300">
                <span className="font-bold text-emerald-400 text-[10px] uppercase tracking-wider print:text-emerald-800">
                  Embrace ("That's Us"):
                </span>
                <span className="text-cream/80 leading-relaxed print:text-black font-medium">
                  {state.keywords.love.join(", ") || "None"}
                </span>
              </div>

              <div className="p-3 bg-rose-950/20 rounded-xl border border-rose-500/30 flex flex-col gap-1 print:bg-gray-50 print:border-gray-300">
                <span className="font-bold text-rose-400 text-[10px] uppercase tracking-wider print:text-rose-800">
                  Avoid ("Definitely Not Us"):
                </span>
                <span className="text-cream/80 leading-relaxed print:text-black font-medium">
                  {state.keywords.hate.join(", ") || "None"}
                </span>
              </div>
            </div>
          </div>

          {/* Logo Anatomy & UVP */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 print:border-black">
              <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2 print:text-amber-800">
                <Layers className="w-5 h-5" />
                <span>6. Mark & UVP Architecture</span>
              </h2>
              <button
                type="button"
                onClick={() => onEditStep(8)}
                className="text-xs text-slate-500 hover:text-amber-300 print:hidden"
              >
                Edit
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="p-3 bg-graphite/60 rounded-xl border border-slate-800 flex flex-col gap-0.5 print:bg-gray-50 print:border-gray-300">
                <span className="text-[10px] font-bold text-cream/60 uppercase tracking-wider print:text-gray-600">
                  Chosen Logo Structure:
                </span>
                <span className="font-bold text-amber-300 text-sm uppercase tracking-wider print:text-black">
                  {state.logoType}
                </span>
              </div>

              <div className="p-3 bg-amber-950/20 rounded-xl border border-amber-500/30 flex flex-col gap-1 print:bg-gray-50 print:border-gray-300">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider print:text-amber-800">
                  Unique Value Proposition:
                </span>
                <blockquote className="font-serif italic text-slate-100 font-semibold leading-relaxed print:text-black">
                  "Our {state.uvp.offering || "[offering]"} is the only{" "}
                  {state.uvp.category || "[category]"} that{" "}
                  {state.uvp.benefit || "[benefit]"} for{" "}
                  {state.uvp.targetAudience || "[audience]"}."
                </blockquote>
              </div>
            </div>
          </div>
        </div>

        {/* STRATEGIST SIGN-OFF BANNER */}
        <div className="p-6 bg-graphite rounded-2xl border-2 border-[#F5F0E8] shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:border-black">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono font-bold text-brass uppercase tracking-wider">
              Onawa Studio Final Sign-Off
            </span>
            <p className="text-base md:text-lg font-black text-cream italic">
              "Alignment Complete. I look forward to bringing your vision to life."
            </p>
            <span className="text-sm font-bold text-cream">
              — Clyde Strydom
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsEmailModalOpen(true)}
            className="px-5 py-3 bg-cream hover:bg-cream/90 text-carbon-black font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-xl shrink-0 print:hidden"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
            <span>Complete Discovery & Dispatch to Clyde</span>
          </button>
        </div>

        {/* MANDATORY FOOTER */}
        <div className="pt-6 border-t border-slate-800 flex justify-center text-xs font-mono text-cream/60 print:text-gray-600">
          © 2026 Onawa Studio | Strategy by Clyde Strydom
        </div>
      </div>

      {/* SUBMIT TO STRATEGIST MODAL */}
      <SubmitToStrategistModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        state={state}
      />
    </div>
  );
};
