import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BrandQuestionnaireState,
  AIAnalysisResult,
  ProjectType,
  ClientUserProfile,
  PortalView,
  NavigationState,
} from "./types";
import { BRAND_ARCHETYPES } from "./data/archetypes";
import { StepProgressBar, QUESTIONNAIRE_STEPS } from "./components/StepProgressBar";
import { WelcomeLandingPage } from "./components/WelcomeLandingPage";
import { VoiceTextArea } from "./components/VoiceTextArea";
import { GoldenCircleSVG } from "./components/GoldenCircleSVG";
import { PersonalitySlider } from "./components/PersonalitySlider";
import { LoveHateMatrix } from "./components/LoveHateMatrix";
import { StrategicVillainMatrix } from "./components/StrategicVillainMatrix";
import { ExperienceRoadmap } from "./components/ExperienceRoadmap";
import { InteractiveMoodBoard } from "./components/InteractiveMoodBoard";
import { ClientProfileModal } from "./components/ClientProfileModal";
import { LogoAnatomyGuide } from "./components/LogoAnatomyGuide";
import { UVPBuilder } from "./components/UVPBuilder";
import { BrandSummaryReport } from "./components/BrandSummaryReport";
import { SuccessStateHub } from "./components/SuccessStateHub";
import { saveStrategySession, loadStrategySession, getDiscoveryStatus, calculateCompletedSteps, getStepIncompleteFields, DiscoveryStatus, supabase } from "./lib/supabase";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldAlert,
  Wand2,
  BookOpen,
  Palette,
  Compass,
  Flame,
  Smile,
  Users,
  Heart,
  HandHeart,
  Crown,
  Plus,
  X,
  Target,
  Flag,
  RotateCcw,
  Lightbulb,
  Building2,
  Rocket,
  Sliders,
  Quote,
  Layers,
  User,
  ShieldCheck,
  CheckCircle2,
  Loader2,
LogOut,
  LayoutDashboard,
  Menu,
  ChevronRight
} from "lucide-react";

const LOCAL_STORAGE_KEY = "brand_discovery_questionnaire_v1";

const INITIAL_STATE: BrandQuestionnaireState = {
  clientProfile: {
    id: "guest_client",
    email: "client@onawastudio.com",
    fullName: "Valued Client",
    companyName: "Strategy Client",
    isAuthenticated: false,
  },

  brandName: "",
  industry: "",
  projectType: "new_brand",
  rebrandReason: "",
  newBrandGoal: "",
  targetAudienceOverview: "",

  goldenCircle: {
    why: "",
    how: "",
    what: "",
  },

  brandHeart: {
    purpose: "",
    vision: "",
    mission: "",
    values: [],
  },

  strategicEnemy: "",
  positioningMatrix: {
    x: 0,
    y: 0,
    quadrant: "",
  },

  primaryArchetype: "",
  secondaryArchetype: "",

  personality: {
    traditionalVsProgressive: 50,
    corporateVsDisruptive: 50,
    reservedVsBold: 50,
    exclusiveVsAccessible: 50,
    playfulVsSerious: 50,
  },

  keywords: {
    love: [],
    hate: [],
  },

  logoType: "",

  experienceRoadmap: {
    phaseAssignments: {
      discovery: [],
      engagement: [],
      purchase: [],
      advocacy: [],
    },
  },

  moodBoard: {
    elements: [],
  },

  uvp: {
    offering: "",
    category: "",
    benefit: "",
    targetAudience: "",
  },

  currentStep: 1,
};

