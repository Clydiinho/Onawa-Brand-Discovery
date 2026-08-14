import React from "react";
import { UVPData, GoldenCircleData, BrandHeartData } from "../types";
import { Sparkles, Copy, Check, Target, Lightbulb } from "lucide-react";

interface UVPBuilderProps {
  uvp: UVPData;
  goldenCircle: GoldenCircleData;
  brandHeart: BrandHeartData;
  onChange: (updated: UVPData) => void;
}

export const UVPBuilder: React.FC<UVPBuilderProps> = ({
  uvp,
  goldenCircle,
  brandHeart,
  onChange,
}) => {
  const [copied, setCopied] = React.useState(false);

  const fullStatement = `Our ${uvp.offering || "[offering]"} is the only ${
    uvp.category || "[category]"
  } that ${uvp.benefit || "[primary benefit]"} for ${
    uvp.targetAudience || "[target audience]"
  }.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullStatement);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Suggestion helpers
  const applySuggestion = (field: keyof UVPData, val: string) => {
    onChange({
      ...uvp,
      [field]: val,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Dynamic UVP Fill-in-the-Blanks Form */}
      <div className="p-6 bg-graphite rounded-2xl border border-white/5 shadow-xl flex flex-col gap-5">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Interactive UVP Architecture</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Offering */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-cream/60 flex items-center justify-between">
              <span>1. Offering / Solution Name:</span>
              <span className="text-[10px] text-cream/40">e.g., "AI CRM platform"</span>
            </label>
            <input
              type="text"
              value={uvp.offering}
              onChange={(e) => onChange({ ...uvp, offering: e.target.value })}
              placeholder="e.g. cloud-native design suite..."
              className="w-full px-3.5 py-2.5 bg-graphite border border-white/5 rounded-xl text-sm text-cream/80 focus:outline-none focus:border-amber-500/80 transition-all"
            />
          </div>

          {/* 2. Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-cream/60 flex items-center justify-between">
              <span>2. Market Category:</span>
              <span className="text-[10px] text-cream/40">e.g., "sales automation tool"</span>
            </label>
            <input
              type="text"
              value={uvp.category}
              onChange={(e) => onChange({ ...uvp, category: e.target.value })}
              placeholder="e.g. enterprise analytics solution..."
              className="w-full px-3.5 py-2.5 bg-graphite border border-white/5 rounded-xl text-sm text-cream/80 focus:outline-none focus:border-amber-500/80 transition-all"
            />
          </div>

          {/* 3. Primary Benefit */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-cream/60 flex items-center justify-between">
              <span>3. Key Differentiating Benefit:</span>
              <span className="text-[10px] text-cream/40">e.g., "eliminates 80% of manual reporting"</span>
            </label>
            <input
              type="text"
              value={uvp.benefit}
              onChange={(e) => onChange({ ...uvp, benefit: e.target.value })}
              placeholder="e.g. guarantees instant response times without code..."
              className="w-full px-3.5 py-2.5 bg-graphite border border-white/5 rounded-xl text-sm text-cream/80 focus:outline-none focus:border-amber-500/80 transition-all"
            />
            {/* Auto-suggestion chip from Golden Circle HOW */}
            {goldenCircle.how && (
              <div className="flex items-center gap-2 mt-1 text-[11px]">
                <span className="text-cream/40">From Golden Circle 'How':</span>
                <button
                  type="button"
                  onClick={() => applySuggestion("benefit", goldenCircle.how)}
                  className="px-2 py-0.5 bg-cyan-500/10 text-cyan-300 rounded border border-cyan-500/30 hover:bg-cyan-500/20 truncate max-w-md text-[10px]"
                >
                  Use: "{goldenCircle.how}"
                </button>
              </div>
            )}
          </div>

          {/* 4. Target Audience */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-cream/60 flex items-center justify-between">
              <span>4. Target Audience / Ideal Customer:</span>
              <span className="text-[10px] text-cream/40">e.g., "growth-stage B2B marketing leaders"</span>
            </label>
            <input
              type="text"
              value={uvp.targetAudience}
              onChange={(e) => onChange({ ...uvp, targetAudience: e.target.value })}
              placeholder="e.g. high-growth tech founders & creative directors..."
              className="w-full px-3.5 py-2.5 bg-graphite border border-white/5 rounded-xl text-sm text-cream/80 focus:outline-none focus:border-amber-500/80 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Live UVP Output Card */}
      <div className="p-6 bg-gradient-to-br from-amber-500/10 via-slate-900 to-purple-500/10 rounded-2xl border border-amber-500/30 shadow-2xl flex flex-col gap-4 relative">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Generated UVP Statement</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 hover:bg-amber-400 transition-all shadow-md"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy UVP</span>
              </>
            )}
          </button>
        </div>

        <blockquote className="text-lg md:text-xl font-serif italic text-cream font-semibold leading-relaxed border-l-4 border-amber-400 pl-4 py-1">
          "{fullStatement}"
        </blockquote>
      </div>
    </div>
  );
};
