import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Marketplace — PostAll",
  description: "Browse thousands of listings across gigs, services, jobs, items for sale, and more on PostAll — Nigeria's largest P2P marketplace.",
  openGraph: {
    title: "Browse Marketplace — PostAll",
    description: "Browse thousands of listings across gigs, services, jobs, items for sale, and more on PostAll — Nigeria's largest P2P marketplace.",
    type: "website",
  },
};

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