export default function App() {
  const [state, setState] = useState<BrandQuestionnaireState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return { ...INITIAL_STATE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error("Failed to load state from localStorage:", e);
    }
    return INITIAL_STATE;
  });

  const [showLandingPage, setShowLandingPage] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [newValueInput, setNewValueInput] = useState("");
  const [activeGoldenRing, setActiveGoldenRing] = useState<"why" | "how" | "what" | null>("why");
  const [loadingAI, setLoadingAI] = useState(false);
  
  // New state-based navigation
  const [discoveryStatus, setDiscoveryStatus] = useState<DiscoveryStatus>("new");
  const [loadingSession, setLoadingSession] = useState(false);
  const [sessionLoadingMessage, setSessionLoadingMessage] = useState("");
  const [navigation, setNavigation] = useState<NavigationState>({
    activeView: "discovery",
    sidebarOpen: true,
  });

  // Data-driven completed steps - recomputed from actual form data
  const completedSteps = useMemo(() => {
    return new Set(calculateCompletedSteps(state));
  }, [state]);

  // Track previous user ID to detect user switches
  const previousUserIdRef = useRef<string | null>(null);
  // Track whether initial session restore has completed
  const initialSessionRestored = useRef(false);
  // Flag to prevent auto-save during initialization
  const isInitializing = useRef(true);

  // Restore Supabase session on mount
  useEffect(() => {
    const restoreSession = async () => {
      if (!supabase) {
        initialSessionRestored.current = true;
        isInitializing.current = false;
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const user = session.user;
          const userMeta = user.user_metadata || {};
          
          const restoredProfile: ClientUserProfile = {
            id: user.id,
            email: user.email || "",
            fullName: userMeta.full_name || user.email?.split("@")[0] || "Client",
            companyName: userMeta.company_name || "",
            isAuthenticated: true,
          };

          setState((prev) => ({ ...prev, clientProfile: restoredProfile }));
          previousUserIdRef.current = user.id;
        }
      } catch (err) {
        console.warn("Failed to restore Supabase session:", err);
      } finally {
        initialSessionRestored.current = true;
        // Small delay to ensure state has settled before enabling auto-save
        setTimeout(() => { isInitializing.current = false; }, 100);
      }
    };

    restoreSession();
  }, []);

  // Save to localStorage and Supabase (guarded during initialization)
  useEffect(() => {
    if (isInitializing.current) return;

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
      if (state.clientProfile?.id && state.clientProfile.isAuthenticated) {
        saveStrategySession(state.clientProfile.id, state);
      }
    } catch (e) {
      console.error("Failed to save state to localStorage:", e);
    }
  }, [state]);

  // Check discovery status when user authenticates
  useEffect(() => {
    const checkDiscoveryStatus = async () => {
      if (state.clientProfile?.id && state.clientProfile.isAuthenticated) {
        const currentUserId = state.clientProfile.id;
        const previousUserId = previousUserIdRef.current;

        // Detect user switch: if a different user just logged in, force reset
        if (previousUserId && previousUserId !== currentUserId) {
          console.log(`User switch detected: ${previousUserId} -> ${currentUserId}. Resetting state.`);
          setState(INITIAL_STATE);
          setNewValueInput("");
          setActiveGoldenRing("why");
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }

        previousUserIdRef.current = currentUserId;

        setSessionLoadingMessage(`Securing session for ${state.clientProfile.fullName || state.clientProfile.email}... Loading proprietary strategy data.`);
        setLoadingSession(true);
        try {
          const status = await getDiscoveryStatus(currentUserId);
          setDiscoveryStatus(status.status);
          
          if (status.status !== "new") {
            const savedSession = await loadStrategySession(currentUserId);
            if (savedSession) {
              setState((prev) => ({ ...prev, ...savedSession }));
            }
          } else {
            // New user — ensure clean state
            setState((prev) => ({
              ...INITIAL_STATE,
              clientProfile: prev.clientProfile,
            }));
          }
        } catch (err) {
          console.warn("Failed to check discovery status:", err);
        } finally {
          setLoadingSession(false);
          setSessionLoadingMessage("");
        }
      }
    };

    // Only run after initial session restore is complete
    if (initialSessionRestored.current) {
      checkDiscoveryStatus();
    }
  }, [state.clientProfile?.id, state.clientProfile?.isAuthenticated]);

  const updateState = (updater: Partial<BrandQuestionnaireState>) => {
    setState((prev) => ({ ...prev, ...updater }));
  };

  const handleInitialize = async () => {
    // Check if user is authenticated
    if (!state.clientProfile?.isAuthenticated) {
      // Not logged in - show auth modal
      setIsAuthModalOpen(true);
      return;
    }

    // User is authenticated - check discovery status
    setLoadingSession(true);
    try {
      const status = await getDiscoveryStatus(state.clientProfile.id);
      setDiscoveryStatus(status.status);

      if (status.status === "completed") {
        // Completed user - take to Client Portal View
        setNavigation({ activeView: "portal", sidebarOpen: true });
        setShowLandingPage(false);
      } else if (status.status === "in_progress") {
        // In-progress user - resume from last completed field
        const savedSession = await loadStrategySession(state.clientProfile.id);
        if (savedSession) {
          setState((prev) => ({ ...prev, ...savedSession }));
          updateState({ currentStep: status.lastCompletedStep });
        }
        setNavigation({ activeView: "discovery", sidebarOpen: true });
        setShowLandingPage(false);
      } else {
        // New user - start from Section 1
        updateState({ currentStep: 1 });
        setNavigation({ activeView: "discovery", sidebarOpen: true });
        setShowLandingPage(false);
      }
    } catch (err) {
      console.warn("Failed to initialize discovery:", err);
      // Fallback - start fresh
      updateState({ currentStep: 1 });
      setShowLandingPage(false);
    } finally {
      setLoadingSession(false);
    }
  };

  const handleSynthesizeAI = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch("/api/enhance-brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandData: state }),
      });

      const data = await res.json();
      if (data.success && data.aiAnalysis) {
        updateState({ aiAnalysis: data.aiAnalysis });
      } else {
        alert(data.error || "Failed to generate AI brand strategy.");
      }
    } catch (err) {
      console.error("AI synthesis error:", err);
      alert("Network error calling Gemini AI endpoint.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleLogout = async () => {
    // Sign out from Supabase Auth
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn("Supabase signOut error:", err);
      }
    }

    // Clear per-user localStorage for the outgoing user
    const outgoingUserId = state.clientProfile?.id;
    if (outgoingUserId && outgoingUserId !== "guest_client") {
      localStorage.removeItem(`onawa_strategy_session_${outgoingUserId}`);
    }

    // Full state reset to clean defaults
    setState(INITIAL_STATE);
    setNewValueInput("");
    setActiveGoldenRing("why");
    setDiscoveryStatus("new");
    setNavigation({ activeView: "discovery", sidebarOpen: true });
    setShowLandingPage(true);

    // Clear global localStorage
    localStorage.removeItem(LOCAL_STORAGE_KEY);

    // Reset tracking refs
    previousUserIdRef.current = null;
  };

  const handleNavigationChange = (view: PortalView) => {
    setNavigation((prev) => ({ ...prev, activeView: view }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextStep = () => {
    // Block advancing until the current section is complete
    const missing = getStepIncompleteFields(state.currentStep, state);
    if (missing.length > 0) {
      const nav = document.getElementById("stage-nav");
      if (nav) nav.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const nextStep = Math.min(QUESTIONNAIRE_STEPS.length, state.currentStep + 1);
    updateState({ currentStep: nextStep });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevStep = () => {
    const prevStep = Math.max(1, state.currentStep - 1);
    updateState({ currentStep: prevStep });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleJumpStep = (stepNumber: number) => {
    // Allow: current step, any step behind the current one (edit history),
    // or stepping forward only as far as the last sequentially-complete stage + 1.
    let furthestSequential = 0;
    for (let s = 1; s <= QUESTIONNAIRE_STEPS.length; s++) {
      if (completedSteps.has(s)) furthestSequential = s;
      else break;
    }

    const maxReachable = Math.max(state.currentStep, furthestSequential + 1);

    if (stepNumber > maxReachable) {
      const nav = document.getElementById("stage-nav");
      if (nav) nav.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    updateState({ currentStep: stepNumber });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all questionnaire answers?")) {
      setState((prev) => ({
        ...INITIAL_STATE,
        clientProfile: prev.clientProfile,
      }));
      setNewValueInput("");
      setActiveGoldenRing("why");
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAddValue = (e: React.FormEvent) => {
    e.preventDefault();
    const val = newValueInput.trim();
    if (val && !state.brandHeart.values.includes(val)) {
      updateState({
        brandHeart: {
          ...state.brandHeart,
          values: [...state.brandHeart.values, val],
        },
      });
      setNewValueInput("");
    }
  };

  const handleRemoveValue = (valToRemove: string) => {
    updateState({
      brandHeart: {
        ...state.brandHeart,
        values: state.brandHeart.values.filter((v) => v !== valToRemove),
      },
    });
  };

  const renderArchetypeIcon = (iconName: string) => {
    switch (iconName) {
      case "ShieldAlert": return <ShieldAlert className="w-5 h-5 text-amber-400" />;
      case "Wand2": return <Wand2 className="w-5 h-5 text-purple-400" />;
      case "BookOpen": return <BookOpen className="w-5 h-5 text-blue-400" />;
      case "Palette": return <Palette className="w-5 h-5 text-pink-400" />;
      case "Sparkles": return <Sparkles className="w-5 h-5 text-emerald-400" />;
      case "Compass": return <Compass className="w-5 h-5 text-yellow-400" />;
      case "Flame": return <Flame className="w-5 h-5 text-red-400" />;
      case "Smile": return <Smile className="w-5 h-5 text-orange-400" />;
      case "Users": return <Users className="w-5 h-5 text-cyan-400" />;
      case "Heart": return <Heart className="w-5 h-5 text-rose-400" />;
      case "HandHeart": return <HandHeart className="w-5 h-5 text-sky-400" />;
      case "Crown": return <Crown className="w-5 h-5 text-yellow-300" />;
      default: return <Sparkles className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="min-h-screen cutting-mat-bg text-white flex flex-col font-sans selection:bg-[#C1FF00] selection:text-slate-950">
      <AnimatePresence mode="wait">
        {showLandingPage ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.35 }}
            className="w-full flex-1 flex flex-col justify-center"
          >
            <WelcomeLandingPage
              onInitialize={handleInitialize}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
              isAuthenticated={state.clientProfile?.isAuthenticated || false}
            />
          </motion.div>
        ) : (
          <motion.div
            key="questionnaire"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full flex-1 flex flex-col"
          >
            {/* Fixed Header with Welcome & Logout */}
            <div className="bg-slate-950/95 border-b border-[#00FFC2]/30 px-4 py-3 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#00FFC2] animate-pulse shrink-0" />
                <span className="text-slate-200 font-medium text-sm">
                  {state.clientProfile?.isAuthenticated ? (
                    <>
                      Welcome, <strong className="text-[#C1FF00] font-extrabold">{state.clientProfile.fullName}</strong>
                    </>
                  ) : (
                    <>
                      Welcome, <strong className="text-white font-bold">{state.clientProfile?.fullName || "Valued Client"}</strong>
                    </>
                  )}
                </span>
                {loadingSession && (
                  <div className="flex items-center gap-2 text-xs text-[#00FFC2]">
                    <div className="w-3 h-3 border-2 border-[#00FFC2] border-t-transparent rounded-full animate-spin" />
                    <span className="font-mono font-bold animate-pulse">{sessionLoadingMessage || "Loading session..."}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-[#FF002B] text-[#FF002B] font-mono text-[11px] font-bold uppercase rounded-lg transition-all flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>

            {/* Top Progress Navigation */}
            <StepProgressBar
              currentStep={state.currentStep}
              onStepClick={handleJumpStep}
              completedSteps={completedSteps}
              onShowLandingPage={() => setShowLandingPage(true)}
            />

            {/* Main Form Canvas Container */}
            <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={state.currentStep}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="w-full flex flex-col gap-8"
                >
            {/* STEP 1: CONTEXT & FOUNDATION */}
            {state.currentStep === 1 && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-black text-[#C1FF00] uppercase tracking-widest">
                    <Flag className="w-4 h-4 text-[#C1FF00]" />
                    <span>Stage 01 • Brand Context</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    Foundational Context & Trajectory
                  </h1>
                  <p className="text-xs md:text-sm text-slate-200">
                    Establish whether we are crafting a brand from scratch or executing a strategic rebrand.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Brand Name */}
                  <div className="flex flex-col gap-1.5 p-5 bg-slate-950/90 rounded-2xl border border-white/20 shadow-xl">
                    <label className="text-xs font-bold text-slate-200">
                      Brand or Product Name <span className="text-[#C1FF00]">*</span>
                    </label>
                    <input
                      type="text"
                      value={state.brandName}
                      onChange={(e) => updateState({ brandName: e.target.value })}
                      placeholder="e.g. Luminary AI, Astraea Studio..."
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#C1FF00]"
                    />
                  </div>

                  {/* Industry */}
                  <div className="flex flex-col gap-1.5 p-5 bg-slate-950/90 rounded-2xl border border-white/20 shadow-xl">
                    <label className="text-xs font-bold text-slate-200">
                      Industry / Primary Domain
                    </label>
                    <input
                      type="text"
                      value={state.industry}
                      onChange={(e) => updateState({ industry: e.target.value })}
                      placeholder="e.g. Fintech, Sustainable Apparel, SaaS..."
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#C1FF00]"
                    />
                  </div>
                </div>

                {/* Conditional Logic Trigger: New Brand vs Rebrand */}
                <div className="p-5 bg-slate-950/90 rounded-2xl border border-white/20 shadow-xl flex flex-col gap-4">
                  <label className="text-xs font-bold text-slate-200">
                    Project Classification <span className="text-[#C1FF00]">*</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => updateState({ projectType: "new_brand" })}
                      className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                        state.projectType === "new_brand"
                          ? "bg-[#C1FF00]/20 border-[#C1FF00] text-[#C1FF00] shadow-lg shadow-[#C1FF00]/10"
                          : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <Rocket className="w-5 h-5 text-[#C1FF00] shrink-0" />
                      <div className="text-left">
                        <div className="font-bold text-sm text-white">
                          New Brand Launch
                        </div>
                        <div className="text-[11px] text-slate-300">
                          Building a fresh identity from zero
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateState({ projectType: "rebrand" })}
                      className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                        state.projectType === "rebrand"
                          ? "bg-[#00FFC2]/20 border-[#00FFC2] text-[#00FFC2] shadow-lg shadow-[#00FFC2]/10"
                          : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <Building2 className="w-5 h-5 text-[#00FFC2] shrink-0" />
                      <div className="text-left">
                        <div className="font-bold text-sm text-white">
                          Strategic Rebrand
                        </div>
                        <div className="text-[11px] text-slate-300">
                          Repositioning an existing brand
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Conditional Logic Question Fields */}
                  {state.projectType === "rebrand" ? (
                    <div className="mt-2 p-4 bg-slate-900/90 rounded-xl border border-[#00FFC2]/40 flex flex-col gap-3 animate-fadeIn">
                      <VoiceTextArea
                        label="Rebrand Catalyst & Pain Points:"
                        rows={2}
                        value={state.rebrandReason || ""}
                        onValueChange={(val) => updateState({ rebrandReason: val })}
                        placeholder="What isn't working with current positioning? Outgrown market, changed offerings, or poor differentiation?"
                      />
                    </div>
                  ) : (
                    <div className="mt-2 p-4 bg-slate-900/90 rounded-xl border border-[#C1FF00]/40 flex flex-col gap-3 animate-fadeIn">
                      <VoiceTextArea
                        label="Launch Objective & Origin Context:"
                        rows={2}
                        value={state.newBrandGoal || ""}
                        onValueChange={(val) => updateState({ newBrandGoal: val })}
                        placeholder="What inspired this new brand launch? What market entry hook will command attention?"
                      />
                    </div>
                  )}
                </div>

                {/* Target Audience Overview */}
                <div className="p-5 bg-slate-950/90 rounded-2xl border border-white/20 shadow-xl flex flex-col gap-2">
                  <VoiceTextArea
                    label="Target Audience Overview"
                    rows={2}
                    value={state.targetAudienceOverview}
                    onValueChange={(val) => updateState({ targetAudienceOverview: val })}
                    placeholder="Who is the ideal customer? Describe their psychographics, aspirations, and core pain points..."
                  />
                </div>
              </div>
            )}

            {/* STEP 2: THE GOLDEN CIRCLE (SIMON SINEK) */}
            {state.currentStep === 2 && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-black text-[#C1FF00] uppercase tracking-widest">
                    <Sparkles className="w-4 h-4 text-[#C1FF00]" />
                    <span>Stage 02 • Simon Sinek's Golden Circle (Onawa Architecture)</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    Inside-Out Purpose Workshop
                  </h1>
                  <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
                    We utilize Simon Sinek's Golden Circle framework,{" "}
                    <span className="text-[#C1FF00] font-bold underline decoration-[#C1FF00]/50 decoration-2 underline-offset-4 drop-shadow-[0_0_8px_rgba(193,255,0,0.6)]">
                      mixed with Clyde Strydom’s 17+ years of elite experience in visual strategy
                    </span>
                    , to find the core of your business.
                  </p>
                </div>

                {/* Strategist Note Banner */}
                <div className="p-4 bg-slate-950/90 rounded-2xl border border-[#00FFC2]/50 shadow-xl flex items-start gap-3">
                  <div className="p-2 bg-[#00FFC2]/10 border border-[#00FFC2]/30 rounded-xl text-[#00FFC2] shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-mono font-bold text-[#00FFC2] uppercase tracking-wider">
                      Clyde’s Perspective:
                    </span>
                    <p className="text-xs text-slate-200 italic leading-relaxed">
                      "To build a great brand, we must start with your 'Why' before we touch a single pixel."
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Interactive Golden Circle SVG */}
                  <div className="lg:col-span-5 w-full flex justify-center">
                    <GoldenCircleSVG
                      why={state.goldenCircle.why}
                      how={state.goldenCircle.how}
                      what={state.goldenCircle.what}
                      activeRing={activeGoldenRing}
                      onSelectRing={(ring) => setActiveGoldenRing(ring)}
                    />
                  </div>

                  {/* Right Column: Form Inputs */}
                  <div className="lg:col-span-7 flex flex-col gap-4">
                    {/* 1. WHY */}
                    <div
                      className={`p-4 rounded-xl border transition-all ${
                        activeGoldenRing === "why"
                          ? "bg-amber-950/20 border-amber-500/80 ring-1 ring-amber-500/50"
                          : "bg-slate-900/80 border-slate-800"
                      }`}
                      onClick={() => setActiveGoldenRing("why")}
                    >
                      <label className="text-xs font-bold text-amber-400 flex items-center justify-between mb-1">
                        <span>1. WHY (Core Purpose / Belief) *</span>
                        <span className="text-[10px] text-slate-500">The Soul</span>
                      </label>
                      <p className="text-[11px] text-slate-400 mb-2">
                        Why does your brand exist beyond making money? What fundamental cause or belief drives you?
                      </p>
                      <VoiceTextArea
                        rows={2}
                        value={state.goldenCircle.why}
                        onValueChange={(val) =>
                          updateState({
                            goldenCircle: { ...state.goldenCircle, why: val },
                          })
                        }
                        placeholder="e.g., We believe everyone deserves effortless access to sustainable clean power..."
                      />
                    </div>

                    {/* 2. HOW */}
                    <div
                      className={`p-4 rounded-xl border transition-all ${
                        activeGoldenRing === "how"
                          ? "bg-cyan-950/20 border-cyan-500/80 ring-1 ring-cyan-500/50"
                          : "bg-slate-900/80 border-slate-800"
                      }`}
                      onClick={() => setActiveGoldenRing("how")}
                    >
                      <label className="text-xs font-bold text-cyan-400 flex items-center justify-between mb-1">
                        <span>2. HOW (Process & Uniqueness)</span>
                        <span className="text-[10px] text-slate-500">The Method</span>
                      </label>
                      <p className="text-[11px] text-slate-400 mb-2">
                        How do you fulfill your why differently? What proprietary process, culture, or values set you apart?
                      </p>
                      <VoiceTextArea
                        rows={2}
                        value={state.goldenCircle.how}
                        onValueChange={(val) =>
                          updateState({
                            goldenCircle: { ...state.goldenCircle, how: val },
                          })
                        }
                        placeholder="e.g., Through zero-latency AI synthesis combined with human artisan curation..."
                      />
                    </div>

                    {/* 3. WHAT */}
                    <div
                      className={`p-4 rounded-xl border transition-all ${
                        activeGoldenRing === "what"
                          ? "bg-purple-950/20 border-purple-500/80 ring-1 ring-purple-500/50"
                          : "bg-slate-900/80 border-slate-800"
                      }`}
                      onClick={() => setActiveGoldenRing("what")}
                    >
                      <label className="text-xs font-bold text-purple-400 flex items-center justify-between mb-1">
                        <span>3. WHAT (Products & Services)</span>
                        <span className="text-[10px] text-slate-500">The Tangible Proof</span>
                      </label>
                      <p className="text-[11px] text-slate-400 mb-2">
                        What actual products or services do you sell to the market every day?
                      </p>
                      <VoiceTextArea
                        rows={2}
                        value={state.goldenCircle.what}
                        onValueChange={(val) =>
                          updateState({
                            goldenCircle: { ...state.goldenCircle, what: val },
                          })
                        }
                        placeholder="e.g., High-performance solar hardware and subscription energy optimization software..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: THE BRAND HEART (COLUMN FIVE) */}
            {state.currentStep === 3 && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                    <Heart className="w-4 h-4" />
                    <span>Stage 03 • Column Five's Brand Heart</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight">
                    Purpose, Vision, Mission & Values
                  </h1>
                  <p className="text-xs md:text-sm text-slate-400">
                    Codify the internal engine that keeps team culture aligned and brand messaging consistent.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Purpose */}
                  <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col gap-2">
                    <VoiceTextArea
                      label="Purpose (Why We Exist)"
                      rows={2}
                      value={state.brandHeart.purpose}
                      onValueChange={(val) =>
                        updateState({
                          brandHeart: { ...state.brandHeart, purpose: val },
                        })
                      }
                      placeholder="The underlying reason for existence beyond profit..."
                    />
                  </div>

                  {/* Vision */}
                  <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col gap-2">
                    <VoiceTextArea
                      label="Vision (The Future We Build)"
                      rows={2}
                      value={state.brandHeart.vision}
                      onValueChange={(val) =>
                        updateState({
                          brandHeart: { ...state.brandHeart, vision: val },
                        })
                      }
                      placeholder="What does the world look like if our brand succeeds completely in 10 years?"
                    />
                  </div>

                  {/* Mission */}
                  <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col gap-2 md:col-span-2">
                    <VoiceTextArea
                      label="Mission (What We Do Daily To Deliver Vision)"
                      rows={2}
                      value={state.brandHeart.mission}
                      onValueChange={(val) =>
                        updateState({
                          brandHeart: { ...state.brandHeart, mission: val },
                        })
                      }
                      placeholder="How we execute, serve customers, and innovate every single day..."
                    />
                  </div>
                </div>

                {/* Values Tags Builder */}
                <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col gap-3">
                  <label className="text-xs font-bold text-slate-300">
                    Core Operating Values & Principles
                  </label>

                  <form onSubmit={handleAddValue} className="flex gap-2">
                    <input
                      type="text"
                      value={newValueInput}
                      onChange={(e) => setNewValueInput(e.target.value)}
                      placeholder="Add a core value (e.g., Radical Transparency, Craftsmanship)..."
                      className="flex-1 bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 hover:bg-amber-400 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </form>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {state.brandHeart.values.map((val) => (
                      <span
                        key={val}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold rounded-full shadow-sm"
                      >
                        <span>{val}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveValue(val)}
                          className="hover:text-amber-100 p-0.5 rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: STRATEGIC VILLAIN & POSITIONING MATRIX (MODULE 1) */}
            {state.currentStep === 4 && (
              <StrategicVillainMatrix
                enemy={state.strategicEnemy}
                onEnemyChange={(enemy) => updateState({ strategicEnemy: enemy })}
                matrix={state.positioningMatrix}
                onMatrixChange={(matrix) => updateState({ positioningMatrix: matrix })}
              />
            )}

            {/* STEP 5: THE 12 ARCHETYPES (WILLOW MARKETING) */}
            {state.currentStep === 5 && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C1FF00] uppercase tracking-widest">
                    <Users className="w-4 h-4 text-[#C1FF00]" />
                    <span>Stage 05 • Willow Marketing's 12 Brand Archetypes</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight">
                    Archetype Personality Selection
                  </h1>
                  <p className="text-xs md:text-sm text-slate-400">
                    Select your Primary Brand Archetype (and an optional Secondary Archetype) to anchor tone, imagery, and emotional stance.
                  </p>
                </div>

                {/* Selection Indicators */}
                <div className="flex flex-wrap items-center gap-4 p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Primary Archetype: </span>
                    <span className="font-bold text-amber-400">
                      {BRAND_ARCHETYPES.find((a) => a.id === state.primaryArchetype)?.name || "None"}
                    </span>
                  </div>
                  <div className="text-slate-600">|</div>
                  <div>
                    <span className="text-slate-400 font-medium">Secondary Archetype: </span>
                    <span className="font-bold text-cyan-400">
                      {BRAND_ARCHETYPES.find((a) => a.id === state.secondaryArchetype)?.name || "None"}
                    </span>
                  </div>
                </div>

                {/* 12 Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {BRAND_ARCHETYPES.map((arch) => {
                    const isPrimary = state.primaryArchetype === arch.id;
                    const isSecondary = state.secondaryArchetype === arch.id;

                    return (
                      <div
                        key={arch.id}
                        className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-3 relative ${
                          isPrimary
                            ? "bg-slate-900 border-amber-500 ring-2 ring-amber-500/50 shadow-xl shadow-amber-500/10"
                            : isSecondary
                            ? "bg-slate-900 border-cyan-500 ring-2 ring-cyan-500/50 shadow-xl shadow-cyan-500/10"
                            : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90"
                        }`}
                      >
                        {/* Header Badge */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {renderArchetypeIcon(arch.iconName)}
                            <h3 className="font-bold text-slate-100 text-base">
                              {arch.name}
                            </h3>
                          </div>

                          {isPrimary && (
                            <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-bold text-[10px] uppercase rounded-full">
                              Primary
                            </span>
                          )}
                          {isSecondary && (
                            <span className="px-2.5 py-0.5 bg-cyan-500 text-slate-950 font-bold text-[10px] uppercase rounded-full">
                              Secondary
                            </span>
                          )}
                        </div>

                        {/* Motto & Summary */}
                        <div className="flex flex-col gap-1">
                          <p className="text-xs font-serif italic font-semibold text-amber-300">
                            "{arch.motto}"
                          </p>
                          <p className="text-[11px] text-slate-300 font-medium">
                            {arch.traitSummary}
                          </p>
                        </div>

                        {/* Traits Badges */}
                        <div className="flex flex-wrap gap-1">
                          {arch.traits.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 bg-slate-950 text-slate-400 border border-slate-800 text-[10px] rounded-md"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Real-world Brand Examples */}
                        <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800/80">
                          Examples: <span className="text-slate-400 italic">{arch.examples.join(", ")}</span>
                        </div>

                        {/* Action Selection Buttons */}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateState({
                                primaryArchetype: arch.id,
                                ...(state.secondaryArchetype === arch.id
                                  ? { secondaryArchetype: "" }
                                  : {}),
                              })
                            }
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              isPrimary
                                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                                : "bg-slate-800 text-slate-300 hover:bg-amber-500/20 hover:text-amber-300"
                            }`}
                          >
                            Set Primary
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              updateState({
                                secondaryArchetype: isSecondary ? "" : arch.id,
                                ...(state.primaryArchetype === arch.id
                                  ? { primaryArchetype: "" }
                                  : {}),
                              })
                            }
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              isSecondary
                                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                                : "bg-slate-800 text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-300"
                            }`}
                          >
                            {isSecondary ? "Remove Sec" : "Set Secondary"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 6: PERSONALITY SPECTRUM */}
            {state.currentStep === 6 && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C1FF00] uppercase tracking-widest">
                    <Sliders className="w-4 h-4 text-[#C1FF00]" />
                    <span>Stage 06 • Personality Spectrum Sliders</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight">
                    Brand Trait Dial & Spectrum Calibration
                  </h1>
                  <p className="text-xs md:text-sm text-slate-400">
                    Slide each continuum to establish where your brand sits between opposing visual and tonal polarities.
                  </p>
                </div>

                <PersonalitySlider
                  personality={state.personality}
                  onChange={(updated) => updateState({ personality: updated })}
                />
              </div>
            )}

            {/* STEP 7: LOVE/HATE MATRIX (FERNANDO IFRÁN) */}
            {state.currentStep === 7 && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C1FF00] uppercase tracking-widest">
                    <Quote className="w-4 h-4 text-[#C1FF00]" />
                    <span>Stage 07 • Fernando Ifrán's Love/Hate Matrix</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight">
                    Embrace vs. Avoid Keyword Matrix
                  </h1>
                  <p className="text-xs md:text-sm text-slate-400">
                    Select or type keywords to define what your brand passionately embraces versus what it adamantly avoids.
                  </p>
                </div>

                <LoveHateMatrix
                  keywords={state.keywords}
                  onChange={(updated) => updateState({ keywords: updated })}
                />
              </div>
            )}

            {/* STEP 8: LOGO ANATOMY GUIDE */}
            {state.currentStep === 8 && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C1FF00] uppercase tracking-widest">
                    <Layers className="w-4 h-4 text-[#C1FF00]" />
                    <span>Stage 08 • Visual Discovery & Logo Anatomy</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight">
                    Logo Mark Architecture & Anatomy
                  </h1>
                  <p className="text-xs md:text-sm text-slate-400">
                    Choose the structural category for your primary logo (Logomark, Logotype, Combination Mark, or Emblem).
                  </p>
                </div>

                <LogoAnatomyGuide
                  selectedType={state.logoType}
                  onSelect={(type) => updateState({ logoType: type })}
                />
              </div>
            )}

            {/* STEP 9: THE EXPERIENCE ROADMAP (MODULE 2) */}
            {state.currentStep === 9 && (
              <ExperienceRoadmap
                roadmap={state.experienceRoadmap}
                onChange={(roadmap) => updateState({ experienceRoadmap: roadmap })}
              />
            )}

            {/* STEP 10: INTERACTIVE VISUAL DIRECTION MOOD BOARD (FABRIC.JS) */}
            {state.currentStep === 10 && (
              <InteractiveMoodBoard
                brandName={state.brandName}
                moodBoard={state.moodBoard || { elements: [] }}
                onChange={(updatedMoodBoard) => updateState({ moodBoard: updatedMoodBoard })}
              />
            )}

            {/* STEP 11: DYNAMIC UVP BUILDER */}
            {state.currentStep === 11 && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C1FF00] uppercase tracking-widest">
                    <Sparkles className="w-4 h-4 text-[#C1FF00]" />
                    <span>Stage 11 • Dynamic UVP Builder</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight">
                    Unique Value Proposition Architecture
                  </h1>
                  <p className="text-xs md:text-sm text-slate-400">
                    Fill in the structural blanks to distill your entire brand positioning into an airtight statement.
                  </p>
                </div>

                <UVPBuilder
                  uvp={state.uvp}
                  goldenCircle={state.goldenCircle}
                  brandHeart={state.brandHeart}
                  onChange={(updated) => updateState({ uvp: updated })}
                />
              </div>
            )}

            {/* STEP 12: SUCCESS STATE HUB & BRAND SUMMARY REPORT */}
            {state.currentStep === 12 && (
              <div className="flex flex-col gap-10">
                <SuccessStateHub
                  state={state}
                  onEditStep={handleJumpStep}
                  onReset={handleReset}
                  onSynthesizeAI={handleSynthesizeAI}
                  loadingAI={loadingAI}
                />

                <BrandSummaryReport
                  state={state}
                  onEditStep={handleJumpStep}
                  onReset={handleReset}
                  onUpdateAIAnalysis={(analysis: AIAnalysisResult) =>
                    updateState({ aiAnalysis: analysis })
                  }
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Stage Navigation Bar */}
        {(() => {
          const missingFields = getStepIncompleteFields(state.currentStep, state);
          const isCurrentStepComplete = missingFields.length === 0;
          const showWarning = !isCurrentStepComplete && state.currentStep < QUESTIONNAIRE_STEPS.length;

          return (
            <div
              id="stage-nav"
              className="mt-10 pt-6 border-t border-[#C1FF00]/30 flex flex-col gap-4 print:hidden"
            >
              {/* Incomplete-section warning bar */}
              {showWarning && (
                <div className="p-4 bg-[#FF002B]/10 border border-[#FF002B]/50 rounded-2xl flex flex-col gap-2 animate-fadeIn">
                  <div className="flex items-center gap-2 text-[#FF002B] font-black font-mono text-xs uppercase tracking-widest">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Complete this stage to continue</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {missingFields.map((field) => (
                      <span
                        key={field}
                        className="px-2.5 py-1 bg-[#FF002B]/15 border border-[#FF002B]/40 text-[#FF002B] text-[11px] font-bold rounded-lg"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={state.currentStep === 1}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                    state.currentStep === 1
                      ? "opacity-0 cursor-default"
                      : "bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-700"
                  }`}
                >
                  <ArrowLeft className="w-4 h-4 text-[#C1FF00]" />
                  <span>Previous Step</span>
                </button>

                <div className="flex items-center gap-2">
                  {state.currentStep < QUESTIONNAIRE_STEPS.length ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={!isCurrentStepComplete}
                      className={`px-6 py-2.5 font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg transition-all ${
                        isCurrentStepComplete
                          ? "bg-[#C1FF00] hover:bg-[#a8df00] text-slate-950 shadow-[#C1FF00]/20"
                          : "bg-slate-800 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      <span>Continue to {QUESTIONNAIRE_STEPS[state.currentStep]?.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-6 py-2.5 bg-[#00FFC2] hover:bg-[#00e6af] text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-[#00FFC2]/20 transition-all"
                    >
                      <span>Print Strategy Report</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </main>
    </motion.div>
  )}
</AnimatePresence>

{/* Supabase Client Profile Modal */}
<ClientProfileModal
  isOpen={isAuthModalOpen}
  onClose={() => setIsAuthModalOpen(false)}
  currentProfile={state.clientProfile}
  onProfileUpdated={(updatedProfile) => {
    // If this is a new authenticated user (different ID from current), force clean state
    if (updatedProfile.isAuthenticated && updatedProfile.id !== state.clientProfile?.id) {
      setState({
        ...INITIAL_STATE,
        clientProfile: updatedProfile,
      });
      setNewValueInput("");
      setActiveGoldenRing("why");
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } else {
      updateState({ clientProfile: updatedProfile });
    }

    if (updatedProfile.isAuthenticated) {
      setShowLandingPage(false);
    }
  }}
/>

{/* Full-screen neon loading overlay during session restore */}
<AnimatePresence>
  {loadingSession && !showLandingPage && (
    <motion.div
      key="session-loader"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-md"
    >
      <div className="flex flex-col items-center gap-6 p-8 max-w-md text-center">
        {/* Animated shield icon */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-2 border-[#00FFC2] animate-ping opacity-30" />
          <div className="absolute inset-2 rounded-full border border-[#C1FF00] animate-spin opacity-50" style={{ animationDuration: "3s" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldCheck className="w-10 h-10 text-[#00FFC2]" />
          </div>
        </div>

        {/* Loading text */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-black text-white tracking-tight">
            {sessionLoadingMessage || "Initializing secure session..."}
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Onawa Studio Discovery Portal
          </p>
        </div>

        {/* Neon progress bar */}
        <div className="w-full max-w-xs">
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00FFC2] via-[#C1FF00] to-[#00FFC2] rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{
                boxShadow: "0 0 12px rgba(0,255,194,0.6), 0 0 24px rgba(193,255,0,0.3)",
              }}
            />
          </div>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Loader2 className="w-3 h-3 text-[#C1FF00] animate-spin" />
            <span className="text-[10px] font-mono text-[#00FFC2] uppercase tracking-widest animate-pulse">
              Encrypting channel...
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
</div>
);
}

