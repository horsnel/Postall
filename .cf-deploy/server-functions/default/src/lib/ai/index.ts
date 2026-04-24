// @ts-nocheck
// ============================================
// PostAll AI Layer — Unified Orchestrator
// ============================================
// 
// This is the main entry point for all AI operations.
// It manages provider selection, fallback chains, and
// provides a simple API for the rest of the application.
//
// Usage:
//   import { ai } from '@/lib/ai';
//   const reply = await ai.chat('Hello!');
//   const enhanced = await ai.enhanceListing({ title: '...', description: '...' });
//   const translated = await ai.translate('Hello', 'fr');
//

import type {
  AIFeature,
  FallbackResult,
  ChatProvider,
  ImageModerationResult,
  ImageGenerationResult,
  TranslationResult,
  TranscriptionResult,
  ListingEnhancement,
  SpamDetectionResult,
  AutoReplyResult,
} from './types';
import { AI_CONFIG, SUPPORTED_LANGUAGES, SPAM_KEYWORDS, BLOCKED_IMAGE_TAGS } from './config';

import { glmProvider } from './providers/glm';
import { groqProvider } from './providers/groq';
import { geminiProvider } from './providers/gemini';
import { openaiProvider } from './providers/openai-chat';
import { whisperProvider } from './providers/whisper';
import { cloudinaryAIProvider } from './providers/cloudinary-ai';
import { replicateProvider } from './providers/replicate';
import { zaiImageProvider } from './providers/zai-image';

// Provider registry
const providers: Record<string, any> = {
  glm,
  groq,
  gemini,
  openai,
  whisper,
  cloudinary,
  replicate,
  'zai-image': zaiImageProvider,
};

// ─── FALLBACK EXECUTOR ─────────────────────────────────────

