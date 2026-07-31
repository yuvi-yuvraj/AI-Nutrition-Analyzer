import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI client (following System instructions)
const apiKey = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Open Food Facts API query helper
async function fetchOpenFoodFactsData(query: string) {
  try {
    // Basic formatting: remove portion numbers/measures, keep names to optimize OFF search
    const cleanQuery = query
      .replace(/[\d\.\/\:]+(g|kg|ml|l|oz|tsp|tbsp|cup|cups|slices|pieces|piece|serving|servings|bowl|bowls|cooked|raw|boiled|scrambled|baked|grilled|pan-seared)?/gi, '')
      .replace(/(breakfast|lunch|snack|dinner|water|fluids|total|about|with|and|of)/gi, '')
      .trim();
    if (!cleanQuery || cleanQuery.length < 2) return null;

    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(cleanQuery)}&search_simple=1&action=process&json=1&page_size=1`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "DailyNutritionAnalyzer/1.0 (aryapandeyyy28@gmail.com)"
      }
    });
    if (!response.ok) return null;
    const data = await response.json();
    if (data && data.products && data.products.length > 0) {
      const p = data.products[0];
      const nutriments = p.nutriments || {};
      return {
        query: query,
        cleanQuery: cleanQuery,
        productName: p.product_name || p.generic_name || cleanQuery,
        brand: p.brands || null,
        calories_100g: parseFloat(nutriments['energy-kcal_100g'] || nutriments['energy-kcal_value'] || 0),
        protein_100g: parseFloat(nutriments['proteins_100g'] || nutriments['proteins_value'] || 0),
        carbs_100g: parseFloat(nutriments['carbohydrates_100g'] || nutriments['carbohydrates_value'] || 0),
        fat_100g: parseFloat(nutriments['fat_100g'] || nutriments['fat_value'] || 0),
        fiber_100g: parseFloat(nutriments['fiber_100g'] || nutriments['fiber_value'] || 0),
        found: true
      };
    }
  } catch (error) {
    console.warn(`Open Food Facts API error for query "${query}":`, error);
  }
  return {
    query: query,
    found: false
  };
}

// Local speed-optimized keyword parser replacing the first Gemini call entirely
function parseFoodKeywordsLocal(log: string): string[] {
  const lines = log.split(/[\n,;:\-\+•]/);
  const items: string[] = [];
  const excludeWords = new Set([
    "breakfast", "lunch", "snack", "dinner", "supper", "meal", "food", "diary", "log", 
    "water", "fluids", "fluid", "total", "about", "with", "and", "of", "the", "a", "an",
    "drank", "ate", "had", "for", "grams", "g", "kg", "ml", "cup", "cups", "serving", 
    "servings", "bowl", "bowls", "slice", "slices", "piece", "pieces", "approx", "approximately"
  ]);

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    
    let clean = line
      .replace(/[\d\.\/\:\(\)]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const words = clean.split(/\s+/).filter(w => {
      const lower = w.toLowerCase();
      // Keep only active ingredient characters
      return lower.length > 1 && !excludeWords.has(lower);
    });

    if (words.length > 0) {
      const item = words.slice(0, 3).join(" ").trim();
      if (item && !items.includes(item)) {
        items.push(item);
      }
    }
    if (items.length >= 4) break; // Limit of 3-4 key food items max as requested
  }

  if (items.length === 0) {
    const fallbackWords = log.replace(/[^\w\s]/g, "").split(/\s+/).filter(w => w.length > 3).slice(0, 3);
    if (fallbackWords.length > 0) {
      items.push(fallbackWords.join(" "));
    }
  }

  return items.slice(0, 4);
}

// 1. API Route: Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: process.env.NODE_ENV });
});

// 2. API Route: Nutrition Analysis
app.post("/api/analyze", async (req, res) => {
  try {
    const { profile, foodIntake } = req.body;

    if (!profile || !foodIntake) {
      res.status(400).json({ success: false, error: "Missing user profile or daily food intake text." });
      return;
    }

    if (!ai) {
      res.status(500).json({
        success: false,
        error: "Google Gemini API client is not initialized. Please ensure the GEMINI_API_KEY secret is configured."
      });
      return;
    }

    const { age, gender, weight, height, activityLevel, dailyGoal } = profile;

    // 1. Extract food terms locally (Bypasses previous first Gemini API call for maximum speed)
    const keywords = parseFoodKeywordsLocal(foodIntake);
    
    // 2. Query Open Food Facts API in parallel (Limit to 3 items to reduce workload)
    const dbResults = await Promise.all(
      keywords.slice(0, 3).map(k => fetchOpenFoodFactsData(k))
    ).then(res => res.filter(Boolean));

    // 3. Main analysis prompt injecting structural results (Ultra Speed Optimized)
    const prompt = `
You are an expert, ultra-concise AI Nutritionist for a premium wellness system. 
Analyze the logs and parameters, output ONLY precise nutritional estimates based on standard clinical calculations.

USER PROFILE:
- Age: ${age} years old, Gender: ${gender}, Weight: ${weight}kg, Height: ${height}cm, Activity: ${activityLevel}, Goal: ${dailyGoal}

FOOD DIARY LOG:
"${foodIntake}"

RAW NUTRITIONAL MATCHES (OPEN FOOD FACTS API):
${JSON.stringify(dbResults)}

CRITICAL SPEED & CONCISENESS RULES:
1. Total text words in all returned JSON fields combined MUST be under 80-120 words. No explanations.
2. Keep ALL string text descriptions and prompts under 4-6 words max.
3. 'overallScore' is a composite balance score between 1 and 100. (The client renders it out of 10).
4. 'recommendations.simpleDietaryImprovements' MUST contain EXACTLY 3 short tips (each under 5 words, e.g., "Add protein morning", "Increase breakfast hydration", "Incorporate raw vegetables").
5. Keep other recommendation lists to exactly 1 item. Keep vitamins and minerals arrays to exactly 2 items each, with 3-word descriptions.
`;

    // Strict schema matching the interface on front-end
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        overallScore: { type: Type.INTEGER, description: "Balance score between 1 and 100" },
        calories: {
          type: Type.OBJECT,
          properties: {
            value: { type: Type.NUMBER, description: "Consumed in kcal" },
            target: { type: Type.NUMBER, description: "Target in kcal" },
            unit: { type: Type.STRING },
            status: { type: Type.STRING, description: "green, yellow, or red" },
            percentage: { type: Type.NUMBER }
          },
          required: ["value", "target", "unit", "status", "percentage"]
        },
        protein: {
          type: Type.OBJECT,
          properties: {
            value: { type: Type.NUMBER, description: "Consumed in grams" },
            target: { type: Type.NUMBER, description: "Target in grams" },
            unit: { type: Type.STRING },
            status: { type: Type.STRING },
            percentage: { type: Type.NUMBER }
          },
          required: ["value", "target", "unit", "status", "percentage"]
        },
        carbs: {
          type: Type.OBJECT,
          properties: {
            value: { type: Type.NUMBER, description: "Consumed in grams" },
            target: { type: Type.NUMBER, description: "Target in grams" },
            unit: { type: Type.STRING },
            status: { type: Type.STRING },
            percentage: { type: Type.NUMBER }
          },
          required: ["value", "target", "unit", "status", "percentage"]
        },
        fat: {
          type: Type.OBJECT,
          properties: {
            value: { type: Type.NUMBER, description: "Consumed in grams" },
            target: { type: Type.NUMBER, description: "Target in grams" },
            unit: { type: Type.STRING },
            status: { type: Type.STRING },
            percentage: { type: Type.NUMBER }
          },
          required: ["value", "target", "unit", "status", "percentage"]
        },
        fiber: {
          type: Type.OBJECT,
          properties: {
            value: { type: Type.NUMBER, description: "Consumed in grams" },
            target: { type: Type.NUMBER, description: "Target in grams" },
            unit: { type: Type.STRING },
            status: { type: Type.STRING },
            percentage: { type: Type.NUMBER }
          },
          required: ["value", "target", "unit", "status", "percentage"]
        },
        vitamins: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              status: { type: Type.STRING, description: "adequate, low, or high" },
              description: { type: Type.STRING, description: "3-word explanation" }
            },
            required: ["name", "status", "description"]
          }
        },
        minerals: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              status: { type: Type.STRING, description: "adequate, low, or high" },
              description: { type: Type.STRING, description: "3-word explanation" }
            },
            required: ["name", "status", "description"]
          }
        },
        hydration: {
          type: Type.OBJECT,
          properties: {
            recommended: { type: Type.NUMBER, description: "Target in L" },
            estimated: { type: Type.NUMBER, description: "Consumed in L" },
            recommendationText: { type: Type.STRING, description: "Under 5 words" }
          },
          required: ["recommended", "estimated", "recommendationText"]
        },
        nutritionalGaps: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING, description: "Under 5 words" },
              severity: { type: Type.STRING, description: "low, medium, or high" }
            },
            required: ["title", "description", "severity"]
          }
        },
        recommendations: {
          type: Type.OBJECT,
          properties: {
            foodsToAdd: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Max 1 food" },
            foodsToReduce: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Max 1 food" },
            nextMealSuggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Max 1 food" },
            simpleDietaryImprovements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Exactly 3 tips" },
            lifestyleTips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Max 1 habit" }
          },
          required: ["foodsToAdd", "foodsToReduce", "nextMealSuggestions", "simpleDietaryImprovements", "lifestyleTips"]
        },
        recommendedFoodsForGaps: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              nutrientRichIn: { type: Type.STRING },
              whyRecommend: { type: Type.STRING, description: "Under 5 words" },
              servingSuggestion: { type: Type.STRING, description: "Under 5 words" }
            },
            required: ["name", "nutrientRichIn", "whyRecommend", "servingSuggestion"]
          }
        },
        searchedFoods: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              matchedFood: { type: Type.STRING },
              found: { type: Type.BOOLEAN },
              source: { type: Type.STRING },
              detailRequirementPrompt: { type: Type.STRING, description: "Under 5 words" },
              calories: { type: Type.NUMBER },
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fat: { type: Type.NUMBER },
              fiber: { type: Type.NUMBER },
              vitaminsAndMineralsList: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["name", "matchedFood", "found", "source", "calories", "protein", "carbs", "fat", "fiber"]
          }
        }
      },
      required: [
        "overallScore", "calories", "protein", "carbs", "fat", "fiber",
        "vitamins", "minerals", "hydration", "nutritionalGaps",
        "recommendations", "recommendedFoodsForGaps", "searchedFoods"
      ]
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.15,
        maxOutputTokens: 550 // Constrains payload size to guarantee response speed under 1-2s
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("No response text returned from Gemini API");
    }

    const result = JSON.parse(textOutput.trim());
    res.json({ success: true, result });
  } catch (error: any) {
    console.error("Gemini nutrition analysis failed:", error);
    res.status(500).json({
      success: false,
      error: error?.message || "An unexpected error occurred during AI analysis."
    });
  }
});

// 3. Vite Server / Production builds integration (from instructions)
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting Express + Vite server in DEVELOPMENT mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting Express server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
