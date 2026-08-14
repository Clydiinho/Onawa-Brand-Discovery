import React, { useRef, useState } from "react";
import { PositioningMatrixData } from "../types";
import { VoiceTextArea } from "./VoiceTextArea";
import {
  Skull,
  Crosshair,
  Sparkles,
  HelpCircle,
  Zap,
  Check,
  Compass,
  MapPin,
  ShieldAlert,
  Info
} from "lucide-react";

interface StrategicVillainMatrixProps {
  enemy: string;
  onEnemyChange: (value: string) => void;
  matrix: PositioningMatrixData;
  onMatrixChange: (updated: PositioningMatrixData) => void;
}

const VILLAIN_PRESETS = [
  "The Boring Status Quo & Mediocrity",
  "Over-Complicated Inefficiency & Noise",
  "Transactional & Inauthentic Cold Corporate Jargon",
  "Overpriced & Outdated Legacy Models",
  "Generic Cookie-Cutter Design & Compromise",
];

export const StrategicVillainMatrix: React.FC<StrategicVillainMatrixProps> = ({
  enemy,
  onEnemyChange,
  matrix,
  onMatrixChange,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Helper to compute quadrant title
  const getQuadrantName = (x: number, y: number): string => {
    if (x >= 0 && y >= 0) return "Blue Ocean Gap (Disruptive + Progressive)";
    if (x < 0 && y >= 0) return "Established Innovator (Corporate + Progressive)";
    if (x >= 0 && y < 0) return "Rebel Entrant (Disruptive + Traditional)";
    return "Legacy Incumbent (Corporate + Traditional)";
  };

  // Helper to handle SVG click or drag coordinates
  const handleUpdateCoordinates = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ("touches" in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Convert pixels to relative percentage (-100 to +100)
    const relX = (clientX - rect.left) / rect.width; // 0 to 1
    const relY = (clientY - rect.top) / rect.height; // 0 to 1

    // Map X: 0 -> -100 (Corporate), 1 -> +100 (Disruptive)
    const x = Math.round((relX - 0.5) * 200);
    // Map Y: 0 -> +100 (Progressive), 1 -> -100 (Traditional)
    const y = Math.round((0.5 - relY) * 200);

    const clampedX = Math.max(-100, Math.min(100, x));
    const clampedY = Math.max(-100, Math.min(100, y));

    onMatrixChange({
      x: clampedX,
      y: clampedY,
      quadrant: getQuadrantName(clampedX, clampedY),
    });
  };

  // Convert -100..100 back to SVG viewBox (0..400)
  // X: -100 -> 30, +100 -> 370
  // Y: +100 -> 30, -100 -> 370
  const svgX = 200 + (matrix.x / 100) * 160;
  const svgY = 200 - (matrix.y / 100) * 160;

  return (
    <div className="flex flex-col gap-8 animate-fadeIn">
      {/* SECTION HEADER */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-mono font-black text-cream uppercase tracking-widest">
          <Skull className="w-4 h-4 text-cream" />
          <span>Stage 04 • Strategic "Villain" & Positioning Matrix</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-headline font-bold text-cream tracking-tight">
          Define The Enemy & Map Your Blue Ocean
        </h1>
        <p className="text-xs md:text-sm text-cream/80 leading-relaxed font-medium">
          Every iconic brand fights for something by fighting against something. Pinpoint the strategic villain your brand rescues clients from, then drop your positioning anchor.
        </p>
      </div>

      {/* CLYDE PERSPECTIVE TOOLTIP CALLOUT */}
      <div className="p-4 bg-graphite rounded-2xl border border-brass/30 shadow-xl flex items-start gap-3 relative group">
        <div className="p-2.5 bg-brass/10 border border-brass/30 rounded-xl text-brass shrink-0">
          <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-brass uppercase tracking-wider">
              Clyde’s Perspective:
            </span>
            <div className="relative inline-block">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip(!showTooltip)}
                className="text-cream/60 hover:text-cream"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
              {showTooltip && (
                <div className="absolute left-0 bottom-full mb-2 w-64 p-2.5 bg-surface border border-brass rounded-xl text-[11px] text-cream/80 z-50 shadow-2xl">
                  Defining a clear strategic villain sharpens visual direction, marketing copy, and sales objections.
                </div>
              )}
            </div>
          </div>
          <p className="text-xs sm:text-sm text-cream font-semibold italic leading-relaxed">
            "To be a hero to your customers, you must first define the villain you are rescuing them from."
          </p>
        </div>
      </div>

      {/* MODULE 1.1: DEFINE YOUR STRATEGIC ENEMY */}
      <div className="p-6 bg-graphite rounded-2xl border border-white/20 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold text-cream uppercase tracking-wider flex items-center gap-2">
            <Crosshair className="w-4 h-4" />
            <span>Define Your Strategic Enemy <span className="text-[#FF002B]">*</span></span>
          </label>
          <span className="text-[10px] font-mono text-cream/60">The Problem You Defeat</span>
        </div>

        {/* Preset Chips */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold text-cream/70">Quick Strategic Villain Archetypes:</span>
          <div className="flex flex-wrap gap-2">
            {VILLAIN_PRESETS.map((preset) => {
              const isSelected = enemy.includes(preset);
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      onEnemyChange("");
                    } else {
                      onEnemyChange(preset);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? "bg-cream text-carbon-black border-cream font-black shadow-md shadow-cream/20"
                      : "bg-surface text-cream/80 border-white/10 hover:border-cream/30 hover:text-cream"
                  }`}
                >
                  {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Zap className="w-3.5 h-3.5 text-cream" />}
                  <span>{preset}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Text Input */}
        <VoiceTextArea
          rows={3}
          value={enemy}
          onValueChange={(val) => onEnemyChange(val)}
          placeholder="e.g. The status quo of bloated legacy agencies charging $50k for slow, generic templates..."
        />
      </div>

      {/* MODULE 1.2: FUTURISTIC 2X2 POSITIONING MATRIX */}
      <div className="p-6 bg-graphite rounded-2xl border border-white/20 shadow-xl flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-base font-headline font-bold text-cream flex items-center gap-2">
              <Compass className="w-5 h-5 text-brass" />
              <span>Blue Ocean Positioning Matrix</span>
            </h2>
            <p className="text-xs text-cream/70 mt-0.5">
              Click or drag on the matrix grid to drop your brand's market marker.
            </p>
          </div>

          <div className="px-3.5 py-1.5 bg-surface/60 border border-[#F5F0E8]/40 rounded-xl text-xs font-mono flex items-center gap-2">
            <span className="text-cream/60">Position:</span>
            <span className="font-bold text-brass">
              X: {matrix.x > 0 ? `+${matrix.x}% Disruptive` : `${matrix.x}% Corporate`} | Y: {matrix.y > 0 ? `+${matrix.y}% Progressive` : `${matrix.y}% Traditional`}
            </span>
          </div>
        </div>

        {/* Interactive Matrix SVG Canvas Container */}
        <div className="relative w-full aspect-square max-w-xl mx-auto bg-graphite rounded-2xl border-2 border-white/5 p-2 overflow-hidden shadow-2xl select-none">
          {/* Axis Labels Overlay */}
          {/* Top Label: PROGRESSIVE */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-3 py-1 bg-surface border border-[#F5F0E8]/50 text-brass font-mono font-black text-[10px] tracking-widest uppercase rounded-full shadow-lg">
            ▲ PROGRESSIVE (NEXT-GEN)
          </div>

          {/* Bottom Label: TRADITIONAL */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-3 py-1 bg-surface border border-white/10 text-cream/60 font-mono font-bold text-[10px] tracking-widest uppercase rounded-full">
            ▼ TRADITIONAL (LEGACY)
          </div>

          {/* Left Label: CORPORATE */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none px-2 py-1 bg-surface border border-white/10 text-cream/60 font-mono font-bold text-[10px] tracking-widest uppercase rounded-full -rotate-90 origin-center">
            ◀ CORPORATE
          </div>

          {/* Right Label: DISRUPTIVE */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none px-2 py-1 bg-surface border border-[#D4A574]/60 text-cream font-mono font-black text-[10px] tracking-widest uppercase rounded-full rotate-90 origin-center shadow-lg">
            DISRUPTIVE ▶
          </div>

          {/* Quadrant Watermark Titles */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none p-8 text-[11px] font-mono font-extrabold uppercase">
            {/* Top-Left: Established Innovator */}
            <div className="p-4 text-cream/30 flex flex-col justify-start items-start">
              <span>ESTABLISHED</span>
              <span>INNOVATOR</span>
            </div>

            {/* Top-Right: Blue Ocean Target Zone */}
            <div className="p-4 text-cream/80 bg-[#D4A574]/5 border-2 border-dashed border-[#D4A574]/30 rounded-xl flex flex-col justify-start items-end text-right animate-pulse">
              <span className="bg-[#D4A574] text-carbon-black px-2 py-0.5 rounded font-black text-[9px] mb-1">
                ★ TARGET ZONE
              </span>
              <span>BLUE OCEAN GAP</span>
              <span className="text-[9px] text-brass">High Margin Opportunity</span>
            </div>

            {/* Bottom-Left: Legacy Incumbent */}
            <div className="p-4 text-cream/30 flex flex-col justify-end items-start">
              <span>LEGACY</span>
              <span>INCUMBENT</span>
            </div>

            {/* Bottom-Right: Rebel Entrant */}
            <div className="p-4 text-cream/30 flex flex-col justify-end items-end text-right">
              <span>REBEL ENTRANT</span>
            </div>
          </div>

          {/* Interactive SVG Grid */}
          <svg
            ref={svgRef}
            viewBox="0 0 400 400"
            className="w-full h-full cursor-crosshair touch-none relative z-10"
            onMouseDown={(e) => {
              setIsDragging(true);
              handleUpdateCoordinates(e);
            }}
            onMouseMove={(e) => {
              if (isDragging) handleUpdateCoordinates(e);
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchStart={(e) => {
              setIsDragging(true);
              handleUpdateCoordinates(e);
            }}
            onTouchMove={(e) => {
              if (isDragging) handleUpdateCoordinates(e);
            }}
            onTouchEnd={() => setIsDragging(false)}
          >
            {/* Grid Pattern Lines */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
              </pattern>

              {/* Glowing Filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Grid */}
            <rect width="400" height="400" fill="url(#grid)" />

            {/* Center Axes Lines */}
            <line x1="200" y1="20" x2="200" y2="380" stroke="#F5F0E8" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
            <line x1="20" y1="200" x2="380" y2="200" stroke="#F5F0E8" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />

            {/* Center Origin Dot */}
            <circle cx="200" cy="200" r="4" fill="#F5F0E8" opacity="0.8" />

            {/* User Target Pin Marker */}
            <g transform={`translate(${svgX}, ${svgY})`} filter="url(#glow)">
              {/* Pulsing Outer Rings */}
              <circle r="22" fill="none" stroke="#D4A574" strokeWidth="1.5" opacity="0.4" className="animate-ping" />
              <circle r="14" fill="rgba(212, 165, 116, 0.25)" stroke="#D4A574" strokeWidth="2" />

              {/* Center Icon Graphic */}
              <circle r="8" fill="#D4A574" />
              <circle r="3" fill="#020617" />
            </g>
          </svg>
        </div>

        {/* Selected Quadrant Summary Badge */}
        <div className="p-4 bg-surface/60 rounded-xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cream" />
            <span className="text-cream/70 font-bold">Identified Market Position:</span>
            <span className="font-black text-cream font-mono">{matrix.quadrant}</span>
          </div>

          <div className="text-[11px] text-cream/60 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-brass" />
            <span>Click matrix above to recalibrate target space</span>
          </div>
        </div>

        {/* Footer Mandatory Sign-off */}
        <div className="pt-2 border-t border-white/5 text-center">
          <p className="text-[11px] font-mono font-bold text-cream/60 uppercase tracking-widest">
            Proprietary Strategic Framework by Clyde Strydom for Onawa Studio.
          </p>
        </div>
      </div>
    </div>
  );
};
