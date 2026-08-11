import React, { useState } from "react";
import { BrandQuestionnaireState } from "../types";
import { sendBrandDiscoveryEmail } from "../utils/emailService";
import { EMAILJS_CONFIG } from "../config/emailConfig";
import { VoiceTextArea } from "./VoiceTextArea";
import {
  Mail,
  Send,
  X,
  CheckCircle2,
  AlertTriangle,
  Settings,
  Copy,
  Check,
  Loader2,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface SubmitToStrategistModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: BrandQuestionnaireState;
}

export const SubmitToStrategistModal: React.FC<SubmitToStrategistModalProps> = ({
  isOpen,
  onClose,
  state,
}) => {
  const [strategistEmail, setStrategistEmail] = useState("clyde@onawastudio.com");
  const [senderName, setSenderName] = useState(state.brandName || "Brand Founder");
  const [senderEmail, setSenderEmail] = useState("");
  const [notes, setNotes] = useState("");

  // EmailJS Credentials Overrides
  const [showConfig, setShowConfig] = useState(false);
  const [serviceId, setServiceId] = useState(EMAILJS_CONFIG.SERVICE_ID);
  const [templateId, setTemplateId] = useState(EMAILJS_CONFIG.TEMPLATE_ID);
  const [publicKey, setPublicKey] = useState(EMAILJS_CONFIG.PUBLIC_KEY);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copiedDigest, setCopiedDigest] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!strategistEmail.trim()) {
      setStatusMessage("Please provide a valid Strategist Email recipient.");
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    const result = await sendBrandDiscoveryEmail(state, {
      strategistEmail,
      senderName,
      senderEmail,
      notes,
      customServiceId: serviceId,
      customTemplateId: templateId,
      customPublicKey: publicKey,
    });

    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setStatusMessage(result.message);
    } else if (result.isFallback) {
      setStatusMessage(result.message);
    } else {
      setStatusMessage(result.message);
    }
  };

  const generateMailDigest = () => {
    return `
BRAND DISCOVERY SUBMISSION FOR STRATEGIST
-----------------------------------------
Brand Name: ${state.brandName || "Unnamed Brand"}
Industry: ${state.industry || "Not specified"}
Project Type: ${state.projectType === "rebrand" ? "Strategic Rebrand" : "New Brand Launch"}
Sender: ${senderName} (${senderEmail || "N/A"})

Notes for Strategist:
${notes || "None"}

=== 1. BRAND HEART ===
Purpose (Why): ${state.brandHeart.purpose}
Vision (Future): ${state.brandHeart.vision}
Mission (How): ${state.brandHeart.mission}
Core Values: ${state.brandHeart.values.join(", ")}

=== 2. GOLDEN CIRCLE ===
WHY (Core Belief): ${state.goldenCircle.why}
HOW (Unique Method): ${state.goldenCircle.how}
WHAT (Offerings): ${state.goldenCircle.what}

=== 3. ARCHETYPE & PERSONALITY ===
Primary Archetype: ${state.primaryArchetype}
Secondary Archetype: ${state.secondaryArchetype || "None"}
Personality Sliders:
- Traditional vs Progressive: ${state.personality.traditionalVsProgressive}%
- Corporate vs Disruptive: ${state.personality.corporateVsDisruptive}%
- Reserved vs Bold: ${state.personality.reservedVsBold}%
- Luxury vs Accessible: ${state.personality.exclusiveVsAccessible}%
- Playful vs Serious: ${state.personality.playfulVsSerious}%

=== 4. VISUAL & VERBAL ===
Logo Format Choice: ${state.logoType.toUpperCase()}
Unique Value Proposition:
"Our ${state.uvp.offering} is the only ${state.uvp.category} that ${state.uvp.benefit} for ${state.uvp.targetAudience}."
Embrace Keywords: ${state.keywords.love.join(", ")}
Avoid Keywords: ${state.keywords.hate.join(", ")}
`.trim();
  };

  const handleCopyDigest = () => {
    navigator.clipboard.writeText(generateMailDigest());
    setCopiedDigest(true);
    setTimeout(() => setCopiedDigest(false), 2500);
  };

  const handleMailTo = () => {
    const subject = encodeURIComponent(`Brand Discovery Submission: ${state.brandName || "New Brand"}`);
    const body = encodeURIComponent(generateMailDigest());
    window.location.href = `mailto:${strategistEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-950 border-2 border-[#C1FF00] w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C1FF00] flex items-center justify-center text-slate-950 shadow-md shadow-[#C1FF00]/20">
              <Mail className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                Submit Strategy to Strategist
              </h2>
              <p className="text-xs text-slate-300">
                Package Brand Heart, Archetypes, Logo choice & UVP for review
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
          {success ? (
            <div className="p-6 bg-[#00FFC2]/10 border border-[#00FFC2] rounded-2xl flex flex-col items-center text-center gap-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#00FFC2]/20 border border-[#00FFC2] flex items-center justify-center text-[#00FFC2]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-black text-white">
                  Submission Sent Successfully!
                </h3>
                <p className="text-xs text-[#00FFC2]">
                  Your complete brand discovery brief for <strong>{state.brandName || "your brand"}</strong> has been delivered to <strong>{strategistEmail}</strong>.
                </p>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#00FFC2] text-slate-950 font-black text-xs rounded-xl hover:bg-[#00FFC2]/90 transition-all shadow-lg shadow-[#00FFC2]/20"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSend} className="flex flex-col gap-4">
              {/* Strategist Recipient Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#C1FF00]">
                  Strategist / Lead Designer Email <span className="text-[#FF002B]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={strategistEmail}
                  onChange={(e) => setStrategistEmail(e.target.value)}
                  placeholder="e.g. lead@brandagency.com"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#C1FF00]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Sender Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-200">
                    Your Name / Founder Name
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Alex Vance"
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#C1FF00]"
                  />
                </div>

                {/* Sender Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-200">
                    Your Contact Email
                  </label>
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#C1FF00]"
                  />
                </div>
              </div>

              {/* Notes for Strategist */}
              <div className="flex flex-col gap-1.5">
                <VoiceTextArea
                  label="Additional Notes or Instructions for Strategist"
                  rows={2}
                  value={notes}
                  onValueChange={(val) => setNotes(val)}
                  placeholder="e.g. Please pay special attention to our target audience section and logo type preference..."
                />
              </div>

              {/* Status Message Banner */}
              {statusMessage && (
                <div className="p-3.5 bg-[#FF002B]/20 border border-[#FF002B] rounded-xl text-xs text-white flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-[#FF002B] mt-0.5" />
                  <div className="flex-1 leading-relaxed">{statusMessage}</div>
                </div>
              )}

              {/* Collapsible EmailJS Configuration Section */}
              <div className="border border-slate-800 rounded-2xl bg-slate-900/60 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowConfig(!showConfig)}
                  className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[#C1FF00]" />
                    <span>EmailJS Credentials Settings (SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY)</span>
                  </div>
                  {showConfig ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showConfig && (
                  <div className="p-4 border-t border-slate-800 flex flex-col gap-3 text-xs animate-fadeIn">
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Configure your standard EmailJS credentials below or directly in <code className="text-[#C1FF00] bg-slate-950 px-1 py-0.5 rounded">/src/config/emailConfig.ts</code>.
                    </p>

                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[10px] text-[#C1FF00]">SERVICE_ID</label>
                      <input
                        type="text"
                        value={serviceId}
                        onChange={(e) => setServiceId(e.target.value)}
                        placeholder="e.g. service_xyz123"
                        className="p-2 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[10px] text-[#C1FF00]">TEMPLATE_ID</label>
                      <input
                        type="text"
                        value={templateId}
                        onChange={(e) => setTemplateId(e.target.value)}
                        placeholder="e.g. template_abc456"
                        className="p-2 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[10px] text-[#C1FF00]">PUBLIC_KEY</label>
                      <input
                        type="text"
                        value={publicKey}
                        onChange={(e) => setPublicKey(e.target.value)}
                        placeholder="e.g. user_789012345"
                        className="p-2 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleCopyDigest}
                    className="flex-1 sm:flex-none px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all border border-slate-700"
                  >
                    {copiedDigest ? <Check className="w-3.5 h-3.5 text-[#00FFC2]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDigest ? "Copied" : "Copy Digest"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleMailTo}
                    className="flex-1 sm:flex-none px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all border border-slate-700"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Mail Client</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#C1FF00] hover:bg-[#a8df00] text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#C1FF00]/20 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Send to Strategist</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
