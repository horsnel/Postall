// Google Cloud Translation — Real-time translation (FREE: 500K chars/month)
// Uses REST API to avoid heavy @google-cloud/translate SDK dependency

export const googleTranslateProvider = {
  name: 'Google Translate' as const,
  isConfigured: () => !!process.env.GOOGLE_TRANSLATE_API_KEY,

  async translate(text: string, targetLang: string, sourceLang?: string): Promise<string> {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey) throw new Error('Google Translate API key not configured');

    const params = new URLSearchParams({
      key: apiKey,
      q: text,
      target: targetLang,
      ...(sourceLang ? { source: sourceLang } : {}),
      format: 'text',
    });

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?${params.toString()}`,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(`Google Translate API error: ${err?.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data?.data?.translations?.[0]?.translatedText || text;
  },

  async detectLanguage(text: string): Promise<{ language: string; confidence: number }> {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey) throw new Error('Google Translate API key not configured');

    const params = new URLSearchParams({
      key: apiKey,
      q: text,
    });

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2/detect?${params.toString()}`,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(`Google Translate detect error: ${err?.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const detection = data?.data?.detections?.[0]?.[0];
    return {
      language: detection?.language || 'en',
      confidence: detection?.confidence || 0,
    };
  },

  async health() {
    if (!this.isConfigured()) return { available: false, error: 'GOOGLE_TRANSLATE_API_KEY not set' };
    try {
      const start = Date.now();
      await this.translate('hello', 'es');
      return { available: true, latency: Date.now() - start };
    } catch (err) {
      return { available: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  },
};
