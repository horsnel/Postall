import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
    ],
  },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https://res.cloudinary.com https://*.cloudinary.com https://images.unsplash.com https://via.placeholder.com https://lh3.googleusercontent.com",
              "connect-src 'self' https://*.supabase.co https://api.paystack.co https://js.stripe.com",
              "frame-src https://js.stripe.com https://hooks.stripe.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://api.paystack.co",
              "frame-ancestors 'none'",
            ].join("; "),
          },
          // X-Frame-Options
          { key: "X-Frame-Options", value: "DENY" },
          // X-Content-Type-Options
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Referrer-Policy
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Permissions-Policy
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(self), geolocation=(self), browsing-topics=()",
          },
          // X-DNS-Prefetch-Control
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
      {
        // Cache static assets
        source: "/(.*)\\.(ico|png|jpg|jpeg|svg|gif|webp|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
