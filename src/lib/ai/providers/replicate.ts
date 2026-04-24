// @ts-nocheck
// Replicate — Image generation via Stable Diffusion XL (FREE: limited credits)
import Replicate from 'replicate';

function getClient() {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return null;
  return new Replicate({ auth: token });
}

export const replicateProvider = {
  name: 'Replicate (SDXL)' as const,
  isConfigured: () => !!process.env.REPLICATE_API_TOKEN,

  async generateImage(prompt: string, options?: { width?: number; height?: number; numOutputs?: number }): Promise<string[]> {
    const client = getClient();
    if (!client) throw new Error('Replicate API token not configured');
    const output = await client.run(
      'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
      {
        input: {
          prompt,
          negative_prompt: 'blurry, low quality, distorted, watermark',
          width: options?.width || 1024,
          height: options?.height || 1024,
          num_outputs: options?.numOutputs || 1,
          guidance_scale: 7.5,
          num_inference_steps: 30,
        },
      }
    );
    return Array.isArray(output) ? output : [output as string];
  },

  async health() {
    if (!this.isConfigured()) return { available: false, error: 'REPLICATE_API_TOKEN not set' };
    try {
      const start = Date.now();
      getClient();
      return { available: true, latency: Date.now() - start };
    } catch (err) {
      return { available: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  },
};
