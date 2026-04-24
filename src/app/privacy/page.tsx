import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChevronRight, Lock, Calendar } from "lucide-react";

const tocItems = [
  { id: "info-we-collect", label: "Information We Collect" },
  { id: "how-we-use", label: "How We Use Information" },
  { id: "info-sharing", label: "Information Sharing" },
  { id: "data-security", label: "Data Security" },
  { id: "cookies", label: "Cookies" },
  { id: "your-rights", label: "Your Rights" },
  { id: "childrens-privacy", label: "Children's Privacy" },
  { id: "international-transfers", label: "International Transfers" },
  { id: "changes-to-policy", label: "Changes to Policy" },
  { id: "contact", label: "Contact" },
];

export default function PrivacyPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 mb-4 bg-white/10 rounded-full px-4 py-2">
            <Lock className="h-5 w-5 text-emerald-200" />
            <span className="text-emerald-100 font-medium">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Privacy Policy
          </h1>
          <div className="flex items-center justify-center gap-2 text-emerald-200">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Last Updated: January 15, 2026</span>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-2.5 max-w-6xl">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/browse" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-foreground font-medium">Privacy Policy</span>
          </nav>
        </div>
      </div>

      {/* Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid lg:grid-cols-[220px_1fr] gap-12">
            {/* Table of Contents - Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  Table of Contents
                </p>
                <nav className="space-y-1">
                  {tocItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-sm text-muted-foreground hover:text-emerald-700 transition-colors py-1"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="prose prose-emerald max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-8">
                At PostAll, we take your privacy seriously. This Privacy Policy describes how we
                collect, use, disclose, and protect your personal information when you use our
                platform, website, mobile applications, and related services (collectively, the
                &quot;Service&quot;). We are committed to being transparent about our data practices
                and giving you control over your personal information.
              </p>

              {/* Information We Collect */}
              <div id="info-we-collect" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700 text-xs">1</Badge>
                  Information We Collect
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We collect several types of information to provide and improve our Service. This
                  includes information you provide directly when creating an account, posting tasks,
                  listing items, messaging other users, or contacting our support team. Directly
                  provided information may include your name, email address, phone number, profile
                  photo, location, payment information, and any content you choose to share on the
                  platform.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We also collect information automatically when you use our Service. This includes
                  your device type, operating system, browser type, IP address, location data, pages
                  visited, features used, time spent on the platform, and referring URLs. We use
                  cookies, web beacons, and similar tracking technologies to collect this
                  information. Additionally, we collect information from third-party sources such as
                  payment processors, identity verification services, and social media platforms when
                  you choose to link them to your account.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  When you use our built-in tools such as Proof Cam, Safe Spots, or the messaging
                  system, we may collect additional data including timestamped photos, geolocation
                  data, message content, and tool usage analytics. This data is stored securely and
                  used solely for the purposes of facilitating transactions, resolving disputes, and
                  improving our safety features.
                </p>
              </div>

              <Separator className="my-8" />

              {/* How We Use Information */}
              <div id="how-we-use" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700 text-xs">2</Badge>
                  How We Use Information
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use the information we collect to provide, maintain, and improve the PostAll
                  platform and its features. This includes creating and managing your account,
                  processing transactions through our escrow system, facilitating communication
                  between users, providing customer support, and personalizing your experience on
                  the platform based on your preferences and activity.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We also use your information to verify your identity and protect against fraud,
                  enforce our Terms of Service and community guidelines, resolve disputes between
                  users, send you important notifications about your account and transactions,
                  and analyze usage patterns to improve our platform&apos;s features, performance,
                  and user experience. We may use aggregated, non-personally identifiable data for
                  research, analytics, and marketing purposes.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  With your consent, we may send you promotional communications about new features,
                  special offers, and events. You can opt out of promotional communications at any
                  time by updating your notification preferences in your account settings or by
                  clicking the unsubscribe link in any promotional email. We will never sell your
                  personal information to third parties for their marketing purposes.
                </p>
              </div>

              <Separator className="my-8" />

              {/* Information Sharing */}
              <div id="info-sharing" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700 text-xs">3</Badge>
                  Information Sharing
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may
                  share your information with other users to the extent necessary to facilitate
                  transactions on the platform, such as displaying your profile, reviews, and
                  listings to potential buyers or sellers. You can control what information is
                  visible on your public profile through your account settings.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may share your information with trusted third-party service providers who assist
                  us in operating the platform, processing payments, providing identity verification,
                  sending notifications, and analyzing usage data. These service providers are
                  contractually obligated to use your information only for the purposes for which it
                  was shared and to maintain appropriate security measures.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We may also disclose your information if required by law, in response to a valid
                  legal request (such as a subpoena or court order), to protect the rights,
                  property, or safety of PostAll, our users, or the public, in connection with
                  an investigation of suspected fraud or security breach, or in connection with a
                  corporate transaction such as a merger, acquisition, or sale of assets.
                </p>
              </div>

              <Separator className="my-8" />

              {/* Data Security */}
              <div id="data-security" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700 text-xs">4</Badge>
                  Data Security
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We implement industry-standard security measures to protect your personal
                  information from unauthorized access, disclosure, alteration, or destruction.
                  These measures include encryption of data in transit and at rest using SSL/TLS
                  protocols, secure storage of passwords using industry-standard hashing algorithms,
                  regular security audits and vulnerability assessments, and strict access controls
                  limiting employee access to personal data.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our payment processing systems comply with PCI-DSS (Payment Card Industry Data
                  Security Standard) requirements, and all financial data is processed through
                  certified, PCI-compliant payment processors. We do not store full credit card
                  numbers on our servers. Payment wallet operations are secured using
                  industry-standard encryption practices and multi-factor authentication.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  While we strive to protect your personal information, no method of transmission
                  over the Internet or electronic storage is 100% secure. We cannot guarantee the
                  absolute security of your data. In the event of a data breach that affects your
                  personal information, we will notify affected users in accordance with applicable
                  laws and take immediate steps to address the breach and prevent future incidents.
                </p>
              </div>

              <Separator className="my-8" />

              {/* Cookies */}
              <div id="cookies" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700 text-xs">5</Badge>
                  Cookies
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use cookies and similar tracking technologies to enhance your experience on the
                  PostAll platform. Cookies are small text files stored on your device that help us
                  remember your preferences, keep you logged in, and understand how you use our
                  Service. We use both session cookies, which expire when you close your browser, and
                  persistent cookies, which remain on your device until they expire or are deleted.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The types of cookies we use include essential cookies that are necessary for the
                  platform to function properly, functionality cookies that remember your preferences
                  and settings, analytics cookies that help us understand how users interact with
                  our platform, and advertising cookies that help us deliver relevant
                  advertisements. You can control cookie settings through your browser preferences,
                  though disabling certain cookies may affect the functionality of the platform.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We also use web beacons, pixel tags, and similar technologies in our emails and on
                  our website to track open rates, click-through rates, and other engagement
                  metrics. These technologies help us improve our communications and provide you
                  with content that is more relevant to your interests and needs.
                </p>
              </div>

              <Separator className="my-8" />

              {/* Your Rights */}
              <div id="your-rights" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700 text-xs">6</Badge>
                  Your Rights
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Depending on your jurisdiction, you may have certain rights regarding your personal
                  information. These rights may include the right to access your personal data, the
                  right to correct inaccurate or incomplete data, the right to delete your personal
                  data (subject to certain legal obligations), the right to restrict the processing
                  of your data, the right to data portability, and the right to object to the
                  processing of your data.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You can exercise most of these rights directly through your account settings. To
                  access or update your personal information, go to your Dashboard and navigate to
                  Profile or Settings. To request deletion of your account and associated data,
                  please contact our support team. We will respond to all requests within 30 days
                  in accordance with applicable privacy laws.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  If you are a resident of the European Union, you have rights under the General
                  Data Protection Regulation (GDPR). If you are a resident of California, you have
                  rights under the California Consumer Privacy Act (CCPA). If you are a resident of
                  Nigeria, you have rights under the Nigeria Data Protection Regulation (NDPR). We
                  comply with all applicable data protection laws and regulations.
                </p>
              </div>

              <Separator className="my-8" />

              {/* Children's Privacy */}
              <div id="childrens-privacy" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700 text-xs">7</Badge>
                  Children&apos;s Privacy
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The PostAll platform is not intended for use by individuals under the age of 18.
                  We do not knowingly collect personal information from children under 18 years of
                  age. If we discover that we have inadvertently collected personal information from
                  a child under 18, we will take immediate steps to delete that information from our
                  servers and terminate the associated account.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  If you are a parent or guardian and believe that your child has provided us with
                  personal information, please contact us immediately at privacy@postall.com. We
                  will work with you to ensure the prompt removal of any such information and take
                  appropriate steps to prevent future occurrences. We are committed to protecting
                  children&apos;s privacy online.
                </p>
              </div>

              <Separator className="my-8" />

              {/* International Transfers */}
              <div id="international-transfers" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700 text-xs">8</Badge>
                  International Transfers
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  PostAll operates internationally and your information may be transferred to and
                  processed in countries other than your country of residence. These countries may
                  have data protection laws that differ from those in your jurisdiction. When we
                  transfer your personal information internationally, we take appropriate measures to
                  ensure it receives an adequate level of protection.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  These measures include entering into standard contractual clauses approved by
                  relevant data protection authorities, ensuring that our third-party service
                  providers maintain appropriate security certifications and compliance with
                  international data protection standards, and implementing robust technical and
                  organizational measures to protect your data during transit and storage.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  By using our Service, you acknowledge and consent to the international transfer of
                  your personal information as described in this Privacy Policy. If you have concerns
                  about international data transfers, please contact us at privacy@postall.com and
                  we will work with you to address your concerns to the extent possible under
                  applicable law.
                </p>
              </div>

              <Separator className="my-8" />

              {/* Changes to Policy */}
              <div id="changes-to-policy" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700 text-xs">9</Badge>
                  Changes to This Policy
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may update this Privacy Policy from time to time to reflect changes in our
                  practices, technology, legal requirements, or other factors. When we make changes,
                  we will update the &quot;Last Updated&quot; date at the top of this page. For
                  material changes that significantly affect your rights, we will provide additional
                  notice such as a prominent announcement on the platform or an email notification.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We encourage you to review this Privacy Policy periodically to stay informed about
                  how we collect, use, and protect your information. Your continued use of the
                  Service after any changes to this Privacy Policy constitutes your acceptance of
                  the updated policy. If you do not agree with the changes, you should stop using
                  the Service and request deletion of your account.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We maintain a version history of this Privacy Policy so you can review previous
                  versions and understand what has changed. If you have any questions about a
                  specific change, please contact us and we will be happy to provide additional
                  clarification and context about the modification.
                </p>
              </div>

              <Separator className="my-8" />

              {/* Contact */}
              <div id="contact" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700 text-xs">10</Badge>
                  Contact
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or
                  our data practices, please contact our Data Protection Officer. We are committed
                  to addressing your privacy concerns promptly and transparently.
                </p>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm text-muted-foreground">
                  <p><strong className="text-foreground">Data Protection Officer:</strong> privacy@postall.com</p>
                  <p><strong className="text-foreground">General Support:</strong> support@postall.com</p>
                  <p><strong className="text-foreground">Address:</strong> PostAll Technologies, Lagos, Nigeria</p>
                </div>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We aim to respond to all privacy-related inquiries within 30 days. For urgent
                  privacy concerns, please indicate the urgency in your email subject line so we
                  can prioritize your request accordingly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
