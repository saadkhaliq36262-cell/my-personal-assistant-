import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CoachApiResponse, EnglishLevel, PracticeTopic } from '@/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message,
      level = 'intermediate',
      topic = 'free',
      history = [],
      apiKey: customKey,
    }: {
      message?: string;
      level?: EnglishLevel;
      topic?: PracticeTopic;
      history?: { role: string; content: string }[];
      apiKey?: string;
    } = body;

    const headerKey = req.headers.get('x-gemini-api-key');
    const apiKey = process.env.GEMINI_API_KEY || customKey || headerKey;

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json(
        {
          error: 'GEMINI_API_KEY is not configured. Please add your key in Settings ⚙️ or configure GEMINI_API_KEY in Vercel Environment Variables.',
        },
        { status: 401 }
      );
    }

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
You are "My English Coach", a warm, encouraging, and expert personal English Speaking Tutor and SaaS language learning partner.
Your mission is to help the student build speaking confidence, grammatical precision, and natural fluency in English.

Student English Level: ${level.toUpperCase()} (${levelGuide})
Active Practice Topic: ${topic.toUpperCase()}

For every spoken or typed sentence from the student:
1. Understand their intended meaning with empathy.
2. Analyze the sentence for important grammatical mistakes, incorrect tenses, awkward prepositions, or unnatural word choices.
   - Do NOT aggressively nitpick tiny punctuation if the sentence is natural; focus on high-impact speaking improvements.
3. If there are mistakes:
   - Mark hasMistakes as true.
   - Provide the corrected sentence ("corrected").
   - Explain the specific rule simply in 1 or 2 friendly, beginner-accessible sentences ("explanation").
   - Provide a natural/native version ("naturalVersion").
4. If the sentence is grammatically sound:
   - Mark hasMistakes as false.
   - For explanation, provide brief encouragement (e.g. "Excellent! Your sentence is natural and grammatically accurate.").
   - For naturalVersion, give an optional alternative phrasing or idiom that native speakers often use.
5. Provide a warm, conversational AI reply that directly responds to the content of what the student said ("aiResponse"). Keep responses concise and natural (2 to 3 sentences).
6. Always include a follow-up question related to the active topic (${topic}) to prompt the student's next practice turn ("followUpQuestion").
7. Extract 1 or 2 useful English vocabulary words or phrasal verbs from the exchange with simple definitions ("vocabWords").

IMPORTANT: You must output ONLY valid JSON matching the requested schema without markdown fences.
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
  "hasMistakes": boolean,
  "original": "${message.trim().replace(/"/g, '\\"')}",
  "corrected": string,
  "explanation": string,
  "naturalVersion": string,
  "aiResponse": string,
  "followUpQuestion": string,
  "encouragementTip": string,
  "vocabWords": [
    { "word": string, "meaning": string }
  ]
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
        console.warn(`Model ${modelName} failed, trying next:`, err?.message);
      }
    }

    if (!result) {
      throw lastError || new Error('All model attempts failed.');
    }

    const responseText = result.response.text();
    
    // Parse JSON safely
    let parsed: any;
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
      explanation: parsed.explanation || 'Great job practicing your English!',
      naturalVersion: parsed.naturalVersion || parsed.corrected || message,
      aiResponse: parsed.aiResponse || "That's great! Let's keep practicing.",
      followUpQuestion: parsed.followUpQuestion || "What else would you like to share?",
      encouragementTip: parsed.encouragementTip || "Keep up the great work!",
      vocabWords: Array.isArray(parsed.vocabWords) ? parsed.vocabWords.slice(0, 3) : [],
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