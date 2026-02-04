
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const parseAIJson = (text: string | undefined) => {
  if (!text) return {};
  try {
    // Remove markdown code block markers if present
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("AI JSON Parsing Error:", e, text);
    return {};
  }
};

export const decodeVin = async (vin: string) => {
  if (!vin || vin.length < 10) return null;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Decode this VIN for a vehicle in Canada: ${vin}. Provide the year, make, and model.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            year: { type: Type.INTEGER },
            make: { type: Type.STRING },
            model: { type: Type.STRING },
            trim: { type: Type.STRING },
            bodyStyle: { type: Type.STRING }
          },
          required: ["year", "make", "model"]
        }
      }
    });

    return parseAIJson(response.text);
  } catch (error) {
    console.error("VIN Decode Error:", error);
    return null;
  }
};

export const generateMarketingCopy = async (vehicle: any, tone: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a high-converting marketing description for a ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}. 
      The tone should be ${tone}. 
      Include 3 key highlights and a closing call to action.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            description: { type: Type.STRING },
            highlights: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            cta: { type: Type.STRING }
          },
          required: ["headline", "description", "highlights", "cta"]
        }
      }
    });

    return parseAIJson(response.text);
  } catch (error) {
    console.error("Marketing Copy Error:", error);
    return null;
  }
};

/**
 * Uses Google Search Grounding to find current market trends for a vehicle.
 */
export const getMarketInsights = async (make: string, model: string, year: number) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a current market price analysis for a ${year} ${make} ${model} in the Canadian market. 
      Include average selling price, demand level (High/Medium/Low), and top competitors.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text || '',
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Market Insights Error:", error);
    return null;
  }
};

/**
 * Uses Google Maps Grounding to find nearby service centers or dealership locations.
 */
export const findDealershipLocations = async (latitude: number, longitude: number) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // Maps grounding is only supported in Gemini 2.5 series models.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Where are the nearest OldRoad Auto premium dealership locations or certified high-end car service centers nearby?",
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: { latitude, longitude }
          }
        }
      },
    });

    return {
      text: response.text || '',
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Maps Grounding Error:", error);
    return null;
  }
};

/**
 * Generates an image of a 'dream car' based on user prompt.
 */
export const generateDreamCarImage = async (prompt: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `A high-resolution, professional studio photograph of a concept luxury vehicle. Description: ${prompt}. Cinematic lighting, 8k resolution, photorealistic.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};
