export type ProjectType = "new_brand" | "rebrand";

export interface GoldenCircleData {
  why: string; // Purpose / Core belief
  how: string; // Process / Unique methodology
  what: string; // Products / Services / Offerings
}

export interface BrandHeartData {
  purpose: string; // Why we exist beyond money
  vision: string; // The future we want to help create
  mission: string; // What we do every day to achieve our vision
  values: string[]; // Core principles (e.g., Integrity, Radical Candor, Innovation)
}

export interface PersonalitySpectrumData {
  traditionalVsProgressive: number; // 0 = Traditional, 100 = Progressive
  corporateVsDisruptive: number; // 0 = Corporate, 100 = Disruptive
  reservedVsBold: number; // 0 = Low-key/Reserved, 100 = Bold/Expressive
  exclusiveVsAccessible: number; // 0 = Exclusive/Luxury, 100 = Accessible/Inclusive
  playfulVsSerious: number; // 0 = Playful/Witty, 100 = Serious/Authoritative
}

export interface LoveHateKeywords {
  love: string[]; // Traits to embrace ("That's us")
  hate: string[]; // Traits to avoid ("Definitely not us")
}

export interface LogoTypeOption {
  id: "logomark" | "logotype" | "combination" | "emblem";
  title: string;
  subtitle: string;
  description: string;
  bestFor: string;
  examples: string;
}

export interface UVPData {
  offering: string; // e.g., "AI-powered CRM"
  category: string; // e.g., "sales automation software"
  benefit: string; // e.g., "eliminates 80% of administrative overhead"
  targetAudience: string; // e.g., "mid-market B2B teams"
}

export interface ArchetypeInfo {
  id: string;
  name: string;
  motto: string;
  traitSummary: string;
  traits: string[];
  fear: string;
  vibeColor: string;
  badgeBg: string;
  examples: string[];
  iconName: string;
}

export interface AIAnalysisResult {
  brandManifesto: string;
  refinedUVP: string;
  taglineOptions: Array<{ tagline: string; angle: string }>;
  brandVoiceGuidelines: string[];
  strategicSummary: string;
}

export interface BrandQuestionnaireState {
  // Step 1: Foundation & Context
  brandName: string;
  industry: string;
  projectType: ProjectType;
  rebrandReason?: string;
  newBrandGoal?: string;
  targetAudienceOverview: string;

  // Step 2: Simon Sinek's Golden Circle
  goldenCircle: GoldenCircleData;

  // Step 3: Column Five's Brand Heart
  brandHeart: BrandHeartData;

  // Step 4: Willow Marketing's 12 Archetypes
  primaryArchetype: string;
  secondaryArchetype: string;

  // Step 5: Personality Spectrum
  personality: PersonalitySpectrumData;

  // Step 6: Fernando Ifrán's Love/Hate Matrix
  keywords: LoveHateKeywords;

  // Step 7: Logo Anatomy
  logoType: "logomark" | "logotype" | "combination" | "emblem";

  // Step 8: Dynamic UVP Builder
  uvp: UVPData;

  // AI Generated Output (Optional)
  aiAnalysis?: AIAnalysisResult;

  // Meta
  currentStep: number;
}
