import React, { useState, useEffect } from "react";
import { BrandQuestionnaireState } from "../types";
import { sendBrandDiscoveryEmail } from "../utils/emailService";
import { sendBlueprintViaGmail } from "../utils/gmailService";
import { createBrandStyleGuideDoc } from "../utils/docsService";
import { initAuth, googleSignIn, logoutUser } from "../utils/authService";
import { EMAILJS_CONFIG } from "../config/emailConfig";
import { VoiceTextArea } from "./VoiceTextArea";
import { User } from "firebase/auth";
import {
  Mail,
  Send,
  X,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Loader2,
  ShieldCheck,
  LogOut,
  ChevronDown,
  ChevronUp,
  Settings,
  FileText,
  ExternalLink
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
  const [activeTab, setActiveTab] = useState<"gmail" | "emailjs">("gmail");

  // Email Recipient & Sender Fields
  const [strategistEmail, setStrategistEmail] = useState("clyde@onawastudio.com");
  const [clientEmail, setClientEmail] = useState("");
  const [senderName, setSenderName] = useState(state.brandName || "Brand Client");
  const [notes, setNotes] = useState("");

  // Google OAuth / Gmail State
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Confirmation Dialog Modal State for Gmail API
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // EmailJS Fallback Settings
  const [showConfig, setShowConfig] = useState(false);
  const [serviceId, setServiceId] = useState(EMAILJS_CONFIG.SERVICE_ID);
  const [templateId, setTemplateId] = useState(EMAILJS_CONFIG.TEMPLATE_ID);
  const [publicKey, setPublicKey] = useState(EMAILJS_CONFIG.PUBLIC_KEY);

  // Google Doc State
  const [createdDocUrl, setCreatedDocUrl] = useState<string | null>(null);
  const [isCreatingDocOnly, setIsCreatingDocOnly] = useState(false);

  // Status
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copiedDigest, setCopiedDigest] = useState(false);

  // Auth Listener
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
        if (currentUser.email && !clientEmail) {
          setClientEmail(currentUser.email);
        }
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );

    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        if (res.user.email) {
          setClientEmail(res.user.email);
        }
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setAuthError(err.message || "Failed to authenticate with Google.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await logoutUser();
    setUser(null);
    setAccessToken(null);
  };

  const handleTriggerGmailSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      setStatusMessage("Please sign in with Google first to send via Gmail.");
      return;
    }
    if (!strategistEmail.trim() || !clientEmail.trim()) {
      setStatusMessage("Please specify both Clyde/Strategist email and your client email.");
      return;
    }
    // Open mandatory confirmation dialog
    setShowConfirmModal(true);
  };

  const executeGmailSend = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    setStatusMessage("1/2 Creating custom Google Doc Brand Style Guide...");

    let docUrl: string | undefined = createdDocUrl || undefined;

    try {
      // 1. Create Google Doc Style Guide via Google Docs API
      if (accessToken && !docUrl) {
        const docResult = await createBrandStyleGuideDoc(state, accessToken, senderName);
        if (docResult.success && docResult.documentUrl) {
          docUrl = docResult.documentUrl;
          setCreatedDocUrl(docUrl);
        }
      }

      setStatusMessage("2/2 Dispatching Brand Blueprint & Google Doc link via Gmail...");

      // 2. Dispatch via Gmail API
      const res = await sendBlueprintViaGmail(state, {
        clientEmail,
        strategistEmail,
        accessToken: accessToken!,
        senderName,
        notes,
        docUrl,
      });

      setLoading(false);
      if (res.success) {
        setSuccess(true);
        setStatusMessage(
          docUrl
            ? `${res.message} Custom Google Doc Style Guide was automatically created and attached!`
            : res.message
        );
      } else {
        setStatusMessage(res.message);
      }
    } catch (err: any) {
      setLoading(false);
      setStatusMessage(err.message || "Unexpected error dispatching email via Gmail.");
    }
  };

  const handleCreateDocOnly = async () => {
    if (!accessToken) {
      setStatusMessage("Please sign in with Google first to create a Google Doc.");
      return;
    }

    setIsCreatingDocOnly(true);
    setStatusMessage("Creating Google Doc Brand Style Guide...");

    try {
      const res = await createBrandStyleGuideDoc(state, accessToken, senderName);
      if (res.success && res.documentUrl) {
        setCreatedDocUrl(res.documentUrl);
        setStatusMessage(`Google Doc created! Click below to open your Style Guide.`);
      } else {
        setStatusMessage(res.message || "Failed to create Google Doc.");
      }
    } catch (err: any) {
      setStatusMessage(err.message || "Error creating Google Doc.");
    } finally {
      setIsCreatingDocOnly(false);
    }
  };

  const handleSendEmailJS = async (e: React.FormEvent) => {
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
      senderEmail: clientEmail,
      notes,
      customServiceId: serviceId,
      customTemplateId: templateId,
      customPublicKey: publicKey,
    });

    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setStatusMessage(result.message);
    } else {
      setStatusMessage(result.message);
    }
  };

  const generateMailDigest = () => {
    return `
BRAND DISCOVERY SUBMISSION FOR STRATEGIST & CLIENT
--------------------------------------------------
Brand Name: ${state.brandName || "Unnamed Brand"}
Industry: ${state.industry || "Not specified"}
Project Type: ${state.projectType === "rebrand" ? "Strategic Rebrand" : "New Brand Launch"}
Sender: ${senderName} (${clientEmail || "N/A"})
Strategist: Clyde Strydom (${strategistEmail})

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

=== 4. VISUAL & VERBAL ===
Logo Format Choice: ${state.logoType.toUpperCase()}
UVP Statement: "Our ${state.uvp.offering} is the only ${state.uvp.category} that ${state.uvp.benefit} for ${state.uvp.targetAudience}."
`.trim();
  };

  const handleCopyDigest = () => {
    navigator.clipboard.writeText(generateMailDigest());
    setCopiedDigest(true);
    setTimeout(() => setCopiedDigest(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-950 border-2 border-[#C1FF00] w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative">
        {/* Header */}
        <div className="p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C1FF00] flex items-center justify-center text-slate-950 shadow-md shadow-[#C1FF00]/20">
              <Mail className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                Dispatch Brand Blueprint Summary
              </h2>
              <p className="text-xs text-slate-300">
                Email complete strategy brief to Clyde Strydom &amp; Client
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

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-6 pt-3">
          <button
            type="button"
            onClick={() => {
              setActiveTab("gmail");
              setStatusMessage(null);
            }}
            className={`px-4 py-2.5 font-mono text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 border-t border-x ${
              activeTab === "gmail"
                ? "bg-slate-900 text-[#C1FF00] border-[#C1FF00] border-b-transparent"
                : "bg-transparent text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#00FFC2]" />
            <span>Gmail API Integration</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("emailjs");
              setStatusMessage(null);
            }}
            className={`px-4 py-2.5 font-mono text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 border-t border-x ${
              activeTab === "emailjs"
                ? "bg-slate-900 text-[#C1FF00] border-[#C1FF00] border-b-transparent"
                : "bg-transparent text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Standard Email Service</span>
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
                  Blueprint & Style Guide Delivered!
                </h3>
                <p className="text-xs text-[#00FFC2] leading-relaxed">
                  {statusMessage ||
                    `The complete Onawa Studio Brand Blueprint for "${
                      state.brandName || "your brand"
                    }" has been emailed to both Clyde Strydom (${strategistEmail}) and client (${clientEmail}).`}
                </p>
              </div>

              {createdDocUrl && (
                <a
                  href={createdDocUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#C1FF00] hover:bg-[#a8df00] text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#C1FF00]/20"
                >
                  <FileText className="w-4 h-4 stroke-[2.5]" />
                  <span>Open Custom Google Doc Brand Style Guide</span>
                </a>
              )}

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold text-xs rounded-xl transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          ) : activeTab === "gmail" ? (
            <form onSubmit={handleTriggerGmailSend} className="flex flex-col gap-4">
              {/* Google Auth Status Banner */}
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                {user && accessToken ? (
                  <div className="flex items-center gap-3">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Google avatar"
                        className="w-9 h-9 rounded-full border border-[#00FFC2]"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#00FFC2]/20 border border-[#00FFC2] flex items-center justify-center font-bold text-[#00FFC2] text-xs">
                        G
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">
                        Authenticated as {user.displayName || "Google User"}
                      </span>
                      <span className="text-[11px] font-mono text-[#00FFC2]">
                        {user.email}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">
                      Sign in with Google to send via Gmail
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Authorizes sending the Brand Blueprint summary directly from Gmail
                    </span>
                  </div>
                )}

                {user && accessToken ? (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono flex items-center gap-1 shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isAuthLoading}
                    className="gsi-material-button shrink-0"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#131314",
                      color: "#e3e3e3",
                      border: "1px solid #8e918f",
                      borderRadius: "12px",
                      padding: "8px 16px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "13px",
                    }}
                  >
                    <div className="gsi-material-button-content-wrapper" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {isAuthLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#C1FF00]" />
                      ) : (
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: "block", width: "18px", height: "18px" }}>
                          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        </svg>
                      )}
                      <span>{isAuthLoading ? "Signing in..." : "Sign in with Google"}</span>
                    </div>
                  </button>
                )}
              </div>

              {authError && (
                <div className="p-3 bg-rose-950/50 border border-rose-500/50 rounded-xl text-xs text-rose-300">
                  {authError}
                </div>
              )}

              {/* Email Addresses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#C1FF00]">
                    1. Clyde Strydom (Strategist Email) <span className="text-[#FF002B]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={strategistEmail}
                    onChange={(e) => setStrategistEmail(e.target.value)}
                    placeholder="clyde@onawastudio.com"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#C1FF00]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#00FFC2]">
                    2. Client Email Recipient <span className="text-[#FF002B]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="client@company.com"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#00FFC2]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-200">
                  Client / Brand Founder Name
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. Alex Vance"
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#C1FF00]"
                />
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-1.5">
                <VoiceTextArea
                  label="Additional Notes or Instructions for Clyde Strydom"
                  rows={2}
                  value={notes}
                  onValueChange={(val) => setNotes(val)}
                  placeholder="e.g. Please review our Golden Circle 'Why' and primary archetype positioning..."
                />
              </div>

              {/* Status Message */}
              {statusMessage && (
                <div className="p-3 bg-amber-950/40 border border-amber-500/50 rounded-xl text-xs text-amber-200">
                  {statusMessage}
                </div>
              )}

              {/* Submit Button & Standalone Google Doc Actions */}
              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  type="submit"
                  disabled={loading || !accessToken}
                  className="w-full py-3.5 bg-[#C1FF00] hover:bg-[#a8df00] disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#C1FF00]/10"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Google Doc &amp; Sending via Gmail...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 stroke-[2.5]" />
                      <span>Create Google Doc &amp; Email Brief to Clyde &amp; Client</span>
                    </>
                  )}
                </button>

                {accessToken && (
                  <div className="flex gap-2">
                    {createdDocUrl ? (
                      <a
                        href={createdDocUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 bg-[#00FFC2]/15 border border-[#00FFC2] hover:bg-[#00FFC2]/25 text-[#00FFC2] font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Open Created Google Doc</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={handleCreateDocOnly}
                        disabled={isCreatingDocOnly}
                        className="flex-1 py-2.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all"
                      >
                        {isCreatingDocOnly ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C1FF00]" />
                        ) : (
                          <FileText className="w-3.5 h-3.5 text-[#C1FF00]" />
                        )}
                        <span>{isCreatingDocOnly ? "Generating Doc..." : "Create Google Doc Only"}</span>
                      </button>
                    )}
                  </div>
                )}

                {!accessToken && (
                  <p className="text-[11px] text-center text-slate-400">
                    Sign in with Google above to enable Google Docs creation &amp; Gmail delivery.
                  </p>
                )}
              </div>
            </form>
          ) : (
            <form onSubmit={handleSendEmailJS} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#C1FF00]">
                  Strategist Email <span className="text-[#FF002B]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={strategistEmail}
                  onChange={(e) => setStrategistEmail(e.target.value)}
                  placeholder="clyde@onawastudio.com"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#C1FF00]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-200">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Alex Vance"
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#C1FF00]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-200">
                    Your Contact Email
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#C1FF00]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <VoiceTextArea
                  label="Notes for Strategist"
                  rows={2}
                  value={notes}
                  onValueChange={(val) => setNotes(val)}
                  placeholder="e.g. Special instructions or priority focus items..."
                />
              </div>

              {/* Optional EmailJS credentials toggle */}
              <div className="border-t border-slate-800 pt-3 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfig(!showConfig)}
                  className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5" />
                    <span>EmailJS Custom Credentials (Optional)</span>
                  </span>
                  {showConfig ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showConfig && (
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={serviceId}
                      onChange={(e) => setServiceId(e.target.value)}
                      placeholder="SERVICE_ID"
                      className="p-2 bg-slate-950 border border-slate-700 rounded-lg text-[11px] text-white"
                    />
                    <input
                      type="text"
                      value={templateId}
                      onChange={(e) => setTemplateId(e.target.value)}
                      placeholder="TEMPLATE_ID"
                      className="p-2 bg-slate-950 border border-slate-700 rounded-lg text-[11px] text-white"
                    />
                    <input
                      type="text"
                      value={publicKey}
                      onChange={(e) => setPublicKey(e.target.value)}
                      placeholder="PUBLIC_KEY"
                      className="p-2 bg-slate-950 border border-slate-700 rounded-lg text-[11px] text-white"
                    />
                  </div>
                )}
              </div>

              {statusMessage && (
                <div className="p-3 bg-amber-950/40 border border-amber-500/50 rounded-xl text-xs text-amber-200">
                  {statusMessage}
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-[#C1FF00] hover:bg-[#a8df00] text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Send via EmailJS</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyDigest}
                  className="px-4 py-3 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2"
                >
                  {copiedDigest ? <Check className="w-4 h-4 text-[#00FFC2]" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedDigest ? "Copied" : "Copy Brief"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* MANDATORY USER CONFIRMATION DIALOG FOR GMAIL DISPATCH */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border-2 border-[#00FFC2] w-full max-w-md rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#00FFC2]/20 border border-[#00FFC2] rounded-xl text-[#00FFC2]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  Confirm Gmail Delivery
                </h3>
                <p className="text-xs text-slate-300">
                  Workspace User Confirmation
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">
              Are you sure you want to send <strong>The Onawa Studio Brand Blueprint</strong> via Gmail to:
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-1 text-xs font-mono">
              <div className="text-[#C1FF00]">1. Clyde Strydom: {strategistEmail}</div>
              <div className="text-[#00FFC2]">2. Client Email: {clientEmail}</div>
              <div className="text-slate-400 text-[11px] mt-1">Sender Account: {user?.email}</div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeGmailSend}
                className="px-5 py-2 bg-[#00FFC2] hover:bg-[#00FFC2]/90 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Confirm &amp; Send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
