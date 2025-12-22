
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { UserProfile, Opportunity, Message } from "../types";
import { MENTOR_SYSTEM_INSTRUCTION } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getPersonalizedOpportunities = async (profile: UserProfile): Promise<Opportunity[]> => {
  const prompt = `Based on this student profile, search your internal database/knowledge for 5 highly relevant current opportunities (internships, scholarships, competitions). 
  Student Profile:
  Name: ${profile.name}
  Major: ${profile.major}
  Interests: ${profile.interests.join(', ')}
  Skills: ${profile.skills.join(', ')}
  Education: ${profile.educationLevel}
  
  Ensure at least one is focused on diversity/inclusion and one on financial need.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            organization: { type: Type.STRING },
            type: { type: Type.STRING, description: "One of: Internship, Scholarship, Competition, Learning Program, Research" },
            deadline: { type: Type.STRING, description: "YYYY-MM-DD" },
            description: { type: Type.STRING },
            link: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            diversityFocus: { type: Type.BOOLEAN },
            financialSupport: { type: Type.BOOLEAN }
          },
          required: ["id", "title", "organization", "type", "deadline", "description", "link", "tags", "diversityFocus", "financialSupport"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Failed to parse opportunities", e);
    return [];
  }
};

export const chatWithMentor = async (history: Message[], userMessage: string, profile: UserProfile): Promise<string> => {
  const contents = [
    { role: 'user', parts: [{ text: `User Profile Context: Major: ${profile.major}, Goals: ${profile.careerGoals}` }] },
    ...history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    })),
    { role: 'user', parts: [{ text: userMessage }] }
  ];

  // @ts-ignore - The SDK types for chats/contents can be tricky
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    // @ts-ignore
    contents: contents,
    config: {
      systemInstruction: MENTOR_SYSTEM_INSTRUCTION,
      temperature: 0.8,
    }
  });

  return response.text || "I'm sorry, I'm having a little trouble thinking right now. Could you say that again? 🌸";
};
