import React, { useState } from "react";
import { LoveHateKeywords } from "../types";
import { INITIAL_KEYWORD_TRAITS, KeywordTrait } from "../data/keywords";
import { ThumbsUp, ThumbsDown, Plus, X, Sparkles, Hash } from "lucide-react";

interface LoveHateMatrixProps {
  keywords: LoveHateKeywords;
  onChange: (updated: LoveHateKeywords) => void;
}

export const LoveHateMatrix: React.FC<LoveHateMatrixProps> = ({
  keywords,
  onChange,
}) => {
  const [availableTraits, setAvailableTraits] = useState<KeywordTrait[]>(
    INITIAL_KEYWORD_TRAITS
  );
  const [customWord, setCustomWord] = useState("");

  const handleToggle = (word: string, targetBucket: "love" | "hate") => {
    const isCurrentlyLove = keywords.love.includes(word);
    const isCurrentlyHate = keywords.hate.includes(word);

    let newLove = [...keywords.love];
    let newHate = [...keywords.hate];

    if (targetBucket === "love") {
      if (isCurrentlyLove) {
        newLove = newLove.filter((w) => w !== word);
      } else {
        newLove.push(word);
        newHate = newHate.filter((w) => w !== word);
      }
    } else if (targetBucket === "hate") {
      if (isCurrentlyHate) {
        newHate = newHate.filter((w) => w !== word);
      } else {
        newHate.push(word);
        newLove = newLove.filter((w) => w !== word);
      }
    }

    onChange({ love: newLove, hate: newHate });
  };

  const handleAddCustomWord = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customWord.trim();
    if (!trimmed) return;

    if (!availableTraits.some((t) => t.label.toLowerCase() === trimmed.toLowerCase())) {
      const newTrait: KeywordTrait = {
        id: `custom_${Date.now()}`,
        label: trimmed,
        category: "attitude",
      };
      setAvailableTraits([newTrait, ...availableTraits]);
    }

    // Default add to love bucket
    if (!keywords.love.includes(trimmed)) {
      onChange({
        ...keywords,
        love: [...keywords.love, trimmed],
        hate: keywords.hate.filter((w) => w !== trimmed),
      });
    }

    setCustomWord("");
  };

  const removeFromBucket = (word: string, bucket: "love" | "hate") => {
    if (bucket === "love") {
      onChange({
        ...keywords,
        love: keywords.love.filter((w) => w !== word),
      });
    } else {
      onChange({
        ...keywords,
        hate: keywords.hate.filter((w) => w !== word),
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Intro Header */}
      <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-center gap-3">
        <Hash className="w-5 h-5 text-amber-400 shrink-0" />
        <div>
          <span className="font-semibold text-amber-300">
            Fernando Ifrán's Brand Love/Hate Matrix:
          </span>{" "}
          Classify traits into what your brand fiercely embodies versus what it strictly avoids to establish unambiguous positioning boundaries.
        </div>
      </div>

      {/* Add Custom Word Input */}
      <form
        onSubmit={handleAddCustomWord}
        className="flex items-center gap-2 p-2 bg-slate-900/80 rounded-xl border border-slate-800"
      >
        <input
          type="text"
          value={customWord}
          onChange={(e) => setCustomWord(e.target.value)}
          placeholder="Add a custom trait keyword (e.g. 'Maverick', 'Anti-Corporate')..."
          className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>Add Trait</span>
        </button>
      </form>

      {/* Love vs Hate Dual Columns Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LOVE BUCKET ("That's Us") */}
        <div className="p-5 bg-emerald-950/20 rounded-2xl border border-emerald-500/30 flex flex-col gap-3 min-h-[160px]">
          <div className="flex items-center justify-between text-emerald-400 font-bold text-sm">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 fill-emerald-500/20" />
              <span>Embrace ("That's Us")</span>
            </div>
            <span className="text-xs font-mono bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
              {keywords.love.length} Selected
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {keywords.love.length === 0 ? (
              <span className="text-xs text-slate-500 italic">
                Click green 'Embrace' buttons below to add traits here...
              </span>
            ) : (
              keywords.love.map((word) => (
                <span
                  key={word}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium rounded-full shadow-sm animate-fadeIn"
                >
                  <span>{word}</span>
                  <button
                    type="button"
                    onClick={() => removeFromBucket(word, "love")}
                    className="hover:text-emerald-100 p-0.5 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* HATE BUCKET ("Definitely Not Us") */}
        <div className="p-5 bg-rose-950/20 rounded-2xl border border-rose-500/30 flex flex-col gap-3 min-h-[160px]">
          <div className="flex items-center justify-between text-rose-400 font-bold text-sm">
            <div className="flex items-center gap-2">
              <ThumbsDown className="w-4 h-4 fill-rose-500/20" />
              <span>Avoid ("Definitely Not Us")</span>
            </div>
            <span className="text-xs font-mono bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-500/30">
              {keywords.hate.length} Selected
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {keywords.hate.length === 0 ? (
              <span className="text-xs text-slate-500 italic">
                Click red 'Avoid' buttons below to add traits here...
              </span>
            ) : (
              keywords.hate.map((word) => (
                <span
                  key={word}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-medium rounded-full shadow-sm animate-fadeIn"
                >
                  <span>{word}</span>
                  <button
                    type="button"
                    onClick={() => removeFromBucket(word, "hate")}
                    className="hover:text-rose-100 p-0.5 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Traits Selector Bank */}
      <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col gap-4">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span>Select Trait Direction:</span>
          <span className="text-slate-500 font-normal text-[11px]">
            Tap green (+) to Embrace or red (-) to Avoid
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {availableTraits.map((trait) => {
            const isLove = keywords.love.includes(trait.label);
            const isHate = keywords.hate.includes(trait.label);

            return (
              <div
                key={trait.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                  isLove
                    ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                    : isHate
                    ? "bg-rose-950/40 border-rose-500/50 text-rose-200"
                    : "bg-slate-800/40 border-slate-700/60 text-slate-300 hover:border-slate-600"
                }`}
              >
                <span className="text-xs font-medium truncate">
                  {trait.label}
                </span>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggle(trait.label, "love")}
                    title="Embrace this trait"
                    className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all ${
                      isLove
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-slate-800 text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-300"
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggle(trait.label, "hate")}
                    title="Avoid this trait"
                    className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all ${
                      isHate
                        ? "bg-rose-500 text-slate-950"
                        : "bg-slate-800 text-slate-400 hover:bg-rose-500/20 hover:text-rose-300"
                    }`}
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
