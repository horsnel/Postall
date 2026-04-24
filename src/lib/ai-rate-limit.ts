// In-memory rate limiter for AI endpoints
// Tracks usage per IP address with sliding window

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimits = new Map<string, RateLimitEntry>()

// Config per endpoint type
const RATE_LIMITS: Record<string, { maxRequests: number; windowMs: number }> = {
  chat: { maxRequests: 10, windowMs: 60_000 },             // 10/min
  translate: { maxRequests: 20, windowMs: 60_000 },         // 20/min
  auto_reply: { maxRequests: 5, windowMs: 60_000 },         // 5/min
  image_generate: { maxRequests: 3, windowMs: 60_000 },     // 3/min
  listing_enhance: { maxRequests: 5, windowMs: 60_000 },     // 5/min
  spam_detect: { maxRequests: 15, windowMs: 60_000 },       // 15/min
  image_moderate: { maxRequests: 10, windowMs: 60_000 },    // 10/min
  default: { maxRequests: 10, windowMs: 60_000 },           // 10/min
}

// Clean up expired entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60_000
let lastCleanup = Date.now()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  for (const [key, entry] of rateLimits.entries()) {
    if (now >= entry.resetAt) {
      rateLimits.delete(key)
    }
  }
}

/**
 * Check if a request is allowed based on rate limit rules.
 * Returns { allowed, remaining, resetAt }.
 */
export function checkRateLimit(
  ip: string,
  endpointType: string
): { allowed: boolean; remaining: number; resetAt: number } {
  cleanup()

  const config = RATE_LIMITS[endpointType] || RATE_LIMITS.default
  const key = `${ip}:${endpointType}`
  const now = Date.now()

  const entry = rateLimits.get(key)

  // No entry or expired window — allow
  if (!entry || now >= entry.resetAt) {
    rateLimits.set(key, {
      count: 1,
      resetAt: now + config.windowMs,
    })
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: now + config.windowMs,
    }
  }

  // Within window
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    }
  }

  // Increment count
  entry.count += 1
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  }
}

/**
 * Get standard rate limit headers for a response.
 * Call AFTER checkRateLimit.
 */
export function getRateLimitHeaders(
  ip: string,
  endpointType: string
): Record<string, string> {
  const key = `${ip}:${endpointType}`
  const entry = rateLimits.get(key)
  const config = RATE_LIMITS[endpointType] || RATE_LIMITS.default

  if (!entry) {
    return {
      "X-RateLimit-Limit": String(config.maxRequests),
      "X-RateLimit-Remaining": String(config.maxRequests),
      "X-RateLimit-Reset": String(Math.floor((Date.now() + config.windowMs) / 1000)),
    }
  }

  return {
    "X-RateLimit-Limit": String(config.maxRequests),
    "X-RateLimit-Remaining": String(Math.max(0, config.maxRequests - entry.count)),
    "X-RateLimit-Reset": String(Math.floor(entry.resetAt / 1000)),
  }
}
