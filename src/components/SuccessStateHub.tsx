import React, { useState } from "react";
import { BrandQuestionnaireState } from "../types";
import { generateBrandStyleGuidePDF } from "../utils/pdfGenerator";
import { SubmitToStrategistModal } from "./SubmitToStrategistModal";
import { BRAND_ARCHETYPES } from "../data/archetypes";
import {
  Sparkles,
  Send,
  Download,
  CheckCircle2,
  Heart,
  Users,
  Layers,
  FileText,
  RotateCcw,
  Loader2,
  Bot,
  ArrowRight,
  ShieldAlert,
  Wand2,
  BookOpen,
  Palette,
  Compass,
  Flame,
  Smile,
  Crown,
  HandHeart,
  Quote
} from "lucide-react";

interface SuccessStateHubProps {
  state: BrandQuestionnaireState;
  onEditStep: (stepNumber: number) => void;
  onReset: () => void;
  onSynthesizeAI: () => void;
  loadingAI: boolean;
}

export const SuccessStateHub: React.FC<SuccessStateHubProps> = ({
  state,
  onEditStep,
  onReset,
  onSynthesizeAI,
  loadingAI,
}) => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfProgressMsg, setPdfProgressMsg] = useState<string | null>(null);

  const primaryArch = BRAND_ARCHETYPES.find((a) => a.id === state.primaryArchetype);
  const secondaryArch = BRAND_ARCHETYPES.find((a) => a.id === state.secondaryArchetype);

  const handleDownloadPDF = async () => {
    try {
      setPdfGenerating(true);
      setPdfProgressMsg("Initializing PDF Generator...");

      await generateBrandStyleGuidePDF(state, (msg) => {
        setPdfProgressMsg(msg);
      });
    } catch (e) {
      console.error("PDF generation failed:", e);
      alert("An error occurred while generating your Brand Style Guide PDF. Please try again.");
    } finally {
      setPdfGenerating(false);
      setPdfProgressMsg(null);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn">
      {/* CELEBRATORY HERO BANNER */}
      <div className="relative overflow-hidden p-8 md:p-10 bg-graphite rounded-3xl border-2 border-cream shadow-2xl flex flex-col gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cream/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cream/20 border border-cream rounded-full text-cream text-xs font-mono font-black uppercase tracking-widest">
              <CheckCircle2 className="w-4 h-4 text-brass" />
              <span>Discovery Complete • Success State</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-headline font-bold text-cream tracking-tight">
              {state.brandName ? `${state.brandName} Discovery Complete` : "Brand Discovery Complete!"}
            </h1>

            <p className="text-sm text-cream/80 leading-relaxed font-medium">
              You have successfully completed Simon Sinek's Golden Circle, Column Five's Brand Heart, the 12 Archetypes, Logo Anatomy, and the Dynamic UVP Builder.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onSynthesizeAI}
              disabled={loadingAI}
              className="px-4 py-2.5 bg-brass hover:bg-brass-hover text-carbon-black font-bold text-xs rounded-xl flex items-center gap-2 border border-brass/30 shadow-lg transition-all disabled:opacity-50"
            >
              {loadingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4 text-carbon-black" />}
              <span>{state.aiAnalysis ? "Re-Synthesize AI Strategy" : "Synthesize AI Strategy"}</span>
            </button>
          </div>
        </div>

        {/* PRIMARY ACTIONS GRID (REQ: Send to My Strategist & Download My Style Guide) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 relative z-10">
          {/* Action 1: Send to My Strategist */}
          <div className="p-6 bg-graphite hover:bg-surface rounded-2xl border-2 border-cream shadow-xl flex flex-col justify-between gap-4 group transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center text-carbon-black shrink-0 shadow-lg shadow-cream/20 group-hover:scale-105 transition-all">
                <Send className="w-6 h-6 stroke-[2.5]" />
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-headline font-bold text-cream group-hover:text-cream transition-colors">
                  Dispatch to Clyde
                </h3>
                <p className="text-xs text-cream/70 leading-relaxed">
                  Complete your Brand Discovery and dispatch your entire Brand Blueprint—including Brand Heart, Archetypes, Positioning Matrix, and Mood Board—directly to Clyde Strydom at Onawa Studio.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEmailModalOpen(true)}
              className="w-full py-3.5 bg-cream hover:bg-cream/90 text-carbon-black font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cream/20 transition-all"
            >
              <span>Complete Discovery & Dispatch to Clyde</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Action 2: Download My Style Guide (PDF) */}
          <div className="p-6 bg-graphite hover:bg-surface rounded-2xl border-2 border-[#F5F0E8] shadow-xl flex flex-col justify-between gap-4 group transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brass flex items-center justify-center text-carbon-black shrink-0 shadow-lg shadow-brass/20 group-hover:scale-105 transition-all">
                <Download className="w-6 h-6 stroke-[2.5]" />
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-headline font-bold text-cream group-hover:text-brass transition-colors">
                  Download My Style Guide
                </h3>
                <p className="text-xs text-cream/70 leading-relaxed">
                  Export a high-end, multi-page client PDF Style Guide containing cover page, Brand Heart, Archetypes & Visual Strategy.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={pdfGenerating}
              className="w-full py-3.5 bg-brass hover:bg-brass-hover text-carbon-black font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brass/20 transition-all disabled:opacity-50"
            >
              {pdfGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{pdfProgressMsg || "Generating PDF..."}</span>
                </>
              ) : (
                <>
                  <span>Download Brand Style Guide (PDF)</span>
                  <Download className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* EXECUTIVE DISCOVERY BRIEF SNAPSHOTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Brand Heart Snapshot */}
        <div className="p-6 bg-graphite rounded-2xl border border-cream/40 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-cream font-bold text-sm">
              <Heart className="w-4 h-4" />
              <span>Brand Heart</span>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="text-[11px] text-cream/60 hover:text-cream"
            >
              Edit
            </button>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-cream/60">Purpose:</span>
              <p className="text-cream/80 font-medium line-clamp-2 mt-0.5">
                {state.brandHeart.purpose || "Not specified"}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-cream/60">Core Values:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {state.brandHeart.values.map((v) => (
                  <span key={v} className="px-2 py-0.5 bg-cream/20 text-cream border border-cream/40 rounded-md text-[10px] font-bold">
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Archetype Snapshot */}
        <div className="p-6 bg-graphite rounded-2xl border border-brass/40 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-brass font-bold text-sm">
              <Users className="w-4 h-4" />
              <span>Primary Archetype</span>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(4)}
              className="text-[11px] text-cream/60 hover:text-brass"
            >
              Edit
            </button>
          </div>

          <div className="flex flex-col gap-2 text-xs">
            <span className="text-base font-bold text-cream">
              {primaryArch?.name || "Not Selected"}
            </span>
            {primaryArch && (
              <p className="text-xs italic text-cream font-serif">
                "{primaryArch.motto}"
              </p>
            )}
            {secondaryArch && (
              <span className="text-[11px] text-cream/70 mt-1">
                Secondary: <strong className="text-brass">{secondaryArch.name}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Visual Strategy Snapshot */}
        <div className="p-6 bg-graphite rounded-2xl border border-brass/30 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-brass font-bold text-sm">
              <Layers className="w-4 h-4" />
              <span>Visual & Verbal Strategy</span>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(7)}
              className="text-[11px] text-cream/60 hover:text-brass"
            >
              Edit
            </button>
          </div>

          <div className="flex flex-col gap-2 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-cream/60">Logo Choice:</span>
              <div className="font-bold text-cream uppercase mt-0.5">
                {state.logoType}
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-cream/60">UVP Summary:</span>
              <p className="text-cream/70 italic line-clamp-2 mt-0.5">
                "Our {state.uvp.offering || "[offering]"} is the only {state.uvp.category || "[category]"}..."
              </p>
            </div>
          </div>
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
