import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { BrandQuestionnaireState } from "../types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Save strategy session state to Supabase or LocalStorage fallback
 */
export async function saveStrategySession(
  userId: string,
  state: Partial<BrandQuestionnaireState>
): Promise<{ success: boolean; message?: string }> {
  try {
    if (supabase && isSupabaseConfigured) {
      const { error } = await supabase.from("brand_discovery_sessions").upsert({
        user_id: userId,
        brand_name: state.brandName || "Untitled Brand",
        session_data: state,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

      if (error) {
        console.warn("Supabase upsert error, falling back to local storage:", error.message);
        localStorage.setItem(`onawa_strategy_session_${userId}`, JSON.stringify(state));
        return { success: true, message: "Saved locally (Supabase table pending)" };
      }
      return { success: true, message: "Strategy session synced to Supabase" };
    } else {
      localStorage.setItem(`onawa_strategy_session_${userId}`, JSON.stringify(state));
      return { success: true, message: "Strategy session saved locally" };
    }
  } catch (err: any) {
    console.error("Save session failed:", err);
    localStorage.setItem(`onawa_strategy_session_${userId}`, JSON.stringify(state));
    return { success: true, message: "Saved to local cache" };
  }
}

/**
 * Load strategy session state
 */
export async function loadStrategySession(
  userId: string
): Promise<Partial<BrandQuestionnaireState> | null> {
  try {
    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("brand_discovery_sessions")
        .select("session_data")
        .eq("user_id", userId)
        .single();

      if (!error && data?.session_data) {
        return data.session_data;
      }
    }
    const cached = localStorage.getItem(`onawa_strategy_session_${userId}`);
    if (cached) {
      return JSON.parse(cached);
    }
    return null;
  } catch (err) {
    console.warn("Failed to load session:", err);
    return null;
  }
}
