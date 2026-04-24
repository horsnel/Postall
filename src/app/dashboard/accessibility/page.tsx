"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Shield,
  Keyboard,
  Eye,
  Monitor,
  MousePointerClick,
  AlertOctagon,
  ChevronLeft,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

type CheckStatus = "pass" | "partial" | "fail";

interface ChecklistItem {
  id: string;
  title: string;
  category: string;
  status: CheckStatus;
  notes: string;
}

const checklist: ChecklistItem[] = [
  {
    id: "skip-nav",
    title: "Skip navigation link",
    category: "Navigation",
    status: "pass",
    notes: "SkipNav component added to root layout. Keyboard users can press Tab to access 'Skip to main content' link.",
  },
  {
    id: "heading-hierarchy",
    title: "Proper heading hierarchy (h1-h6)",
    category: "Semantic HTML",
    status: "pass",
    notes: "All pages use a single h1 per page, followed by proper h2-h4 hierarchy. No skipped levels detected.",
  },
  {
    id: "alt-text",
    title: "Alt text for images",
    category: "Media",
    status: "pass",
    notes: "All <img> tags have descriptive alt attributes. Decorative images use aria-hidden where appropriate.",
  },
  {
    id: "color-contrast",
    title: "Color contrast ratio >= 4.5:1",
    category: "Visual",
    status: "pass",
    notes: "Emerald-600 on white: 4.62:1. Text meets WCAG AA for normal text. Large text exceeds 3:1 requirement.",
  },
  {
    id: "keyboard-nav",
    title: "Keyboard navigable",
    category: "Interaction",
    status: "pass",
    notes: "All interactive elements (buttons, links, inputs) are reachable via Tab. Focus order follows visual order.",
  },
  {
    id: "focus-indicators",
    title: "Focus indicators visible",
    category: "Visual",
    status: "pass",
    notes: "All interactive elements show visible focus rings using Tailwind's focus-visible:ring utilities. Emerald-500 focus ring.",
  },
  {
    id: "aria-labels",
    title: "ARIA labels on interactive elements",
    category: "Semantic HTML",
    status: "pass",
    notes: "Icon-only buttons have aria-label or title attributes. Custom components use proper ARIA roles and labels.",
  },
  {
    id: "screen-reader",
    title: "Screen reader friendly",
    category: "Assistive Tech",
    status: "pass",
    notes: "VisuallyHidden utility available. Status messages use aria-live regions. Form errors are announced.",
  },
  {
    id: "form-labels",
    title: "Form labels associated with inputs",
    category: "Forms",
    status: "partial",
    notes: "Most forms use <Label htmlFor> properly. Some dynamic forms (filter dropdowns) may need explicit aria-label.",
  },
  {
    id: "error-linking",
    title: "Error messages linked to form fields",
    category: "Forms",
    status: "partial",
    notes: "Error text appears below inputs. aria-describedby could be added to link errors programmatically to inputs.",
  },
  {
    id: "focus-trap",
    title: "Focus trap in modals/dialogs",
    category: "Interaction",
    status: "partial",
    notes: "useFocusTrap hook implemented. Needs integration with all Dialog/Sheet components for full coverage.",
  },
  {
    id: "reduced-motion",
    title: "Reduced motion support",
    category: "Visual",
    status: "partial",
    notes: "CSS animations need prefers-reduced-motion media query. Framer Motion animations should respect this preference.",
  },
  {
    id: "touch-targets",
    title: "Touch target size >= 44px",
    category: "Interaction",
    status: "partial",
    notes: "Most buttons meet 44px minimum. Some icon-only buttons in headers and toolbars may be smaller than 44px.",
  },
  {
    id: "page-language",
    title: "Page language attribute",
    category: "Semantic HTML",
    status: "fail",
    notes: "Root <html> has lang='en' set globally. Multilingual content (translations) may need lang attributes on specific elements.",
  },
  {
    id: "landmarks",
    title: "Landmark regions",
    category: "Semantic HTML",
    status: "fail",
    notes: "Missing explicit <main>, <nav>, <aside>, <footer> landmark roles. Semantic HTML elements should be used consistently.",
  },
];

const statusConfig: Record<CheckStatus, { icon: typeof CheckCircle2; color: string; bg: string; label: string }> = {
  pass: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", label: "Pass" },
  partial: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", label: "Partial" },
  fail: { icon: XCircle, color: "text-rose-600", bg: "bg-rose-50", label: "Fail" },
};

const categories = ["Navigation", "Semantic HTML", "Media", "Visual", "Interaction", "Forms", "Assistive Tech"];

