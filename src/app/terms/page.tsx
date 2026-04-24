import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChevronRight, FileText, Calendar } from "lucide-react";

const tocItems = [
  { id: "introduction", label: "Introduction" },
  { id: "acceptance-of-terms", label: "Acceptance of Terms" },
  { id: "user-accounts", label: "User Accounts" },
  { id: "marketplace-rules", label: "Marketplace Rules" },
  { id: "payments-escrow", label: "Payments & Escrow" },
  { id: "prohibited-items", label: "Prohibited Items & Services" },
  { id: "intellectual-property", label: "Intellectual Property" },
  { id: "limitation-of-liability", label: "Limitation of Liability" },
  { id: "dispute-resolution", label: "Dispute Resolution" },
  { id: "modifications", label: "Modifications to Terms" },
  { id: "contact", label: "Contact" },
];

export default function TermsPage() {
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
            <FileText className="h-5 w-5 text-emerald-200" />
            <span className="text-emerald-100 font-medium">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Terms of Service
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
            <span className="text-foreground font-medium">Terms of Service</span>
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
                Welcome to PostAll. These Terms of Service (&quot;Terms&quot;) govern your access to and use of
                the PostAll platform, including our website, mobile applications, and all related
                services (collectively, the &quot;Service&quot;). By accessing or using our Service, you agree to
                be bound by these Terms. If you do not agree to these Terms, please do not use our
                Service.
              </p>

              {/* Introduction */}
              <div id="introduction" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700 text-xs">1</Badge>
                  Introduction
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  PostAll is a peer-to-peer marketplace platform that connects individuals and
                  businesses for the purpose of posting tasks, offering services, buying and selling
                  goods, and accessing a suite of integrated tools designed to facilitate safe and
                  efficient transactions. Our platform operates across multiple cities and countries,
                  primarily serving communities in Africa and beyond.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  These Terms apply to all users of the PostAll platform, including buyers, sellers,
                  workers, service providers, and visitors. We encourage you to read these Terms
                  carefully before using our Service, as they contain important information about your
                  rights, obligations, and the limitations of our liability.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  By creating an account or using any part of our Service, you acknowledge that you
                  have read, understood, and agree to be bound by these Terms in their entirety. If
                  you are using the Service on behalf of an organization, you represent and warrant
                  that you have the authority to bind that organization to these Terms.
                </p>
              </div>

              <Separator className="my-8" />

              {/* Acceptance of Terms */}
              <div id="acceptance-of-terms" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700 text-xs">2</Badge>
                  Acceptance of Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  By accessing, browsing, or using the PostAll platform in any manner, you
                  acknowledge that you have read these Terms of Service and agree to be bound by them
                  without limitation or qualification. These Terms constitute a legally binding
                  agreement between you and PostAll.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you do not agree with any part of these Terms, you must discontinue use of the
                  Service immediately. Your continued use of the platform following the posting of
                  any changes to these Terms constitutes acceptance of those changes. We reserve the
                  right to refuse service to anyone for any reason at any time.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  You represent and warrant that you are at least 18 years of age, or the age of
                  legal majority in your jurisdiction, and have the legal capacity to enter into
                  binding agreements. If you are under 18, you may only use the Service under the
                  supervision and consent of a parent or legal guardian who agrees to be bound by
                  these Terms.
                </p>
              </div>

              <Separator className="my-8" />

              {/* User Accounts */}
              <div id="user-accounts" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700 text-xs">3</Badge>
                  User Accounts
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To access certain features of the Service, you must create a user account. When
                  creating your account, you must provide accurate, complete, and current information.
                  You are responsible for maintaining the confidentiality of your account credentials
                  and for all activities that occur under your account.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You agree to notify PostAll immediately of any unauthorized use of your account or
                  any other breach of security. PostAll will not be liable for any loss or damage
                  arising from your failure to comply with this section. You may not create multiple
                  accounts, impersonate another person, or create accounts using false or misleading
                  information.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  You may terminate your account at any time by contacting us or using the account
                  deletion feature in your settings. Upon termination, your right to use the Service
                  will immediately cease. PostAll reserves the right to suspend or terminate
                  accounts that violate these Terms or for any other reason at our sole discretion,
                  with or without notice.
                </p>
              </div>

              <Separator className="my-8" />

              {/* Marketplace Rules */}
              <div id="marketplace-rules" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700 text-xs">4</Badge>
                  Marketplace Rules
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  All users must conduct themselves in a professional, honest, and respectful manner
                  when using the PostAll platform. This includes providing accurate descriptions of
                  goods and services, communicating promptly and courteously, fulfilling obligations
                  in a timely manner, and respecting the rights of other users.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Users must not manipulate ratings, reviews, or any other feedback mechanisms on the
                  platform. All transactions must be conducted through the PostAll platform using our
                  built-in payment and escrow systems. Attempting to circumvent our payment systems
                  or direct users to external payment methods is strictly prohibited.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  PostAll acts as an intermediary platform and does not guarantee the quality, safety,
                  or legality of any goods, services, or tasks listed on the platform. Users are
                  responsible for conducting their own due diligence before entering into any
                  transaction. We encourage users to utilize our verification tools, read reviews,
                  and communicate with other parties before committing to a transaction.
                </p>
              </div>

              <Separator className="my-8" />

              {/* Payments & Escrow */}
              <div id="payments-escrow" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700 text-xs">5</Badge>
                  Payments &amp; Escrow
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  All payments on the PostAll platform are processed through our secure escrow system.
                  When a buyer initiates a transaction, the payment is held in escrow until the buyer
                  confirms satisfaction with the delivered goods or services. This system protects
                  both buyers and sellers throughout the transaction process.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  PostAll charges a platform service fee of 5% and an escrow protection fee of 2% on
                  all completed transactions. These fees are automatically deducted from the
                  transaction amount. The fee structure is transparent and there are no additional
                  hidden charges, subscription fees, or listing fees associated with using the
                  platform.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Funds held in escrow are maintained in secure, segregated accounts and are not
                  commingled with PostAll&apos;s operating funds. In the event of a dispute, funds
                  will remain in escrow until the dispute resolution process is complete. Users may
                  withdraw funds from their PostAll wallet to their linked bank accounts or
                  wallet balance at any time, subject to our withdrawal policies and
                  processing times.
                </p>
              </div>

              <Separator className="my-8" />

              {/* Prohibited Items & Services */}
              <div id="prohibited-items" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700 text-xs">6</Badge>
                  Prohibited Items &amp; Services
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Users may not list, sell, or offer the following items or services on the PostAll
                  platform: illegal drugs or controlled substances, weapons and ammunition, stolen
                  property, counterfeit goods, hazardous materials, adult content or services,
                  gambling services, pyramid schemes, fraudulent or deceptive offers, items that
                  infringe on intellectual property rights, and any other goods or services prohibited
                  by applicable law.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Additionally, users may not use the platform for any activity that is fraudulent,
                  misleading, deceptive, or harmful to others. This includes phishing attempts,
                  spamming, distributing malware, or any other form of cybercrime. Users who violate
                  these prohibitions may have their accounts permanently suspended and may be subject
                  to legal action.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  PostAll reserves the right to remove any listing, task, or content that violates
                  these prohibitions or that we deem inappropriate for any reason, with or without
                  prior notice. We cooperate with law enforcement agencies in investigations involving
                  illegal activities on our platform.
                </p>
              </div>

              <Separator className="my-8" />

              {/* Intellectual Property */}
              <div id="intellectual-property" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700 text-xs">7</Badge>
                  Intellectual Property
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  All content, features, and functionality of the PostAll platform, including but not
                  limited to text, graphics, logos, icons, images, audio clips, digital downloads,
                  data compilations, and software, are the exclusive property of PostAll and are
                  protected by international copyright, trademark, patent, trade secret, and other
                  intellectual property laws.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Users retain ownership of the content they post on the platform, including task
                  descriptions, listings, reviews, and profile information. By posting content on
                  PostAll, you grant us a non-exclusive, worldwide, royalty-free, irrevocable
                  license to use, reproduce, modify, adapt, publish, translate, distribute, and
                  display such content in connection with the operation and promotion of the platform.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  You may not use, copy, modify, or distribute any content from the PostAll platform
                  without our prior written consent, except as expressly permitted by these Terms.
                  Any unauthorized use of our intellectual property may result in legal action and
                  damages.
                </p>
              </div>

              <Separator className="my-8" />

              {/* Limitation of Liability */}
              <div id="limitation-of-liability" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700 text-xs">8</Badge>
                  Limitation of Liability
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To the maximum extent permitted by applicable law, PostAll and its directors,
                  employees, partners, agents, suppliers, and affiliates shall not be liable for any
                  indirect, incidental, special, consequential, or punitive damages, including but
                  not limited to loss of profits, data, use, goodwill, or other intangible losses,
                  resulting from your access to or use of or inability to access or use the Service.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  PostAll does not guarantee the accuracy, reliability, or completeness of any
                  content posted on the platform. We do not endorse any user, listing, or service,
                  and we are not a party to any transaction between users. Users are solely
                  responsible for their interactions with other users and for any agreements they
                  enter into through the platform.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  In no event shall PostAll&apos;s total aggregate liability exceed the amount of
                  fees paid by you to PostAll during the twelve (12) months preceding the claim.
                  Some jurisdictions do not allow the exclusion of certain warranties or limitation
                  of liability, so some of the above limitations may not apply to you.
                </p>
              </div>

              <Separator className="my-8" />

              {/* Dispute Resolution */}
              <div id="dispute-resolution" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700 text-xs">9</Badge>
                  Dispute Resolution
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  In the event of a dispute between users, we encourage both parties to communicate
                  directly through the platform&apos;s messaging system to attempt to resolve the
                  issue amicably. If direct communication does not resolve the dispute, either party
                  may escalate the matter by opening a formal dispute through the platform.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our dispute resolution team will review all available evidence, including
                  communications, Proof Cam images, transaction records, and any other relevant
                  information. We aim to resolve all disputes within 72 hours of submission. The
                  decision of our dispute resolution team is final and binding with respect to the
                  distribution of escrow funds.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Any disputes arising out of or relating to these Terms or the Service that cannot
                  be resolved through our internal dispute resolution process shall be resolved
                  through binding arbitration in accordance with the rules of the applicable
                  arbitration body in the jurisdiction where PostAll is registered. You agree to
                  waive any right to participate in class action lawsuits against PostAll.
                </p>
              </div>

              <Separator className="my-8" />

              {/* Modifications to Terms */}
              <div id="modifications" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700 text-xs">10</Badge>
                  Modifications to Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  PostAll reserves the right to modify, update, or replace these Terms at any time
                  at our sole discretion. When we make changes, we will update the &quot;Last
                  Updated&quot; date at the top of this page and, for material changes, we will
                  provide a prominent notice on the platform or send a notification to the email
                  address associated with your account.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We encourage you to review these Terms periodically to stay informed of any changes.
                  Your continued use of the Service after any modifications to these Terms
                  constitutes your acceptance of the updated Terms. If you do not agree with the
                  modified Terms, you must stop using the Service and may request the deletion of
                  your account.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  In cases where changes are significant, we will make reasonable efforts to provide
                  advance notice to users. However, we reserve the right to implement changes
                  immediately if required by law or to protect the security and integrity of the
                  platform and its users.
                </p>
              </div>

              <Separator className="my-8" />

              {/* Contact */}
              <div id="contact" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700 text-xs">11</Badge>
                  Contact
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you have any questions, concerns, or feedback regarding these Terms of Service,
                  or if you need assistance with any aspect of the PostAll platform, please do not
                  hesitate to contact us. We are committed to providing excellent support and
                  resolving any issues promptly and fairly.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You can reach us through the following channels:
                </p>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm text-muted-foreground">
                  <p><strong className="text-foreground">Email:</strong> legal@postall.com</p>
                  <p><strong className="text-foreground">Support:</strong> support@postall.com</p>
                  <p><strong className="text-foreground">Address:</strong> PostAll Technologies, Lagos, Nigeria</p>
                </div>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We aim to respond to all inquiries within 24-48 hours during business days. For
                  urgent matters, please use the in-app support chat feature for faster response
                  times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
