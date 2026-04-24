// Simple in-memory cache for AI responses
// Cache key = hash of prompt + model + params
// TTL: 5 minutes for translations, 1 hour for listing enhancements

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

const cache = new Map<string, CacheEntry<unknown>>()

// Clean up expired entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60_000
let lastCleanup = Date.now()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  for (const [key, entry] of cache.entries()) {
    if (now >= entry.expiresAt) {
      cache.delete(key)
    }
  }
}

// Predefined TTL values
export const CACHE_TTL = {
  translate: 5 * 60_000,        // 5 minutes
  listing_enhance: 60 * 60_000, // 1 hour
  spam_detect: 10 * 60_000,    // 10 minutes
  auto_reply: 30 * 60_000,     // 30 minutes
  default: 5 * 60_000,         // 5 minutes
} as const

/**
 * Generate a deterministic cache key from parts.
 * Uses a simple string hash for consistency.
 */
export function generateCacheKey(...parts: string[]): string {
  const combined = parts.join("::")
  // Simple hash function
  let hash = 0
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = ((hash << 5) - hash + char) | 0
  }
  return `ai_cache_${Math.abs(hash).toString(36)}`
}

/**
 * Get a cached value if it exists and hasn't expired.
 * Returns null if not found or expired.
 */
export function getCached<T>(key: string): T | null {
  cleanup()

  const entry = cache.get(key)
  if (!entry) return null

  if (Date.now() >= entry.expiresAt) {
    cache.delete(key)
    return null
  }

  return entry.data as T
}

/**
 * Set a cache value with a TTL.
 */
export function setCache<T>(key: string, data: T, ttlMs: number): void {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  })
}

/**
 * Get cache stats (useful for debugging / monitoring).
 */
export function getCacheStats() {
  cleanup()
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  }
}
