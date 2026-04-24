'use client';

import Link from "next/link";

import { useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import MagicLinkModal from '@/components/layout/magic-link-modal';
import {
  ChevronLeft,
  Siren,
  Phone,
  AlertTriangle,
  Shield,
  Flag,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Heart,
  Eye,
  MapPin,
  FileText,
  MessageCircle,
  ShieldAlert,
  AlertCircle,
  X,
  Globe,
} from 'lucide-react';

interface EmergencyNumber {
  country: string;
  police: string;
  ambulance: string;
  fire: string;
  emergency: string;
}

const emergencyNumbers: EmergencyNumber[] = [
  {
    country: 'Nigeria',
    police: '112 / 199',
    ambulance: '112 / 199',
    fire: '112 / 199',
    emergency: '112',
  },
  {
    country: 'Lagos, Nigeria',
    police: '112 / 199',
    ambulance: '112 / 199',
    fire: '112 / 199',
    emergency: '112',
  },
  {
    country: 'Abuja, Nigeria',
    police: '112 / 199',
    ambulance: '112 / 199',
    fire: '112 / 199',
    emergency: '112',
  },
  {
    country: 'Port Harcourt, Nigeria',
    police: '112 / 199',
    ambulance: '112 / 199',
    fire: '112 / 199',
    emergency: '112',
  },
  {
    country: 'Enugu, Nigeria',
    police: '112 / 199',
    ambulance: '112 / 199',
    fire: '112 / 199',
    emergency: '112',
  },
];

const reportTypes = [
  { value: 'dispute', label: 'Dispute', icon: Flag },
  { value: 'scam', label: 'Scam / Fraud', icon: ShieldAlert },
  { value: 'safety_concern', label: 'Safety Concern', icon: AlertTriangle },
  { value: 'other', label: 'Other', icon: MessageCircle },
];

const safetyTips = [
  {
    title: 'Always meet in public places',
    content:
      'Choose well-lit, busy locations like shopping malls, banks, or police stations for all in-person meetings.',
  },
  {
    title: 'Never send money outside the platform',
    content:
      'Use PostAll Escrow for all payments. Direct bank transfers or mobile money outside the platform offer no protection.',
  },
  {
    title: 'Verify the person and listing',
    content:
      'Check user profiles for verification badges, reviews, and account age. Be wary of too-good-to-be-true deals.',
  },
  {
    title: 'Use Proof Cam for evidence',
    content:
      'Capture photos of items, meeting locations, and transaction details using the built-in Proof Cam tool.',
  },
  {
    title: 'Share your meeting details',
    content:
      'Tell a friend or family member where you\'re going and who you\'re meeting. Share your live location if possible.',
  },
  {
    title: 'Trust your instincts',
    content:
      'If something feels wrong, it probably is. Don\'t be afraid to walk away from a deal or call for help.',
  },
];

export default function EmergencyPage() {
  const { user } = useAuthStore();
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    type: '',
    description: '',
    targetId: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showDangerBanner, setShowDangerBanner] = useState(true);

  const handleReportClick = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowReportModal(true);
  };

  const handleReportSubmit = async () => {
    if (!reportForm.type || !reportForm.description) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: reportForm.type,
          description: reportForm.description,
          reporterId: user?.id,
          targetType: 'other',
          targetId: reportForm.targetId || 'emergency-report',
        }),
      });
      if (res.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setShowReportModal(false);
          setReportForm({ type: '', description: '', targetId: '' });
          setSubmitSuccess(false);
        }, 3000);
      }
    } catch {
      // Error handled silently
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[60vh]">
      {/* Danger Banner */}
      {showDangerBanner && (
        <div className="bg-rose-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg animate-pulse">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base">
                    Are you in danger right now?
                  </p>
                  <p className="text-rose-100 text-xs sm:text-sm">
                    Call your local emergency services immediately. Do not wait.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a href="tel:112">
                  <Button
                    size="sm"
                    className="bg-white text-rose-700 hover:bg-rose-50 font-bold"
                  >
                    <Phone className="h-4 w-4 mr-1.5" />
                    <span className="hidden sm:inline">Call </span>112
                  </Button>
                </a>
                <button
                  onClick={() => setShowDangerBanner(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-rose-600 to-orange-500 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
              <Siren className="h-4 w-4" />
              Emergency Resources
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Emergency Center
            </h1>
            <p className="text-lg sm:text-xl text-rose-100 max-w-2xl mx-auto mb-8">
              Quick access to emergency contacts, report issues, and find safety resources
              across all our supported regions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="tel:112">
                <Button
                  size="lg"
                  className="bg-white text-rose-700 hover:bg-rose-50 font-bold"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Emergency (112)
                </Button>
              </a>
              <Button
                onClick={handleReportClick}
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10"
              >
                <Flag className="h-4 w-4 mr-2" />
                Report to PostAll
              </Button>
            </div>
          </div>
          <div className="text-center mt-6">
            <Link href="/browse#tools" className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm">
              <ChevronLeft className="h-4 w-4" />Back to All Tools
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Emergency Numbers */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Emergency Numbers
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Quick access to emergency services in your country
              </p>
            </div>
            <Badge variant="outline" className="border-rose-200 text-rose-700 bg-rose-50 hidden sm:flex">
              <Phone className="h-3 w-3 mr-1" />
              Tap to Call
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {emergencyNumbers.map((country) => (
              <Card
                key={country.country}
                className="hover:shadow-md transition-all duration-200 border-2 hover:border-rose-200"
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center">
                      <Globe className="h-4 w-4 text-rose-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{country.country}</h3>
                  </div>
                  <div className="space-y-2.5">
                    <a
                      href={`tel:${country.emergency}`}
                      className="flex items-center justify-between p-2.5 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-rose-500" />
                        <span className="text-xs font-medium text-rose-700">
                          Emergency
                        </span>
                      </div>
                      <span className="text-lg font-bold text-rose-700 group-hover:text-rose-800">
                        {country.emergency}
                      </span>
                    </a>
                    <a
                      href={`tel:${country.police.split(' / ')[0].replace(/\s/g, '')}`}
                      className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <span className="text-xs font-medium text-gray-600">
                          Police
                        </span>
                      </div>
                      <span className="text-base font-bold text-gray-800 group-hover:text-gray-900">
                        {country.police}
                      </span>
                    </a>
                    <a
                      href={`tel:${country.ambulance.split(' / ')[0].replace(/\s/g, '')}`}
                      className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-gray-400" />
                        <span className="text-xs font-medium text-gray-600">
                          Ambulance
                        </span>
                      </div>
                      <span className="text-base font-bold text-gray-800 group-hover:text-gray-900">
                        {country.ambulance}
                      </span>
                    </a>
                    <a
                      href={`tel:${country.fire.split(' / ')[0].replace(/\s/g, '')}`}
                      className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                        <span className="text-xs font-medium text-gray-600">
                          Fire
                        </span>
                      </div>
                      <span className="text-base font-bold text-gray-800 group-hover:text-gray-900">
                        {country.fire}
                      </span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Report to PostAll */}
        <div className="mb-12">
          <Card className="overflow-hidden border-2 border-emerald-200">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-emerald-100 flex-shrink-0">
                  <Flag className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Report to PostAll
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Experienced a scam, safety concern, or dispute? Our safety team reviews
                    every report and responds within 24 hours.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {reportTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={handleReportClick}
                        className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all text-left group"
                      >
                        <div className="p-2 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 transition-colors">
                          <type.icon className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{type.label}</p>
                          <p className="text-xs text-gray-500">
                            {type.value === 'dispute'
                              ? 'Payment or delivery disagreements'
                              : type.value === 'scam'
                                ? 'Fraudulent users or listings'
                                : type.value === 'safety_concern'
                                  ? 'Unsafe situations or threats'
                                  : 'Any other issue to report'}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-500" />
                      </button>
                    ))}
                  </div>

                  <Button
                    onClick={handleReportClick}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    File a Report Now
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Safety Tips */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Safety Tips
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Follow these guidelines to stay safe while using PostAll and conducting
              in-person transactions.
            </p>
          </div>

          <Card>
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {safetyTips.map((tip, index) => (
                  <AccordionItem key={index} value={`tip-${index}`}>
                    <AccordionTrigger className="px-6 hover:no-underline hover:bg-gray-50">
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-emerald-700 font-bold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{tip.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 pt-0">
                      <div className="ml-11 text-gray-600 leading-relaxed">
                        {tip.content}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Platform Safety Tools */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
            Safety Tools on PostAll
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: 'Safe Spots',
                desc: 'Find verified safe meeting locations in your city with community reviews.',
                icon: Shield,
                color: 'text-teal-600 bg-teal-50',
                path: '/tools/safe-spots',
              },
              {
                title: 'Proof Cam',
                desc: 'Capture timestamped, watermarked photos as evidence for transactions.',
                icon: Eye,
                color: 'text-emerald-600 bg-emerald-50',
                path: '/tools/proof-cam',
              },
              {
                title: 'Escrow Protection',
                desc: 'Secure your payments with our escrow system. Funds released only after verification.',
                icon: CheckCircle2,
                color: 'text-cyan-600 bg-cyan-50',
                path: '/tools/escrow',
              },
            ].map((tool) => (
              <a key={tool.title} href={tool.path}>
                <Card className="h-full hover:shadow-md transition-all cursor-pointer group hover:border-emerald-200">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <tool.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{tool.title}</h3>
                    <p className="text-sm text-gray-500">{tool.desc}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>

        {/* PostAll Safety Team */}
        <Card className="bg-emerald-50 border-emerald-200 overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="p-4 rounded-xl bg-emerald-100 flex-shrink-0">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  PostAll Safety Team
                </h2>
                <p className="text-gray-600 mb-4">
                  Our dedicated safety team is available 24/7 to assist with urgent matters.
                  Reach out through any of these channels.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white border border-emerald-200">
                      <Phone className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Hotline</p>
                      <p className="font-semibold text-gray-900">+234 800 POSTALL</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white border border-emerald-200">
                      <MessageCircle className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-semibold text-gray-900">safety@postall.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white border border-emerald-200">
                      <FileText className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Report</p>
                      <p className="font-semibold text-gray-900">In-App Reporting</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Modal */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-emerald-600" />
              File a Report
            </DialogTitle>
            <DialogDescription>
              Our safety team reviews every report and will respond within 24 hours.
              Your report can be anonymous.
            </DialogDescription>
          </DialogHeader>
          {submitSuccess ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Report Submitted
              </h3>
              <p className="text-gray-500">
                Thank you for reporting. Our safety team will review your report and
                get back to you within 24 hours. Stay safe.
              </p>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div>
                <Label>Report Type *</Label>
                <Select
                  value={reportForm.type}
                  onValueChange={(val) =>
                    setReportForm({ ...reportForm, type: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="What are you reporting?" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="report-description">Description *</Label>
                <Textarea
                  id="report-description"
                  placeholder="Please describe what happened in detail. Include names, dates, and any relevant information."
                  value={reportForm.description}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, description: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="report-target">
                  Related Task/Listing ID (optional)
                </Label>
                <Input
                  id="report-target"
                  placeholder="Paste the task or listing ID if applicable"
                  value={reportForm.targetId}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, targetId: e.target.value })
                  }
                />
              </div>

              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-800">
                  False reports can result in account suspension. Please only file
                  genuine reports about real safety concerns.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowReportModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReportSubmit}
                  disabled={
                    submitting || !reportForm.type || !reportForm.description
                  }
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Report'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Auth Modal */}
      <MagicLinkModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  );
}
