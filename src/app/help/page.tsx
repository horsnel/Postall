import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  HelpCircle,
  Rocket,
  ClipboardList,
  Briefcase,
  CreditCard,
  Settings,
  Shield,
  MessageCircle,
  Mail,
  Phone,
  BookOpen,
  ArrowRight,
  FileText,
  Lock,
  ChevronRight,
} from "lucide-react";

const faqCategories = [
  {
    id: "getting-started",
    icon: <Rocket className="h-5 w-5" />,
    title: "Getting Started",
    description: "Learn the basics of using PostAll for the first time",
    color: "emerald",
    questions: [
      {
        q: "Do I need to create an account to use PostAll?",
        a: "You can browse all listings, tasks, and services on PostAll without creating an account. However, to post tasks, apply for work, send messages, make purchases, or use any of our 24 tools, you will need to create a free account. The sign-up process is quick and only requires basic information like your name and email address.",
      },
      {
        q: "How do I create an account on PostAll?",
        a: "To create an account, click the 'Log In' button in the top-right corner of any page and select 'Sign Up.' You can register using your email address or phone number. After verifying your contact information, you can set up your profile, add a photo, and start using all the features available on the platform right away.",
      },
      {
        q: "What cities is PostAll available in?",
        a: "PostAll is currently available in over 25 cities across Nigeria including Lagos, Abuja, Port Harcourt, Ibadan, and many more. We are constantly expanding to new cities, so check back regularly or follow us on social media for updates on new locations.",
      },
      {
        q: "Is PostAll free to use?",
        a: "Yes, PostAll is completely free to get started. You can browse listings, post tasks, apply for jobs, and use our basic tools at no cost. We only charge a small platform fee of 5% on completed transactions and a 2% escrow protection fee. There are no subscription fees, no listing fees, and no hidden charges whatsoever.",
      },
      {
        q: "What are the 24 tools available on PostAll?",
        a: "Our 24 built-in tools include AI Assistant, Price Check, Safe Spots, Proof Cam, Escrow Calculator, Task Timer, Invoice Generator, Rating System, Verified Profiles, Emergency Button, Dispute Resolver, Meeting Scheduler, Delivery Tracker, Background Check, Portfolio Builder, Skill Matcher, Budget Planner, Negotiation Helper, Feedback Hub, Community Forum, Market Analytics, Job Board, Service Directory, and Crypto Wallet.",
      },
    ],
  },
  {
    id: "posting-tasks",
    icon: <ClipboardList className="h-5 w-5" />,
    title: "Posting Tasks",
    description: "Everything you need to know about creating and managing tasks",
    color: "teal",
    questions: [
      {
        q: "How do I post a task on PostAll?",
        a: "To post a task, click the 'Post a Task' button on the homepage or navigation bar. Fill in the task details including a clear title, detailed description, your budget range, location, deadline, and any specific requirements. You can also add photos to help workers understand exactly what you need. Once submitted, your task will be visible to all users in your area.",
      },
      {
        q: "What information should I include in my task description?",
        a: "A good task description should include a clear summary of the work needed, specific skills or tools required, the expected timeline and deadline, your budget range, preferred meeting location, and any other relevant details. The more specific you are, the better quality applications you will receive from qualified workers who understand exactly what you need.",
      },
      {
        q: "Can I edit or delete a task after posting it?",
        a: "Yes, you can edit your task at any time as long as no one has been selected yet. Go to your Dashboard, click on 'My Tasks,' find the task you want to modify, and click the edit button. If you want to delete a task, you can do so from the same menu. Note that once a worker has been selected and escrow has been funded, the task cannot be deleted, only disputed.",
      },
      {
        q: "How do I choose the right worker for my task?",
        a: "Review all applications carefully by checking each worker's profile, ratings, reviews, and completion history. You can message applicants directly through the platform to ask questions and discuss the task before making your decision. Consider their experience level, proposed timeline, and price. Once you've chosen, select them and the escrow process will begin automatically.",
      },
    ],
  },
  {
    id: "finding-work",
    icon: <Briefcase className="h-5 w-5" />,
    title: "Finding Work",
    description: "Tips for workers and service providers looking for opportunities",
    color: "cyan",
    questions: [
      {
        q: "How do I find tasks that match my skills?",
        a: "Browse the 'Find Work' page to see all available tasks filtered by category and location. You can use our Skill Matcher tool to get personalized task recommendations based on your profile and skills. Set up alerts for specific categories so you get notified when new tasks that match your expertise are posted in your area.",
      },
      {
        q: "How do I write a winning application?",
        a: "A strong application includes a personalized greeting, specific details about how you'll approach the task, your relevant experience, your proposed timeline, and a competitive but fair price. Avoid generic copy-paste applications. Reference specific details from the task description to show you've read and understood the requirements. Include links to your portfolio or past work if available.",
      },
      {
        q: "How many tasks can I apply for at once?",
        a: "There is no limit to the number of tasks you can apply for simultaneously. However, we recommend focusing on tasks where you have genuine expertise and can deliver quality work on time. Applying for too many tasks without the capacity to complete them can negatively affect your ratings and reputation on the platform over time.",
      },
      {
        q: "What happens after I'm selected for a task?",
        a: "Once selected, you'll receive a notification and the task will move to your 'Active Tasks' in the Dashboard. The buyer's payment will be held in escrow, and you can begin working on the task. Use the platform messaging system to communicate with the buyer, share updates, and coordinate any meetings. Complete the work as agreed, and the escrow funds will be released to you upon confirmation.",
      },
    ],
  },
  {
    id: "payments-escrow",
    icon: <CreditCard className="h-5 w-5" />,
    title: "Payments & Escrow",
    description: "Understanding how payments, fees, and escrow protection work",
    color: "amber",
    questions: [
      {
        q: "How does the escrow system work?",
        a: "When a buyer agrees to hire you, they deposit the task payment into PostAll's secure escrow account. The funds are held safely and released to you only after the buyer confirms the work is complete or the review period expires. This protects both parties — the buyer knows their money is safe, and you know the funds are available before you start working.",
      },
      {
        q: "What fees does PostAll charge?",
        a: "PostAll charges two small fees: a 5% platform service fee on completed transactions and a 2% escrow protection fee. These fees are automatically deducted from the transaction amount before funds are released to the seller. For example, on a $100 transaction, the seller receives $93 after fees. There are no subscription fees, listing fees, or hidden charges.",
      },
      {
        q: "How do I withdraw money from my PostAll wallet?",
        a: "Go to your Dashboard and click on 'Wallet.' You'll see your available balance, and you can click 'Withdraw' to transfer funds to your linked Nigerian bank account. Bank transfers typically process within 1-3 business days.",
      },
      {
        q: "What payment methods are accepted?",
        a: "PostAll accepts bank transfers and debit cards securely processed through Paystack. All transactions are in Nigerian Naira (₦).",
      },
      {
        q: "What happens if there's a dispute over payment?",
        a: "Either party can open a dispute within the review period after a task is marked complete. Our dispute resolution team will review all evidence including messages, Proof Cam images, and transaction history. We aim to resolve disputes within 72 hours, and our decision regarding fund distribution is final. The escrow funds remain safely held until the dispute is resolved.",
      },
    ],
  },
  {
    id: "account-settings",
    icon: <Settings className="h-5 w-5" />,
    title: "Account & Settings",
    description: "Managing your profile, preferences, and account settings",
    color: "orange",
    questions: [
      {
        q: "How do I update my profile information?",
        a: "Go to your Dashboard and click on 'Profile.' From there, you can update your display name, profile photo, bio, skills, city, and other personal information. A complete and well-maintained profile helps you build trust with other users and increases your chances of being selected for tasks or attracting buyers to your listings.",
      },
      {
        q: "How do I get verified on PostAll?",
        a: "To get verified, go to your Profile page and click the 'Get Verified' button. You'll need to provide a valid government-issued ID and complete our verification process. Verified users receive a special badge on their profile, which increases trust and visibility. Verification is free and typically completes within 24-48 hours after submission.",
      },
      {
        q: "Can I change my email address or phone number?",
        a: "Yes, you can update your email address and phone number from the Settings page in your Dashboard. You'll need to verify your new contact information before the change takes effect. We recommend keeping your contact information current to ensure you don't miss important notifications about tasks, messages, and payments.",
      },
      {
        q: "How do I delete my account?",
        a: "To delete your account, go to Settings and scroll to the 'Danger Zone' section at the bottom of the page. Click 'Delete Account' and confirm your decision. Please note that account deletion is permanent and cannot be undone. Any active tasks or escrow funds will need to be resolved before deletion can proceed. We recommend withdrawing any remaining wallet balance first.",
      },
    ],
  },
  {
    id: "safety",
    icon: <Shield className="h-5 w-5" />,
    title: "Safety",
    description: "Staying safe on the platform and protecting yourself",
    color: "rose",
    questions: [
      {
        q: "How do I report suspicious activity or a user?",
        a: "You can report any listing, profile, message, or user by clicking the flag icon or 'Report' button available throughout the platform. Provide as much detail as possible about the issue. Our safety team reviews all reports within 24 hours and takes appropriate action, which may include warnings, account suspension, or permanent bans depending on the severity.",
      },
      {
        q: "What are Safe Spots and how do I use them?",
        a: "Safe Spots are pre-vetted, public meeting locations recommended for in-person transactions. You can find them using our Safe Spots tool, which shows verified locations on a map with ratings and reviews from other users. Safe Spots typically include well-lit areas with CCTV coverage, high foot traffic, and security presence. We strongly recommend using Safe Spots for all in-person meetups.",
      },
      {
        q: "What is the Proof Cam and when should I use it?",
        a: "The Proof Cam is a built-in tool that captures timestamped, geotagged photos and videos linked to specific transactions. Use it before handing over items (to document their condition) and after receiving items or completed work. Proof Cam images are encrypted and stored securely, and they serve as admissible evidence in any dispute resolution process on the platform.",
      },
      {
        q: "What should I do if I feel unsafe during a transaction?",
        a: "Your personal safety is the top priority. If you feel unsafe at any point during a transaction, remove yourself from the situation immediately and contact local emergency services if necessary. Once you're safe, use the in-app Emergency button to alert our safety team, and file a detailed report through the platform. We take all safety concerns extremely seriously and will investigate promptly.",
      },
      {
        q: "How does PostAll handle fraud and scams?",
        a: "We employ multiple layers of fraud prevention including automated detection systems, manual reviews, user verification, and community reporting. Scammers are permanently banned from the platform. If you've been a victim of fraud, open a dispute immediately and our team will investigate. We work closely with law enforcement when necessary to protect our users and their interests.",
      },
    ],
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
  emerald: { bg: "bg-emerald-50/50", text: "text-emerald-700", border: "border-emerald-200", iconBg: "bg-emerald-100" },
  teal: { bg: "bg-teal-50/50", text: "text-teal-700", border: "border-teal-200", iconBg: "bg-teal-100" },
  cyan: { bg: "bg-cyan-50/50", text: "text-cyan-700", border: "border-cyan-200", iconBg: "bg-cyan-100" },
  amber: { bg: "bg-amber-50/50", text: "text-amber-700", border: "border-amber-200", iconBg: "bg-amber-100" },
  orange: { bg: "bg-orange-50/50", text: "text-orange-700", border: "border-orange-200", iconBg: "bg-orange-100" },
  rose: { bg: "bg-rose-50/50", text: "text-rose-700", border: "border-rose-200", iconBg: "bg-rose-100" },
};

export default function HelpPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 mb-4 bg-white/10 rounded-full px-4 py-2">
            <HelpCircle className="h-5 w-5 text-emerald-200" />
            <span className="text-emerald-100 font-medium">Help Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            How Can We Help?
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto mb-8">
            Find answers to common questions, learn how to use our platform, and get the support you
            need to have a great experience on PostAll.
          </p>
          {/* Search Bar (cosmetic) */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for answers..."
                className="pl-12 h-12 text-base bg-white rounded-full border-0 shadow-lg"
                readOnly
              />
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-2.5 max-w-6xl">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/browse" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-foreground font-medium">Help Center</span>
          </nav>
        </div>
      </div>

      {/* FAQ Categories Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our FAQ categories to find answers to the most common questions about using
              the PostAll marketplace.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {faqCategories.map((cat) => {
              const colors = colorMap[cat.color];
              return (
                <a key={cat.id} href={`#${cat.id}`}>
                  <Card className={`h-full cursor-pointer hover:shadow-md transition-shadow ${colors.bg} ${colors.border}`}>
                    <CardContent className="p-5">
                      <div className={`h-10 w-10 rounded-lg ${colors.iconBg} ${colors.text} flex items-center justify-center mb-3`}>
                        {cat.icon}
                      </div>
                      <h3 className="font-semibold mb-1">{cat.title}</h3>
                      <p className="text-xs text-muted-foreground">{cat.description}</p>
                      <div className={`flex items-center gap-1 text-xs font-medium ${colors.text} mt-3`}>
                        {cat.questions.length} questions
                        <ChevronRight className="h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              );
            })}
          </div>

          {/* Detailed FAQ Accordion Sections */}
          {faqCategories.map((cat) => {
            const colors = colorMap[cat.color];
            return (
              <div key={cat.id} id={cat.id} className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`h-10 w-10 rounded-lg ${colors.iconBg} ${colors.text} flex items-center justify-center`}>
                    {cat.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{cat.title}</h2>
                    <p className="text-sm text-muted-foreground">{cat.description}</p>
                  </div>
                </div>
                <Card>
                  <CardContent className="p-0">
                    <Accordion type="single" collapsible className="w-full">
                      {cat.questions.map((faq, idx) => (
                        <AccordionItem key={idx} value={`${cat.id}-${idx}`}>
                          <AccordionTrigger className="px-6 text-left">
                            {faq.q}
                          </AccordionTrigger>
                          <AccordionContent className="px-6 text-muted-foreground leading-relaxed">
                            {faq.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Still Need Help */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <HelpCircle className="h-12 w-12 mx-auto mb-6 text-emerald-600" />
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Couldn&apos;t find what you were looking for? Our support team is here to help. Reach out
            through any of the channels below and we&apos;ll get back to you as soon as possible.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-emerald-700" />
                </div>
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Chat with our support team in real-time during business hours for immediate
                  assistance with any issues you're experiencing.
                </p>
                <Button variant="outline" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Start Chat
                </Button>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-teal-700" />
                </div>
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Send us an email at support@postall.com with a detailed description of your issue.
                  We typically respond within 24 hours.
                </p>
                <Button variant="outline" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Send Email
                </Button>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-cyan-700" />
                </div>
                <h3 className="font-semibold mb-2">Community Forum</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ask questions, share tips, and connect with other PostAll users in our community
                  forum. Many questions are answered by experienced community members.
                </p>
                <Button variant="outline" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Visit Forum
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="text-sm text-muted-foreground">Quick Links:</span>
            <Link href="/safety">
              <Button variant="ghost" size="sm" className="gap-1.5 text-emerald-700">
                <Shield className="h-4 w-4" />
                Safety Center
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
            <Link href="/terms">
              <Button variant="ghost" size="sm" className="gap-1.5 text-emerald-700">
                <FileText className="h-4 w-4" />
                Terms of Service
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
            <Link href="/privacy">
              <Button variant="ghost" size="sm" className="gap-1.5 text-emerald-700">
                <Lock className="h-4 w-4" />
                Privacy Policy
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
