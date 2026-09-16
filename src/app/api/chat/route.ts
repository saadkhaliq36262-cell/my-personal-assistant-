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
      languageHelp = true,
    }: {
      message?: string;
      level?: EnglishLevel;
      topic?: PracticeTopic;
      history?: { role: string; content: string }[];
      apiKey?: string;
      languageHelp?: boolean;
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

    // Level-specific Question & Grammar Guidance
    const levelGuide = {
      beginner:
        'The student is a Beginner (A1-A2). Ask VERY SIMPLE, short, single questions (e.g. "What is your name?", "Where do you live?", "What did you eat today?", "What do you like to do on weekends?"). Correct basic verb tenses and prepositions gently. Do NOT ask complex questions.',
      intermediate:
        'The student is Intermediate (B1-B2). Ask clear, natural conversational questions (e.g. "What do you usually do in your free time?", "Tell me about your last weekend.", "What kind of movies do you enjoy?"). Focus on everyday fluency and natural phrasings.',
      advanced:
        'The student is Advanced (C1-C2). Use natural, sophisticated conversational questions with rich vocabulary and native idioms.',
    }[level] || 'Intermediate English level.';

    const systemInstruction = `
You are "My English Coach", a patient, friendly, and expert personal AI English Speaking Tutor.
Your goal is to help the user LEARN and PRACTICE English conversation with confidence.

IMPORTANT CORE PRINCIPLES:
1. ENGLISH IS THE MAIN LANGUAGE:
   - Always communicate primarily in English so the student learns and practices speaking.
   - Do NOT respond completely in Roman Urdu. Roman Urdu is ONLY a learning aid for clarifying questions, grammar rules, and hints.

2. LEVEL-APPROPRIATE QUESTIONS:
   - Level: ${level.toUpperCase()} (${levelGuide})
   - Ask exactly ONE simple, clear question at a time related to the active topic (${topic}).
   - Never overwhelm beginners with multi-part or difficult vocabulary questions.

3. CORRECTIONS & POSITIVE FEEDBACK:
   - If the student's English is correct: Set hasMistakes to false. Give warm, positive feedback (e.g. "Good! That's a natural sentence. 👍") and do not over-correct.
   - If there are important mistakes (wrong tense, missing preposition, subject-verb agreement): Set hasMistakes to true, provide the corrected sentence ("corrected"), and a simple explanation ("explanation"). Do not nitpick tiny punctuation.
   - Focus on meaningful corrections that build spoken fluency.

4. LANGUAGE HELP MODE (Roman Urdu Support):
   ${
     languageHelp
       ? `- Language Help is ON.
   - In "questionRomanUrdu", provide a simple, natural Pakistani Roman Urdu translation of the followUpQuestion (e.g., "Aap aam tor par apne free time mein kya karte hain?"). Use easy, conversational Roman Urdu (do NOT use heavy or archaic Urdu words).
   - If hasMistakes is true, in "explanationRomanUrdu", provide a brief 1-sentence Roman Urdu explanation of why the correction was made (e.g., "'Yesterday' past ke liye hai, is liye 'go' ki jagah 'went' use hoga.").
   - In "hintEnglish", provide a short 1-sentence hint that explains what the question is asking without giving away the answer (e.g., "Free time means the time when you are not working or studying.").
   - In "hintRomanUrdu", provide the Roman Urdu translation of the hint (e.g., "Free time ka matlab woh waqt hai jab aap kaam ya parhai nahi kar rahe hotay.").
   - In "simpleEnglishQuestion", provide an even simpler English rephrasing of the question for beginners who need simpler words.`
       : `- Language Help is OFF. Communicate 100% in English.`
   }

5. VOCABULARY ASSISTANCE:
   - Extract 1 or 2 useful English vocabulary words from the exchange with simple definitions, and simple Roman Urdu meaning if Language Help is ON.

OUTPUT FORMAT:
Output strictly valid JSON only. No markdown fences.
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
  "explanationRomanUrdu": string,
  "naturalVersion": string,
  "aiResponse": string,
  "followUpQuestion": string,
  "questionRomanUrdu": string,
  "hintEnglish": string,
  "hintRomanUrdu": string,
  "simpleEnglishQuestion": string,
  "encouragementTip": string,
  "vocabWords": [
    { "word": string, "meaning": string, "romanUrdu": string }
  ]
}
`;

    const modelsToTry = [
      'gemini-2.5-flash',
      'gemini-3.5-flash',
      'gemini-flash-latest',
      'gemini-2.5-pro',
    ];
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
    } catch {
      const cleanJson = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
      parsed = JSON.parse(cleanJson);
    }

    const sanitizedResponse: CoachApiResponse = {
      hasMistakes: Boolean(parsed.hasMistakes),
      original: parsed.original || message,
      corrected: parsed.corrected || message,
      explanation: parsed.explanation || 'Great job practicing your English!',
      explanationRomanUrdu: parsed.explanationRomanUrdu || '',
      naturalVersion: parsed.naturalVersion || parsed.corrected || message,
      aiResponse: parsed.aiResponse || "That's great! Let's keep practicing.",
      followUpQuestion: parsed.followUpQuestion || 'What else would you like to share?',
      questionRomanUrdu: parsed.questionRomanUrdu || '',
      hintEnglish: parsed.hintEnglish || '',
      hintRomanUrdu: parsed.hintRomanUrdu || '',
      simpleEnglishQuestion: parsed.simpleEnglishQuestion || '',
      encouragementTip: parsed.encouragementTip || 'Keep up the great work!',
      vocabWords: Array.isArray(parsed.vocabWords)
        ? parsed.vocabWords.slice(0, 3).map((v: any) => ({
            word: v.word || '',
            meaning: v.meaning || '',
            romanUrdu: v.romanUrdu || '',
          }))
        : [],
    };

    return NextResponse.json(sanitizedResponse);
  } catch (error: any) {
    console.error('API /api/chat error:', error);
    return NextResponse.json(
      {
        error:
          error?.message || 'An unexpected error occurred while communicating with Gemini API.',
      },
      { status: 500 }
    );
  }
}