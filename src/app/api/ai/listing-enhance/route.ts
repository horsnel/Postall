
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/ai-rate-limit';
import { getCached, setCache, generateCacheKey, CACHE_TTL } from '@/lib/ai-cache';

// Listing enhancement endpoint — GPT-4o-mini → Gemini → GLM
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateCheck = checkRateLimit(ip, 'listing_enhance');

    if (!rateCheck.allowed) {
      const retryAfter = Math.ceil((rateCheck.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            ...getRateLimitHeaders(ip, 'listing_enhance'),
          },
        }
      );
    }

    const body = await request.json();
    const { title, description, category } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'title and description are required' },
        {
          status: 400,
          headers: getRateLimitHeaders(ip, 'listing_enhance'),
        }
      );
    }

    // Check cache first
    const cacheKey = generateCacheKey('listing_enhance', title, description, category || '');
    const cached = getCached<Record<string, unknown>>(cacheKey);

    if (cached) {
      return NextResponse.json(
        {
          ...cached,
          provider: 'cache',
        },
        {
          headers: {
            'X-Cache': 'HIT',
            ...getRateLimitHeaders(ip, 'listing_enhance'),
          },
        }
      );
    }

    const { ai } = await import('@/lib/ai');
    const result = await ai.enhanceListing({ title, description, category });

    // Cache the result
    setCache(cacheKey, result.data, CACHE_TTL.listing_enhance);

    return NextResponse.json(
      {
        ...result.data,
        provider: result.provider,
      },
      {
        headers: {
          'X-Cache': 'MISS',
          ...getRateLimitHeaders(ip, 'listing_enhance'),
        },
      }
    );
  } catch (error) {
    console.error('Listing enhance error:', error);
    const message = error instanceof Error ? error.message : 'Enhancement failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
