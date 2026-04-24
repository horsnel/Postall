"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Mail,
  MessageCircle,
  Phone,
  Send,
  MapPin,
  Clock,
  ShieldAlert,
  Building2,
  Globe,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Headphones,
  Sparkles,
  ArrowRight,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const contactChannels = [
  {
    icon: Mail,
    title: "Email",
    detail: "support@postall.com",
    description: "Send us an email anytime",
    color: "text-blue-500",
    bgColor: "bg-emerald-500/10",
    href: "mailto:support@postall.com",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    detail: "+234 800 POSTALL",
    description: "Chat with us instantly",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    href: "https://wa.me/2348007678255",
  },
  {
    icon: Phone,
    title: "Phone",
    detail: "+234 800 767 8255",
    description: "Mon-Fri, 9AM - 6PM WAT",
    color: "text-purple-500",
    bgColor: "bg-emerald-500/10",
    href: "tel:+2348007678255",
  },
  {
    icon: Globe,
    title: "Social Media",
    detail: "@postallng",
    description: "Follow us for updates",
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    href: "#",
  },
];

const socialLinks = [
  { icon: Twitter, label: "Twitter", handle: "@postallng", href: "#" },
  { icon: Instagram, label: "Instagram", handle: "@postallng", href: "#" },
  { icon: Facebook, label: "Facebook", handle: "PostAll Nigeria", href: "#" },
  { icon: Linkedin, label: "LinkedIn", handle: "PostAll", href: "#" },
];

const faqItems = [
  {
    question: "How quickly will I get a response?",
    answer:
      "We typically respond within 2 hours during business hours (Mon-Fri, 9AM-6PM WAT). On weekends and public holidays, responses may take up to 12 hours. For urgent issues, WhatsApp is the fastest way to reach us.",
  },
  {
    question: "I have a problem with a transaction. What should I do?",
    answer:
      "Open a dispute through the transaction page in your dashboard, or contact us via WhatsApp with your transaction ID. Our dispute resolution team will investigate and work to resolve the issue within 48 hours. All transactions are escrow-protected, so your money is safe.",
  },
  {
    question: "How do I report a suspicious listing or user?",
    answer:
      "Click the 'Report' button on any listing or user profile. You can also email safety@postall.com with details. Our safety team reviews all reports within 4 hours and takes appropriate action including account suspension if necessary.",
  },
  {
    question: "I want to partner with PostAll. Who should I contact?",
    answer:
      "For partnerships, sponsorships, and business development opportunities, please select 'Partnership' in the contact form subject, or email partnerships@postall.com. We'd love to hear from businesses, NGOs, and organizations looking to collaborate.",
  },
  {
    question: "Can I get a refund for a promoted listing?",
    answer:
      "If your promoted listing did not receive the expected visibility due to a platform issue, contact us within 7 days of the promotion period. We'll review your case and may offer a credit or refund. Refunds are not available for listings removed by the user during the promotion period.",
  },
  {
    question: "I forgot my password. How do I reset it?",
    answer:
      "Go to the login page and click 'Forgot Password'. Enter your registered email address and we'll send you a reset link. The link expires after 1 hour for security. If you don't receive the email, check your spam folder or contact support.",
  },
];

const offices = [
  {
    city: "Lagos HQ",
    country: "Nigeria",
    address: "14th Floor, Civic Towers\nOzumba Mbadiwe Avenue\nVictoria Island, Lagos",
    phone: "+234 800 767 8255",
    email: "lagos@postall.com",
    color: "bg-emerald-500",
  },
  {
    city: "Lagos Office",
    country: "Nigeria",
    address: "Suite 302, Civic Towers\nOzumba Mbadiwe Avenue\nVictoria Island, Lagos",
    phone: "+234 800 767 8255",
    email: "lagos@postall.com",
    color: "bg-emerald-600",
  },
];

