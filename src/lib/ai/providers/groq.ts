// @ts-nocheck
// Groq — Ultra-fast Llama 3.1 70B (FREE tier: 30 requests/min)
import Groq from 'groq-sdk';

function getClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  return new Groq({ apiKey, dangerouslyAllowBrowser: false });
}

export const groqProvider = {
  name: 'Groq (Llama 3.1 70B)' as const,
  isConfigured: () => !!process.env.GROQ_API_KEY,
  model: process.env.GROQ_MODEL || 'llama-3.1-70b-versatile',

  async chat(messages: Array<{ role: string; content: string }>, options?: { temperature?: number; max_tokens?: number }) {
    const client = getClient();
    if (!client) throw new Error('Groq API key not configured');
    const response = await client.chat.completions.create({
      model: this.model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 1000,
    });
    return response.choices[0]?.message?.content || '';
  },

  async health() {
    if (!this.isConfigured()) return { available: false, error: 'GROQ_API_KEY not set' };
    try {
      const start = Date.now();
      await this.chat([{ role: 'user', content: 'ping' }], { max_tokens: 5 });
      return { available: true, latency: Date.now() - start };
    } catch (err) {
      return { available: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  },
};
