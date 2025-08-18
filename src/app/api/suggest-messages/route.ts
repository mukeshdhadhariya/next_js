import { GoogleGenAI } from "@google/genai";
import { streamText} from 'ai';
import { google } from "@ai-sdk/google";

// const _ai = new GoogleGenAI({apiKey:process.env.GOOGLE_API_KEY});

import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request:Request){
    try {
        const prompt =`Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;
        
        // const chatResult= await _ai.models.generateContent({
        //     model: "gemini-2.5-flash",
        //     contents:prompt,
        //     config:{
        //         maxOutputTokens:400,
        //     }
        // });

        const result= streamText({
            model:google('gemini-2.5-flash'),
            prompt,
        });

        return result.toTextStreamResponse()

    }catch (error) {
      console.error('An unexpected error occurred:', error);
      throw error;
    }
}


// import { google } from "@ai-sdk/google";
// import { streamText } from "ai";


// export const runtime = 'edge';

// export async function POST(request:Request){
//     try {
//         const prompt='tell me 10 famous indian poet and their poem'

//         const result=await streamText({
//             model:google('gemini-2.5-flash'),
//             messages: [{ role: 'user', content: prompt }]
//         });

//         console.log(result)

//         return result.toTextStreamResponse()

//     } catch (error) {
//         throw error
//     }
// }