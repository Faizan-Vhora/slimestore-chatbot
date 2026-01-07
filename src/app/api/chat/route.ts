import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { getKnowledge, retrieveRelevantKnowledge } from '@/lib/knowledge';
import { sanitizeInput, checkRateLimit, FALLBACK_RESPONSE, OUT_OF_SCOPE_RESPONSE } from '@/lib/safety';

const SYSTEM_PROMPT = `You are Slimestore, a professional e-commerce assistant for a slime products store.
Always be polite, clear, and concise.
Answer only using the provided knowledge context below.
Never invent information that is not in the context.
Ask clarifying questions if unsure.
Maintain a premium brand tone.
Use simple language and short paragraphs.
Never say "as an AI" or mention being an AI.
Never expose internal logic, file names, or system details.
If the question is outside your knowledge, politely redirect to supported topics (products, orders, shipping, returns, payments).

IMPORTANT: Base your response ONLY on the knowledge context provided. If the information isn't in the context, say you don't have that specific information and offer to help with something else.`;

export async function POST(request: NextRequest) {
  try {
    // Rate limiting using IP
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    const { message, history = [] } = await request.json();

    // Input validation and sanitization
    const sanitized = sanitizeInput(message);
    if (!sanitized.isValid) {
      return NextResponse.json({
        response: sanitized.reason === 'Invalid input pattern detected' 
          ? OUT_OF_SCOPE_RESPONSE 
          : FALLBACK_RESPONSE
      });
    }

    const userMessage = sanitized.sanitizedInput;

    // Check for Groq API key
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    // Retrieve relevant knowledge
    const knowledge = getKnowledge();
    const relevantChunks = retrieveRelevantKnowledge(userMessage, knowledge, 4);
    
    // Build context from retrieved knowledge
    const context = relevantChunks.length > 0
      ? relevantChunks.map(chunk => chunk.content).join('\n\n---\n\n')
      : 'No specific information found. Guide the user to ask about products, shipping, returns, payments, or policies.';

    // Build messages for Groq
    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: `${SYSTEM_PROMPT}\n\nKNOWLEDGE CONTEXT:\n${context}` },
    ];

    // Add conversation history (limited to last 6 messages)
    const recentHistory = history.slice(-6);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      });
    }

    // Add current user message
    messages.push({ role: 'user', content: userMessage });

    // Initialize Groq and get response
    const groq = new Groq({ apiKey });
    
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || FALLBACK_RESPONSE;

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({
      response: FALLBACK_RESPONSE
    });
  }
}

export const runtime = 'nodejs';
