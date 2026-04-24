"use client";

import Link from "next/link";
import { GraduationCap, ClipboardCheck, BookOpen, ChartColumnIncreasing, Award, ArrowRight , ChevronLeft} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const features = [
  {
    icon: ClipboardCheck,
    title: "Skill Assessment",
    description:
      "Take personalized skill assessments to identify your strengths and areas for improvement. Get a detailed breakdown of your competencies with recommendations for growth.",
  },
  {
    icon: BookOpen,
    title: "Curated Courses",
    description:
      "Access a library of curated courses designed specifically for marketplace professionals. Learn practical skills from graphic design to project management at your own pace.",
  },
  {
    icon: ChartColumnIncreasing,
    title: "Progress Tracking",
    description:
      "Track your learning progress with detailed analytics. See how your skills improve over time, monitor course completion rates, and set personal development goals.",
  },
  {
    icon: Award,
    title: "Certification",
    description:
      "Earn verified certificates upon course completion to showcase on your profile. Certified professionals attract more clients and command higher rates on the marketplace.",
  },
];

const steps = [
  {
    step: 1,
    title: "Assess Your Skills",
    description:
      "Start with a comprehensive skill assessment that evaluates your current abilities. Get a personalized learning path based on your strengths, weaknesses, and career goals.",
  },
  {
    step: 2,
    title: "Learn at Your Pace",
    description:
      "Enroll in courses that match your learning path. Each course includes video lessons, practical exercises, quizzes, and peer discussions for a well-rounded learning experience.",
  },
  {
    step: 3,
    title: "Get Certified",
    description:
      "Complete courses and pass assessments to earn your certificate. Display your certifications on your marketplace profile to stand out and attract premium opportunities.",
  },
];

export default function LearnSkillsPage() {
  return (
    <div className="min-h-[60vh]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="bg-white/20 text-white mb-4 hover:bg-white/20">Education Tool</Badge>
          <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Learn Skills</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Take skill courses and earn certifications. Grow your expertise and boost your earnings.
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
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center mb-3">
                  <feature.icon className="h-5 w-5 text-amber-600" />
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
        <p className="text-muted-foreground mb-4">In the meantime, explore related tools:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Link href="/browse">
            <Button variant="outline">Browse Marketplace</Button>
          </Link>
          <Link href="/tools/my-reputation">
            <Button variant="outline">My Reputation</Button>
          </Link>
        </div>
        <Link href="/#tools" className="block mt-6 text-sm text-primary hover:underline">
          <ChevronLeft className="h-4 w-4" />Back to All Tools
        </Link>
      </div>
    </div>
  );
}
