
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/ai-rate-limit';
import { getCached, setCache, generateCacheKey, CACHE_TTL } from '@/lib/ai-cache';

// Auto-reply generation endpoint — GPT-4o-mini → Groq → GLM
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateCheck = checkRateLimit(ip, 'auto_reply');

    if (!rateCheck.allowed) {
      const retryAfter = Math.ceil((rateCheck.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            ...getRateLimitHeaders(ip, 'auto_reply'),
          },
        }
      );
    }

    const body = await request.json();
    const { message, listingTitle, sellerName, tone } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'message is required' },
        {
          status: 400,
          headers: getRateLimitHeaders(ip, 'auto_reply'),
        }
      );
    }

    // Check cache first
    const cacheKey = generateCacheKey('auto_reply', message, listingTitle || '', sellerName || '', tone || 'friendly');
    const cached = getCached<{ reply: string; tone: string }>(cacheKey);

    if (cached) {
      return NextResponse.json(
        {
          reply: cached.reply,
          tone: cached.tone,
          provider: 'cache',
        },
        {
          headers: {
            'X-Cache': 'HIT',
            ...getRateLimitHeaders(ip, 'auto_reply'),
          },
        }
      );
    }

    const { ai } = await import('@/lib/ai');
    const result = await ai.autoReply({ message, listingTitle, sellerName, tone });

    // Cache the result
    setCache(cacheKey, {
      reply: result.data.reply,
      tone: result.data.tone,
    }, CACHE_TTL.auto_reply);

    return NextResponse.json(
      {
        reply: result.data.reply,
        tone: result.data.tone,
        provider: result.provider,
      },
      {
        headers: {
          'X-Cache': 'MISS',
          ...getRateLimitHeaders(ip, 'auto_reply'),
        },
      }
    );
  } catch (error) {
    console.error('Auto-reply error:', error);
    const message = error instanceof Error ? error.message : 'Auto-reply generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
