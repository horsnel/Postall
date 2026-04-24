
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/ai-rate-limit';

// Image generation endpoint — Z.ai Image → Replicate SDXL
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateCheck = checkRateLimit(ip, 'image_generate');

    if (!rateCheck.allowed) {
      const retryAfter = Math.ceil((rateCheck.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            ...getRateLimitHeaders(ip, 'image_generate'),
          },
        }
      );
    }

    const body = await request.json();
    const { prompt, size, width, height } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'prompt is required' },
        {
          status: 400,
          headers: getRateLimitHeaders(ip, 'image_generate'),
        }
      );
    }

    const { ai } = await import('@/lib/ai');
    const result = await ai.generateImage(prompt, { size, width, height });

    return NextResponse.json(
      {
        images: result.data.urls || [],
        base64: result.data.base64 || null,
        provider: result.provider,
      },
      {
        headers: getRateLimitHeaders(ip, 'image_generate'),
      }
    );
  } catch (error) {
    console.error('Image generation error:', error);
    const message = error instanceof Error ? error.message : 'Image generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
