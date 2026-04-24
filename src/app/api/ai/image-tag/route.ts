
import { NextRequest, NextResponse } from 'next/server';

// Image auto-tagging endpoint — Cloudinary AI → Gemini Vision
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 });
    }

    const { ai } = await import('@/lib/ai');
    const result = await ai.tagImage(imageUrl);
    const data = result.data as unknown as Record<string, unknown>;

    return NextResponse.json({
      tags: (data.tags as { confidence: number; tag: string }[]) || [],
      isSafe: data.isSafe as boolean ?? true,
      blockedTags: (data.blockedTags as string[]) || [],
      provider: result.provider,
    });
  } catch (error) {
    console.error('Image tagging error:', error);
    const message = error instanceof Error ? error.message : 'Image tagging failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
