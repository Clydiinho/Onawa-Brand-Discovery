import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { BrandQuestionnaireState } from "../types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Determine the completion status of a discovery session
 */
export type DiscoveryStatus = "new" | "in_progress" | "completed";

export interface DiscoveryStatusResult {
  status: DiscoveryStatus;
  lastCompletedStep: number;
  totalFieldsCompleted: number;
  totalFieldsRequired: number;
}

/**
 * Check the user's discovery status and return the appropriate step to resume from
 */
export async function getDiscoveryStatus(
  userId: string
): Promise<DiscoveryStatusResult> {
  const defaultResult: DiscoveryStatusResult = {
    status: "new",
    lastCompletedStep: 1,
    totalFieldsCompleted: 0,
    totalFieldsRequired: 12,
  };

  try {
    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("discovery_responses")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error || !data) {
        return defaultResult;
      }

      const sessionData = data.session_data as BrandQuestionnaireState;
      
      // Check completion status
      const completedSteps = calculateCompletedSteps(sessionData);
      const totalCompleted = completedSteps.length;
      
      if (totalCompleted === 0) {
        return defaultResult;
      }

      if (totalCompleted >= 12) {
        return {
          status: "completed",
          lastCompletedStep: 12,
          totalFieldsCompleted: totalCompleted,
          totalFieldsRequired: 12,
        };
      }

      // Find the last completed step to resume from
      const lastCompleted = Math.max(...completedSteps);
      const nextStep = Math.min(lastCompleted + 1, 12);

      return {
        status: "in_progress",
        lastCompletedStep: nextStep,
        totalFieldsCompleted: totalCompleted,
        totalFieldsRequired: 12,
      };
    }

    // Check localStorage fallback
    const cached = localStorage.getItem(`onawa_strategy_session_${userId}`);
    if (cached) {
      const sessionData = JSON.parse(cached) as BrandQuestionnaireState;
      const completedSteps = calculateCompletedSteps(sessionData);
      const totalCompleted = completedSteps.length;

      if (totalCompleted === 0) {
        return defaultResult;
      }

      if (totalCompleted >= 12) {
        return {
          status: "completed",
          lastCompletedStep: 12,
          totalFieldsCompleted: totalCompleted,
          totalFieldsRequired: 12,
        };
      }

      const lastCompleted = Math.max(...completedSteps);
      return {
        status: "in_progress",
        lastCompletedStep: Math.min(lastCompleted + 1, 12),
        totalFieldsCompleted: totalCompleted,
        totalFieldsRequired: 12,
      };
    }

    return defaultResult;
  } catch (err) {
    console.warn("Failed to get discovery status:", err);
    return defaultResult;
  }
}

/**
 * Calculate which steps are completed based on the state data
 */
function calculateCompletedSteps(state: BrandQuestionnaireState): number[] {
  const completed: number[] = [];

  // Step 1: Brand Context
  if (state.brandName && state.industry && state.targetAudienceOverview) {
    completed.push(1);
  }

  // Step 2: Golden Circle
  if (state.goldenCircle.why && state.goldenCircle.how && state.goldenCircle.what) {
    completed.push(2);
  }

  // Step 3: Brand Heart
  if (state.brandHeart.purpose && state.brandHeart.vision && state.brandHeart.mission && state.brandHeart.values.length > 0) {
    completed.push(3);
  }

  // Step 4: Strategic Villain & Matrix
  if (state.strategicEnemy && state.positioningMatrix) {
    completed.push(4);
  }

  // Step 5: Archetypes
  if (state.primaryArchetype) {
    completed.push(5);
  }

  // Step 6: Personality Spectrum
  if (state.personality) {
    completed.push(6);
  }

  // Step 7: Love/Hate Matrix
  if (state.keywords.love.length > 0 || state.keywords.hate.length > 0) {
    completed.push(7);
  }

  // Step 8: Logo Anatomy
  if (state.logoType) {
    completed.push(8);
  }

  // Step 9: Experience Roadmap
  if (state.experienceRoadmap) {
    completed.push(9);
  }

  // Step 10: Mood Board
  if (state.moodBoard && state.moodBoard.elements.length > 0) {
    completed.push(10);
  }

  // Step 11: UVP
  if (state.uvp.offering && state.uvp.category && state.uvp.benefit && state.uvp.targetAudience) {
    completed.push(11);
  }

  // Step 12: Strategy Report (consider completed if we reach this point)
  if (state.aiAnalysis) {
    completed.push(12);
  }

  return completed;
}

/**
 * Save strategy session state to Supabase or LocalStorage fallback
 */
export async function saveStrategySession(
  userId: string,
  state: Partial<BrandQuestionnaireState>
): Promise<{ success: boolean; message?: string }> {
  try {
    if (supabase && isSupabaseConfigured) {
      const { error } = await supabase.from("discovery_responses").upsert({
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
        .from("discovery_responses")
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
