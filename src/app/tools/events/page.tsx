"use client";

import Link from "next/link";
import { CalendarDays, Ticket, CirclePlus, Calendar, ArrowRight , ChevronLeft} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const features = [
  {
    icon: CalendarDays,
    title: "Event Listings",
    description:
      "Discover a wide range of local events including workshops, meetups, networking sessions, and community gatherings. Filter by date, category, and location to find what excites you.",
  },
  {
    icon: CirclePlus,
    title: "Event Creation",
    description:
      "Create and promote your own events on the marketplace. Set event details, ticket pricing, capacity limits, and share with your network to attract attendees.",
  },
  {
    icon: Ticket,
    title: "RSVP System",
    description:
      "Easily RSVP to events with a single click. Track your upcoming events, manage your attendance, and get reminders before events start so you never miss out.",
  },
  {
    icon: Calendar,
    title: "Calendar Integration",
    description:
      "Sync events directly to your personal calendar. Get automatic reminders and see all your upcoming marketplace events alongside your other commitments in one place.",
  },
];

const steps = [
  {
    step: 1,
    title: "Discover Events",
    description:
      "Browse upcoming events in your city or explore events in other locations. Use filters for categories like workshops, social, professional, or community events.",
  },
  {
    step: 2,
    title: "RSVP or Create",
    description:
      "RSVP to events that interest you with one click, or create your own event to share with the community. Set details, capacity, and ticket options for your event.",
  },
  {
    step: 3,
    title: "Connect & Attend",
    description:
      "Add events to your calendar, connect with other attendees beforehand, and show up ready to network, learn, and have a great time. Share your experience afterward.",
  },
];

export default function EventsPage() {
  return (
    <div className="min-h-[60vh]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="bg-white/20 text-white mb-4 hover:bg-white/20">Community Tool</Badge>
          <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
            <CalendarDays className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Events</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Discover local events. Attend workshops, meetups, and community gatherings near you.
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
          <Link href="/browse/community">
            <Button variant="outline">Browse Community</Button>
          </Link>
          <Link href="/tools/team-up">
            <Button variant="outline">Team Up</Button>
          </Link>
        </div>
        <Link href="/#tools" className="block mt-6 text-sm text-primary hover:underline">
          <ChevronLeft className="h-4 w-4" />Back to All Tools
        </Link>
      </div>
    </div>
  );
}
