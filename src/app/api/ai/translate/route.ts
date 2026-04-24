
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/ai-rate-limit';
import { getCached, setCache, generateCacheKey, CACHE_TTL } from '@/lib/ai-cache';

// Translation endpoint — uses AI fallback chain (Google Translate → Gemini → GLM)
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateCheck = checkRateLimit(ip, 'translate');

    if (!rateCheck.allowed) {
      const retryAfter = Math.ceil((rateCheck.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            ...getRateLimitHeaders(ip, 'translate'),
          },
        }
      );
    }

    const body = await request.json();
    const { text, targetLang, sourceLang } = body;

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: 'text and targetLang are required' },
        {
          status: 400,
          headers: getRateLimitHeaders(ip, 'translate'),
        }
      );
    }

    // Check cache first
    const cacheKey = generateCacheKey('translate', text, targetLang, sourceLang || 'auto');
    const cached = getCached<{ translatedText: string; detectedLanguage: string; confidence: number }>(cacheKey);

    if (cached) {
      return NextResponse.json(
        {
          translatedText: cached.translatedText,
          detectedLanguage: cached.detectedLanguage,
          confidence: cached.confidence,
          provider: 'cache',
        },
        {
          headers: {
            'X-Cache': 'HIT',
            ...getRateLimitHeaders(ip, 'translate'),
          },
        }
      );
    }

    // Dynamic import to avoid build issues if AI package not configured
    const { ai } = await import('@/lib/ai');
    const result = await ai.translate(text, targetLang, sourceLang);

    // Cache the result
    setCache(cacheKey, {
      translatedText: result.data.translatedText,
      detectedLanguage: result.data.detectedLanguage,
      confidence: result.data.confidence,
    }, CACHE_TTL.translate);

    return NextResponse.json(
      {
        translatedText: result.data.translatedText,
        detectedLanguage: result.data.detectedLanguage,
        confidence: result.data.confidence,
        provider: result.provider,
        attempts: result.attempts.map(a => ({ provider: a.provider, success: a.success })),
      },
      {
        headers: {
          'X-Cache': 'MISS',
          ...getRateLimitHeaders(ip, 'translate'),
        },
      }
    );
  } catch (error) {
    console.error('Translation error:', error);
    const message = error instanceof Error ? error.message : 'Translation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Get supported languages
export async function GET() {
  const { ai } = await import('@/lib/ai');
  return NextResponse.json({ languages: ai.languages });
}
