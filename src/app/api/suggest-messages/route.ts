import { GoogleGenAI } from "@google/genai";
import { streamText} from 'ai';
import { google } from "@ai-sdk/google";

import { NextResponse } from 'next/server';

const _ai = new GoogleGenAI({apiKey:process.env.GOOGLE_GENERATIVE_AI_API_KEY});

export const runtime = 'edge';

export async function POST(request:Request){
    try {
        const prompt =`Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;

        const chatResult= await _ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents:prompt
        });

        const text =
        chatResult.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

        console.log(text)

        return NextResponse.json({ completion:text});

    }catch (error) {
      console.error('An unexpected error occurred:', error);
      throw error;
    }
}
