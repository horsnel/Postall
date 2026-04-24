// @ts-nocheck
// OpenAI GPT-4o-mini — Listing enhance, auto-reply, spam (FREE tier: 1M tokens/day for new accounts)
import OpenAI from 'openai';

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

export const openaiProvider = {
  name: 'OpenAI GPT-4o-mini' as const,
  isConfigured: () => !!process.env.OPENAI_API_KEY,
  chatModel: process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini',

  async chat(messages: Array<{ role: string; content: string }>, options?: { temperature?: number; max_tokens?: number }) {
    const client = getClient();
    if (!client) throw new Error('OpenAI API key not configured');
    const response = await client.chat.completions.create({
      model: this.chatModel,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 1000,
    });
    return response.choices[0]?.message?.content || '';
  },

  async health() {
    if (!this.isConfigured()) return { available: false, error: 'OPENAI_API_KEY not set' };
    try {
      const start = Date.now();
      await this.chat([{ role: 'user', content: 'ping' }], { max_tokens: 5 });
      return { available: true, latency: Date.now() - start };
    } catch (err) {
      return { available: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  },
};
