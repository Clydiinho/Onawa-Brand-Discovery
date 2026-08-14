import React from "react";
import { motion } from "motion/react";
import { Sparkles, Compass, Target } from "lucide-react";

interface GoldenCircleSVGProps {
  why: string;
  how: string;
  what: string;
  activeRing: "why" | "how" | "what" | null;
  onSelectRing: (ring: "why" | "how" | "what") => void;
}

export const GoldenCircleSVG: React.FC<GoldenCircleSVGProps> = ({
  why,
  how,
  what,
  activeRing,
  onSelectRing,
}) => {
  const isWhyFilled = why.trim().length > 0;
  const isHowFilled = how.trim().length > 0;
  const isWhatFilled = what.trim().length > 0;

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-graphite rounded-2xl border border-white/5 shadow-2xl overflow-hidden backdrop-blur-xl">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-cyan-500/5 to-purple-500/5 pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-widest text-amber-400">
        <Sparkles className="w-4 h-4 animate-pulse text-amber-400" />
        <span>Simon Sinek's Golden Circle (Inside-Out)</span>
      </div>

      <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full drop-shadow-2xl select-none"
        >
          <defs>
            {/* Gradients */}
            <radialGradient id="whyGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#d97706" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#78350f" stopOpacity="0.1" />
            </radialGradient>

            <linearGradient id="howGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
            </linearGradient>

            <linearGradient id="whatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6d28d9" stopOpacity="0.4" />
            </linearGradient>

            {/* Glow Filters */}
            <filter id="glowGold" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glowCyan" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Ring: WHAT */}
          <g
            className="cursor-pointer group transition-all duration-300"
            onClick={() => onSelectRing("what")}
          >
            <circle
              cx="200"
              cy="200"
              r="180"
              fill={activeRing === "what" ? "#6d28d9" : "#1e1b4b"}
              fillOpacity={isWhatFilled ? "0.35" : "0.15"}
              stroke={isWhatFilled ? "#a855f7" : "#4c1d95"}
              strokeWidth={activeRing === "what" ? "4" : "2"}
              strokeDasharray={isWhatFilled ? "none" : "6 4"}
              className="transition-all duration-500 hover:stroke-purple-400"
            />
            {/* Label WHAT */}
            <text
              x="200"
              y="50"
              textAnchor="middle"
              className="fill-purple-300 font-bold text-[14px] uppercase tracking-widest pointer-events-none select-none"
            >
              3. WHAT
            </text>
            <text
              x="200"
              y="68"
              textAnchor="middle"
              className="fill-cream/40 text-[11px] font-medium pointer-events-none select-none"
            >
              Products & Services
            </text>
          </g>

          {/* Middle Ring: HOW */}
          <g
            className="cursor-pointer group transition-all duration-300"
            onClick={() => onSelectRing("how")}
          >
            <circle
              cx="200"
              cy="200"
              r="125"
              fill={activeRing === "how" ? "#0284c7" : "#0f172a"}
              fillOpacity={isHowFilled ? "0.45" : "0.2"}
              stroke={isHowFilled ? "#06b6d4" : "#0e7490"}
              strokeWidth={activeRing === "how" ? "4" : "2"}
              strokeDasharray={isHowFilled ? "none" : "6 4"}
              className="transition-all duration-500 hover:stroke-cyan-300"
            />
            {/* Label HOW */}
            <text
              x="200"
              y="108"
              textAnchor="middle"
              className="fill-cyan-300 font-bold text-[14px] uppercase tracking-widest pointer-events-none select-none"
            >
              2. HOW
            </text>
            <text
              x="200"
              y="124"
              textAnchor="middle"
              className="fill-cream/40 text-[11px] font-medium pointer-events-none select-none"
            >
              Process & Uniqueness
            </text>
          </g>

          {/* Inner Core: WHY */}
          <g
            className="cursor-pointer group transition-all duration-300"
            onClick={() => onSelectRing("why")}
          >
            {/* Pulsing Aura if filled */}
            {isWhyFilled && (
              <circle
                cx="200"
                cy="200"
                r="70"
                fill="url(#whyGlow)"
                filter="url(#glowGold)"
                className="animate-pulse opacity-80"
              />
            )}

            <circle
              cx="200"
              cy="200"
              r="68"
              fill={activeRing === "why" ? "#d97706" : "#78350f"}
              fillOpacity={isWhyFilled ? "0.9" : "0.6"}
              stroke={isWhyFilled ? "#fbbf24" : "#b45309"}
              strokeWidth={activeRing === "why" ? "5" : "3"}
              className="transition-all duration-500 hover:stroke-amber-300"
            />

            {/* Core WHY Text */}
            <text
              x="200"
              y="194"
              textAnchor="middle"
              className="fill-amber-100 font-black text-[16px] uppercase tracking-widest pointer-events-none select-none drop-shadow-md"
            >
              1. WHY
            </text>
            <text
              x="200"
              y="212"
              textAnchor="middle"
              className="fill-amber-200 text-[11px] font-semibold pointer-events-none select-none"
            >
              Purpose & Belief
            </text>
            <text
              x="200"
              y="226"
              textAnchor="middle"
              className="fill-amber-300/80 text-[9px] font-mono uppercase tracking-wider pointer-events-none select-none"
            >
              [The Core Soul]
            </text>
          </g>
        </svg>
      </div>

      {/* Interactive Status Footer */}
      <div className="mt-4 grid grid-cols-3 gap-2 w-full text-center text-xs">
        <button
          type="button"
          onClick={() => onSelectRing("why")}
          className={`p-2 rounded-lg border transition-all ${
            isWhyFilled
              ? "bg-amber-500/20 border-amber-500/50 text-amber-300 font-medium"
              : "bg-graphite/60 border-white/10 text-cream/40 hover:border-white/15"
          } ${activeRing === "why" ? "ring-2 ring-amber-400" : ""}`}
        >
          <div className="flex items-center justify-center gap-1">
            <Target className="w-3.5 h-3.5 text-amber-400" />
            <span>Why</span>
          </div>
          <div className="text-[10px] opacity-75 mt-0.5">
            {isWhyFilled ? "✓ Defined" : "Pending"}
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelectRing("how")}
          className={`p-2 rounded-lg border transition-all ${
            isHowFilled
              ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-medium"
              : "bg-graphite/60 border-white/10 text-cream/40 hover:border-white/15"
          } ${activeRing === "how" ? "ring-2 ring-cyan-400" : ""}`}
        >
          <div className="flex items-center justify-center gap-1">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>How</span>
          </div>
          <div className="text-[10px] opacity-75 mt-0.5">
            {isHowFilled ? "✓ Defined" : "Pending"}
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelectRing("what")}
          className={`p-2 rounded-lg border transition-all ${
            isWhatFilled
              ? "bg-purple-500/20 border-purple-500/50 text-purple-300 font-medium"
              : "bg-graphite/60 border-white/10 text-cream/40 hover:border-white/15"
          } ${activeRing === "what" ? "ring-2 ring-purple-400" : ""}`}
        >
          <div className="flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>What</span>
          </div>
          <div className="text-[10px] opacity-75 mt-0.5">
            {isWhatFilled ? "✓ Defined" : "Pending"}
          </div>
        </button>
      </div>
    </div>
  );
};
