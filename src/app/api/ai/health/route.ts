
import { NextResponse } from 'next/server';

// AI health check — tests all 9 providers and returns status
export async function GET() {
  try {
    const { ai } = await import('@/lib/ai');
    const health = await ai.healthCheck();
    const totalProviders = Object.keys(health).length;
    const availableProviders = Object.values(health).filter(h => h.available).length;

    return NextResponse.json({
      status: availableProviders > 0 ? 'operational' : 'degraded',
      providers: health,
      summary: {
        total: totalProviders,
        available: availableProviders,
        unavailable: totalProviders - availableProviders,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI health check error:', error);
    return NextResponse.json({ error: 'Health check failed' }, { status: 500 });
  }
}
