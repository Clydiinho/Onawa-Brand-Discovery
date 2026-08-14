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
          className="absolute top-6 right-6 z-20 px-4 py-2 bg-carbon-dark hover:bg-carbon-charcoal border border-white/15 hover:border-cream/20 text-cream font-mono text-xs font-bold uppercase tracking-widest rounded-xl flex items-center gap-2 transition-all"
        >
          <LogIn className="w-3.5 h-3.5 text-cream" />
          <span className="text-cream">Client Login</span>
        </button>
      )}

      {/* Designer Cutting Mat Grid Backdrop Overlay */}
      <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-25 overflow-hidden">
        <div className="absolute top-3 left-4 font-mono text-[10px] text-cream tracking-widest uppercase">
          + GRID_CUTTING_MAT // X: 042 Y: 891 // SCALE: 1:1
        </div>
        <div className="absolute top-3 right-4 font-mono text-[10px] text-cream tracking-widest uppercase">
          [MODE: CYBER_STUDIO_STRATEGY]
        </div>
        <div className="absolute bottom-3 left-4 font-mono text-[10px] text-cream/30">
          010 — 020 — 030 — 040 — 050 — 060 — 070 — 080 — 090 — 100 CM
        </div>
        <div className="absolute bottom-3 right-4 font-mono text-[10px] text-[#FF002B]">
          ● SYSTEM READY
        </div>
      </div>

      {/* Main Hero Container - flat, elevated */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-4xl w-full p-8 md:p-14 relative z-10"
      >
        {/* Top Floating Badges - flat, no glass */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-charcoal border border-white/10 rounded-lg">
            <span className="text-xs font-bold font-mono text-cream tracking-widest uppercase">
              ONAWA STUDIO
            </span>
            <span className="text-[10px] font-bold text-cream/70">| Discovery Portal</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-1.5 bg-charcoal/50 border border-white/10 rounded-lg">
            <Terminal className="w-4 h-4 text-cream" />
            <span className="text-xs font-mono font-bold text-cream tracking-widest uppercase">
              An Onawa Studio Original Tool
            </span>
          </div>
        </div>

        {/* Hero Headlines */}
        <div className="flex flex-col gap-3 max-w-3xl text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold text-cream tracking-tight leading-[1.05] text-balance">
            Welcome to{" "}
            <span className="text-cream/70 font-medium">Onawa Studio's Discovery Experience.</span>
          </h1>

          <p className="text-xl sm:text-2xl font-light text-cream leading-snug text-balance">
            A bespoke brand architecture portal engineered exclusively for Onawa Studio clients.
          </p>

          <p className="text-sm sm:text-base text-cream/60 leading-[1.9] tracking-wide max-w-2xl mx-auto font-normal">
            We utilize Simon Sinek's Golden Circle framework,{" "}
            <span className="text-cream font-medium underline decoration-brass/60 decoration-2 underline-offset-4">
              mixed with Clyde Strydom's 17+ years of elite experience in visual strategy
            </span>
            , to find the core of your business.
          </p>
        </div>

        {/* Clyde's Strategist Note Banner - flat, no glass */}
        <div className="w-full p-5 bg-charcoal/30 rounded-xl border border-white/8 flex items-start gap-3.5">
          <div className="p-2 bg-cream/10 border border-cream/15 rounded-lg text-cream shrink-0 mt-0.5">
            <Compass className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono font-bold text-cream uppercase tracking-wider">
              Strategist's Perspective — Clyde Strydom
            </span>
            <p className="text-xs sm:text-sm text-cream/80 italic leading-relaxed">
              "To build a great brand, we must start with your 'Why' before we touch a single pixel. Branding is not a game of pretty visuals; it is a game of strategy. Prepare to build your true Brand DNA."
            </p>
          </div>
        </div>

        {/* Feature DNA Cards Teaser */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full my-6">
          <div className="card p-3 flex flex-col items-center gap-1.5">
            <Target className="w-5 h-5 text-cream" />
            <span className="text-xs font-bold text-cream">Golden Circle</span>
            <span className="text-[10px] text-cream/50">Why • How • What</span>
          </div>

          <div className="card p-3 flex flex-col items-center gap-1.5">
            <Wand2 className="w-5 h-5 text-cream" />
            <span className="text-xs font-bold text-cream">12 Archetypes</span>
            <span className="text-[10px] text-cream/50">3x4 Grid</span>
          </div>

          <div className="card p-3 flex flex-col items-center gap-1.5">
            <Heart className="w-5 h-5 text-[#FF002B]" />
            <span className="text-xs font-bold text-cream">Love/Hate Cloud</span>
            <span className="text-[10px] text-cream/50">Embrace vs Avoid</span>
          </div>

          <div className="card p-3 flex flex-col items-center gap-1.5">
            <Layers className="w-5 h-5 text-[#2B00FF]" />
            <span className="text-xs font-bold text-cream">Logo Architecture</span>
            <span className="text-[10px] text-cream/50">Mark • Type • Combo</span>
          </div>
        </div>

        {/* Large Carbon-Pulsing Action Button - flat, no glass, no neon */}
        <div className="pt-4 w-full flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={onInitialize}
            className="relative group px-10 py-5 bg-cream/8 hover:bg-cream/10 text-carbon font-black text-base uppercase tracking-widest rounded-xl flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-carbon" />
            <span>INITIALIZE DISCOVERY</span>
            <ArrowRight className="w-5 h-5 text-carbon group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-xs font-mono text-cream/50 mt-2">
            © 2026 Onawa Studio | Strategy by Clyde Strydom
          </p>
        </div>
      </motion.div>
    </div>
  );
};