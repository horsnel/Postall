import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TranslationProvider } from "@/lib/i18n";
import { ClientLayout } from "@/components/layout/client-layout";
import { SkipNav } from "@/components/ui/skip-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://postall-three.vercel.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0D8A5C",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PostAll — Buy, Sell & Post Anything in Nigeria | Lagos Marketplace",
    template: "%s | PostAll — Nigeria's Marketplace",
  },
  description:
    "Nigeria's largest all-in-one marketplace. Buy and sell items, post tasks, find jobs, and access services across Lagos, Abuja, Port Harcourt and 25+ cities. No signup required to browse. Escrow-protected payments.",
  keywords: [
    "Nigeria marketplace",
    "Lagos marketplace",
    "buy and sell Nigeria",
    "post tasks Nigeria",
    "find jobs Lagos",
    "Nigerian classifieds",
    "escrow payments Nigeria",
    "freelance Nigeria",
    "services marketplace",
    "electronics Lagos",
    "fashion Nigeria",
    "PostAll",
    "Naira marketplace",
  ],
  authors: [{ name: "PostAll", url: SITE_URL }],
  creator: "PostAll",
  publisher: "PostAll",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PostAll",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: SITE_URL,
    siteName: "PostAll",
    title: "PostAll — Buy, Sell & Post Anything in Nigeria",
    description:
      "Nigeria's largest all-in-one marketplace. Buy, sell, post tasks, find jobs, and access services across 25+ cities. Escrow-protected payments.",
    images: [
      {
        url: "/favicon.svg",
        width: 32,
        height: 32,
        alt: "PostAll",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PostAll — Buy, Sell & Post Anything in Nigeria",
    description:
      "Nigeria's largest all-in-one marketplace. Post tasks, find work, buy and sell items, and access 24 powerful tools.",
    images: ["/favicon.svg"],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-NG" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Analytics placeholder — add your script here */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-[#0D8A5C] focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:text-sm focus:no-underline focus:outline-none focus:ring-2 focus:ring-[#0D8A5C]/40">
          Skip to main content
        </a>

        <TranslationProvider>
          <ClientLayout>
            <main id="main-content" role="main">
              {children}
            </main>
            <Toaster />
          </ClientLayout>
        </TranslationProvider>
      </body>
    </html>
  );
}
