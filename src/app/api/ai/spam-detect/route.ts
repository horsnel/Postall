
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/ai-rate-limit';

// Spam detection endpoint — GPT-4o-mini → Gemini → Local rules
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateCheck = checkRateLimit(ip, 'spam_detect');

    if (!rateCheck.allowed) {
      const retryAfter = Math.ceil((rateCheck.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            ...getRateLimitHeaders(ip, 'spam_detect'),
          },
        }
      );
    }

    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'text is required' },
        {
          status: 400,
          headers: getRateLimitHeaders(ip, 'spam_detect'),
        }
      );
    }

    const { ai } = await import('@/lib/ai');
    const result = await ai.detectSpam(text);

    return NextResponse.json(
      {
        isSpam: result.data.isSpam,
        score: result.data.score,
        reasons: result.data.reasons,
        provider: result.provider,
      },
      {
        headers: getRateLimitHeaders(ip, 'spam_detect'),
      }
    );
  } catch (error) {
    console.error('Spam detection error:', error);
    const message = error instanceof Error ? error.message : 'Spam detection failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
