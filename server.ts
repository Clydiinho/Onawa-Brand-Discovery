import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Brand Strategy Enhancement API
  app.post("/api/enhance-brand", async (req, res) => {
    try {
      const { brandData } = req.body;
      
      if (!brandData) {
        return res.status(400).json({ error: "Brand data is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "GEMINI_API_KEY is not configured on the server. You can still use the standard generated report!" 
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `You are a world-class Chief Brand Strategist and Brand Director. Analyze the following Brand Discovery Questionnaire data and produce a high-impact, polished Brand Manifesto, refined UVP, and 3 distinct Tagline Options.

Brand Data:
- Brand Name: ${brandData.brandName || "Unnamed Brand"}
- Industry / Market: ${brandData.industry || "Not specified"}
- Project Type: ${brandData.projectType || "New Brand"}
${brandData.rebrandReason ? `- Rebrand Context: ${brandData.rebrandReason}` : ""}
${brandData.newBrandGoal ? `- Launch Context: ${brandData.newBrandGoal}` : ""}

Golden Circle (Simon Sinek):
- WHY (Purpose): ${brandData.goldenCircle?.why || "Not answered"}
- HOW (Process/Uniqueness): ${brandData.goldenCircle?.how || "Not answered"}
- WHAT (Products/Services): ${brandData.goldenCircle?.what || "Not answered"}

Brand Heart (Column Five):
- Purpose (Why): ${brandData.brandHeart?.purpose || "Not answered"}
- Vision (Future impact): ${brandData.brandHeart?.vision || "Not answered"}
- Mission (How we deliver): ${brandData.brandHeart?.mission || "Not answered"}
- Core Values: ${brandData.brandHeart?.values?.join(", ") || "Not answered"}

Archetypes (Willow Marketing):
- Primary Archetype: ${brandData.archetype?.primary || "Not chosen"}
- Secondary Archetype: ${brandData.archetype?.secondary || "Not chosen"}

Personality Spectrum Sliders (0-100 scale):
- Heritage vs. Progressive: ${brandData.personality?.traditionalVsProgressive ?? 50}
- Corporate vs. Disruptive: ${brandData.personality?.corporateVsDisruptive ?? 50}
- Reserved/Low-key vs. Bold/Expressive: ${brandData.personality?.reservedVsBold ?? 50}
- Exclusive/Elite vs. Accessible/Inclusive: ${brandData.personality?.exclusiveVsAccessible ?? 50}
- Playful/Witty vs. Serious/Authoritative: ${brandData.personality?.playfulVsSerious ?? 50}

Love / Hate Keyword Matrix (Fernando Ifrán):
- Traits to Embrace ("That's us"): ${brandData.keywords?.love?.join(", ") || "None"}
- Traits to Avoid ("Definitely not us"): ${brandData.keywords?.hate?.join(", ") || "None"}

Logo Anatomy Preference:
- Chosen Type: ${brandData.logoType?.type || "Not chosen"}

Draft UVP:
- Offering: ${brandData.uvp?.offering || ""}
- Category: ${brandData.uvp?.category || ""}
- Primary Benefit: ${brandData.uvp?.benefit || ""}
- Target Audience: ${brandData.uvp?.targetAudience || ""}

Please respond in JSON format with the following structure:
{
  "brandManifesto": "A inspiring, multi-paragraph Brand Manifesto (approx 150 words) capturing the soul, conviction, and emotional pull of the brand.",
  "refinedUVP": "A punchy, airtight Unique Value Proposition statement.",
  "taglineOptions": [
    { "tagline": "...", "angle": "Emotional / Purpose-Driven" },
    { "tagline": "...", "angle": "Action / Benefit-Driven" },
    { "tagline": "...", "angle": "Provocative / Disruptive" }
  ],
  "brandVoiceGuidelines": [
    "Guideline 1 on tone and language",
    "Guideline 2 on imagery and narrative",
    "Guideline 3 on customer engagement"
  ],
  "strategicSummary": "A concise executive elevator pitch summarizing why this brand will stand out in its market."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);

      res.json({ success: true, aiAnalysis: parsed });
    } catch (err: any) {
      console.error("Error in AI Brand Enhancement:", err);
      res.status(500).json({ 
        error: err.message || "Failed to generate AI brand enhancement" 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
