// @ts-nocheck
// Z.ai GLM — Primary chat model (FREE, unlimited via dev SDK)
import ZAI from 'z-ai-web-dev-sdk';

let _zai: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getClient() {
  if (!_zai) {
    _zai = await ZAI.create();
  }
  return _zai;
}

export const glmProvider = {
  name: 'GLM (Z.ai)' as const,
  isConfigured: () => true, // Always available via dev SDK

  async chat(messages: Array<{ role: string; content: string }>, options?: { temperature?: number; max_tokens?: number }) {
    const client = await getClient();
    const completion = await client.chat.completions.create({
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 1000,
    });
    return completion.choices[0]?.message?.content || '';
  },

  async health(): Promise<{ available: boolean; latency?: number; error?: string }> {
    try {
      const start = Date.now();
      await this.chat([{ role: 'user', content: 'ping' }], { max_tokens: 5 });
      return { available: true, latency: Date.now() - start };
    } catch (err) {
      return { available: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  },
};
