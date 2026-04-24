import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://postall-three.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/browse",
    "/jobs",
    "/autos",
    "/housing",
    "/services",
    "/deals",
    "/about",
    "/contact",
    "/help",
    "/how-it-works",
    "/safety",
    "/pricing",
    "/advertise",
    "/terms",
    "/privacy",
    "/categories",
    "/stores",
    "/community",
    "/events",
    "/testimonials",
  ];

  const categoryPages = [
    "/browse/electronics",
    "/browse/vehicles",
    "/browse/fashion",
    "/browse/property",
    "/browse/services",
    "/browse/jobs",
    "/browse/furniture",
    "/browse/phones",
    "/browse/health",
    "/browse/agriculture",
  ];

  const toolPages = [
    "/tools/ai-chat",
    "/tools/ai-translate",
    "/tools/ai-image",
    "/tools/unit-converter",
    "/tools/currency-converter",
    "/tools/qr-generator",
    "/tools/password-generator",
    "/tools/bmi-calculator",
  ];

  const allPages = [...staticPages, ...categoryPages, ...toolPages];

  return allPages.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1.0 : path.startsWith("/browse") ? 0.8 : 0.6,
  }));
}
