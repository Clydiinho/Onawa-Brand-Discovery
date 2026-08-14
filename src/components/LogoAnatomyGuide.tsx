import React from "react";
import { LogoTypeOption } from "../types";
import { Check, Layers, Image, Type, Shield, Sparkles } from "lucide-react";

interface LogoAnatomyGuideProps {
  selectedType: "" | "logomark" | "logotype" | "combination" | "emblem";
  onSelect: (type: "logomark" | "logotype" | "combination" | "emblem") => void;
}

const LOGO_OPTIONS: LogoTypeOption[] = [
  {
    id: "logomark",
    title: "Logomark (Symbol / Icon)",
    subtitle: "Pure visual emblem without text",
    description: "A stylized geometric or pictorial mark that embodies the brand abstractly or literally.",
    bestFor: "Established brands with global reach or apps needing a strong app icon.",
    examples: "Apple, Nike Swoosh, Target Bullseye, Twitter",
  },
  {
    id: "logotype",
    title: "Logotype (Wordmark / Typographic)",
    subtitle: "Custom typographic representation of the brand name",
    description: "Custom lettering or bespoke typography focused entirely on the brand's phonetic name.",
    bestFor: "New brands with unique, catchy, or short names looking for name recognition.",
    examples: "Google, Coca-Cola, Sony, Supreme, FedEx",
  },
  {
    id: "combination",
    title: "Combination Mark (Symbol + Wordmark)",
    subtitle: "Integrated icon and custom wordmark",
    description: "Pairs a distinct icon/mark alongside or above custom typography for ultimate versatility.",
    bestFor: "90% of modern brands — offers full flexibility across web, print, and mobile.",
    examples: "Adidas, Lacoste, Burger King, Airbnb",
  },
  {
    id: "emblem",
    title: "Emblem (Badge / Crest / Seal)",
    subtitle: "Text enclosed inside a crest or badge design",
    description: "Integrates text and iconography tightly inside a boundary or seal.",
    bestFor: "Heritage brands, sports clubs, universities, automotive, and artisanal goods.",
    examples: "Starbucks, Porsche, Harvard, BMW, Harley-Davidson",
  },
];

export const LogoAnatomyGuide: React.FC<LogoAnatomyGuideProps> = ({
  selectedType,
  onSelect,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Intro info box */}
      <div className="p-4 bg-graphite/80 rounded-xl border border-white/5 text-xs text-cream/60 flex items-center gap-3">
        <Layers className="w-5 h-5 text-amber-400 shrink-0" />
        <div>
          <span className="font-semibold text-amber-300">Logo Anatomy & Mark Strategy:</span>{" "}
          Selecting your structural mark style dictates visual hierarchy, icon scalability, and multi-channel versatility across digital platforms.
        </div>
      </div>

      {/* Grid of 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LOGO_OPTIONS.map((option) => {
          const isSelected = selectedType === option.id;

          return (
            <div
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4 relative overflow-hidden ${
                isSelected
                  ? "bg-graphite/90 border-amber-500 ring-2 ring-amber-500/50 shadow-xl shadow-amber-500/10"
                  : "bg-graphite/80 border-white/5 hover:border-white/15 hover:bg-graphite"
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Selected</span>
                </div>
              )}

              {/* Top SVG Visual Diagram */}
              <div className="w-full h-32 rounded-xl bg-graphite/80 border border-white/5 flex items-center justify-center p-4">
                {option.id === "logomark" && (
                  <svg viewBox="0 0 100 100" className="w-20 h-20 text-amber-400">
                    <polygon
                      points="50,15 90,85 10,85"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinejoin="round"
                    />
                    <circle cx="50" cy="55" r="12" fill="currentColor" />
                  </svg>
                )}

                {option.id === "logotype" && (
                  <div className="font-serif italic font-black text-2xl tracking-wider text-cyan-400 border-b-2 border-cyan-400 pb-1">
                    VERITAS
                  </div>
                )}

                {option.id === "combination" && (
                  <div className="flex items-center gap-3">
                    <svg viewBox="0 0 100 100" className="w-12 h-12 text-purple-400">
                      <rect x="20" y="20" width="60" height="60" rx="12" fill="none" stroke="currentColor" strokeWidth="8" />
                      <circle cx="50" cy="50" r="14" fill="currentColor" />
                    </svg>
                    <div className="flex flex-col">
                      <span className="font-sans font-black tracking-widest text-lg text-cream uppercase">
                        AURA
                      </span>
                      <span className="text-[9px] font-mono tracking-widest text-purple-400 uppercase">
                        STUDIOS
                      </span>
                    </div>
                  </div>
                )}

                {option.id === "emblem" && (
                  <div className="relative flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-20 h-20 text-emerald-400">
                      <path
                        d="M50,10 L85,25 L85,60 C85,80 50,95 50,95 C50,95 15,80 15,60 L15,25 Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="5"
                      />
                    </svg>
                    <span className="absolute text-[10px] font-bold text-emerald-300 uppercase tracking-widest text-center px-1">
                      EST. 2026
                    </span>
                  </div>
                )}
              </div>

              {/* Title & Description */}
              <div className="flex flex-col gap-1.5">
                <h3 className="font-bold text-cream text-sm flex items-center gap-2">
                  <span>{option.title}</span>
                </h3>
                <p className="text-xs text-cream/60 font-medium">
                  {option.subtitle}
                </p>
                <p className="text-[11px] text-cream/40 leading-relaxed mt-1">
                  {option.description}
                </p>
              </div>

              {/* Best for & Examples */}
              <div className="pt-3 border-t border-white/5 flex flex-col gap-1.5 text-[11px]">
                <div>
                  <span className="text-amber-400 font-semibold">Best For: </span>
                  <span className="text-cream/60">{option.bestFor}</span>
                </div>
                <div>
                  <span className="text-cream/40 font-medium">Examples: </span>
                  <span className="text-cream/40 italic">{option.examples}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
