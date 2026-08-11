export interface KeywordTrait {
  id: string;
  label: string;
  category: "tone" | "attitude" | "positioning" | "style";
}

export const INITIAL_KEYWORD_TRAITS: KeywordTrait[] = [
  { id: "maverick", label: "Maverick", category: "attitude" },
  { id: "nurturing", label: "Nurturing", category: "tone" },
  { id: "disruptive", label: "Disruptive", category: "positioning" },
  { id: "elegant", label: "Elegant", category: "style" },
  { id: "academic", label: "Academic / Scholarly", category: "tone" },
  { id: "whimsical", label: "Whimsical", category: "style" },
  { id: "corporate", label: "Corporate / Formal", category: "positioning" },
  { id: "high_octane", label: "High-Octane / Edgy", category: "attitude" },
  { id: "reserved", label: "Quiet / Low-Key", category: "tone" },
  { id: "ultra_luxurious", label: "Ultra-Luxurious", category: "positioning" },
  { id: "accessible", label: "Democratic / Accessible", category: "positioning" },
  { id: "technical", label: "Technical / Granular", category: "tone" },
  { id: "playful", label: "Playful / Witty", category: "tone" },
  { id: "unapologetic", label: "Unapologetic", category: "attitude" },
  { id: "minimalist", label: "Minimalist / Sparse", category: "style" },
  { id: "reassuring", label: "Reassuring / Steady", category: "tone" },
  { id: "radical", label: "Radical / Unconventional", category: "positioning" },
  { id: "traditional", label: "Heritage / Traditional", category: "positioning" },
  { id: "methodical", label: "Methodical / Precise", category: "attitude" },
  { id: "relatable", label: "Relatable / Grounded", category: "attitude" },
  { id: "high_tech", label: "Futuristic / High-Tech", category: "style" },
  { id: "wholesome", label: "Pure / Wholesome", category: "tone" },
  { id: "provocative", label: "Provocative", category: "attitude" },
  { id: "ironclad", label: "Ironclad / Reliable", category: "positioning" },
  { id: "gentle", label: "Gentle / Empathetic", category: "tone" },
  { id: "fast_paced", label: "Agile / Fast-Paced", category: "attitude" },
  { id: "exclusive", label: "Exclusive / VIP-Only", category: "positioning" },
  { id: "irreverent", label: "Irreverent", category: "tone" }
];
