
import { NextRequest, NextResponse } from "next/server";

// ─── In-memory translation cache ───────────────────────────────
const translationCache = new Map<string, { translatedText: string; timestamp: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// ─── Rate limiting (per IP, 20 req/min) ────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_MINUTE = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

// ─── Supported languages ──────────────────────────────────────
const SUPPORTED_LANGS = ["en", "yo", "ha", "ig", "pcm"];

function getCacheKey(text: string, fromLang: string, toLang: string) {
  return `${fromLang}|${toLang}|${text}`.toLowerCase();
}

function cleanCache() {
  const now = Date.now();
  for (const [key, val] of translationCache.entries()) {
    if (now - val.timestamp > CACHE_TTL_MS) {
      translationCache.delete(key);
    }
  }
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.resetAt > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, resetAt: now });
    return { allowed: true, remaining: MAX_REQUESTS_PER_MINUTE - 1 };
  }

  if (entry.count >= MAX_REQUESTS_PER_MINUTE) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: MAX_REQUESTS_PER_MINUTE - entry.count };
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit check
    const ip = getClientIp(request);
    const { allowed, remaining } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Max 20 translations per minute." },
        { status: 429, headers: { "X-RateLimit-Remaining": "0" } }
      );
    }

    const body = await request.json();
    const { text, fromLang, toLang } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "text is required and must be a string" },
        { status: 400 }
      );
    }

    // Default: translate TO English if no target specified
    const targetLang = toLang || "en";
    const sourceLang = fromLang || "auto";

    if (!SUPPORTED_LANGS.includes(targetLang)) {
      return NextResponse.json(
        { error: `Unsupported target language: ${targetLang}. Supported: ${SUPPORTED_LANGS.join(", ")}` },
        { status: 400 }
      );
    }

    // Clean old cache entries periodically
    if (Math.random() < 0.1) cleanCache();

    // Check cache
    const cacheKey = getCacheKey(text, sourceLang, targetLang);
    const cached = translationCache.get(cacheKey);
    if (cached) {
      return NextResponse.json({
        translatedText: cached.translatedText,
        fromLang: sourceLang,
        toLang: targetLang,
        cached: true,
      }, {
        headers: { "X-RateLimit-Remaining": String(remaining) },
      });
    }

    // Use the existing AI translation endpoint via internal fetch
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const translateRes = await fetch(`${baseUrl}/api/ai/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        targetLang,
        sourceLang,
      }),
    });

    if (!translateRes.ok) {
      const errData = await translateRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: errData.error || "Translation service unavailable" },
        { status: translateRes.status }
      );
    }

    const data = await translateRes.json();
    const translatedText = data.translatedText || text;

    // Store in cache
    translationCache.set(cacheKey, {
      translatedText,
      timestamp: Date.now(),
    });

    return NextResponse.json({
      translatedText,
      fromLang: sourceLang,
      toLang: targetLang,
      detectedLanguage: data.detectedLanguage,
      cached: false,
    }, {
      headers: { "X-RateLimit-Remaining": String(remaining) },
    });
  } catch (error) {
    console.error("Chat translation error:", error);
    const message = error instanceof Error ? error.message : "Translation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    languages: SUPPORTED_LANGS.map((code) => {
      const labels: Record<string, string> = {
        en: "English",
        yo: "Yoruba",
        ha: "Hausa",
        ig: "Igbo",
        pcm: "Pidgin",
      };
      return { code, label: labels[code] || code };
    }),
    rateLimit: {
      maxPerMinute: MAX_REQUESTS_PER_MINUTE,
      windowMs: RATE_LIMIT_WINDOW_MS,
    },
  });
}
