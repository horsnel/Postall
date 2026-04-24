import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jobs & Careers in Nigeria — PostAll",
  description: "Find your next career opportunity on PostAll. Browse thousands of job listings across technology, marketing, design, finance, healthcare, and more in Nigeria.",
  openGraph: {
    title: "Jobs & Careers in Nigeria — PostAll",
    description: "Find your next career opportunity on PostAll. Browse thousands of job listings across technology, marketing, design, finance, healthcare, and more in Nigeria.",
    type: "website",
  },
};

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
