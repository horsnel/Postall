// ============================================
// PostAll SEO Metadata Constants & Helpers
// ============================================
// Centralized SEO metadata for all key pages.
// Used by components to set dynamic meta tags.

import type { Metadata } from "next";

export interface PageSEO {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

const SITE_URL = "https://postall.com";
const SITE_NAME = "PostAll";
const DEFAULT_OG_IMAGE = "/favicon.svg";

export const pageSEO: Record<string, PageSEO> = {
  '/': {
    title: 'PostAll — The All-in-One Marketplace Platform',
    description: 'Post tasks, find work, buy and sell items, and access 24 powerful tools. No signup required to browse. Crypto and fiat accepted with platform escrow protection.',
    keywords: ['marketplace', 'tasks', 'gigs', 'services', 'jobs', 'for sale', 'crypto', 'escrow', 'freelance', 'nigeria', 'postall'],
  },
  '/browse': {
    title: 'Browse Marketplace — PostAll',
    description: 'Browse thousands of listings across gigs, services, jobs, items for sale, and more on PostAll — Nigeria\'s largest P2P marketplace.',
    keywords: ['browse', 'marketplace', 'listings', 'nigeria', 'search', 'postall'],
  },
  '/jobs': {
    title: 'Jobs & Careers in Nigeria — PostAll',
    description: 'Find your next career opportunity on PostAll. Browse thousands of job listings across technology, marketing, design, finance, healthcare, and more in Nigeria.',
    keywords: ['jobs', 'careers', 'employment', 'nigeria', 'hiring', 'full-time', 'part-time', 'remote', 'postall'],
  },
  '/services': {
    title: 'Local Services Directory — PostAll',
    description: 'Find trusted local service providers on PostAll. Browse 2,500+ verified professionals across 18 service categories including IT, home repair, beauty, and education.',
    keywords: ['services', 'professionals', 'local services', 'nigeria', 'hire', 'freelance', 'postall'],
  },
  '/deals': {
    title: 'Deals & Promotions — PostAll',
    description: 'Discover the best deals and promotions on PostAll. Save up to 70% on electronics, fashion, vehicles, and more across Nigeria.',
    keywords: ['deals', 'promotions', 'discounts', 'sales', 'nigeria', 'save money', 'postall'],
  },
  '/events': {
    title: 'Local Events & Happenings — PostAll',
    description: 'Discover events near you on PostAll. Find concerts, workshops, meetups, conferences, and community activities happening in your city.',
    keywords: ['events', 'concerts', 'workshops', 'meetups', 'nigeria', 'local events', 'postall'],
  },
  '/how-it-works': {
    title: 'How PostAll Works — Step-by-Step Guide',
    description: 'Learn how to use PostAll in 4 simple steps. Browse, post, pay securely with escrow, and get results. Complete buyer and seller guide with FAQ.',
    keywords: ['how it works', 'guide', 'tutorial', 'postall', 'marketplace guide', 'escrow'],
  },
  '/testimonials': {
    title: 'Testimonials & Reviews — PostAll',
    description: 'See what thousands of users say about PostAll. Real stories from buyers, sellers, and freelancers across Nigeria.',
    keywords: ['testimonials', 'reviews', 'success stories', 'user feedback', 'postall'],
  },
  '/contact': {
    title: 'Contact Us — PostAll Support',
    description: 'Get in touch with PostAll support. Email, WhatsApp, phone, and social media channels available. 24/7 support for all your marketplace needs.',
    keywords: ['contact', 'support', 'help', 'customer service', 'postall'],
  },
  '/about': {
    title: 'About PostAll — Our Story',
    description: 'Learn about PostAll — Nigeria\'s largest P2P marketplace. Our mission, team, and vision for connecting people across West Africa.',
    keywords: ['about', 'company', 'team', 'mission', 'postall', 'nigeria'],
  },
  '/safety': {
    title: 'Safety Center — PostAll',
    description: 'Stay safe on PostAll. Learn about escrow protection, verified sellers, safe meeting spots, scam prevention, and emergency contacts.',
    keywords: ['safety', 'security', 'escrow', 'scam prevention', 'safe trading', 'postall'],
  },
  '/privacy': {
    title: 'Privacy Policy — PostAll',
    description: 'Read PostAll\'s privacy policy. Learn how we collect, use, and protect your personal data on our marketplace platform.',
    keywords: ['privacy', 'privacy policy', 'data protection', 'personal data', 'postall'],
  },
  '/terms': {
    title: 'Terms of Service — PostAll',
    description: 'Read PostAll\'s terms of service. Understand the rules, guidelines, and policies for using our marketplace platform.',
    keywords: ['terms', 'terms of service', 'guidelines', 'policies', 'postall'],
  },
  '/advertise': {
    title: 'Advertise on PostAll — Grow Your Business',
    description: 'Reach 50K+ daily visitors on PostAll. Advertise your business with Basic, Professional, or Enterprise plans starting from ₦10,000/month.',
    keywords: ['advertise', 'advertising', 'business', 'marketing', 'promote', 'postall'],
  },
  '/stores': {
    title: 'Browse Stores — PostAll Marketplace',
    description: 'Discover verified stores on PostAll. Browse top-rated sellers, their listings, reviews, and find the best deals across all categories.',
    keywords: ['stores', 'shops', 'verified sellers', 'top sellers', 'nigeria', 'postall'],
  },
  '/sitemap': {
    title: 'Sitemap — PostAll',
    description: 'Complete sitemap of all pages on PostAll marketplace. Find links to all marketplace categories, tools, and resources.',
    keywords: ['sitemap', 'pages', 'navigation', 'postall'],
  },
  '/post-task': {
    title: 'Post a Task — PostAll',
    description: 'Post a task on PostAll and get it done. Describe what you need, set a budget, and receive applications from skilled freelancers across Nigeria.',
    keywords: ['post task', 'hire freelancer', 'get work done', 'nigeria', 'postall'],
  },
  '/find-work': {
    title: 'Find Work & Freelance Jobs — PostAll',
    description: 'Find work on PostAll. Browse tasks and gigs matching your skills. Apply, get hired, and earn money on Nigeria\'s largest freelance marketplace.',
    keywords: ['find work', 'freelance jobs', 'gigs', 'earn money', 'nigeria', 'postall'],
  },
  '/sell-item': {
    title: 'Sell Items Online — PostAll Marketplace',
    description: 'Sell items on PostAll — Nigeria\'s largest P2P marketplace. List electronics, vehicles, furniture, fashion, and more. Secure escrow payments.',
    keywords: ['sell items', 'sell online', 'list items', 'marketplace', 'nigeria', 'postall'],
  },
  '/pricing': {
    title: 'Pricing Plans — PostAll',
    description: 'View PostAll pricing for listings, promotions, and advertising. Free posting for most categories with affordable upgrade options.',
    keywords: ['pricing', 'fees', 'cost', 'plans', 'listing fees', 'postall'],
  },
};

/**
 * Get SEO metadata for a given path
 */
export function getSEO(path: string): PageSEO {
  return (
    pageSEO[path] || {
      title: 'PostAll — Marketplace Platform',
      description: 'Nigeria\'s largest P2P marketplace. Post tasks, find work, buy and sell items.',
      keywords: ['postall', 'marketplace', 'nigeria'],
    }
  );
}

// ─── Metadata Generation Helpers ────────────────────────

/**
 * Generate a Next.js Metadata object for a given page
 */
export function generatePageMetadata(
  title: string,
  description: string,
  path: string,
  image?: string
): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImage = image ? `${SITE_URL}${image}` : `${SITE_URL}${DEFAULT_OG_IMAGE}`;