async function executeWithFallback<T>(
  feature: AIFeature,
  executor: (providerName: string) => Promise<T>,
): Promise<FallbackResult<T>> {
  const config = AI_CONFIG[feature];
  const providerOrder = [config.primary, ...config.fallbacks];
  const attempts: FallbackResult<T>['attempts'] = [];

  for (const providerName of providerOrder) {
    const start = Date.now();
    try {
      // Special handling for local fallbacks
      if (providerName === 'local-rules') {
        const result = executor(providerName);
        return {
          data: result,
          provider: providerName,
          attempts: [...attempts, { provider: providerName, success: true, latency: Date.now() - start }],
        };
      }
      if (providerName === 'web-speech') {
        const result = executor(providerName);
        return {
          data: result,
          provider: providerName,
          attempts: [...attempts, { provider: providerName, success: true, latency: Date.now() - start }],
        };
      }
      if (providerName === 'local-filter') {
        const result = executor(providerName);
        return {
          data: result,
          provider: providerName,
          attempts: [...attempts, { provider: providerName, success: true, latency: Date.now() - start }],
        };
      }

      const result = await Promise.race([
        executor(providerName),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), config.timeout)
        ),
      ]);

      return {
        data: result,
        provider: providerName,
        attempts: [...attempts, { provider: providerName, success: true, latency: Date.now() - start }],
      };
    } catch (err) {
      attempts.push({
        provider: providerName,
        success: false,
        latency: Date.now() - start,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  throw new Error(`All AI providers failed for feature "${feature}". Attempts: ${JSON.stringify(attempts)}`);
}

// ─── AI SERVICE ────────────────────────────────────────────

export const ai = {
  // ─── AI ASSISTANT CHAT ─────────────────────────────────
  async chat(userMessage: string, history: Array<{ role: string; content: string }> = []): Promise<FallbackResult<string>> {
    const messages = [
      { role: 'system', content: `You are the PostAll AI Assistant — a friendly marketplace helper. Be concise and helpful.` },
      ...history,
      { role: 'user', content: userMessage },
    ];
    return executeWithFallback<string>('chat', async (providerName) => {
      switch (providerName) {
        case 'glm': return glmProvider.chat(messages);
        case 'groq': return groqProvider.chat(messages);
        case 'gemini': return geminiProvider.chat(messages);
        default: throw new Error(`Unknown chat provider: ${providerName}`);
      }
    });
  },

  // ─── LISTING ENHANCEMENT ───────────────────────────────
  async enhanceListing(listing: { title: string; description: string; category?: string }): Promise<FallbackResult<ListingEnhancement>> {
    const prompt = `Enhance this marketplace listing. Return JSON only.
Title: "${listing.title}"
Description: "${listing.description}"
Category: "${listing.category || 'unknown'}"

Return this format:
{
  "title": "improved title",
  "description": "improved, detailed description (3-5 sentences)",
  "suggestedCategory": "category from: gigs, services, jobs, for-sale, housing, community",
  "suggestedPrice": null,
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`;

    return executeWithFallback<ListingEnhancement>('listing-enhance', async (providerName) => {
      let response: string;
      switch (providerName) {
        case 'openai': response = await openaiProvider.chat([{ role: 'user', content: prompt }]); break;
        case 'gemini': response = await geminiProvider.generateText(prompt); break;
        case 'glm': response = await glmProvider.chat([{ role: 'user', content: prompt }]); break;
        default: throw new Error(`Unknown provider: ${providerName}`);
      }
      // Parse JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Failed to parse AI response as JSON');
      return JSON.parse(jsonMatch[0]);
    });
  },

  // ─── AUTO-REPLY ────────────────────────────────────────
  async autoReply(context: { message: string; listingTitle?: string; sellerName?: string; tone?: string }): Promise<FallbackResult<AutoReplyResult>> {
    const tone = context.tone || 'friendly and professional';
    const prompt = `You are auto-replying to a marketplace inquiry on PostAll. Generate a brief, helpful response.
${context.listingTitle ? `Listing: "${context.listingTitle}"` : ''}
${context.sellerName ? `Seller: ${context.sellerName}` : ''}
Buyer message: "${context.message}"

Reply with ${tone} tone. Keep it under 3 sentences.`;

    return executeWithFallback<AutoReplyResult>('auto-reply', async (providerName) => {
      let reply: string;
      switch (providerName) {
        case 'openai': reply = await openaiProvider.chat([{ role: 'user', content: prompt }], { temperature: 0.8 }); break;
        case 'groq': reply = await groqProvider.chat([{ role: 'user', content: prompt }], { temperature: 0.8 }); break;
        case 'glm': reply = await glmProvider.chat([{ role: 'user', content: prompt }], { temperature: 0.8 }); break;
        default: throw new Error(`Unknown provider: ${providerName}`);
      }
      return { reply, tone, provider: providerName };
    });
  },

  // ─── SPAM DETECTION ────────────────────────────────────
  async detectSpam(text: string): Promise<FallbackResult<SpamDetectionResult>> {
    const prompt = `Analyze this marketplace message for spam. Reply with JSON only:
"${text}"

Return: {"isSpam": boolean, "score": number (0-1), "reasons": ["reason1", "reason2"]}`;

    return executeWithFallback<SpamDetectionResult>('spam-detect', async (providerName) => {
      // Local rule-based fallback
      if (providerName === 'local-rules') {
        const lowerText = text.toLowerCase();
        const matchedKeywords = SPAM_KEYWORDS.filter(kw => lowerText.includes(kw));
        const isSpam = matchedKeywords.length >= 2;
        const score = Math.min(matchedKeywords.length / 3, 1);
        return {
          isSpam,
          score,
          reasons: matchedKeywords.length > 0 ? [`Matched spam keywords: ${matchedKeywords.join(', ')}`] : ['No spam indicators'],
          provider: 'local-rules',
        };
      }

      let response: string;
      switch (providerName) {
        case 'openai': response = await openaiProvider.chat([{ role: 'user', content: prompt }], { temperature: 0 }); break;
        case 'gemini': response = await geminiProvider.generateText(prompt, { temperature: 0 }); break;
        default: throw new Error(`Unknown provider: ${providerName}`);
      }
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Failed to parse spam detection response');
      return { ...JSON.parse(jsonMatch[0]), provider: providerName };
    });
  },

  // ─── TRANSLATION ───────────────────────────────────────
  async translate(text: string, targetLang: string, sourceLang?: string): Promise<FallbackResult<TranslationResult>> {
    return executeWithFallback<TranslationResult>('translate', async (providerName) => {
      switch (providerName) {
        case 'gemini': {
          const prompt = sourceLang
            ? `Translate to ${targetLang}: "${text}"`
            : `Detect the language and translate to ${targetLang}: "${text}"`;
          const result = await geminiProvider.generateText(prompt);
          return { translatedText: result, provider: 'gemini' };
        }
        case 'glm': {
          const prompt = `Translate the following text to ${targetLang}. Only return the translation: "${text}"`;
          const translated = await glmProvider.chat([{ role: 'user', content: prompt }], { temperature: 0.1 });
          return { translatedText: translated, provider: 'glm' };
        }
        default: throw new Error(`Unknown translation provider: ${providerName}`);
      }
    });
  },

  // ─── VOICE TRANSCRIPTION ───────────────────────────────
  async transcribe(audioBuffer: Buffer, mimeType?: string): Promise<FallbackResult<TranscriptionResult>> {
    return executeWithFallback<TranscriptionResult>('voice', async (providerName) => {
      if (providerName === 'web-speech') {
        throw new Error('Web Speech API is client-side only. Use the browser SpeechRecognition API directly.');
      }
      const text = await whisperProvider.transcribe(audioBuffer, mimeType);
      return { text, provider: 'whisper' };
    });
  },

  // ─── IMAGE MODERATION ──────────────────────────────────
  async moderateImage(imageUrl: string): Promise<FallbackResult<ImageModerationResult>> {
    return executeWithFallback<ImageModerationResult>('image-moderate', async (providerName) => {
      if (providerName === 'local-filter') {
        return {
          isSafe: true,
          categories: {},
          provider: 'local-filter',
        };
      }
      if (providerName === 'cloudinary') {
        const result = await cloudinaryAIProvider.moderate(imageUrl);
        return { ...result, provider: 'cloudinary' };
      }
      if (providerName === 'gemini') {
        const analysis = await geminiProvider.analyzeImage(imageUrl, 'image/jpeg', 
          'Analyze this image for inappropriate content. Reply JSON only: {"isSafe": boolean, "categories": {"violence": 0, "nudity": 0, "hate": 0}}'
        );
        const jsonMatch = analysis.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Failed to parse Gemini moderation response');
        return { ...JSON.parse(jsonMatch[0]), provider: 'gemini' };
      }
      throw new Error(`Unknown moderation provider: ${providerName}`);
    });
  },

  // ─── IMAGE GENERATION ──────────────────────────────────
  async generateImage(prompt: string, options?: { size?: string; width?: number; height?: number }): Promise<FallbackResult<ImageGenerationResult>> {
    return executeWithFallback<ImageGenerationResult>('image-generate', async (providerName) => {
      if (providerName === 'zai-image') {
        const base64 = await zaiImageProvider.generateImage(prompt, { size: options?.size });
        return { base64, provider: 'zai-image' };
      }
      if (providerName === 'replicate') {
        const urls = await replicateProvider.generateImage(prompt, { width: options?.width, height: options?.height });
        return { urls, provider: 'replicate' };
      }
      throw new Error(`Unknown image generation provider: ${providerName}`);
    });
  },

  // ─── IMAGE TAGGING ─────────────────────────────────────
  async tagImage(imageUrl: string): Promise<FallbackResult<ImageGenerationResult & { tags: Array<{ confidence: number; tag: string }> }>> {
    return executeWithFallback<any>('image-tag', async (providerName) => {
      if (providerName === 'cloudinary') {
        const tags = await cloudinaryAIProvider.tag(imageUrl);
        // Check against blocked tags
        const blockedTags = BLOCKED_IMAGE_TAGS.filter(bt =>
          tags.some(t => t.tag.toLowerCase().includes(bt))
        );
        return { tags, isSafe: blockedTags.length === 0, blockedTags, provider: 'cloudinary' };
      }
      if (providerName === 'gemini') {
        const analysis = await geminiProvider.analyzeImage(imageUrl, 'image/jpeg',
          'List all objects, scenes, and concepts in this image. Reply JSON only: {"tags": [{"tag": "object", "confidence": 0.95}]}'
        );
        const jsonMatch = analysis.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Failed to parse Gemini tag response');
        return { ...JSON.parse(jsonMatch[0]), provider: 'gemini' };
      }
      throw new Error(`Unknown tagging provider: ${providerName}`);
    });
  },

  // ─── HEALTH CHECK ALL ──────────────────────────────────
  async healthCheck(): Promise<Record<string, { available: boolean; latency?: number; error?: string }>> {
    const checks = await Promise.all([
      glmProvider.health(),
      groqProvider.health(),
      geminiProvider.health(),
      openaiProvider.health(),
      whisperProvider.health(),
      cloudinaryAIProvider.health(),
      replicateProvider.health(),
      zaiImageProvider.health(),
    ]);
    
    const names = ['glm', 'groq', 'gemini', 'openai', 'whisper', 'cloudinary', 'replicate', 'zai-image'];
    const result: Record<string, any> = {};
    names.forEach((name, i) => {
      result[name] = checks[i];
    });
    return result;
  },

  // ─── SUPPORTED LANGUAGES ───────────────────────────────
  languages: SUPPORTED_LANGUAGES,
};

export default ai;
