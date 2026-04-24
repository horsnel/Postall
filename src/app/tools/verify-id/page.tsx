"use client";

import Link from "next/link";
import { BadgeCheck, Shield, Smartphone, Mail, Award, ArrowRight , ChevronLeft} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const features = [
  {
    icon: Shield,
    title: "Government ID Verification",
    description:
      "Verify your identity with a valid government-issued ID. Upload your ID card or passport for secure verification that builds trust with other marketplace users.",
  },
  {
    icon: Smartphone,
    title: "Phone Number Verification",
    description:
      "Link and verify your phone number via SMS confirmation. Verified numbers add an extra layer of authenticity to your profile and increase buyer confidence.",
  },
  {
    icon: Mail,
    title: "Email Verification",
    description:
      "Confirm your email address to unlock full platform features. Verified emails ensure you never miss important notifications about your tasks and transactions.",
  },
  {
    icon: Award,
    title: "Badge System",
    description:
      "Earn verification badges as you complete each verification step. Display your verified status prominently on your profile to attract more clients and opportunities.",
  },
];

const steps = [
  {
    step: 1,
    title: "Choose Verification Type",
    description:
      "Select which form of verification you'd like to complete. Start with email or phone for quick verification, or go for full government ID verification.",
  },
  {
    step: 2,
    title: "Submit Your Documents",
    description:
      "Upload a clear photo or scan of your chosen verification document. Our system will automatically review and validate your submission within minutes.",
  },
  {
    step: 3,
    title: "Earn Your Badge",
    description:
      "Once verified, receive your trust badge on your profile. Verified users get higher visibility, more trust from clients, and priority in search results.",
  },
];

export default function VerifyIDPage() {
  return (
    <div className="min-h-[60vh]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="bg-white/20 text-white mb-4 hover:bg-white/20">Trust & Safety</Badge>
          <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
            <BadgeCheck className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Verify ID</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Verify your identity to build trust and unlock premium features on the marketplace.
          </p>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="container mx-auto max-w-4xl -mt-6 relative z-10 px-4">
        <Card className="shadow-xl border-emerald-200">
          <CardContent className="p-6 text-center">
            <Badge variant="secondary" className="bg-amber-100 text-amber-700 mb-2">
              Coming Soon
            </Badge>
            <h2 className="text-xl font-semibold mb-2">This Tool is Under Development</h2>
            <p className="text-muted-foreground mb-4">
              We&apos;re building this feature with care. Get notified when it launches.
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input placeholder="Enter your email" type="email" className="flex-1" />
              <Button>Notify Me</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">What to Expect</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <Card key={feature.title} className="border-emerald-100 hover:border-emerald-300 transition-colors">
              <CardContent className="p-5">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-3">
                  <feature.icon className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-muted/30 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-8">How It Will Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {steps.map((item) => (
              <Card key={item.step} className="text-center relative">
                <CardContent className="p-5">
                  <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  {item.step < 3 && (
                    <ArrowRight className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-5 w-5 text-emerald-300" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Related Tools */}
      <div className="container mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-muted-foreground mb-4">In the meantime, explore related resources:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Link href="/safety">
            <Button variant="outline">Safety Center</Button>
          </Link>
          <Link href="/tools/proof-cam">
            <Button variant="outline">Proof Cam</Button>
          </Link>
        </div>
        <Link href="/#tools" className="block mt-6 text-sm text-primary hover:underline">
          <ChevronLeft className="h-4 w-4" />Back to All Tools
        </Link>
      </div>
    </div>
  );
}
