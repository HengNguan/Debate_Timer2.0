import { GoogleGenAI, Type } from "@google/genai";
import { AspectRatio, DebateTopic } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateDebateTopics = async (context: string): Promise<DebateTopic[]> => {
  if (!apiKey) throw new Error("API Key missing");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate 5 interesting, controversial, or balanced debate motions related to: "${context}". 
      Return them as a JSON list of objects with 'topic' and 'category'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ['topic', 'category']
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    const parsed = JSON.parse(jsonText);
    return parsed.map((item: any, index: number) => ({
      id: `topic-${index}-${Date.now()}`,
      topic: item.topic,
      category: item.category
    }));

  } catch (error) {
    console.error("Topic generation error:", error);
    throw error;
  }
};

export const generateTeamMascot = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  if (!apiKey) throw new Error("API Key missing");

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `A high quality, professional vector art or 3D render logo/mascot for a debate team. Concept: ${prompt}`,
      config: {
        numberOfImages: 1,
        aspectRatio: aspectRatio,
        outputMimeType: 'image/png',
      }
    });

    const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (!base64ImageBytes) {
      throw new Error("No image generated");
    }
    
    return `data:image/png;base64,${base64ImageBytes}`;

  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
};