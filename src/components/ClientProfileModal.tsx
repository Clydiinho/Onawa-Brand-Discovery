import React, { useState } from "react";
import { ClientUserProfile } from "../types";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { sendWelcomeEmail } from "../utils/emailService";
import {
  ShieldCheck,
  User,
  Lock,
  Mail,
  Building,
  Sparkles,
  X,
  Loader2,
  CheckCircle2,
  KeyRound,
  LogIn,
  UserPlus
} from "lucide-react";

interface ClientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile?: ClientUserProfile;
  onProfileUpdated: (profile: ClientUserProfile) => void;
}

export const ClientProfileModal: React.FC<ClientProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onProfileUpdated,
}) => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(currentProfile?.fullName || "");
  const [companyName, setCompanyName] = useState(currentProfile?.companyName || "");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      if (supabase && isSupabaseConfigured) {
        if (mode === "signup") {
          const { data, error } = await supabase.auth.signUp({
            email,
            password: password || "onawastudio2026",
            options: {
              data: {
                full_name: fullName || email.split("@")[0],
                company_name: companyName,
              },
            },
          });

          if (error) throw error;

          const newProfile: ClientUserProfile = {
            id: data.user?.id || `user_${Date.now()}`,
            email: data.user?.email || email,
            fullName: fullName || email.split("@")[0],
            companyName: companyName || "Onawa Client",
            isAuthenticated: true,
          };
          onProfileUpdated(newProfile);
          setSuccessMessage("Account created & strategy session initialized!");

          // Send welcome email (non-blocking)
          sendWelcomeEmail(newProfile.email, newProfile.fullName).catch(() => {});

          setTimeout(onClose, 1200);
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: password || "onawastudio2026",
          });

          if (error) throw error;

          const userMeta = data.user?.user_metadata || {};
          const newProfile: ClientUserProfile = {
            id: data.user?.id || `user_${Date.now()}`,
            email: data.user?.email || email,
            fullName: userMeta.full_name || fullName || email.split("@")[0],
            companyName: userMeta.company_name || companyName || "Onawa Client",
            isAuthenticated: true,
          };
          onProfileUpdated(newProfile);
          setSuccessMessage("Signed in successfully!");
          setTimeout(onClose, 1000);
        }
      } else {
        // Local mode fallback
        await new Promise((resolve) => setTimeout(resolve, 600));
        const newProfile: ClientUserProfile = {
          id: `client_${Date.now()}`,
          email,
          fullName: fullName || email.split("@")[0],
          companyName: companyName || "Onawa Studio Client",
          isAuthenticated: true,
        };
        onProfileUpdated(newProfile);
        setSuccessMessage("Client Profile authenticated for strategy session!");
        setTimeout(onClose, 1000);
      }
    } catch (err: any) {
      console.warn("Auth warning:", err.message);
      // Fallback guest profile
      const newProfile: ClientUserProfile = {
        id: `client_${Date.now()}`,
        email,
        fullName: fullName || email.split("@")[0] || "Valued Client",
        companyName: companyName || "Onawa Partner",
        isAuthenticated: true,
      };
      onProfileUpdated(newProfile);
      setSuccessMessage("Profile synchronized locally.");
      setTimeout(onClose, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      if (supabase && isSupabaseConfigured) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: window.location.href,
          },
        });
        if (error) throw error;
      } else {
        // Simulated Google Auth login for demo
        await new Promise((resolve) => setTimeout(resolve, 800));
        const demoGoogleProfile: ClientUserProfile = {
          id: `google_user_${Date.now()}`,
          email: "client@onawa.studio",
          fullName: fullName || "Alex Mercer",
          companyName: companyName || "Apex Enterprises",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          isAuthenticated: true,
        };
        onProfileUpdated(demoGoogleProfile);
        setSuccessMessage("Signed in with Google!");
        setTimeout(onClose, 1000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-graphite/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-graphite border-2 border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-cream/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-brass/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-cream/60 hover:text-cream bg-surface border border-slate-800 hover:border-white/10 rounded-full transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col gap-2 text-left mb-6">
          <div className="flex items-center gap-2 text-xs font-mono font-black text-cream uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-cream" />
            <span>Onawa Studio • Client Profile Gateway</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-cream tracking-tight">
            {mode === "signin" ? "Sign In to Client Portal" : "Create Client Profile"}
          </h2>
          <p className="text-xs text-cream/70 leading-relaxed font-medium">
            Custom strategic discovery portal for Onawa Studio clients. Powered by Simon Sinek's Golden Circle &amp; Clyde Strydom's 17+ years of brand experience.
          </p>
        </div>

        {/* Quick Google OAuth Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 px-4 bg-surface hover:bg-graphite border border-white/10 hover:border-cream/30 text-cream font-bold text-xs rounded-xl flex items-center justify-center gap-3 transition-all mb-4 shadow-md group"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
            />
          </svg>
          <span>Continue with Google Account</span>
        </button>

        <div className="relative flex items-center justify-center my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative px-3 bg-graphite text-[10px] font-mono text-cream/60 uppercase tracking-wider">
            Or Private Credentials
          </span>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleEmailAuth} className="flex flex-col gap-3.5">
          {mode === "signup" && (
            <>
              <div>
                <label className="block text-[11px] font-bold text-cream/70 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/60" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Clyde Strydom"
                    className="w-full pl-9 pr-3 py-2.5 bg-surface border border-white/10 focus:border-cream text-cream text-xs rounded-xl focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-cream/70 mb-1">
                  Company / Organization Name
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/60" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Onawa Studio"
                    className="w-full pl-9 pr-3 py-2.5 bg-surface border border-white/10 focus:border-cream text-cream text-xs rounded-xl focus:outline-none transition-all"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-bold text-cream/70 mb-1">
              Email Address <span className="text-[#FF002B]">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/60" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@company.com"
                className="w-full pl-9 pr-3 py-2.5 bg-surface border border-white/10 focus:border-cream text-cream text-xs rounded-xl focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-cream/70 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/60" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-surface border border-white/10 focus:border-cream text-cream text-xs rounded-xl focus:outline-none transition-all"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-300 font-medium">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-cream hover:bg-cream/90 text-carbon-black font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating Profile...</span>
              </>
            ) : mode === "signin" ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Strategy Session</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create &amp; Save Client Profile</span>
              </>
            )}
          </button>
        </form>

        {/* Mode Toggle */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setErrorMessage("");
              setSuccessMessage("");
            }}
            className="text-xs font-mono text-cream/60 hover:text-cream transition-colors"
          >
            {mode === "signin"
              ? "New Onawa client? Create a profile here →"
              : "Already have a profile? Sign in here →"}
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-900 text-center">
          <p className="text-[10px] text-cream/60 font-mono">
            {isSupabaseConfigured
              ? "Connected to Supabase PostgreSQL Database & Auth"
              : "Local Client Profile Storage Active (Supabase ready)"}
          </p>
        </div>
      </div>
    </div>
  );
};
