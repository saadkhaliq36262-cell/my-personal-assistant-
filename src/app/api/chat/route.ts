import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CoachApiResponse, EnglishLevel, PracticeTopic } from '@/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json(
        {
          error: 'GEMINI_API_KEY is not configured on the server. Please add your GEMINI_API_KEY to .env.local for local development or Vercel Environment Variables for production.',
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      message,
      level = 'intermediate',
      topic = 'free',
      history = [],
    }: {
      message?: string;
      level?: EnglishLevel;
      topic?: PracticeTopic;
      history?: { role: string; content: string }[];
    } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please provide a non-empty message to practice.' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Level instructions
    const levelGuide = {
      beginner: 'The student is a Beginner (A1-A2). Use simple everyday vocabulary and short clear sentences. Correct basic grammar (past tense, prepositions, subject-verb agreement) gently. Speak slowly and warmly.',
      intermediate: 'The student is Intermediate (B1-B2). Use natural conversational English with common idioms and phrasal verbs. Focus on fluency, natural phrasing, and sentence flow.',
      advanced: 'The student is Advanced (C1-C2). Use sophisticated vocabulary, nuanced expressions, and professional/native idioms. Offer subtle refinements and style improvements.'
    }[level] || 'Intermediate English level.';

    const systemInstruction = `
You are "My English Coach", a warm, encouraging, and expert personal English Speaking Tutor.
Your mission is to help the student build confidence and fluency in speaking English.

Student English Level: ${level.toUpperCase()} (${levelGuide})
Active Practice Topic: ${topic.toUpperCase()}

For every spoken sentence from the student:
1. Analyze the sentence for grammatical mistakes, incorrect tenses, awkward prepositions, or unnatural word choices.
2. If there are noticeable mistakes:
   - Provide the corrected sentence.
   - Explain the specific rule or mistake in 1 or 2 simple, friendly sentences (never condescending).
   - Provide a natural/native version.
3. If the sentence is already grammatically accurate:
   - Mark hasMistakes as false.
   - For explanation, provide a brief praise (e.g. "Excellent! Your sentence is grammatically correct.").
   - For naturalVersion, give an optional alternative phrasing or idiom that native speakers often use.
4. Reply naturally and warmly to the content of what the student said (do NOT sound like an exam robot, sound like an empathetic conversation partner!).
5. Always include a follow-up question related to the active topic (${topic}) to prompt the student to practice speaking their next sentence.

IMPORTANT: You must output ONLY valid JSON matching the requested schema. Do not wrap in markdown quotes if possible, or return strictly parseable JSON.
`;

    const recentHistoryText = (history || [])
      .slice(-6)
      .map((h) => `${h.role === 'user' ? 'Student' : 'Tutor'}: ${h.content}`)
      .join('\n');

    const prompt = `
Context / Recent Conversation:
${recentHistoryText || 'Starting a new conversation.'}

Student just said:
"${message.trim()}"

Respond in JSON format with the following fields:
{
  "hasMistakes": boolean (true if student made grammar/tense/vocab mistakes, false otherwise),
  "original": "${message.trim().replace(/"/g, '\\"')}",
  "corrected": string (the grammatically correct version of what they said),
  "explanation": string (simple, encouraging 1-2 sentence explanation of the mistake or praise),
  "naturalVersion": string (how a native speaker would say this naturally),
  "aiResponse": string (friendly conversational reply to what they said),
  "followUpQuestion": string (engaging question to prompt the student's next response),
  "encouragementTip": string (optional short motivational phrase like "Great effort!" or "You are doing great!")
}
`;

    const modelsToTry = ['gemini-2.5-flash', 'gemini-3.5-flash', 'gemini-flash-latest', 'gemini-2.5-pro'];
    let result = null;
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
          systemInstruction: systemInstruction,
        });
        result = await model.generateContent(prompt);
        if (result) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed, trying next model:`, err?.message);
      }
    }

    if (!result) {
      throw lastError || new Error('All model attempts failed.');
    }

    const responseText = result.response.text();
    
    // Parse JSON safely
    let parsed: CoachApiResponse;
    try {
      parsed = JSON.parse(responseText);
    } catch (parseError) {
      const cleanJson = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
      parsed = JSON.parse(cleanJson);
    }

    const sanitizedResponse: CoachApiResponse = {
      hasMistakes: Boolean(parsed.hasMistakes),
      original: parsed.original || message,
      corrected: parsed.corrected || message,
      explanation: parsed.explanation || 'Great job practicing!',
      naturalVersion: parsed.naturalVersion || parsed.corrected || message,
      aiResponse: parsed.aiResponse || "That's great! Let's keep practicing.",
      followUpQuestion: parsed.followUpQuestion || "What else would you like to share?",
      encouragementTip: parsed.encouragementTip || "Keep up the great work!",
    };

    return NextResponse.json(sanitizedResponse);
  } catch (error: any) {
    console.error('API /api/chat error:', error);
    return NextResponse.json(
      {
        error: error?.message || 'An unexpected error occurred while communicating with Gemini API.',
      },
      { status: 500 }
    );
  }
}