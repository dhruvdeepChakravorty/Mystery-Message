import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { GoogleGenerativeAI } from "@google/generative-ai";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMENI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMENI_API_KEY is not defined in the environment variables.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({model:'gemini-1.5-pro-latest'})
    const promt ="Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."

    const result = await model.generateContent(promt)
    const response = await result.response
    const generatedText =
      response.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";


    if (!response.text) {
      throw new Error("Failed to generate text. No response received.");
    }

    return new Response(JSON.stringify({ text: generatedText.trim()}), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error generating text:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to generate text",
        message: error.message || "Something went wrong",
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
