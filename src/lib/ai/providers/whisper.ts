// @ts-nocheck
// Whisper — Voice transcription (OpenAI free tier OR browser Web Speech API)
import OpenAI from 'openai';

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

export const whisperProvider = {
  name: 'Whisper (OpenAI)' as const,
  isConfigured: () => !!process.env.OPENAI_API_KEY,

  async transcribe(audioBuffer: Buffer, mimeType: string = 'audio/webm') {
    const client = getClient();
    if (!client) throw new Error('OpenAI API key not configured');
    const file = new File([audioBuffer], 'audio.webm', { type: mimeType });
    const transcription = await client.audio.transcriptions.create({
      model: 'whisper-1',
      file,
    });
    return transcription.text;
  },

  // Fallback: instruction for client-side Web Speech API
  browserFallback: {
    available: typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window),
    instruction: 'Use browser Web Speech API (SpeechRecognition) for client-side transcription as fallback.',
  },

  async health() {
    if (!this.isConfigured()) return { available: false, error: 'OPENAI_API_KEY not set (use Web Speech API fallback)' };
    try {
      const start = Date.now();
      // Whisper health check — just verify the client initializes
      getClient();
      return { available: true, latency: Date.now() - start };
    } catch (err) {
      return { available: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  },
};
