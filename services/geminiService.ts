import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../constants";

export const getRecommendation = async (userPreferences: string[]): Promise<string> => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
    console.warn("Gemini API Key is not configured. Returning mock recommendation.");
    return `Com base nos seus interesses em ${userPreferences.join(', ')}, você pode gostar de assistir a um vídeo sobre técnicas avançadas de JavaScript ou uma nova análise de jogo indie!`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const model = "gemini-2.5-flash"; // Using a general flash model for text recommendations

    const prompt = `A user enjoys videos about the following topics: ${userPreferences.join(', ')}.
    Suggest one new type of video content they might like, and briefly explain why.
    Keep the suggestion concise and engaging, around 1-2 sentences.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 100, // Limit the response length for concise recommendations
        thinkingConfig: { thinkingBudget: 50 }, // Allocate thinking tokens
      },
    });

    const text = response.text;
    if (text) {
      return text.trim();
    } else {
      console.error("Gemini API returned an empty response.");
      return "Não foi possível gerar uma recomendação no momento. Tente novamente mais tarde.";
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `Erro ao gerar recomendação: ${error.message}. Verifique sua chave de API Gemini.`;
    }
    return "Erro desconhecido ao gerar recomendação. Verifique sua chave de API Gemini.";
  }
};