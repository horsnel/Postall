// ============================================
// PostAll AI Layer — Type Definitions
// ============================================

export interface AIProvider {
  name: string;
  isConfigured: () => boolean;
  health: () => Promise<{ available: boolean; latency?: number; error?: string }>;
}

export interface ChatProvider extends AIProvider {
  chat: (messages: Array<{ role: string; content: string }>, options?: { temperature?: number; max_tokens?: number }) => Promise<string>;
}

export interface VisionProvider extends AIProvider {
  analyzeImage: (imageBase64: string, mimeType: string, prompt: string) => Promise<string>;
}

export interface ImageModerationResult {
  isSafe: boolean;
  categories: Record<string, number>;
  tags?: Array<{ confidence: number; tag: string }>;
}

export interface ImageGenerationResult {
  urls?: string[];
  base64?: string;
  provider: string;
}

export interface TranslationResult {
  translatedText: string;
  detectedLanguage?: string;
  confidence?: number;
  provider: string;
}

export interface TranscriptionResult {
  text: string;
  confidence?: number;
  provider: string;
}

export interface ListingEnhancement {
  title: string;
  description: string;
  suggestedCategory?: string;
  suggestedPrice?: number;
  tags?: string[];
}

export interface SpamDetectionResult {
  isSpam: boolean;
  score: number; // 0-1
  reasons: string[];
  provider: string;
}

export interface AutoReplyResult {
  reply: string;
  tone: string;
  provider: string;
}

export interface AIFeatureConfig {
  primary: string;        // Provider name
  fallbacks: string[];    // Ordered fallback provider names
  timeout: number;        // ms before trying next fallback
}

// Fallback chain execution result
export interface FallbackResult<T> {
  data: T;
  provider: string;
  attempts: Array<{ provider: string; success: boolean; latency: number; error?: string }>;
}

// AI Features enum
export type AIFeature = 
  | 'chat'          // AI Assistant
  | 'listing-enhance'  // Listing description enhancement
  | 'auto-reply'    // Auto-reply generation
  | 'spam-detect'   // Spam/content detection
  | 'translate'     // Message translation
  | 'voice'         // Voice transcription
  | 'image-moderate' // Image moderation
  | 'image-generate' // Image generation
  | 'image-tag';    // Image auto-tagging
