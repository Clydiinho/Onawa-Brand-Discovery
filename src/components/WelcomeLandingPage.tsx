import React from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, Compass, ShieldAlert, Heart, Layers, Target, Wand2, Terminal, LogIn } from "lucide-react";

interface WelcomeLandingPageProps {
  onInitialize: () => void;
  onOpenAuthModal?: () => void;
  isAuthenticated?: boolean;
}

export const WelcomeLandingPage: React.FC<WelcomeLandingPageProps> = ({
  onInitialize,
  onOpenAuthModal,
  isAuthenticated = false,
}) => {

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center py-10 px-4 text-center">
      {/* Client Login Link - Top Right Corner */}
      {onOpenAuthModal && !isAuthenticated && (
        <button
          type="button"
          onClick={onOpenAuthModal}
          className="absolute top-6 right-6 z-20 px-4 py-2 bg-slate-950/80 hover:bg-slate-900 border border-white/20 hover:border-[#00FFC2] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-lg backdrop-blur-sm"
        >
          <LogIn className="w-3.5 h-3.5 text-[#00FFC2]" />
          <span className="text-[#00FFC2]">Client Login</span>
        </button>
      )}
      {/* Designer Cutting Mat Grid Backdrop Overlay */}
      <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-40 overflow-hidden border border-white/20">
        <div className="absolute top-3 left-4 font-mono text-[10px] text-[#C1FF00] tracking-widest uppercase">
          + GRID_CUTTING_MAT // X: 042 Y: 891 // SCALE: 1:1
        </div>
        <div className="absolute top-3 right-4 font-mono text-[10px] text-[#00FFC2] tracking-widest uppercase">
          [MODE: CYBER_STUDIO_STRATEGY]
        </div>
        <div className="absolute bottom-3 left-4 font-mono text-[10px] text-slate-300">
          010 — 020 — 030 — 040 — 050 — 060 — 070 — 080 — 090 — 100 CM
        </div>
        <div className="absolute bottom-3 right-4 font-mono text-[10px] text-[#FF002B]">
          ● SYSTEM READY
        </div>
      </div>

      {/* Main Glassmorphic Hero Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="neon-conic-card-active max-w-4xl w-full p-8 md:p-14 flex flex-col items-center gap-8 relative z-10"
      >
        {/* Top Floating Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-950/90 border-2 border-[#C1FF00] rounded-2xl shadow-xl shadow-[#C1FF00]/20">
            <span className="text-xs font-black font-mono text-[#C1FF00] tracking-widest uppercase">
              ONAWA STUDIO
            </span>
            <span className="text-[10px] font-bold text-slate-400">| Discovery Portal</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#2B00FF]/40 border border-[#00FFC2] rounded-full shadow-lg shadow-[#2B00FF]/30">
            <Terminal className="w-4 h-4 text-[#00FFC2]" />
            <span className="text-xs font-mono font-black text-[#C1FF00] tracking-widest uppercase">
              An Onawa Studio Original Tool
            </span>
          </div>
        </div>

        {/* Hero Headlines */}
        <div className="flex flex-col gap-4 max-w-3xl text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none drop-shadow-md">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C1FF00] via-[#00FFC2] to-[#2B00FF]">Onawa Studio's Discovery Experience.</span>
          </h1>

          <p className="text-base sm:text-lg font-bold text-[#C1FF00] leading-snug">
            A bespoke brand architecture portal engineered exclusively for Onawa Studio clients.
          </p>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl mx-auto font-medium">
            We utilize Simon Sinek's Golden Circle framework,{" "}
            <span className="text-[#C1FF00] font-bold underline decoration-[#C1FF00]/50 decoration-2 underline-offset-4 drop-shadow-[0_0_8px_rgba(193,255,0,0.6)]">
              mixed with Clyde Strydom’s 17+ years of elite experience in visual strategy
            </span>
            , to find the core of your business.
          </p>
        </div>

        {/* Clyde's Strategist Note Banner */}
        <div className="w-full p-4 md:p-5 bg-slate-950/90 rounded-2xl border border-[#00FFC2]/40 text-left flex items-start gap-3.5 shadow-lg">
          <div className="p-2 bg-[#00FFC2]/10 border border-[#00FFC2]/30 rounded-xl text-[#00FFC2] shrink-0 mt-0.5">
            <Compass className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono font-bold text-[#00FFC2] uppercase tracking-wider">
              Strategist's Perspective — Clyde Strydom
            </span>
            <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
              "To build a great brand, we must start with your 'Why' before we touch a single pixel. Branding is not a game of pretty visuals; it is a game of strategy. Prepare to build your true Brand DNA."
            </p>
          </div>
        </div>

        {/* Feature DNA Cards Teaser */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full my-2">
          <div className="p-3 bg-slate-950/70 rounded-xl border border-white/10 flex flex-col items-center gap-1.5">
            <Target className="w-5 h-5 text-[#C1FF00]" />
            <span className="text-xs font-black text-white">Golden Circle</span>
            <span className="text-[10px] text-slate-300">Why • How • What</span>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-white/10 flex flex-col items-center gap-1.5">
            <Wand2 className="w-5 h-5 text-[#00FFC2]" />
            <span className="text-xs font-black text-white">12 Archetypes</span>
            <span className="text-[10px] text-slate-300">3x4 Glass Matrix</span>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-white/10 flex flex-col items-center gap-1.5">
            <Heart className="w-5 h-5 text-[#FF002B]" />
            <span className="text-xs font-black text-white">Love/Hate Cloud</span>
            <span className="text-[10px] text-slate-300">Embrace vs Avoid</span>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-white/10 flex flex-col items-center gap-1.5">
            <Layers className="w-5 h-5 text-[#2B00FF]" />
            <span className="text-xs font-black text-white">Logo Architecture</span>
            <span className="text-[10px] text-slate-300">Mark • Type • Combo</span>
          </div>
        </div>

        {/* Large Neon-Pulsing Action Button */}
        <div className="pt-4 w-full flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={onInitialize}
            className="neon-btn-pulse relative group px-10 py-5 bg-[#C1FF00] hover:bg-[#a8df00] text-slate-950 font-black text-base uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 shadow-2xl transition-all cursor-pointer transform active:scale-95"
          >
            <Sparkles className="w-5 h-5 text-slate-950" />
            <span>INITIALIZE DISCOVERY</span>
            <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-xs font-mono text-slate-400 mt-2">
            © 2026 Onawa Studio | Strategy by Clyde Strydom
          </p>
        </div>
      </motion.div>
    </div>
  );
};
