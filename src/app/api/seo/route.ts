
import { NextRequest, NextResponse } from 'next/server';

// Dynamic SEO metadata API route
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '';
  const id = searchParams.get('id') || '';
  const slug = searchParams.get('slug') || '';

  const siteName = 'PostAll';
  const baseUrl = 'https://postall.com';
  const defaultOgImage = `${baseUrl}/favicon.svg`;

  if (page === 'item' && id) {
    return NextResponse.json({
      title: `Item #${id} | PostAll Marketplace`,
      description: `View details for item #${id} on PostAll — Nigeria's largest P2P marketplace. Buy and sell items, find services, and more.`,
      keywords: ['marketplace', 'buy', 'sell', 'nigeria', 'item', 'postall'],
      ogTitle: `Item #${id} | PostAll`,
      ogDescription: `View details for item #${id} on PostAll marketplace.`,
      ogImage: defaultOgImage,
      ogUrl: `${baseUrl}/item/${id}`,
      canonical: `${baseUrl}/item/${id}`,
    });
  }

  if (page === 'category' && slug) {
    const categoryMeta: Record<string, { title: string; description: string; keywords: string[] }> = {
      gigs: {
        title: 'Gigs & Quick Tasks in Nigeria | PostAll',
        description: 'Browse thousands of gigs and quick tasks on PostAll. Find freelance work, hire talent, and get things done across Nigeria and West Africa.',
        keywords: ['gigs', 'freelance', 'tasks', 'nigeria', 'quick jobs', 'postall'],
      },
      services: {
        title: 'Professional Services Directory | PostAll',
        description: 'Find trusted local service providers on PostAll. Browse home services, IT support, beauty, repairs, and 18+ service categories across Nigeria.',
        keywords: ['services', 'professionals', 'local', 'nigeria', 'hire', 'postall'],
      },
      jobs: {
        title: 'Jobs & Careers in Nigeria | PostAll',
        description: 'Discover job opportunities across Nigeria on PostAll. Full-time, part-time, contract, and remote positions from top employers.',
        keywords: ['jobs', 'careers', 'employment', 'nigeria', 'hiring', 'postall'],
      },
      'for-sale': {
        title: 'Items for Sale in Nigeria | PostAll Marketplace',
        description: 'Buy and sell items on PostAll marketplace. Electronics, vehicles, furniture, fashion, and more across 25+ cities in Nigeria.',
        keywords: ['for sale', 'buy', 'sell', 'nigeria', 'marketplace', 'items', 'postall'],
      },
      housing: {
        title: 'Housing & Rentals in Nigeria | PostAll',
        description: 'Find apartments, houses, rooms, and commercial spaces on PostAll. Browse verified listings across Lagos, Abuja, and 8+ Nigerian cities.',
        keywords: ['housing', 'rentals', 'apartments', 'nigeria', 'real estate', 'postall'],
      },
      community: {
        title: 'Community Events & Groups | PostAll',
        description: 'Connect with your local community on PostAll. Find events, groups, classes, and activities happening in your city.',
        keywords: ['community', 'events', 'groups', 'local', 'nigeria', 'postall'],
      },
    };

    const meta = categoryMeta[slug] || {
      title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} | PostAll`,
      description: `Browse ${slug} listings on PostAll — Nigeria's largest P2P marketplace.`,
      keywords: [slug, 'postall', 'marketplace', 'nigeria'],
    };

    return NextResponse.json({
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
      ogTitle: meta.title,
      ogDescription: meta.description,
      ogImage: defaultOgImage,
      ogUrl: `${baseUrl}/browse/${slug}`,
      canonical: `${baseUrl}/browse/${slug}`,
    });
  }

  // Default: homepage metadata
  return NextResponse.json({
    title: `${siteName} — The All-in-One Marketplace Platform`,
    description: 'Post tasks, find work, buy and sell items, and access 24 powerful tools. No signup required to browse. Crypto and fiat accepted with platform escrow protection.',
    keywords: ['marketplace', 'tasks', 'gigs', 'services', 'jobs', 'for sale', 'crypto', 'escrow', 'freelance', 'nigeria', 'postall'],
    ogTitle: `${siteName} — The All-in-One Marketplace Platform`,
    ogDescription: 'Post tasks, find work, buy and sell items, and access 24 powerful tools.',
    ogImage: defaultOgImage,
    ogUrl: baseUrl,
    canonical: baseUrl,
  });
}
