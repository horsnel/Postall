'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  CheckCircle2,
  Megaphone,
  Users,
  MapPin,
  ChartColumnIncreasing,
  Star,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Zap,
  Crown,
  Building2,
  Headphones,
  Eye,
  Package,
  SlidersHorizontal,
} from 'lucide-react'

const stats = [
  { label: 'Daily Visitors', value: '50,000+', icon: Eye },
  { label: 'Cities', value: '25+', icon: MapPin },
  { label: 'Categories', value: '6', icon: Package },
  { label: 'Monthly Transactions', value: '₦500M+', icon: ChartColumnIncreasing },
]

const tiers = [
  {
    name: 'Basic',
    price: '₦10,000',
    period: '/month',
    description: 'Great for small businesses getting started on PostAll.',
    features: [
      'Up to 10 featured listings',
      'Business badge on profile',
      'Priority in search results',
      'Basic analytics',
    ],
    icon: Zap,
    popular: false,
    cta: 'Get Started',
    color: 'border-gray-200',
    bgIcon: 'bg-muted',
  },
  {
    name: 'Professional',
    price: '₦25,000',
    period: '/month',
    description: 'For growing businesses that need more visibility and tools.',
    features: [
      'Up to 50 featured listings',
      'Top Seller badge',
      'Homepage banner placement',
      'Advanced analytics',
      'Dedicated store page',
      'Priority customer support',
    ],
    icon: Star,
    popular: true,
    cta: 'Get Started',
    color: 'border-primary',
    bgIcon: 'bg-primary/10',
  },
  {
    name: 'Enterprise',
    price: '₦75,000',
    period: '/month',
    description: 'Maximum exposure and features for established businesses.',
    features: [
      'Unlimited featured listings',
      'Verified Business badge',
      'Sponsored homepage banner',
      'Full analytics dashboard',
      'Custom store page',
      'API access',
      'Dedicated account manager',
      'Multiple locations',
    ],
    icon: Crown,
    popular: false,
    cta: 'Get Started',
    color: 'border-amber-300',
    bgIcon: 'bg-amber-100',
  },
]

const caseStudies = [
  {
    business: 'TechDeals',
    description: 'Electronics seller on PostAll',
    result: 'grew revenue 300% in 3 months',
    metric: '300%',
    metricLabel: 'Revenue Growth',
    icon: Zap,
  },
  {
    business: 'PropertyPro',
    description: 'Real estate agency in Lagos',
    result: 'gets 50+ leads per day',
    metric: '50+',
    metricLabel: 'Daily Leads',
    icon: Building2,
  },
  {
    business: 'QuickFix Services',
    description: 'Home services provider',
    result: 'completed 1,000+ jobs',
    metric: '1,000+',
    metricLabel: 'Jobs Completed',
    icon: SlidersHorizontal,
  },
]

const faqs = [
  {
    question: 'How quickly will I see results from advertising?',
    answer: 'Most advertisers see increased visibility within 24 hours of launching their campaign. For best results, we recommend running your campaign for at least 30 days to gather sufficient data and optimize performance.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept payments via bank transfers and debit cards securely processed through Paystack. All prices are in Nigerian Naira (₦).',
  },
  {
    question: 'Can I change or cancel my plan at any time?',
    answer: 'Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect at the start of your next billing cycle. There are no cancellation fees or long-term contracts.',
  },
  {
    question: 'What does "featured listing" mean?',
    answer: 'Featured listings appear at the top of search results and category pages with a special badge, giving them significantly more visibility. Featured listings typically get 3-5x more views than regular listings.',
  },
  {
    question: 'How is the homepage banner placement works?',
    answer: 'Professional and Enterprise plans include homepage banner placement. Your banner ad (1200x300px recommended) will rotate with other advertisers on the homepage. Enterprise plan gets priority placement with longer display times.',
  },
]

function Wrench({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

export default function AdvertisePage() {
  const [email, setEmail] = useState('')

  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-emerald-50/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.1),rgba(0,0,0,0))]" />
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl relative">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10 gap-1.5">
              <Megaphone className="h-3.5 w-3.5" />
              Business Advertising
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Grow Your Business on{' '}
              <span className="text-primary">PostAll</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
              Reach thousands of buyers and clients across Africa. Promote your business with powerful tools designed to drive real results.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <Link href="/dashboard/settings">
                <Button size="lg" className="gap-2 text-base">
                  <Sparkles className="h-5 w-5" />
                  Start Advertising Today
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2 text-base">
                <Headphones className="h-5 w-5" />
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b bg-card">
        <div className="container mx-auto px-4 py-10 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="text-center">
                  <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Advertising Options (Pricing Tiers) */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Advertising Options</h2>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
              Choose the plan that fits your business. All prices in Nigerian Naira (₦).
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {tiers.map((tier) => {
              const Icon = tier.icon
              return (
                <Card
                  key={tier.name}
                  className={`relative flex flex-col ${tier.color} ${tier.popular ? 'shadow-lg scale-[1.02] md:scale-105' : ''}`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-3 py-1 gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${tier.bgIcon}`}>
                        <Icon className={`h-5 w-5 ${tier.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{tier.name}</h3>
                        <p className="text-xs text-muted-foreground">{tier.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="mb-6">
                      <span className="text-3xl font-bold">{tier.price}</span>
                      <span className="text-muted-foreground">{tier.period}</span>
                    </div>
                    <ul className="space-y-3">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link href="/dashboard/settings" className="w-full">
                      <Button
                        className="w-full gap-2"
                        variant={tier.popular ? 'default' : 'outline'}
                      >
                        {tier.cta}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Success Stories</h2>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
              Real businesses achieving real growth on PostAll.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {caseStudies.map((study) => {
              const Icon = study.icon
              return (
                <Card key={study.business} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg">{study.business}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{study.description}</p>
                    <div className="mt-4 py-3 px-4 bg-emerald-50 rounded-lg">
                      <p className="text-2xl font-bold text-emerald-700">{study.metric}</p>
                      <p className="text-xs text-emerald-600 mt-0.5">{study.metricLabel}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      <span className="font-medium text-foreground">{study.business}</span> {study.result}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-muted-foreground mt-2">
              Everything you need to know about advertising on PostAll.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-primary/5 border-t">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <Megaphone className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold tracking-tight">Start Advertising Today</h2>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            Join hundreds of businesses already growing on PostAll. Set up your first campaign in under 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link href="/dashboard/settings">
              <Button size="lg" className="gap-2">
                <Sparkles className="h-5 w-5" />
                Start Advertising Today
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="gap-2">
              <Headphones className="h-5 w-5" />
              Talk to Sales
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No long-term contracts. Cancel anytime. Paystack payments accepted.
          </p>
        </div>
      </section>

    </div>
  )
}
