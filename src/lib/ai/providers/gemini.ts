// Google Gemini Flash — Multi-purpose (FREE tier: 15 RPM, 1M tokens/day)
import { GoogleGenerativeAI } from '@google/generative-ai';

function getClient() {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
}

export const geminiProvider = {
  name: 'Google Gemini Flash' as const,
  isConfigured: () => !!process.env.GOOGLE_AI_API_KEY,
  model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',

  async chat(messages: Array<{ role: string; content: string }>, options?: { temperature?: number; max_tokens?: number }) {
    const genAI = getClient();
    if (!genAI) throw new Error('Google AI API key not configured');
    const model = genAI.getGenerativeModel({ model: this.model });

    // Convert chat format to Gemini format
    const lastMessage = messages[messages.length - 1];
    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' as const : 'user' as const,
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.content);
    return result.response.text();
  },

  async generateText(prompt: string, options?: { temperature?: number; max_tokens?: number }) {
    const genAI = getClient();
    if (!genAI) throw new Error('Google AI API key not configured');
    const model = genAI.getGenerativeModel({
      model: this.model,
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.max_tokens ?? 1000,
      },
    });
    const result = await model.generateContent(prompt);
    return result.response.text();
  },

  async analyzeImage(imageBase64: string, mimeType: string, prompt: string) {
    const genAI = getClient();
    if (!genAI) throw new Error('Google AI API key not configured');
    const model = genAI.getGenerativeModel({ model: this.model });
    const result = await model.generateContent([
      { inlineData: { data: imageBase64, mimeType } },
      prompt,
    ]);
    return result.response.text();
  },

  async health() {
    if (!this.isConfigured()) return { available: false, error: 'GOOGLE_AI_API_KEY not set' };
    try {
      const start = Date.now();
      await this.generateText('ping', { max_tokens: 5 });
      return { available: true, latency: Date.now() - start };
    } catch (err) {
      return { available: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  },
};
