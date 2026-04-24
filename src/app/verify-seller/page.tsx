"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BadgeCheck,
  Star,
  TrendingUp,
  MessageCircle,
  HeadphonesIcon,
  Award,
  ShieldCheck,
  UserCheck,
  FileText,
  Smartphone,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Users,
} from "lucide-react";

const requirements = [
  { name: "Profile Photo", basic: true, standard: true, premium: true },
  { name: "Email Verified", basic: true, standard: true, premium: true },
  { name: "Phone Verified", basic: true, standard: true, premium: true },
  { name: "Government ID", basic: false, standard: true, premium: true },
  { name: "6+ Month History", basic: false, standard: true, premium: true },
  { name: "95%+ Rating", basic: false, standard: false, premium: true },
  { name: "Transaction History", basic: false, standard: false, premium: true },
  { name: "Listing Count", basic: "2+", standard: "5+", premium: "10+" },
];

export default function VerifySellerPage() {
  return (
    <div className="flex min-h-screen flex-col">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/10 mb-6">
            <BadgeCheck className="h-8 w-8 text-emerald-200" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Become a Verified Seller
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Stand out from the crowd and build trust with buyers. Verified sellers
            get more visibility, more messages, and more sales.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-emerald-300 text-emerald-700">
              <Star className="h-3.5 w-3.5 mr-1.5" />
              Benefits
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Benefits of Verification
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Unlock exclusive features and gain buyer trust with verified status.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <BadgeCheck className="h-6 w-6" />,
                title: "Verified Badge on Profile",
                desc: "Green checkmark badge visible everywhere on the platform — your listings, messages, and reviews.",
                color: "emerald",
              },
              {
                icon: <TrendingUp className="h-6 w-6" />,
                title: "Higher Search Rankings",
                desc: "Verified sellers appear first in search results, giving you maximum visibility to potential buyers.",
                color: "teal",
              },
              {
                icon: <MessageCircle className="h-6 w-6" />,
                title: "3x More Messages",
                desc: "Buyers prefer verified sellers. Get up to 3x more messages and inquiries than unverified sellers.",
                color: "cyan",
              },
              {
                icon: <HeadphonesIcon className="h-6 w-6" />,
                title: "Priority Support",
                desc: "Get faster dispute resolution and priority customer support from our dedicated team.",
                color: "amber",
              },
              {
                icon: <Award className="h-6 w-6" />,
                title: "Featured Listings",
                desc: "Regular promotion for top sellers. Your listings get featured placement across the platform.",
                color: "orange",
              },
              {
                icon: <ShieldCheck className="h-6 w-6" />,
                title: "Buyer Trust",
                desc: '"Verified" seal on all your listings builds instant credibility and trust with buyers.',
                color: "emerald",
              },
            ].map((benefit) => (
              <Card key={benefit.title} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700 mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{benefit.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* How to Get Verified */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-emerald-300 text-emerald-700">
              <ArrowRight className="h-3.5 w-3.5 mr-1.5" />
              Step by Step
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How to Get Verified</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to earn your verified badge.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: 1,
                icon: <UserCheck className="h-6 w-6" />,
                title: "Complete Profile",
                desc: "Fill out all profile information including your name, bio, and profile photo.",
              },
              {
                step: 2,
                icon: <FileText className="h-6 w-6" />,
                title: "Upload Valid ID",
                desc: "Submit a government-issued ID for identity verification. Accepted: NIN, Passport, Voter's Card.",
              },
              {
                step: 3,
                icon: <Smartphone className="h-6 w-6" />,
                title: "Phone Verification",
                desc: "Confirm your phone number with a one-time verification code sent via SMS.",
              },
              {
                step: 4,
                icon: <Clock className="h-6 w-6" />,
                title: "Review & Approval",
                desc: "Our team reviews your application within 24-48 hours. You'll get notified once approved.",
              },
            ].map((item) => (
              <Card key={item.step} className="text-center relative">
                <CardContent className="p-6">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  <div className="h-14 w-14 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-4 mt-2 text-emerald-700">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Verification Levels */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-emerald-300 text-emerald-700">
              <Star className="h-3.5 w-3.5 mr-1.5" />
              Tiers
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Verification Levels</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              There are three levels of verification, each unlocking more benefits.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Basic */}
            <Card className="relative">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <h3 className="text-xl font-bold">Basic</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Email + phone verified
                </p>
                <Badge className="bg-emerald-100 text-emerald-700 mb-4">Free</Badge>
                <div className="space-y-2">
                  {[
                    "Verified badge on profile",
                    "Appear in verified search filter",
                    "Basic seller tools",
                  ].map((feature) => (
                    <div key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Standard */}
            <Card className="relative border-2 border-emerald-500">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-emerald-600 text-white">Recommended</Badge>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <h3 className="text-xl font-bold">Standard</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  ID verified + 6-month history
                </p>
                <Badge className="bg-emerald-100 text-emerald-700 mb-4">Free</Badge>
                <div className="space-y-2">
                  {[
                    "All Basic benefits",
                    "Higher search rankings",
                    "Priority in search results",
                    "Access to paid promotions",
                  ].map((feature) => (
                    <div key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Premium */}
            <Card className="relative">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <h3 className="text-xl font-bold">Premium</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  ID verified + 1-year history + 95%+ rating
                </p>
                <Badge className="bg-emerald-100 text-emerald-700 mb-4">Free</Badge>
                <div className="space-y-2">
                  {[
                    "All Standard benefits",
                    "3x more messages from buyers",
                    "Priority support & dispute resolution",
                    "Featured listing placements",
                    '"Top Seller" spotlight on homepage',
                  ].map((feature) => (
                    <div key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Requirements Table */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-emerald-300 text-emerald-700">
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Requirements
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Requirements Table</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See exactly what&apos;s needed for each verification level.
            </p>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-semibold text-sm">Requirement</th>
                      <th className="text-center p-4 font-semibold text-sm">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          Basic
                        </div>
                      </th>
                      <th className="text-center p-4 font-semibold text-sm">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          Standard
                        </div>
                      </th>
                      <th className="text-center p-4 font-semibold text-sm">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          Premium
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {requirements.map((req, i) => (
                      <tr key={req.name} className={i < requirements.length - 1 ? "border-b" : ""}>
                        <td className="p-4 text-sm font-medium">{req.name}</td>
                        <td className="p-4 text-center">
                          {typeof req.basic === "boolean" ? (
                            req.basic ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
                            ) : (
                              <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            <span className="text-sm font-medium text-emerald-700">{req.basic}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof req.standard === "boolean" ? (
                            req.standard ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
                            ) : (
                              <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            <span className="text-sm font-medium text-emerald-700">{req.standard}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof req.premium === "boolean" ? (
                            req.premium ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
                            ) : (
                              <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            <span className="text-sm font-medium text-emerald-700">{req.premium}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Verified Seller Stats */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-emerald-300 text-emerald-700">
              <Users className="h-3.5 w-3.5 mr-1.5" />
              Community
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Verified Seller Stats</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <BadgeCheck className="h-6 w-6 text-emerald-700" />
                </div>
                <p className="text-3xl font-bold text-emerald-700 mb-2">1,200+</p>
                <p className="text-sm text-muted-foreground">Verified Sellers on PostAll</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-amber-700" />
                </div>
                <p className="text-3xl font-bold text-emerald-700 mb-2">3x</p>
                <p className="text-sm text-muted-foreground">Verified sellers get 3x more sales</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="h-6 w-6 text-teal-700" />
                </div>
                <p className="text-3xl font-bold text-emerald-700 mb-2">5x</p>
                <p className="text-sm text-muted-foreground">Buyers trust verified sellers 5x more</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <BadgeCheck className="h-12 w-12 mx-auto mb-6 text-emerald-200" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Verified Today
          </h2>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto mb-4 leading-relaxed">
            Join over 1,200 verified sellers and start building trust with buyers.
            The verification process is quick and completely free.
          </p>
          <p className="text-2xl font-bold text-emerald-200 mb-8">
            &#8358;0 — Verification is FREE for all levels
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/tools/verify-id">
              <Button size="lg" variant="secondary" className="gap-2">
                <BadgeCheck className="h-4 w-4" />
                Start Verification
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/help">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
