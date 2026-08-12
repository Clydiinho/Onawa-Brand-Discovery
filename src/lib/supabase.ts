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

      if (totalCompleted >= 11) {
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

      if (totalCompleted >= 11) {
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
 * Return a list of human-readable field names that are still incomplete
 * for a given step. Empty result = step is complete.
 */
export function getStepIncompleteFields(
  step: number,
  state: BrandQuestionnaireState
): string[] {
  const missing: string[] = [];

  switch (step) {
    case 1:
      if (!state.brandName.trim()) missing.push("Brand Name");
      if (!state.industry.trim()) missing.push("Industry / Primary Domain");
      if (!state.targetAudienceOverview.trim()) missing.push("Target Audience Overview");
      break;
    case 2:
      if (!state.goldenCircle.why.trim()) missing.push("WHY (Core Purpose)");
      if (!state.goldenCircle.how.trim()) missing.push("HOW (Process)");
      if (!state.goldenCircle.what.trim()) missing.push("WHAT (Offerings)");
      break;
    case 3:
      if (!state.brandHeart.purpose.trim()) missing.push("Purpose");
      if (!state.brandHeart.vision.trim()) missing.push("Vision");
      if (!state.brandHeart.mission.trim()) missing.push("Mission");
      if (!state.brandHeart.values.length) missing.push("Core Values");
      break;
    case 4:
      if (!state.strategicEnemy.trim()) missing.push("Strategic Enemy");
      if (!state.positioningMatrix.quadrant.trim()) missing.push("Positioning Matrix placement");
      break;
    case 5:
      if (!state.primaryArchetype) missing.push("Primary Archetype");
      break;
    case 6:
      {
        const p = state.personality;
        const engaged = [p.traditionalVsProgressive, p.corporateVsDisruptive, p.reservedVsBold, p.exclusiveVsAccessible, p.playfulVsSerious].some(v => v !== 50);
        if (!engaged) missing.push("Personality Spectrum sliders");
      }
      break;
    case 7:
      if (state.keywords.love.length === 0 && state.keywords.hate.length === 0) {
        missing.push("Embrace or Avoid keywords");
      }
      break;
    case 8:
      if (!state.logoType) missing.push("Logo Mark Style");
      break;
    case 9:
      {
        const assignments = Object.values(state.experienceRoadmap.phaseAssignments);
        const hasAny = assignments.some((arr) => arr.length > 0);
        if (!hasAny) missing.push("Experience touchpoint selections");
      }
      break;
    case 10:
      if (!state.moodBoard.elements.length) missing.push("Mood Board elements");
      break;
    case 11:
      if (!state.uvp.offering.trim()) missing.push("Offering");
      if (!state.uvp.category.trim()) missing.push("Category");
      if (!state.uvp.benefit.trim()) missing.push("Key Benefit");
      if (!state.uvp.targetAudience.trim()) missing.push("Target Audience");
      break;
    default:
      break;
  }

  return missing;
}

/**
 * Calculate which steps are completed based on the state data
 */
export function calculateCompletedSteps(state: BrandQuestionnaireState): number[] {
  const completed: number[] = [];
  const totalSteps = 12;

  for (let step = 1; step <= totalSteps; step++) {
    // Step 12 (Strategy Report) counts once all previous stages are complete
    if (step === 12) {
      // The report itself is considered complete when the user has reached it
      // (it simply aggregates the previous 11 stages).
      continue;
    }
    if (getStepIncompleteFields(step, state).length === 0) {
      completed.push(step);
    }
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

/**
 * Delete all user data from discovery_responses and sign out
 * Note: This does NOT delete the Supabase Auth account itself.
 * To fully delete the auth account, use the Supabase Dashboard or Admin API.
 */
export async function deleteAccount(
  userId: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Delete user data from discovery_responses
    if (supabase && isSupabaseConfigured) {
      const { error } = await supabase
        .from("discovery_responses")
        .delete()
        .eq("user_id", userId);

      if (error) {
        console.warn("Failed to delete discovery data:", error.message);
      }
    }

    // Clear per-user localStorage
    localStorage.removeItem(`onawa_strategy_session_${userId}`);

    // Sign out from Supabase Auth
    if (supabase) {
      await supabase.auth.signOut();
    }

    return { success: true, message: "Account data deleted and session terminated." };
  } catch (err: any) {
    console.error("Delete account error:", err);
    return { success: false, message: err.message || "Failed to delete account." };
  }
}
