import React from "react";
import { Check, Sparkles, Flag, Heart, Users, Sliders, Hash, Layers, FileText, Skull, Compass, Palette } from "lucide-react";

export interface StepConfig {
  number: number;
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const QUESTIONNAIRE_STEPS: StepConfig[] = [
  {
    number: 1,
    id: "context",
    title: "Brand Context",
    subtitle: "New vs Rebrand",
    icon: Flag,
  },
  {
    number: 2,
    id: "golden_circle",
    title: "Golden Circle",
    subtitle: "Inside-Out Purpose",
    icon: Sparkles,
  },
  {
    number: 3,
    id: "brand_heart",
    title: "Brand Heart",
    subtitle: "Vision & Values",
    icon: Heart,
  },
  {
    number: 4,
    id: "villain_matrix",
    title: "Enemy & Matrix",
    subtitle: "Villain & Positioning",
    icon: Skull,
  },
  {
    number: 5,
    id: "archetypes",
    title: "12 Archetypes",
    subtitle: "Brand Soul & Motto",
    icon: Users,
  },
  {
    number: 6,
    id: "personality",
    title: "Personality Spectrum",
    subtitle: "Sliding Trait Scale",
    icon: Sliders,
  },
  {
    number: 7,
    id: "love_hate",
    title: "Love/Hate Matrix",
    subtitle: "Traits to Embrace/Avoid",
    icon: Hash,
  },
  {
    number: 8,
    id: "logo_anatomy",
    title: "Logo Anatomy",
    subtitle: "Logomark vs Type",
    icon: Layers,
  },
  {
    number: 9,
    id: "experience_roadmap",
    title: "Experience Roadmap",
    subtitle: "Journey & Touchpoints",
    icon: Compass,
  },
  {
    number: 10,
    id: "mood_board",
    title: "Visual Mood Board",
    subtitle: "Fabric.js Canvas",
    icon: Palette,
  },
  {
    number: 11,
    id: "uvp",
    title: "UVP Builder",
    subtitle: "Value Proposition",
    icon: Sparkles,
  },
  {
    number: 12,
    id: "summary",
    title: "Strategy Report",
    subtitle: "Executive Summary",
    icon: FileText,
  },
];


interface StepProgressBarProps {
  currentStep: number;
  onStepClick: (stepNumber: number) => void;
  completedSteps: Set<number>;
  onShowLandingPage?: () => void;
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  onStepClick,
  completedSteps,
  onShowLandingPage,
}) => {
  const totalSteps = QUESTIONNAIRE_STEPS.length;
  const progressPercent = Math.min(
    100,
    Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)
  );

  return (
    <div className="w-full bg-[#2B00FF] border-b border-[#00FFC2]/30 sticky top-0 z-40 backdrop-blur-xl shadow-2xl px-4 py-3 text-white">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        {/* Top Header Row */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {onShowLandingPage && (
              <button
                type="button"
                onClick={onShowLandingPage}
                className="px-2.5 py-1 bg-black/40 hover:bg-black/60 border border-[#00FFC2]/40 text-[#00FFC2] font-mono font-bold text-[10px] uppercase rounded-lg transition-all"
              >
                ← Portal
              </button>
            )}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-slate-950/80 border border-[#C1FF00]/50 rounded-lg text-[10px] font-mono font-black text-[#C1FF00]">
              <span>ONAWA STUDIO</span>
            </div>
            <span className="px-3 py-1 bg-[#C1FF00] text-slate-950 font-black uppercase tracking-wider text-[10px] rounded-full shadow-md">
              Stage {currentStep} of {totalSteps}
            </span>
            <span className="text-white font-bold text-sm hidden sm:inline">
              {QUESTIONNAIRE_STEPS[currentStep - 1]?.title}
            </span>
          </div>

          <div className="flex items-center gap-4 text-white">
            <span className="text-[#00FFC2] font-mono font-bold text-[11px]">
              {progressPercent}% Complete
            </span>
            <div className="w-24 sm:w-36 h-2.5 bg-black/40 rounded-full overflow-hidden border border-[#00FFC2]/40">
              <div
                className="h-full bg-gradient-to-r from-[#C1FF00] via-[#00FFC2] to-[#FF002B] transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Desktop / Tablet Step Timeline */}
        <div className="hidden lg:grid grid-cols-12 gap-1 items-center">
          {QUESTIONNAIRE_STEPS.map((step) => {
            const Icon = step.icon;
            const isCurrent = step.number === currentStep;
            const isCompleted = completedSteps.has(step.number);
            const isClickable = step.number <= currentStep || isCompleted;

            return (
              <button
                key={step.id}
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step.number)}
                className={`relative flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200 text-left ${
                  isCurrent
                    ? "bg-[#C1FF00] text-slate-950 font-extrabold shadow-lg shadow-black/30 scale-105"
                    : isCompleted
                    ? "bg-black/30 border border-[#00FFC2]/50 text-white hover:bg-black/50"
                    : "bg-black/20 text-white/50 opacity-60 cursor-not-allowed"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent
                      ? "bg-slate-950 text-[#C1FF00]"
                      : isCompleted
                      ? "bg-[#00FFC2] text-slate-950"
                      : "bg-black/40 text-white/50"
                  }`}
                >
                  {isCompleted && !isCurrent ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="text-center w-full truncate">
                  <div className="text-[11px] font-bold truncate leading-tight">
                    {step.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

};
