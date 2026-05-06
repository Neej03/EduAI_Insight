import { GoogleGenAI, Type } from "@google/genai";
import { Student } from "../types";

export interface AIInsight {
  insight: string;
  prediction: string;
  recommendation: string;
}

export async function generateStudentInsight(student: Student): Promise<AIInsight> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
  You are an expert educational AI assistant. Analyze the following student's performance data and provide:
  1. A personalized feedback/insight.
  2. A predictive warning or comment on their trajectory.
  3. Actionable improvement strategies.

  Student Data:
  Name: ${student.name}
  Attendance: ${student.attendancePct}%
  Overall Score: ${student.overallScore}%
  Current Risk Level: ${student.riskLevel}
  
  Subject Scores:
  ${student.subjects.map(s => `- ${s.subject}: ${s.score}/${s.maxScore}`).join('\n')}

  Past Trend:
  ${student.history.map(h => `- ${h.examName}: ${h.score}%`).join('\n')}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insight: {
              type: Type.STRING,
              description: "A short personalized feedback summary of the student's current performance.",
            },
            prediction: {
              type: Type.STRING,
              description: "A predictive warning or comment on their trajectory (e.g., 'If current trend continues...').",
            },
            recommendation: {
              type: Type.STRING,
              description: "Clear, actionable improvement strategy for subjects where they scored loosely.",
            },
          },
          required: ["insight", "prediction", "recommendation"],
        },
      },
    });

    const jsonStr = (response.text || "").trim();
    if (!jsonStr) {
       throw new Error('Empty response from AI.');
    }
    return JSON.parse(jsonStr) as AIInsight;
  } catch (error) {
    console.error("AI Insight Generation Error:", error);
    return {
      insight: "Unable to generate insights at the moment.",
      prediction: "N/A",
      recommendation: "Please review the student's marks manually.",
    };
  }
}