  return {
    title,
    description,
    keywords: [],
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_NG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Generate JSON-LD structured data for a listing
 */
export function generateListingJsonLd(listing: {
  id: string;
  title: string;
  description: string;
  price: number;
  currency?: string;
  city?: string;
  category?: string;
  seller?: string;
  imageUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: listing.description,
    url: `${SITE_URL}/item/${listing.id}`,
    image: listing.imageUrl || `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    offers: {
      "@type": "Offer",
      price: listing.price,
      priceCurrency: listing.currency || "NGN",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: listing.seller || SITE_NAME,
      },
    },
    address: listing.city
      ? {
          "@type": "PostalAddress",
          addressLocality: listing.city,
          addressCountry: "NG",
        }
      : undefined,
  };
}

/**
 * Generate JSON-LD structured data for the Organization (homepage)
 */
export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    description:
      "Nigeria's largest P2P marketplace — Post tasks, find work, buy and sell items, and access 24 powerful tools.",
    sameAs: [
      "https://twitter.com/postall_ng",
      "https://facebook.com/postallng",
      "https://instagram.com/postall_ng",
      "https://linkedin.com/company/postall",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+234-800-POSTALL",
      contactType: "customer service",
      areaServed: "NG",
      availableLanguage: ["English", "Yoruba", "Hausa", "Igbo", "Pidgin"],
    },
  };
}

/**
 * Generate JSON-LD structured data for breadcrumbs
 */
export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}
