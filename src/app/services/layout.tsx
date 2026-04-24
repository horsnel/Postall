import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Local Services Directory — PostAll",
  description: "Find trusted local service providers on PostAll. Browse 2,500+ verified professionals across 18 service categories including IT, home repair, beauty, and education.",
  openGraph: {
    title: "Local Services Directory — PostAll",
    description: "Find trusted local service providers on PostAll. Browse 2,500+ verified professionals across 18 service categories including IT, home repair, beauty, and education.",
    type: "website",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
