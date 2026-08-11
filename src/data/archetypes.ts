import { ArchetypeInfo } from "../types";

export const BRAND_ARCHETYPES: ArchetypeInfo[] = [
  {
    id: "hero",
    name: "Hero",
    motto: "Where there’s a will, there’s a way.",
    traitSummary: "Fearless, disciplined, brave & competitive",
    traits: ["Courageous", "Disciplined", "Goal-Oriented", "Resilient"],
    fear: "Weakness, failure, or vulnerability",
    vibeColor: "from-amber-500 to-red-600",
    badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    examples: ["Nike", "BMW", "FedEx", "Gatorade"],
    iconName: "ShieldAlert"
  },
  {
    id: "magician",
    name: "Magician",
    motto: "Anything can happen!",
    traitSummary: "Visionary, catalyst, transformational & inventive",
    traits: ["Transformational", "Visionary", "Charismatic", "Intuitive"],
    fear: "Unintended negative consequences or stagnant reality",
    vibeColor: "from-purple-500 to-indigo-600",
    badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    examples: ["Disney", "Dyson", "TED", "Mastercard"],
    iconName: "Wand2"
  },
  {
    id: "sage",
    name: "Sage",
    motto: "The truth will set you free.",
    traitSummary: "Expert, scholar, analytical & truthful",
    traits: ["Knowledgeable", "Analytical", "Objective", "Thoughtful"],
    fear: "Being duped, misled, or ignorant",
    vibeColor: "from-blue-500 to-cyan-600",
    badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    examples: ["Google", "BBC", "Harvard", "The Economist"],
    iconName: "BookOpen"
  },
  {
    id: "creator",
    name: "Creator",
    motto: "If it can be imagined, it can be created.",
    traitSummary: "Innovative, non-linear, imaginative & expressive",
    traits: ["Inventive", "Aesthetic", "Original", "Non-linear"],
    fear: "Mediocrity, duplication, or lack of vision",
    vibeColor: "from-pink-500 to-rose-600",
    badgeBg: "bg-pink-500/10 text-pink-400 border-pink-500/30",
    examples: ["Apple", "Lego", "Adobe", "Pinterest"],
    iconName: "Palette"
  },
  {
    id: "innocent",
    name: "Innocent",
    motto: "Free to be you and me.",
    traitSummary: "Pure, optimistic, honest & wholesome",
    traits: ["Optimistic", "Authentic", "Trustworthy", "Wholesome"],
    fear: "Doing something wrong or being punished",
    vibeColor: "from-emerald-400 to-teal-500",
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    examples: ["Dove", "Innocent Drinks", "Burt's Bees", "Avem"],
    iconName: "Sparkles"
  },
  {
    id: "explorer",
    name: "Explorer",
    motto: "Don't fence me in.",
    traitSummary: "Adventurous, authentic, independent & pioneering",
    traits: ["Independent", "Pioneering", "Autotelic", "Curious"],
    fear: "Entrapment, conformity, or emptiness",
    vibeColor: "from-amber-600 to-yellow-500",
    badgeBg: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    examples: ["Patagonia", "Jeep", "The North Face", "REI"],
    iconName: "Compass"
  },
  {
    id: "rebel",
    name: "Rebel (Outlaw)",
    motto: "Rules are made to be broken.",
    traitSummary: "Disruptive, unconventional, radical & liberating",
    traits: ["Iconoclastic", "Radical", "Bold", "Unapologetic"],
    fear: "Powerlessness or conforming to status quo",
    vibeColor: "from-red-600 to-rose-700",
    badgeBg: "bg-red-500/10 text-red-400 border-red-500/30",
    examples: ["Harley-Davidson", "Virgin", "Red Bull", "Diesel"],
    iconName: "Flame"
  },
  {
    id: "jester",
    name: "Jester",
    motto: "You only live once.",
    traitSummary: "Playful, humorous, irreverent & joyous",
    traits: ["Humorous", "Playful", "Spontaneous", "Irreverent"],
    fear: "Boredom or being dull and serious",
    vibeColor: "from-orange-500 to-amber-500",
    badgeBg: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    examples: ["Ben & Jerry's", "Mailchimp", "Dollar Shave Club", "Skittles"],
    iconName: "Smile"
  },
  {
    id: "everyman",
    name: "Everyman",
    motto: "All men and women are created equal.",
    traitSummary: "Down-to-earth, relatable, empathetic & dependable",
    traits: ["Relatable", "Empathetic", "Unpretentious", "Grounded"],
    fear: "Standing out too much or being rejected",
    vibeColor: "from-teal-500 to-cyan-600",
    badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    examples: ["IKEA", "Target", "Levi's", "Ford"],
    iconName: "Users"
  },
  {
    id: "lover",
    name: "Lover",
    motto: "You're the only one.",
    traitSummary: "Passionate, sensory, intimate & elegant",
    traits: ["Sensory", "Passionate", "Intimate", "Refined"],
    fear: "Being unwanted, unloved, or unappreciated",
    vibeColor: "from-rose-500 to-red-500",
    badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    examples: ["Chanel", "Godiva", "Alfa Romeo", "Haagen-Dazs"],
    iconName: "Heart"
  },
  {
    id: "caregiver",
    name: "Caregiver",
    motto: "Love your neighbor as yourself.",
    traitSummary: "Compassionate, nurturing, selfless & protective",
    traits: ["Nurturing", "Generous", "Protective", "Supportive"],
    fear: "Ingratitude, helplessness, or selfishness",
    vibeColor: "from-sky-400 to-indigo-500",
    badgeBg: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    examples: ["UNICEF", "Volvo", "Johnson & Johnson", "Campbell's"],
    iconName: "HandHeart"
  },
  {
    id: "ruler",
    name: "Ruler",
    motto: "Power isn't everything, it's the only thing.",
    traitSummary: "Authoritative, commanding, structured & prestigious",
    traits: ["Commanding", "Structured", "Prestigious", "Responsible"],
    fear: "Chaos, loss of control, or being overthrown",
    vibeColor: "from-amber-400 to-yellow-600",
    badgeBg: "bg-yellow-400/10 text-yellow-300 border-yellow-400/30",
    examples: ["Mercedes-Benz", "Rolex", "IBM", "Microsoft"],
    iconName: "Crown"
  }
];
