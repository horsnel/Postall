
import { NextRequest, NextResponse } from 'next/server';

// Image moderation endpoint — Cloudinary AI → Gemini Vision → Local filter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 });
    }

    const { ai } = await import('@/lib/ai');
    const result = await ai.moderateImage(imageUrl);

    return NextResponse.json({
      isSafe: result.data.isSafe,
      categories: result.data.categories,
      provider: result.provider,
    });
  } catch (error) {
    console.error('Image moderation error:', error);
    const message = error instanceof Error ? error.message : 'Image moderation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
