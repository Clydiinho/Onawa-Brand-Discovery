import React from "react";
import { PersonalitySpectrumData } from "../types";
import { Sliders, RefreshCw, Sparkles } from "lucide-react";

interface PersonalitySliderProps {
  personality: PersonalitySpectrumData;
  onChange: (updated: PersonalitySpectrumData) => void;
}

interface TraitConfig {
  key: keyof PersonalitySpectrumData;
  leftLabel: string;
  rightLabel: string;
  leftDesc: string;
  rightDesc: string;
  color: string;
}

const TRAITS: TraitConfig[] = [
  {
    key: "traditionalVsProgressive",
    leftLabel: "Heritage & Traditional",
    rightLabel: "Progressive & Future-Bound",
    leftDesc: "Grounded in history, proven methods, timeless custom",
    rightDesc: "Embracing cutting-edge tech, novel paradigms, forward evolution",
    color: "from-amber-500 to-cyan-500",
  },
  {
    key: "corporateVsDisruptive",
    leftLabel: "Structured & Corporate",
    rightLabel: "Maverick & Disruptive",
    leftDesc: "Institutional authority, process-driven, risk-managed",
    rightDesc: "Rule-breaker, challenger brand, bold industry shakeup",
    color: "from-blue-500 to-pink-500",
  },
  {
    key: "reservedVsBold",
    leftLabel: "Quiet & Understated",
    rightLabel: "Bold & High-Expressive",
    leftDesc: "Subtle elegance, minimal noise, quiet confidence",
    rightDesc: "High energy, vivid visual impact, loud presence",
    color: "from-emerald-500 to-amber-500",
  },
  {
    key: "exclusiveVsAccessible",
    leftLabel: "Exclusive & Luxury",
    rightLabel: "Accessible & Democratic",
    leftDesc: "Bespoke, high-bar, elite, curated scarcity",
    rightDesc: "Open for everyone, affordable, highly welcoming",
    color: "from-purple-500 to-teal-500",
  },
  {
    key: "playfulVsSerious",
    leftLabel: "Playful & Witty",
    rightLabel: "Serious & Authoritative",
    leftDesc: "Humor, lightheartedness, relatable banter",
    rightDesc: "Solemn expertise, unshakeable gravity, crisp precision",
    color: "from-orange-500 to-indigo-500",
  },
];

export const PersonalitySlider: React.FC<PersonalitySliderProps> = ({
  personality,
  onChange,
}) => {
  const handleSliderChange = (key: keyof PersonalitySpectrumData, val: number) => {
    onChange({
      ...personality,
      [key]: val,
    });
  };

  const applyPreset = (presetName: string) => {
    if (presetName === "disruptive_tech") {
      onChange({
        traditionalVsProgressive: 90,
        corporateVsDisruptive: 85,
        reservedVsBold: 80,
        exclusiveVsAccessible: 75,
        playfulVsSerious: 35,
      });
    } else if (presetName === "heritage_luxury") {
      onChange({
        traditionalVsProgressive: 20,
        corporateVsDisruptive: 25,
        reservedVsBold: 30,
        exclusiveVsAccessible: 15,
        playfulVsSerious: 85,
      });
    } else if (presetName === "approachable_eco") {
      onChange({
        traditionalVsProgressive: 75,
        corporateVsDisruptive: 60,
        reservedVsBold: 45,
        exclusiveVsAccessible: 85,
        playfulVsSerious: 30,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Quick Presets Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-graphite/80 rounded-xl border border-white/5">
        <div className="flex items-center gap-2 text-xs text-cream/60 font-semibold">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Quick Preset Dial:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => applyPreset("disruptive_tech")}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-graphite text-cyan-300 hover:bg-surface border border-cyan-500/30 transition-all"
          >
            🚀 Disruptive Tech
          </button>
          <button
            type="button"
            onClick={() => applyPreset("heritage_luxury")}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-graphite text-amber-300 hover:bg-surface border border-amber-500/30 transition-all"
          >
            👑 Heritage Luxury
          </button>
          <button
            type="button"
            onClick={() => applyPreset("approachable_eco")}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-graphite text-emerald-300 hover:bg-surface border border-emerald-500/30 transition-all"
          >
            🌱 Approachable & Eco
          </button>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 gap-6">
        {TRAITS.map((item) => {
          const val = personality[item.key] ?? 50;
          return (
            <div
              key={item.key}
              className="p-5 bg-graphite rounded-2xl border border-white/5/90 shadow-lg flex flex-col gap-3 backdrop-blur-md"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-cream/80 uppercase tracking-wider">
                  {item.leftLabel}
                </span>
                <span className="font-mono text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  {val}%
                </span>
                <span className="font-bold text-cream/80 uppercase tracking-wider text-right">
                  {item.rightLabel}
                </span>
              </div>

              {/* Slider track */}
              <div className="relative flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={val}
                  onChange={(e) =>
                    handleSliderChange(item.key, parseInt(e.target.value, 10))
                  }
                  className="w-full h-3 bg-graphite rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              {/* Dynamic Verbal Descriptor */}
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className={`transition-all ${val <= 40 ? "text-amber-300 font-semibold" : ""}`}>
                  {item.leftDesc}
                </span>
                <span className={`transition-all text-right ${val >= 60 ? "text-amber-300 font-semibold" : ""}`}>
                  {item.rightDesc}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
