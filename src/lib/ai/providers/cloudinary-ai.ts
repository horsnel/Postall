// @ts-nocheck
// Cloudinary AI — Image moderation, auto-tagging, smart cropping (FREE: 25 credits/day)
import { v2 as cloudinary } from 'cloudinary';

function getClient() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) return null;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinary;
}

export const cloudinaryAIProvider = {
  name: 'Cloudinary AI' as const,
  isConfigured: () => !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),

  async moderate(imageUrl: string): Promise<{ isSafe: boolean; categories: Record<string, number> }> {
    const client = getClient();
    if (!client) throw new Error('Cloudinary not configured');
    const result = await client.api.resource(imageUrl, { moderation: 'aws_rek' });
    const moderation = result?.moderation?.[0];
    if (!moderation) return { isSafe: true, categories: {} };
    // If any moderation category > 0.7, flag as unsafe
    const maxScore = Math.max(...Object.values(moderation));
    return { isSafe: maxScore < 0.7, categories: moderation };
  },

  async tag(imageUrl: string): Promise<Array<{ confidence: number; tag: string }>> {
    const client = getClient();
    if (!client) throw new Error('Cloudinary not configured');
    const result = await client.api.resource(imageUrl, { categorization: 'google_tagging', max_results: 10 });
    const tags = result?.categorization?.google_tagging?.data || result?.tags || [];
    if (Array.isArray(tags)) {
      return tags.map((t: any) => ({ confidence: t.confidence || t.prediction || 0, tag: t.name || t.tag || t }));
    }
    if (typeof tags === 'object') {
      return Object.entries(tags).map(([tag, confidence]) => ({ confidence: confidence as number, tag }));
    }
    return [];
  },

  async health() {
    if (!this.isConfigured()) return { available: false, error: 'Cloudinary credentials not set' };
    try {
      const start = Date.now();
      getClient();
      return { available: true, latency: Date.now() - start };
    } catch (err) {
      return { available: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  },
};