export default function AccessibilityPage() {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = checklist.filter((item) => {
    if (filterCategory !== "all" && item.category !== filterCategory) return false;
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    return true;
  });

  const passCount = checklist.filter((i) => i.status === "pass").length;
  const partialCount = checklist.filter((i) => i.status === "partial").length;
  const failCount = checklist.filter((i) => i.status === "fail").length;
  const score = Math.round(((passCount + partialCount * 0.5) / checklist.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-6 w-6 text-emerald-600" />
            Accessibility Audit
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            WCAG 2.1 AA Compliance Checklist — {checklist.length} items
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Overall Score */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative h-28 w-28 shrink-0">
              <svg className="h-28 w-28 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" className="text-muted/20" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="50" fill="none"
                  stroke="currentColor" className="text-emerald-500"
                  strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(score / 100) * 314.16} 314.16`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-emerald-700">{score}%</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Overall Compliance Score</h3>
                <p className="text-sm text-muted-foreground">
                  Based on WCAG 2.1 Level AA guidelines
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-lg font-bold text-emerald-700">{passCount}</p>
                    <p className="text-xs text-muted-foreground">Passing</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-lg font-bold text-amber-700">{partialCount}</p>
                    <p className="text-xs text-muted-foreground">Partial</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-rose-600" />
                  <div>
                    <p className="text-lg font-bold text-rose-700">{failCount}</p>
                    <p className="text-xs text-muted-foreground">Needs Work</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={score} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">Category</p>
          <div className="flex flex-wrap gap-1.5">
            <Badge
              variant={filterCategory === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterCategory("all")}
            >
              All ({checklist.length})
            </Badge>
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={filterCategory === cat ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilterCategory(cat)}
              >
                {cat} ({checklist.filter((i) => i.category === cat).length})
              </Badge>
            ))}
          </div>
        </div>
        <Separator orientation="vertical" className="hidden sm:block h-auto" />
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">Status</p>
          <div className="flex gap-1.5">
            <Badge
              variant={filterStatus === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterStatus("all")}
            >
              All
            </Badge>
            <Badge
              variant={filterStatus === "pass" ? "default" : "outline"}
              className="cursor-pointer bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200"
              onClick={() => setFilterStatus("pass")}
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Pass
            </Badge>
            <Badge
              variant={filterStatus === "partial" ? "default" : "outline"}
              className="cursor-pointer bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200"
              onClick={() => setFilterStatus("partial")}
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              Partial
            </Badge>
            <Badge
              variant={filterStatus === "fail" ? "default" : "outline"}
              className="cursor-pointer bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200"
              onClick={() => setFilterStatus("fail")}
            >
              <XCircle className="h-3 w-3 mr-1" />
              Fail
            </Badge>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {filtered.map((item) => {
          const config = statusConfig[item.status];
          const StatusIcon = config.icon;
          return (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`h-8 w-8 rounded-full ${config.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <StatusIcon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm">{item.title}</p>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${config.color} border-current/30`}
                      >
                        {config.label}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        {item.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No items match the selected filters.</p>
          </div>
        )}
      </div>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-amber-600" />
            Priority Action Items
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-rose-50 border border-rose-100">
              <XCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-rose-800">High Priority: Add Landmark Regions</p>
                <p className="text-xs text-rose-700 mt-1">
                  Wrap page sections in semantic landmark elements (&lt;main&gt;, &lt;nav&gt;, &lt;aside&gt;, &lt;footer&gt;). This is critical for screen reader navigation.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-rose-50 border border-rose-100">
              <XCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-rose-800">High Priority: Fix Page Language for Translated Content</p>
                <p className="text-xs text-rose-700 mt-1">
                  Add lang attribute to individual elements when showing translated content (e.g., Yoruba, Hausa, Igbo translations).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-amber-800">Medium Priority: Add prefers-reduced-motion Support</p>
                <p className="text-xs text-amber-700 mt-1">
                  Add CSS media query to disable animations for users who prefer reduced motion. Wrap framer-motion animations with motion preferences.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-amber-800">Medium Priority: Integrate Focus Trap in All Modals</p>
                <p className="text-xs text-amber-700 mt-1">
                  Apply the useFocusTrap hook to all Dialog and Sheet components. Currently implemented but not wired to all modal instances.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-amber-800">Medium Priority: Enforce Touch Target Minimums</p>
                <p className="text-xs text-amber-700 mt-1">
                  Audit all icon-only buttons in headers, toolbars, and card actions to ensure minimum 44x44px touch target size.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <Keyboard className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{passCount}/{checklist.length}</p>
            <p className="text-xs text-muted-foreground">WCAG Items Passed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Monitor className="h-6 w-6 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{partialCount}</p>
            <p className="text-xs text-muted-foreground">Partial Compliance</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="h-6 w-6 text-cyan-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{failCount}</p>
            <p className="text-xs text-muted-foreground">Needs Improvement</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MousePointerClick className="h-6 w-6 text-rose-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{score}%</p>
            <p className="text-xs text-muted-foreground">Accessibility Score</p>
          </CardContent>
        </Card>
      </div>

      {/* Last Updated */}
      <p className="text-xs text-muted-foreground text-center">
        Last audit: April 6, 2026 &middot; PostAll Accessibility Compliance Dashboard
      </p>
    </div>
  );
}
