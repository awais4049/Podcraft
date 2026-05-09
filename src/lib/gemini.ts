import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface PodcastPlanResponse {
  topics: {
    title: string;
    whyItMatters: string;
    talkingPoints: string[];
    suggestedSegment: string;
  }[];
  questions: {
    question: string;
    duration: string;
    category: string;
    priority: 'High' | 'Medium' | 'Low';
  }[];
  hooks: string[];
  intros: {
    tone: string;
    script: string;
  }[];
  outline: {
    title: string;
    segments: {
      name: string;
      description: string;
      duration: string;
      transition: string;
    }[];
  };
  timestamps: {
    time: string;
    label: string;
  }[];
}

export const generatePodcastPlan = async (params: {
  niche: string;
  guestName?: string;
  guestBio?: string;
  goal: string;
  tone: string;
  length: string;
  format: string;
}): Promise<PodcastPlanResponse> => {
  const model = "gemini-3-flash-preview";

  const prompt = `You are an autonomous podcast planning assistant (PodCraft). 
  Analyze the following input and generate a complete podcast production plan:
  - Niche: ${params.niche}
  - Guest: ${params.guestName || 'None'}
  - Guest Bio: ${params.guestBio || 'N/A'}
  - Goal: ${params.goal}
  - Tone: ${params.tone}
  - Length: ${params.length}
  - Format: ${params.format}

  Reason step-by-step before generating the plan.
  Provide structured output with:
  1. Trending Topics (at least 3)
  2. Interview Questions (at least 5)
  3. Engaging Hooks and Intros (at least 3 variations)
  4. Detailed Episode Outline with Segments and Transitions
  5. Suggested Timestamps Breakdown`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                whyItMatters: { type: Type.STRING },
                talkingPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                suggestedSegment: { type: Type.STRING }
              }
            }
          },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                duration: { type: Type.STRING },
                category: { type: Type.STRING },
                priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
              }
            }
          },
          hooks: { type: Type.ARRAY, items: { type: Type.STRING } },
          intros: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                tone: { type: Type.STRING },
                script: { type: Type.STRING }
              }
            }
          },
          outline: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              segments: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    transition: { type: Type.STRING }
                  }
                }
              }
            }
          },
          timestamps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                label: { type: Type.STRING }
              }
            }
          }
        },
        required: ["topics", "questions", "hooks", "outline", "timestamps"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
