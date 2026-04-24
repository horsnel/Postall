"use client";

import Link from "next/link";
import { Lock, Shield, Calculator, Scale, ArrowRight , ChevronLeft} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const features = [
  {
    icon: Shield,
    title: "How Escrow Works",
    description:
      "Understand the complete escrow process from payment initiation to fund release. Your money is held securely until both parties confirm the transaction is complete.",
  },
  {
    icon: Calculator,
    title: "Fee Calculator",
    description:
      "Calculate exactly how much you'll pay in escrow fees before committing. See a transparent breakdown of platform fees and escrow protection costs for any transaction amount.",
  },
  {
    icon: Lock,
    title: "Protection Guarantee",
    description:
      "Every escrow transaction comes with our protection guarantee. If something goes wrong, our dispute resolution team will fairly assess the situation and ensure proper fund handling.",
  },
  {
    icon: Scale,
    title: "Dispute Resolution",
    description:
      "Built-in dispute resolution process for when things don't go as planned. Submit evidence, communicate through our mediation system, and get a fair resolution within 48 hours.",
  },
];

const steps = [
  {
    step: 1,
    title: "Initiate Escrow",
    description:
      "When a task begins or an item is purchased, the buyer's payment is automatically placed into escrow. Funds are held securely until the work is completed or item delivered.",
  },
  {
    step: 2,
    title: "Complete the Transaction",
    description:
      "The seller or worker completes their obligation — finishing the task, delivering the item, or providing the service. Both parties can verify completion through the platform.",
  },
  {
    step: 3,
    title: "Funds Released Safely",
    description:
      "Once the buyer confirms satisfaction, escrow funds are released to the seller's wallet. If there's a dispute, our resolution team reviews the case before releasing funds.",
  },
];

export default function EscrowPage() {
  return (
    <div className="min-h-[60vh]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="bg-white/20 text-white mb-4 hover:bg-white/20">Payment Tool</Badge>
          <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Escrow</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Secure payment protection for every transaction. Your money is safe until the job is done.
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
          <Link href="/pricing">
            <Button variant="outline">Pricing</Button>
          </Link>
          <Link href="/safety">
            <Button variant="outline">Safety Center</Button>
          </Link>
        </div>
        <Link href="/#tools" className="block mt-6 text-sm text-primary hover:underline">
          <ChevronLeft className="h-4 w-4" />Back to All Tools
        </Link>
      </div>
    </div>
  );
}
