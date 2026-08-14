import React, { useState, useEffect } from "react";
import { BrandQuestionnaireState } from "../types";
import { sendBrandDiscoveryEmail, EmailResult } from "../utils/emailService";
import { BRAND_ARCHETYPES } from "../data/archetypes";
import {
  Mail,
  Send,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap,
  Heart,
  Users,
  Target,
  Sparkles,
  User
} from "lucide-react";

interface SubmitToStrategistModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: BrandQuestionnaireState;
}

const STRATEGIST_EMAIL = "imnotjustanybody@gmail.com";

export const SubmitToStrategistModal: React.FC<SubmitToStrategistModalProps> = ({
  isOpen,
  onClose,
  state,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string[]>([]);

  // Client email state - pre-fill from profile
  const [clientEmail, setClientEmail] = useState(state.clientProfile?.email || "");

  // Update client email when state changes
  useEffect(() => {
    if (state.clientProfile?.email) {
      setClientEmail(state.clientProfile.email);
    }
  }, [state.clientProfile?.email]);

  if (!isOpen) return null;

  const primaryArch = BRAND_ARCHETYPES.find((a) => a.id === state.primaryArchetype);
  const secondaryArch = BRAND_ARCHETYPES.find((a) => a.id === state.secondaryArchetype);

  const handleDispatch = async () => {
    if (!clientEmail.trim()) {
      setError("Please enter your email address to receive a copy of the Brand Blueprint.");
      return;
    }

    setLoading(true);
    setError(null);
    setStatusMessage("Establishing secure link to Onawa Studio...");

    try {
      // Simulate connection delay for UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStatusMessage("Encrypting Brand DNA payload...");

      await new Promise((resolve) => setTimeout(resolve, 600));

      setStatusMessage("Dispatching to Clyde Strydom & your inbox...");

      const result: EmailResult = await sendBrandDiscoveryEmail(state, {
        strategistEmail: STRATEGIST_EMAIL,
        clientEmail: clientEmail.trim(),
        senderName: state.clientProfile?.fullName || state.brandName || "Brand Client",
        senderEmail: clientEmail.trim(),
        notes: "",
      });

      setLoading(false);

      if (result.success) {
        setSentTo(result.sentTo);
        setSuccess(true);
        setStatusMessage(result.message);
      } else {
        setError(result.message || "Failed to dispatch Brand Blueprint. Please try again.");
      }
    } catch (err: any) {
      console.error("Dispatch error:", err);
      setLoading(false);
      setError(err.message || "Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-graphite/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-graphite border-2 border-cream w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative">
        {/* Header */}
        <div className="p-6 bg-surface border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cream flex items-center justify-center text-carbon-black shadow-md shadow-cream/20">
              <Mail className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-headline font-bold text-cream">
                Dispatch Brand Blueprint
              </h2>
              <p className="text-xs text-cream/70">
                Send your complete strategy to Clyde Strydom & yourself
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-cream/60 hover:text-cream hover:bg-graphite rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
          {success ? (
            /* SUCCESS STATE */
            <div className="p-6 bg-brass/10 border border-brass rounded-2xl flex flex-col items-center text-center gap-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-brass/20 border border-brass flex items-center justify-center text-brass">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-headline font-bold text-cream">
                  Brand DNA Transmitted!
                </h3>
                <p className="text-sm text-brass leading-relaxed font-medium">
                  Your Brand DNA has been transmitted to Clyde Strydom. He will review your strategy and visual direction before your next session.
                </p>
              </div>

              {/* Sent to list */}
              <div className="w-full p-4 bg-surface/80 rounded-xl border border-white/5 mt-2">
                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex items-center justify-center gap-2 text-cream font-bold">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Dispatch completed to:</span>
                  </div>
                  {sentTo.map((email) => (
                    <div key={email} className="flex items-center justify-center gap-2 text-cream/70">
                      <CheckCircle2 className="w-3 h-3 text-brass" />
                      <span className="font-mono">{email}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-cream hover:bg-cream/90 text-carbon-black font-black text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* DISPATCH FORM */
            <div className="flex flex-col gap-5">
              {/* Brand Summary Preview */}
              <div className="p-4 bg-surface/90 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-cream uppercase tracking-widest mb-3">
                  <Sparkles className="w-4 h-4" />
                  <span>Blueprint Payload Preview</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-graphite rounded-xl border border-white/5">
                    <div className="flex items-center gap-1.5 text-brass mb-1">
                      <Heart className="w-3 h-3" />
                      <span className="font-bold">Brand Heart</span>
                    </div>
                    <p className="text-cream/60 line-clamp-2">
                      {state.brandHeart.purpose || "Not set"}
                    </p>
                  </div>

                  <div className="p-3 bg-graphite rounded-xl border border-white/5">
                    <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                      <Target className="w-3 h-3" />
                      <span className="font-bold">Golden Circle</span>
                    </div>
                    <p className="text-cream/60 line-clamp-2">
                      {state.goldenCircle.why || "Not set"}
                    </p>
                  </div>

                  <div className="p-3 bg-graphite rounded-xl border border-white/5">
                    <div className="flex items-center gap-1.5 text-purple-400 mb-1">
                      <Users className="w-3 h-3" />
                      <span className="font-bold">Archetype</span>
                    </div>
                    <p className="text-cream/60">
                      {primaryArch?.name || "Not selected"}
                    </p>
                  </div>

                  <div className="p-3 bg-graphite rounded-xl border border-white/5">
                    <div className="flex items-center gap-1.5 text-brass mb-1">
                      <Sparkles className="w-3 h-3" />
                      <span className="font-bold">UVP</span>
                    </div>
                    <p className="text-cream/60 line-clamp-2">
                      {state.uvp.offering || "Not set"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Client Email Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brass">
                  Your Email Address <span className="text-[#FF002B]">*</span>
                </label>
                <p className="text-[10px] text-cream/60">
                  A copy of the Brand Blueprint will be sent to this address
                </p>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/60" />
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-surface border border-white/10 rounded-xl text-xs text-cream focus:outline-none focus:border-brass"
                  />
                </div>
              </div>

              {/* Recipient Info */}
              <div className="p-4 bg-cream/10 rounded-2xl border border-cream/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-carbon-black">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-cream">Dispatching to:</p>
                    <p className="text-sm font-black text-cream">Clyde Strydom — Onawa Studio</p>
                    <p className="text-[11px] font-mono text-cream/60">{STRATEGIST_EMAIL}</p>
                    {clientEmail && (
                      <p className="text-[11px] font-mono text-brass mt-1">
                        + Copy to: {clientEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-rose-950/50 border border-rose-500/50 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Status Indicator */}
              {loading && (
                <div className="p-4 bg-surface rounded-2xl border border-brass/50 flex items-center gap-3 animate-pulse">
                  <Loader2 className="w-5 h-5 text-brass animate-spin" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-brass">
                      {statusMessage || "Establishing secure link to Onawa Studio..."}
                    </span>
                    <span className="text-[10px] text-cream/60">
                      Report dispatched.
                    </span>
                  </div>
                </div>
              )}

              {/* Dispatch Button */}
              <button
                type="button"
                onClick={handleDispatch}
                disabled={loading || !clientEmail.trim()}
                className="w-full py-4 bg-cream hover:bg-cream/90 disabled:bg-graphite/60 disabled:text-cream/30 text-carbon-black font-black text-sm uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-cream/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 stroke-[2.5]" />
                    <span>Complete Discovery & Dispatch to Clyde</span>
                  </>
                )}
              </button>

              {/* Subtle footer note */}
              <p className="text-[10px] text-center text-cream/40 font-mono">
                Includes Brand Heart, Golden Circle, Archetypes, Positioning Matrix, UVP & Mood Board link
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