const subjectOptions = [
  { value: "general", label: "General Inquiry" },
  { value: "technical", label: "Technical Support" },
  { value: "problem", label: "Report a Problem" },
  { value: "partnership", label: "Partnership" },
  { value: "advertising", label: "Advertising" },
  { value: "safety", label: "Safety Concern" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleChange = (
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <div className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[300px] md:h-[400px] overflow-hidden text-white">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-400" />
            <img src="/images/contact-hero.png" alt="Get in touch" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
          </div>
          <div className="relative z-10 flex items-center justify-center h-full px-4">
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="bg-white/20 text-white hover:bg-white/30 border-white/30 mb-6 text-sm px-4 py-1">
                <Headphones className="h-3.5 w-3.5 mr-1.5" />
                We&apos;re Here to Help
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Get in Touch
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                Our support team is available 24/7 to help you with any
                questions, issues, or feedback. We typically respond within 2
                hours.
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Contact Form + Channels */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we&apos;ll get back to you as
                    soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for reaching out. We&apos;ll get back to you
                        within 2 hours during business hours.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({
                            name: "",
                            email: "",
                            phone: "",
                            subject: "",
                            message: "",
                          });
                        }}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">
                            Full Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(e) =>
                              handleChange("name", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">
                            Email <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) =>
                              handleChange("email", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+234 800 000 0000"
                            value={formData.phone}
                            onChange={(e) =>
                              handleChange("phone", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">
                            Subject <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={formData.subject}
                            onValueChange={(value) =>
                              handleChange("subject", value)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {subjectOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">
                          Message <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us how we can help you..."
                          rows={5}
                          value={formData.message}
                          onChange={(e) =>
                            handleChange("message", e.target.value)
                          }
                          required
                          className="resize-none"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <p className="text-xs text-muted-foreground">
                          <span className="text-red-500">*</span> Required fields
                        </p>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Channels Sidebar */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-2">Other Ways to Reach Us</h3>
              {contactChannels.map((channel, i) => (
                <a key={i} href={channel.href} target="_blank" rel="noopener noreferrer">
                  <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group hover:border-emerald-200 dark:hover:border-emerald-800 mb-4">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div
                        className={`h-11 w-11 rounded-xl ${channel.bgColor} flex items-center justify-center shrink-0`}
                      >
                        <channel.icon className={`h-5 w-5 ${channel.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm group-hover:text-emerald-600 transition-colors">
                          {channel.title}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {channel.detail}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </CardContent>
                  </Card>
                </a>
              ))}

              {/* Response Time */}
              <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                <CardContent className="p-4 flex items-start gap-3">
                  <Clock className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-emerald-800 dark:text-emerald-300">
                      Response Time
                    </p>
                    <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70 mt-1">
                      We typically respond within{" "}
                      <strong>2 hours</strong> during business hours and within{" "}
                      <strong>12 hours</strong> on weekends and public holidays.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardContent className="p-4">
                  <p className="font-medium text-sm mb-3">Follow Us</p>
                  <div className="grid grid-cols-2 gap-2">
                    {socialLinks.map((social, i) => (
                      <a
                        key={i}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-muted transition-colors group"
                      >
                        <social.icon className="h-4 w-4 text-muted-foreground group-hover:text-emerald-600 transition-colors" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate">
                            {social.label}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {social.handle}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-muted/40 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 mb-4"
              >
                FAQ
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Common Support Questions
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Quick answers to frequently asked support questions.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Office Locations */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <Badge
              variant="secondary"
              className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 mb-4"
            >
              <Building2 className="h-3.5 w-3.5 mr-1.5" />
              Our Offices
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Visit Us
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Come say hello at one of our office locations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {offices.map((office, i) => (
              <Card
                key={i}
                className="overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Map Placeholder */}
                <div className="h-40 bg-muted relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-teal-100/50 dark:from-emerald-900/20 dark:to-teal-900/20" />
                  <div className="relative flex flex-col items-center gap-2">
                    <MapPin className="h-8 w-8 text-emerald-500" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {office.city}
                    </span>
                  </div>
                  {/* Grid pattern for map feel */}
                  <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%">
                      <defs>
                        <pattern
                          id={`grid-${i}`}
                          width="30"
                          height="30"
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M 30 0 L 0 0 0 30"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.5"
                          />
                        </pattern>
                      </defs>
                      <rect
                        width="100%"
                        height="100%"
                        fill={`url(#grid-${i})`}
                      />
                    </svg>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`h-8 w-8 rounded-lg ${office.color} flex items-center justify-center`}
                    >
                      <Building2 className="h-4 w-4 text-white" />
                    </span>
                    <div>
                      <h3 className="font-semibold">{office.city}</h3>
                      <p className="text-xs text-muted-foreground">
                        {office.country}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                    {office.address}
                  </p>
                  <div className="mt-4 pt-4 border-t space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{office.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{office.email}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Safety / Emergency Section */}
        <section className="bg-muted/40 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-rose-200 dark:border-rose-800 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-5">
                  <div className="md:col-span-2 bg-gradient-to-br from-rose-500 to-orange-500 p-8 flex flex-col items-center justify-center text-white text-center">
                    <ShieldAlert className="h-12 w-12 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Safety Emergency?</h3>
                    <p className="text-sm text-white/80">
                      If you feel unsafe during a transaction
                    </p>
                  </div>
                  <div className="md:col-span-3 p-6 md:p-8">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-1 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-rose-500" />
                          Emergency Safety Line
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          For immediate safety concerns during a transaction or
                          meeting, call our emergency line:
                        </p>
                        <p className="text-lg font-bold text-rose-600 mt-1">
                          +234 800 SAFE PA (7233 72)
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Safety Email</h4>
                        <p className="text-sm text-muted-foreground">
                          Report safety concerns confidentially:
                        </p>
                        <a
                          href="mailto:safety@postall.com"
                          className="text-sm text-emerald-600 hover:underline font-medium"
                        >
                          safety@postall.com
                        </a>
                      </div>
                      <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">
                          <strong className="text-rose-600 dark:text-rose-400">
                            Remember:
                          </strong>{" "}
                          Always meet at verified Safe Spots for in-person
                          transactions. Never share your banking PIN or passwords.
                          If something feels wrong, trust your instincts and
                          walk away. Your safety is our top priority.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-3xl p-10 md:p-16 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Still Have Questions?
                </h2>
                <p className="text-emerald-50 text-lg mb-8 max-w-xl mx-auto">
                  Check out our Help Center for detailed guides, tutorials, and
                  answers to all your questions.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/help">
                    <Button
                      size="lg"
                      className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold px-8 h-12"
                    >
                      Visit Help Center
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/safety">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/40 text-white hover:bg-white/10 hover:text-white font-semibold px-8 h-12"
                    >
                      Safety Center
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
