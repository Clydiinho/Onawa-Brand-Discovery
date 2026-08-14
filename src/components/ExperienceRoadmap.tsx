import React, { useState } from "react";
import { ExperienceRoadmapData, RoadmapPhase } from "../types";
import {
  Compass,
  Globe,
  Share2,
  Package,
  Headphones,
  Store,
  Mail,
  Smartphone,
  FileText,
  Ticket,
  Users,
  Megaphone,
  Sparkles,
  CheckCircle2,
  Plus,
  ArrowRight,
  Info,
  Check,
  RotateCcw
} from "lucide-react";

interface ExperienceRoadmapProps {
  roadmap: ExperienceRoadmapData;
  onChange: (updated: ExperienceRoadmapData) => void;
}

export interface TouchpointDefinition {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const TOUCHPOINT_VAULT: TouchpointDefinition[] = [
  { id: "website", name: "Website & Web App", category: "Digital", icon: Globe },
  { id: "social_media", name: "Social Media Channels", category: "Content", icon: Share2 },
  { id: "unboxing", name: "Unboxing & Packaging", category: "Physical", icon: Package },
  { id: "customer_service", name: "Customer Service & Support", category: "Human", icon: Headphones },
  { id: "retail", name: "Retail & Physical Environment", category: "Physical", icon: Store },
  { id: "email_marketing", name: "Email Newsletters & Lifecycle", category: "Digital", icon: Mail },
  { id: "mobile_app", name: "Mobile Application", category: "Product", icon: Smartphone },
  { id: "sales_deck", name: "Sales Deck & Pitch Materials", category: "Collateral", icon: FileText },
  { id: "events_expos", name: "Pop-Up Events & Expos", category: "Experiential", icon: Ticket },
  { id: "community", name: "VIP Community & Member Portal", category: "Retention", icon: Users },
  { id: "word_of_mouth", name: "Referral & Word of Mouth", category: "Advocacy", icon: Megaphone },
  { id: "product_ux", name: "Product Quality & UX Craft", category: "Core Product", icon: Sparkles },
];

export const ROADMAP_PHASES: Array<{
  id: RoadmapPhase;
  title: string;
  subtitle: string;
  color: string;
  borderColor: string;
  bgLight: string;
}> = [
  {
    id: "discovery",
    title: "1. Discovery",
    subtitle: "Awareness & First Impression",
    color: "#D4A574",
    borderColor: "border-brass",
    bgLight: "bg-brass/10",
  },
  {
    id: "engagement",
    title: "2. Engagement",
    subtitle: "Consideration & Relationship",
    color: "#F5F0E8",
    borderColor: "border-cream",
    bgLight: "bg-cream/10",
  },
  {
    id: "purchase",
    title: "3. Purchase",
    subtitle: "Conversion & Unboxing/Onboarding",
    color: "#2563eb",
    borderColor: "border-blue-500",
    bgLight: "bg-blue-500/10",
  },
  {
    id: "advocacy",
    title: "4. Advocacy",
    subtitle: "Loyalty, Community & Retention",
    color: "#a855f7",
    borderColor: "border-purple-500",
    bgLight: "bg-purple-500/10",
  },
];

export const ExperienceRoadmap: React.FC<ExperienceRoadmapProps> = ({
  roadmap,
  onChange,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<RoadmapPhase>("discovery");

  // Helper to check which phase a touchpoint belongs to
  const getAssignedPhase = (touchpointId: string): RoadmapPhase | null => {
    for (const phaseKey of Object.keys(roadmap.phaseAssignments) as RoadmapPhase[]) {
      if (roadmap.phaseAssignments[phaseKey]?.includes(touchpointId)) {
        return phaseKey;
      }
    }
    return null;
  };

  // Toggle touchpoint assignment
  const handleAssignTouchpoint = (touchpointId: string, targetPhase: RoadmapPhase) => {
    const currentAssignments = { ...roadmap.phaseAssignments };

    // First remove from all phases
    (Object.keys(currentAssignments) as RoadmapPhase[]).forEach((p) => {
      currentAssignments[p] = (currentAssignments[p] || []).filter((id) => id !== touchpointId);
    });

    const currentInTarget = roadmap.phaseAssignments[targetPhase] || [];
    const isAlreadyInTarget = roadmap.phaseAssignments[targetPhase]?.includes(touchpointId);

    if (!isAlreadyInTarget) {
      currentAssignments[targetPhase] = [...currentInTarget, touchpointId];
    }

    onChange({ phaseAssignments: currentAssignments });
  };

  const handleResetRoadmap = () => {
    onChange({
      phaseAssignments: {
        discovery: ["website", "social_media"],
        engagement: ["email_marketing", "sales_deck"],
        purchase: ["unboxing", "product_ux"],
        advocacy: ["customer_service", "community"],
      },
    });
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn">
      {/* SECTION HEADER */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-mono font-black text-brass uppercase tracking-widest">
          <Compass className="w-4 h-4 text-brass" />
          <span>Stage 09 • The Experience Roadmap (Journey & Touchpoints)</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-headline font-bold text-cream tracking-tight">
          Customer Lifecycle & Touchpoint Cyber-Vault
        </h1>
        <p className="text-xs md:text-sm text-cream/80 leading-relaxed font-medium">
          Branding is the sum of every interaction a customer has with your organization from start to finish. Map where your new visual identity will live across the 4 key experience phases.
        </p>
      </div>

      {/* TIMELINE SVG GRAPHIC HEADER */}
      <div className="p-6 bg-graphite/90 rounded-2xl border border-white/20 shadow-xl flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-base font-headline font-bold text-cream flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cream" />
              <span>Visual Customer Experience Timeline</span>
            </h2>
            <p className="text-xs text-cream/70 mt-0.5">
              Select a stage below, then click touchpoints from the Cyber-Vault to assign them to that lifecycle step.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetRoadmap}
            className="self-start sm:self-auto px-3 py-1.5 bg-surface border border-white/10 hover:border-slate-500 text-cream/70 hover:text-cream rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-brass" />
            <span>Reset Default Roadmap</span>
          </button>
        </div>

        {/* Horizontal Visual Timeline Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROADMAP_PHASES.map((phase) => {
            const isSelected = selectedPhase === phase.id;
            const assignedIds = roadmap.phaseAssignments[phase.id] || [];

            return (
              <div
                key={phase.id}
                onClick={() => setSelectedPhase(phase.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 relative ${
                  isSelected
                    ? `${phase.borderColor} bg-surface ring-2 ring-white/20 shadow-xl scale-[1.02]`
                    : "border-white/5 bg-graphite/70 hover:border-white/10 hover:bg-surface/60 opacity-85"
                }`}
              >
                {/* Stage Header */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-black uppercase font-mono tracking-wider"
                      style={{ color: phase.color }}
                    >
                      {phase.title}
                    </span>
                    {isSelected && (
                      <span
                        className="px-2 py-0.5 text-[9px] font-black uppercase rounded-full"
                        style={{ backgroundColor: phase.color, color: "#020617" }}
                      >
                        Active Stage
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-cream/60 font-medium">
                    {phase.subtitle}
                  </span>
                </div>

                {/* Assigned Touchpoint Chips List */}
                <div className="flex flex-col gap-1.5 min-h-[90px] p-2 bg-graphite/90 rounded-xl border border-white/5">
                  <span className="text-[10px] font-mono text-cream/60 uppercase tracking-wider font-bold">
                    Assigned ({assignedIds.length}):
                  </span>
                  {assignedIds.length === 0 ? (
                    <span className="text-[11px] text-cream/40 italic py-2">
                      Click touchpoints below to assign...
                    </span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {assignedIds.map((id) => {
                        const tp = TOUCHPOINT_VAULT.find((t) => t.id === id);
                        if (!tp) return null;
                        const Icon = tp.icon;
                        return (
                          <span
                            key={id}
                            className="px-2 py-1 bg-surface border border-white/10 text-cream/80 text-[10px] font-bold rounded-lg flex items-center gap-1 shadow-sm"
                          >
                            <Icon className="w-3 h-3 text-cream" />
                            <span className="truncate max-w-[110px]">{tp.name}</span>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Select Stage Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhase(phase.id);
                  }}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? "bg-surface text-carbon-black font-black shadow-md"
                      : "bg-surface text-cream/70 hover:bg-graphite"
                  }`}
                >
                  <span>{isSelected ? "Stage Selected" : "Assign to This Phase"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODULE 2.2: THE CYBER-VAULT (TOUCHPOINTS GRID) */}
      <div className="p-6 bg-graphite/90 rounded-2xl border border-white/20 shadow-xl flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-base font-headline font-bold text-cream flex items-center gap-2">
              <Package className="w-5 h-5 text-brass" />
              <span>The Cyber-Vault (Interactive Touchpoints)</span>
            </h2>
            <p className="text-xs text-cream/70 mt-0.5">
              Click any touchpoint to assign or reassign it to{" "}
              <span className="font-bold text-cream underline">
                {ROADMAP_PHASES.find((p) => p.id === selectedPhase)?.title}
              </span>
            </p>
          </div>

          <div className="px-3 py-1.5 bg-surface border border-[#D4A574]/40 rounded-xl text-xs font-mono font-bold text-cream flex items-center gap-2">
            <span>Target: {ROADMAP_PHASES.find((p) => p.id === selectedPhase)?.title}</span>
          </div>
        </div>

        {/* Touchpoint Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {TOUCHPOINT_VAULT.map((tp) => {
            const Icon = tp.icon;
            const assignedPhase = getAssignedPhase(tp.id);
            const isAssignedToCurrent = assignedPhase === selectedPhase;
            const assignedPhaseConfig = ROADMAP_PHASES.find((p) => p.id === assignedPhase);

            return (
              <button
                key={tp.id}
                type="button"
                onClick={() => handleAssignTouchpoint(tp.id, selectedPhase)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-3 relative ${
                  isAssignedToCurrent
                    ? "bg-[#D4A574]/15 border-[#D4A574] ring-1 ring-[#D4A574]/50 shadow-lg shadow-[#D4A574]/10 scale-[1.02]"
                    : assignedPhase
                    ? "bg-surface/90 border-white/10 hover:border-[#F5F0E8]"
                    : "bg-graphite/80 border-white/5 text-cream/60 hover:border-white/15 hover:text-cream"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="p-2 bg-surface border border-white/10 rounded-xl text-cream">
                    <Icon className="w-4 h-4 text-cream" />
                  </div>

                  {assignedPhase ? (
                    <span
                      className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded-md text-carbon-black"
                      style={{ backgroundColor: assignedPhaseConfig?.color || "#F5F0E8" }}
                    >
                      {assignedPhaseConfig?.title.split(".")[1]?.trim()}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-surface text-cream/40 text-[9px] font-mono rounded-md border border-white/5">
                      Unassigned
                    </span>
                  )}
                </div>

                <div>
                  <div className="font-bold text-xs text-cream leading-snug">
                    {tp.name}
                  </div>
                  <div className="text-[10px] text-cream/60 font-mono mt-0.5">
                    Category: {tp.category}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] pt-2 border-t border-white/5 font-bold">
                  {isAssignedToCurrent ? (
                    <span className="text-cream flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Assigned to Active
                    </span>
                  ) : (
                    <span className="text-cream/60 hover:text-cream flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5 text-brass" /> Click to Assign
                    </span>
                  )}
                </div>
              </button>
            );
          })}
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
