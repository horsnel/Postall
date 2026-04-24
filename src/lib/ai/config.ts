// ============================================
// PostAll AI Layer — Model Configuration & Fallback Chains
// ============================================

import type { AIFeatureConfig } from './types';

/**
 * Fallback chain configuration for each AI feature.
 * 
 * When the primary provider fails or times out, it automatically
 * tries the next fallback in order until one succeeds.
 * 
 * FREE MODELS USED:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Provider            │ Free Tier                    │ Use   │
 * ├─────────────────────┼──────────────────────────────┼───────┤
 * │ GLM (Z.ai)         │ Unlimited via dev SDK        │ Chat  │
 * │ Groq Llama 3.1 70B │ 30 req/min                   │ Chat  │
 * │ Gemini Flash        │ 15 RPM, 1M tokens/day        │ Multi │
 * │ GPT-4o-mini         │ 1M tokens/day (new accounts) │ Text  │
 * │ Whisper             │ Via browser Speech API       │ Voice │
 * │ Cloudinary AI       │ 25 credits/day               │ Image │
 * │ Google Translate    │ 500K chars/month             │ i18n  │
 * │ Replicate SDXL      │ Limited free credits         │ ImgGen│
 * │ HuggingFace         │ Free tier                    │ Class │
 * └─────────────────────────────────────────────────────────────┘
 */
export const AI_CONFIG: Record<string, AIFeatureConfig> = {
  // ─── AI ASSISTANT CHAT ────────────────────────────────────
  // Primary: GLM (always available, unlimited free)
  // Fallback 1: Groq (ultra-fast Llama 3.1, 30 RPM free)
  // Fallback 2: Gemini Flash (15 RPM free, 1M tokens/day)
  chat: {
    primary: 'glm',
    fallbacks: ['groq', 'gemini'],
    timeout: 10000,
  },

  // ─── LISTING DESCRIPTION ENHANCEMENT ──────────────────────
  // Primary: GPT-4o-mini (best at structured text generation)
  // Fallback 1: Gemini Flash (good at creative writing)
  // Fallback 2: GLM (reliable fallback)
  'listing-enhance': {
    primary: 'openai',
    fallbacks: ['gemini', 'glm'],
    timeout: 15000,
  },

  // ─── AUTO-REPLY GENERATION ────────────────────────────────
  // Primary: GPT-4o-mini (good conversational ability)
  // Fallback 1: Groq Llama 3.1 (fast, good at chat)
  // Fallback 2: GLM (always available)
  'auto-reply': {
    primary: 'openai',
    fallbacks: ['groq', 'glm'],
    timeout: 10000,
  },

  // ─── SPAM / CONTENT MODERATION ────────────────────────────
  // Primary: GPT-4o-mini (excellent at classification)
  // Fallback 1: Gemini Flash (good safety filters)
  // Fallback 2: Rule-based local check
  'spam-detect': {
    primary: 'openai',
    fallbacks: ['gemini', 'local-rules'],
    timeout: 8000,
  },

  // ─── TRANSLATION ──────────────────────────────────────────
  // Primary: Google Translate (best quality, 500K chars/month free)
  // Fallback 1: Gemini Flash (built-in translation)
  // Fallback 2: GLM (can translate via prompting)
  translate: {
    primary: 'gemini',
    fallbacks: ['glm'],
    timeout: 10000,
  },

  // ─── VOICE TRANSCRIPTION ──────────────────────────────────
  // Primary: Whisper API (OpenAI, most accurate)
  // Fallback: Browser Web Speech API (client-side)
  voice: {
    primary: 'whisper',
    fallbacks: ['web-speech'],
    timeout: 30000,
  },

  // ─── IMAGE MODERATION ─────────────────────────────────────
  // Primary: Cloudinary AI (purpose-built for this)
  // Fallback 1: Gemini Vision (can analyze images)
  // Fallback 2: Basic local check
  'image-moderate': {
    primary: 'cloudinary',
    fallbacks: ['gemini', 'local-filter'],
    timeout: 15000,
  },

  // ─── IMAGE GENERATION ─────────────────────────────────────
  // Primary: Z.ai Image (always available, free)
  // Fallback: Replicate SDXL (limited free credits)
  'image-generate': {
    primary: 'zai-image',
    fallbacks: ['replicate'],
    timeout: 60000,
  },

  // ─── IMAGE AUTO-TAGGING ───────────────────────────────────
  // Primary: Cloudinary AI (auto-tagging built-in)
  // Fallback 1: Gemini Vision (can describe/tag images)
  'image-tag': {
    primary: 'cloudinary',
    fallbacks: ['gemini'],
    timeout: 15000,
  },
};

// Language codes for translation
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'ar', name: 'Arabic' },
  { code: 'sw', name: 'Swahili' },
  { code: 'am', name: 'Amharic' },
  { code: 'ha', name: 'Hausa' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'ig', name: 'Igbo' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'de', name: 'German' },
  { code: 'af', name: 'Afrikaans' },
  { code: 'zu', name: 'Zulu' },
] as const;

// Spam detection keywords (local fallback)
export const SPAM_KEYWORDS = [
  'click here now', 'free money', 'urgent action required',
  'you have won', 'limited time offer', 'act now',
  'bitcoin investment', 'crypto giveaway', 'wire transfer',
  'nigerian prince', 'lottery winner', '100% guarantee',
];

// Image moderation blocked tags (local fallback)
export const BLOCKED_IMAGE_TAGS = [
  'nudity', 'violence', 'weapon', 'drug', 'gore',
  'hate symbol', 'explicit', 'nsfw', 'adult content',
];
