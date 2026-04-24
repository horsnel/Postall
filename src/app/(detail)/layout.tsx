import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Listing Details — PostAll",
    template: "%s — PostAll",
  },
  description: "View listing details on PostAll — Nigeria's largest P2P marketplace. Secure escrow payments, verified sellers, and real-time messaging.",
  openGraph: {
    type: "website",
    siteName: "PostAll",
  },
};

// Header and Footer are provided by ClientLayout - no duplicates needed
export default function DetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
