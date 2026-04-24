"use client";

import Link from "next/link";
import { Calendar, ListTodo, Users, Bell, ArrowRight , ChevronLeft} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const features = [
  {
    icon: Calendar,
    title: "Calendar View",
    description:
      "Visualize all your tasks, meetings, and deadlines in a beautiful calendar interface. Switch between daily, weekly, and monthly views to plan your time effectively.",
  },
  {
    icon: ListTodo,
    title: "Task Deadline Tracking",
    description:
      "Never miss a deadline with automatic task tracking. See upcoming deadlines color-coded by urgency and receive reminders before they're due.",
  },
  {
    icon: Users,
    title: "Meeting Scheduling",
    description:
      "Schedule meetings with clients and collaborators directly from the tool. Share availability, propose time slots, and confirm meetings without leaving the platform.",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description:
      "Get customizable reminders via push notification and email. Set multiple reminder times before deadlines and meetings so nothing catches you off guard.",
  },
];

const steps = [
  {
    step: 1,
    title: "Connect Your Tasks",
    description:
      "Link your marketplace tasks and deadlines to the scheduler. Import existing commitments and set up your preferred working hours and availability windows.",
  },
  {
    step: 2,
    title: "Plan Your Schedule",
    description:
      "Drag and drop tasks onto your calendar to allocate time blocks. Schedule meetings with clients by sharing your available time slots for easy booking.",
  },
  {
    step: 3,
    title: "Stay on Track",
    description:
      "Receive timely reminders and alerts before deadlines. Review your daily agenda each morning and adjust priorities as new tasks come in throughout the day.",
  },
];

export default function SchedulerPage() {
  return (
    <div className="min-h-[60vh]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="bg-white/20 text-white mb-4 hover:bg-white/20">Productivity Tool</Badge>
          <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
            <Calendar className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Scheduler</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Schedule meetings and tasks. Stay organized and never miss a deadline.
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
                <div className="h-10 w-10 rounded-lg bg-cyan-100 flex items-center justify-center mb-3">
                  <feature.icon className="h-5 w-5 text-cyan-600" />
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
          <Link href="/dashboard/tasks">
            <Button variant="outline">My Tasks</Button>
          </Link>
          <Link href="/tools/auto-reply">
            <Button variant="outline">Auto-Reply</Button>
          </Link>
        </div>
        <Link href="/#tools" className="block mt-6 text-sm text-primary hover:underline">
          <ChevronLeft className="h-4 w-4" />Back to All Tools
        </Link>
      </div>
    </div>
  );
}
