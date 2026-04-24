
import { NextResponse } from "next/server";

const SITE_URL = "https://postall.com";

interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: string;
  priority: number;
}

function createEntry(path: string, changeFreq: string, priority: number): SitemapEntry {
  return {
    url: `${SITE_URL}${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: changeFreq,
    priority: priority,
  };
}

export async function GET() {
  const staticPages: SitemapEntry[] = [
    createEntry("/", "daily", 1.0),
    createEntry("/browse", "daily", 0.9),
    createEntry("/jobs", "daily", 0.9),
    createEntry("/autos", "daily", 0.9),
    createEntry("/housing", "daily", 0.9),
    createEntry("/services", "daily", 0.9),
    createEntry("/deals", "daily", 0.8),
    createEntry("/events", "weekly", 0.8),
    createEntry("/stores", "weekly", 0.7),
    createEntry("/how-it-works", "monthly", 0.7),
    createEntry("/testimonials", "monthly", 0.6),
    createEntry("/contact", "monthly", 0.6),
    createEntry("/about", "monthly", 0.5),
    createEntry("/safety", "monthly", 0.6),
    createEntry("/privacy", "yearly", 0.3),
    createEntry("/terms", "yearly", 0.3),
    createEntry("/advertise", "monthly", 0.6),
    createEntry("/pricing", "monthly", 0.6),
    createEntry("/post-task", "monthly", 0.8),
    createEntry("/find-work", "monthly", 0.8),
    createEntry("/sell-item", "monthly", 0.8),
    createEntry("/promote", "monthly", 0.6),
    createEntry("/help", "monthly", 0.5),
    createEntry("/categories", "weekly", 0.6),
    createEntry("/community", "daily", 0.7),
    createEntry("/community/forums", "daily", 0.6),
    createEntry("/community/lost-found", "daily", 0.6),
    createEntry("/near-me", "weekly", 0.7),
    createEntry("/compare", "weekly", 0.6),
    createEntry("/reviews", "daily", 0.6),
    createEntry("/favorites", "weekly", 0.5),
    createEntry("/blog", "weekly", 0.6),
    createEntry("/sitemap", "monthly", 0.3),
    createEntry("/download", "yearly", 0.2),
    createEntry("/recently-viewed", "weekly", 0.3),
    createEntry("/saved-searches", "weekly", 0.4),
    createEntry("/buyer-protection", "monthly", 0.5),
    createEntry("/verify-seller", "monthly", 0.5),
    createEntry("/welcome", "monthly", 0.4),
    createEntry("/tools", "weekly", 0.6),
    createEntry("/tools/smart-alerts", "weekly", 0.5),
    createEntry("/tools/price-check", "weekly", 0.5),
    createEntry("/tools/translate", "weekly", 0.5),
    createEntry("/tools/instant-pay", "weekly", 0.5),
    createEntry("/tools/safe-spots", "monthly", 0.5),
    createEntry("/tools/housing", "weekly", 0.5),
    createEntry("/tools/ai-assistant", "weekly", 0.5),
    createEntry("/tools/scheduler", "weekly", 0.5),
    createEntry("/tools/escrow", "monthly", 0.5),
    createEntry("/tools/verify-id", "weekly", 0.5),
    createEntry("/tools/emergency", "monthly", 0.5),
    createEntry("/tools/my-reputation", "weekly", 0.5),
    createEntry("/tools/learn-skills", "weekly", 0.5),
    createEntry("/tools/team-up", "weekly", 0.5),
    createEntry("/tools/events", "weekly", 0.5),
    createEntry("/tools/proof-cam", "weekly", 0.5),
    createEntry("/tools/auto-reply", "weekly", 0.5),
    createEntry("/tools/freecycle", "weekly", 0.5),
    createEntry("/tools/ship-helper", "weekly", 0.5),
    createEntry("/tools/market-insights", "weekly", 0.5),
  ];

  const categories = ["gigs", "services", "jobs", "for-sale", "housing", "community"];
  const categoryPages = categories.map((cat) =>
    createEntry(`/browse/${cat}`, "daily", 0.7)
  );

  const allPages = [...staticPages, ...categoryPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}
