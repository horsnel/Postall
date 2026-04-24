
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/ai-rate-limit';

const SYSTEM_PROMPT = `You are the AI Assistant for PostAll, an all-in-one marketplace platform serving multiple cities across Africa and beyond. You help users with:

1. **Task Posting**: How to create tasks, set budgets, choose categories, add descriptions, use AI enhancement
2. **Finding Work**: Browsing tasks, applying, writing cover letters, setting up profiles
3. **Selling Items**: Listing items, setting prices, adding photos, managing delivery options
4. **Payments & Escrow**: How escrow protection works, payment methods, fees (5% platform + 2% escrow), wallet features, crypto payments (coming soon)
5. **Safety**: Safe Spots for meetups, Proof Cam for documentation, verification badges, safety tips
6. **Tools**: Ship Helper, Freecycle, Market Insights, Smart Alerts, Scheduler, Translate, Route Plan, Team Up, Learn Skills, Auto-Reply
7. **Account**: Profile setup, verification tiers, reputation system, settings

Key facts:
- PostAll operates in Lagos, Accra, Nairobi, Johannesburg, Cairo, Dubai, London, New York, Toronto, Sydney
- Categories: Gigs (quick jobs), Services (professional), Jobs (employment), For Sale, Housing, Community
- Authentication via magic link (phone/email) — no passwords
- 24 tools available to users
- Escrow protects both buyers and sellers
- Platform fee: 5%, Escrow fee: 2%

Be friendly, concise, and helpful. Use emerald/green themed language when appropriate. If you don't know something specific, direct users to the Help Center at /help.`;

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateCheck = checkRateLimit(ip, 'chat');

    if (!rateCheck.allowed) {
      const retryAfter = Math.ceil((rateCheck.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            ...getRateLimitHeaders(ip, 'chat'),
          },
        }
      );
    }

    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        {
          status: 400,
          headers: getRateLimitHeaders(ip, 'chat'),
        }
      );
    }

    // Build conversation history with system prompt
    const history = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const { ai } = await import('@/lib/ai');
    
    // Use fallback chain: GLM → Groq → Gemini
    const lastMessage = messages[messages.length - 1]?.content || '';
    
    // Direct provider call with full history to preserve system prompt
    const result = await ai.chat(lastMessage, history);

    return NextResponse.json(
      {
        message: result.data,
        provider: result.provider,
        attempts: result.attempts.map(a => ({ provider: a.provider, success: a.success, latency: a.latency })),
      },
      {
        headers: getRateLimitHeaders(ip, 'chat'),
      }
    );
  } catch (error: unknown) {
    console.error('AI Chat error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
