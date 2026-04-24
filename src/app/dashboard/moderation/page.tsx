"use client";

import { useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Eye,
  Ban,
  CheckCircle2,
  XCircle,
  Clock,
  MessageCircleWarning,
  UserX,
  Trash2,
  ChevronDown,
  ChevronUp,
  Scale,
  Bot,
  Shield,
  FileWarning,
  ChartColumnIncreasing,
  TrendingDown,
  Gavel,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// --- Types ---
interface ReportedItem {
  id: string;
  type: "Listing" | "Message" | "User" | "Review";
  reporter: string;
  reason: "Spam" | "Inappropriate" | "Scam" | "Duplicate" | "Offensive" | "Other";
  reportedDate: string;
  status: "Pending" | "Reviewing" | "Resolved" | "Dismissed";
  preview: string;
  fullContent: string;
}

interface ModerationAction {
  action: string;
  moderator: string;
  target: string;
  reason: string;
  timestamp: string;
  outcome: string;
}

// --- Sample Data ---
const pendingReports: ReportedItem[] = [
  {
    id: "RPT-001",
    type: "Listing",
    reporter: "Adebayo O.",
    reason: "Scam",
    reportedDate: "2024-03-15 09:23",
    status: "Pending",
    preview: "Brand new iPhone 15 Pro Max - ₦150,000. Too good to be true...",
    fullContent: "Brand new iPhone 15 Pro Max sealed box. Selling for ₦150,000 only. This is a genuine Apple product with warranty. Call me now, only 2 left! Buyer must pay before inspection. No returns accepted. Delivery available nationwide for ₦5,000 extra. Payment via bank transfer only.",
  },
  {
    id: "RPT-002",
    type: "Message",
    reporter: "Chioma N.",
    reason: "Offensive",
    reportedDate: "2024-03-15 08:45",
    status: "Pending",
    preview: "User sent threatening messages after I declined their offer...",
    fullContent: "User 'FastDeal2024' sent multiple threatening messages after the reporter declined a low-ball offer. Messages included personal attacks, threats to post negative reviews, and demands for personal banking information.",
  },
  {
    id: "RPT-003",
    type: "Listing",
    reporter: "System (Auto)",
    reason: "Spam",
    reportedDate: "2024-03-14 22:10",
    status: "Pending",
    preview: "New account posting identical listings across 15 categories...",
    fullContent: "User account 'QuickSeller_NG' created 45 identical listings across 15 categories in under 2 hours. All listings have the same stock photo, generic description, and suspiciously low prices (90% below market). Account was created 3 hours ago.",
  },
  {
    id: "RPT-004",
    type: "Listing",
    reporter: "Emeka A.",
    reason: "Duplicate",
    reportedDate: "2024-03-14 18:30",
    status: "Pending",
    preview: "Same listing posted multiple times with slight title changes...",
    fullContent: "User posted the same 3-bedroom apartment listing 6 times in the last 2 days. Each time with slightly different titles and prices. This is clogging the housing category and could be misleading to buyers.",
  },
  {
    id: "RPT-005",
    type: "Review",
    reporter: "Tunde M.",
    reason: "Other",
    reportedDate: "2024-03-14 14:15",
    status: "Pending",
    preview: "Fake 5-star review from a user who never purchased...",
    fullContent: "User left a 5-star review for seller 'TechHubNG' but has no record of any transaction. The review was posted within 1 minute of account creation. The reviewer profile has no activity other than this single review.",
  },
  {
    id: "RPT-006",
    type: "Message",
    reporter: "Kemi B.",
    reason: "Scam",
    reportedDate: "2024-03-14 11:50",
    status: "Pending",
    preview: "User attempting to redirect payment outside PostAll escrow...",
    fullContent: "During a conversation about a ₦450K camera listing, the other party asked to 'avoid PostAll fees' by paying directly to a personal account. They offered a 10% discount for paying outside the platform. When declined, they sent a fake PostAll payment confirmation email.",
  },
];

const moderationLog: ModerationAction[] = [
  { action: "Content Removed", moderator: "Admin_Femi", target: "Listing #45231 - Fake Gucci Bags", reason: "Counterfeit goods", timestamp: "2024-03-15 10:30", outcome: "Resolved" },
  { action: "User Warned", moderator: "Mod_Amina", target: "User: LagosDeals99", reason: "Spam - duplicate listings", timestamp: "2024-03-15 09:15", outcome: "Resolved" },
  { action: "Report Dismissed", moderator: "Mod_Chris", target: "Review #8923", reason: "No violation found - legitimate review", timestamp: "2024-03-15 08:45", outcome: "Dismissed" },
  { action: "Account Banned", moderator: "Admin_Femi", target: "User: ScamKing_2024", reason: "Multiple scam reports - permanent ban", timestamp: "2024-03-14 16:20", outcome: "Resolved" },
  { action: "Content Removed", moderator: "Mod_Amina", target: "Listing #44198 - Offensive content", reason: "Violation of community guidelines", timestamp: "2024-03-14 14:00", outcome: "Resolved" },
  { action: "User Warned", moderator: "Mod_Chris", target: "User: QuickPost42", reason: "Misleading category placement", timestamp: "2024-03-14 11:30", outcome: "Resolved" },
  { action: "Content Removed", moderator: "Admin_Femi", target: "Listing #44010 - Stolen photos", reason: "Listing used stolen real estate photos", timestamp: "2024-03-13 15:45", outcome: "Resolved" },
  { action: "Account Banned", moderator: "Mod_Amina", target: "User: SpamBot_NG", reason: "Automated spam bot activity", timestamp: "2024-03-13 10:20", outcome: "Resolved" },
  { action: "Report Dismissed", moderator: "Mod_Chris", target: "Listing #43850", reason: "No violation - competitive pricing is allowed", timestamp: "2024-03-13 09:00", outcome: "Dismissed" },
  { action: "Content Removed", moderator: "Admin_Femi", target: "Message #MSG-7810", reason: "Harassment and threats", timestamp: "2024-03-12 17:30", outcome: "Resolved" },
  { action: "User Warned", moderator: "Mod_Amina", target: "User: PriceHacker99", reason: "Attempted off-platform payment scam", timestamp: "2024-03-12 14:15", outcome: "Resolved" },
  { action: "Content Removed", moderator: "Mod_Chris", target: "Review #REV-8600", reason: "Fake review from bot account", timestamp: "2024-03-12 11:00", outcome: "Resolved" },
];

const reasonColor: Record<string, string> = {
  Spam: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Inappropriate: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  Scam: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  Duplicate: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  Offensive: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
  Other: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

const actionColor: Record<string, string> = {
  "Content Removed": "border-amber-300 text-amber-600",
  "User Warned": "border-cyan-300 text-cyan-600",
  "Report Dismissed": "border-gray-300 text-gray-600",
  "Account Banned": "border-red-300 text-red-600",
};

export function ModerationContent() {
  const [activeTab, setActiveTab] = useState("queue");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportedItem | null>(null);
  const [moderatorNote, setModeratorNote] = useState("");
  const [autoModSettings, setAutoModSettings] = useState({
    aiSpamDetection: true,
    autoHideScam: true,
    imageVerification: false,
    blockAfterReports: true,
    profanityFilter: true,
  });

  const totalReports = pendingReports.length + moderationLog.length;
  const resolvedCount = moderationLog.filter((a) => a.outcome === "Resolved").length;
  const dismissedCount = moderationLog.filter((a) => a.outcome === "Dismissed").length;
  const pendingCount = pendingReports.length;
  const avgResolutionTime = "2.4 hours";

  const openReviewDialog = (item: ReportedItem) => {
    setSelectedReport(item);
    setReviewDialogOpen(true);
  };

  const handleAction = (action: string) => {
    toast.success(`Action "${action}" applied successfully`);
    setReviewDialogOpen(false);
    setModeratorNote("");
  };

  const toggleAutoMod = (key: keyof typeof autoModSettings) => {
    setAutoModSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success("Auto-moderation setting updated");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <div className="mb-1">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
            Community Moderation
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Review reports, enforce rules, keep the community safe</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Reports", value: totalReports.toString(), icon: ChartColumnIncreasing, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
          { label: "Pending Review", value: pendingCount.toString(), icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20" },
          { label: "Resolved", value: resolvedCount.toString(), icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Avg Resolution", value: avgResolutionTime, icon: TrendingDown, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`h-9 w-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <Badge variant="outline" className="text-xs font-semibold">
                  {stat.value}
                </Badge>
              </div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Tabs: Report Queue + Moderation Log */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="queue" className="gap-1.5">
            <FileWarning className="h-4 w-4" />
            Report Queue
            <Badge variant="secondary" className="text-[10px] ml-1">{pendingCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="log" className="gap-1.5">
            <Clock className="h-4 w-4" />
            Moderation Log
            <Badge variant="secondary" className="text-[10px] ml-1">{moderationLog.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-1.5">
            <Bot className="h-4 w-4" />
            Auto-Mod
          </TabsTrigger>
        </TabsList>

        {/* Report Queue Tab */}
        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileWarning className="h-5 w-5 text-emerald-600" />
                Pending Reports
              </CardTitle>
              <CardDescription>Review and take action on reported content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[90px]">ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="hidden md:table-cell">Reporter</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead className="hidden lg:table-cell">Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingReports.map((item) => (
                      <>
                        <TableRow key={item.id} className="group">
                          <TableCell className="font-mono text-xs">{item.id}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-sm">{item.reporter}</TableCell>
                          <TableCell>
                            <Badge className={`text-xs ${reasonColor[item.reason]}`}>
                              {item.reason}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                            {item.reportedDate}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() =>
                                  setExpandedRow(expandedRow === item.id ? null : item.id)
                                }
                              >
                                {expandedRow === item.id ? (
                                  <ChevronUp className="h-3.5 w-3.5 mr-1" />
                                ) : (
                                  <ChevronDown className="h-3.5 w-3.5 mr-1" />
                                )}
                                Preview
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700"
                                onClick={() => openReviewDialog(item)}
                              >
                                Review
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        {expandedRow === item.id && (
                          <TableRow key={`${item.id}-preview`}>
                            <TableCell colSpan={6} className="bg-muted/30 px-6 py-3">
                              <div className="rounded-lg border bg-background p-3">
                                <p className="text-xs text-muted-foreground mb-1">Content Preview:</p>
                                <p className="text-sm text-foreground">{item.preview}</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Moderation Rules */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Gavel className="h-5 w-5 text-emerald-600" />
                Moderation Rules & Guidelines
              </CardTitle>
              <CardDescription>Community guidelines and enforcement actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { rule: "Spam & Self-Promotion", severity: "Warning", description: "Excessive posting of identical or near-identical content" },
                  { rule: "Inappropriate Content", severity: "Removal", description: "Content that violates community standards or is offensive" },
                  { rule: "Scam & Fraud", severity: "Ban", description: "Any attempt to deceive or defraud other users" },
                  { rule: "Duplicate Listings", severity: "Warning", description: "Posting the same item multiple times across categories" },
                  { rule: "Offensive Material", severity: "Removal", description: "Abusive, threatening, or discriminatory content" },
                  { rule: "Fake Listings", severity: "Ban", description: "Listings with stolen photos, false descriptions, or non-existent items" },
                ].map((rule) => {
                  const severityClass = rule.severity === "Ban"
                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    : rule.severity === "Removal"
                    ? "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
                  return (
                    <div key={rule.rule} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{rule.rule}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{rule.description}</p>
                      </div>
                      <Badge className={`text-xs ml-3 shrink-0 ${severityClass}`}>
                        {rule.severity}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Moderation Log Tab */}
        <TabsContent value="log" className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-emerald-600">{resolvedCount}</p>
                <p className="text-xs text-muted-foreground">Actions Resolved</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-500">{dismissedCount}</p>
                <p className="text-xs text-muted-foreground">Reports Dismissed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{avgResolutionTime}</p>
                <p className="text-xs text-muted-foreground">Avg. Resolution Time</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-600" />
                Moderation Action History
              </CardTitle>
              <CardDescription>Complete log of all moderation actions taken</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead className="hidden md:table-cell">Reason</TableHead>
                      <TableHead className="hidden md:table-cell">Moderator</TableHead>
                      <TableHead className="hidden lg:table-cell">Time</TableHead>
                      <TableHead>Outcome</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {moderationLog.map((entry, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${actionColor[entry.action] || ""}`}>
                            {entry.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm max-w-[160px] truncate">{entry.target}</TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground max-w-[140px] truncate">
                          {entry.reason}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                          {entry.moderator}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                          {entry.timestamp}
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${
                            entry.outcome === "Resolved"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400"
                          }`}>
                            {entry.outcome}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Auto-Moderation Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5 text-emerald-600" />
                Auto-Moderation Settings
              </CardTitle>
              <CardDescription>Configure automated content moderation rules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { key: "aiSpamDetection" as const, label: "AI-powered spam detection", description: "Automatically detect and flag spam content using machine learning", icon: Bot },
                  { key: "autoHideScam" as const, label: "Auto-hide listings flagged as scam", description: "Immediately hide listings when multiple scam reports are received", icon: Shield },
                  { key: "imageVerification" as const, label: "Require image verification for items over ₦500K", description: "Mandate AI-powered image verification for high-value listings", icon: Eye },
                  { key: "blockAfterReports" as const, label: "Block users after 3 resolved reports", description: "Automatically suspend accounts with 3+ valid reports against them", icon: UserX },
                  { key: "profanityFilter" as const, label: "Profanity filter in messages", description: "Automatically filter and replace offensive language in user messages", icon: MessageCircleWarning },
                ].map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mt-0.5">
                        <setting.icon className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{setting.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{setting.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={autoModSettings[setting.key]}
                      onCheckedChange={() => toggleAutoMod(setting.key)}
                      className="data-[state=checked]:bg-emerald-600"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Content Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-emerald-600" />
              Review Reported Content
            </DialogTitle>
            <DialogDescription>
              {selectedReport && `${selectedReport.id} — ${selectedReport.type} reported by ${selectedReport.reporter}`}
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge className={reasonColor[selectedReport.reason]}>
                  {selectedReport.reason}
                </Badge>
                <Badge variant="outline">{selectedReport.type}</Badge>
                <Badge variant="outline">{selectedReport.reportedDate}</Badge>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-2">Reported Content</h4>
                <div className="rounded-lg border bg-muted/30 p-3 max-h-40 overflow-y-auto">
                  <p className="text-sm leading-relaxed">{selectedReport.fullContent}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Reporter&apos;s Reason</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedReport.reason === "Scam" && "User suspects this content is an attempt to deceive or defraud other users on the platform."}
                  {selectedReport.reason === "Inappropriate" && "Content contains material that violates community standards or may be offensive to other users."}
                  {selectedReport.reason === "Offensive" && "Content contains abusive language, personal attacks, or threatening behavior."}
                  {selectedReport.reason === "Spam" && "Content appears to be repetitive, unsolicited commercial messaging, or self-promotional spam."}
                  {selectedReport.reason === "Duplicate" && "The same content has been posted multiple times, clogging the marketplace."}
                  {selectedReport.reason === "Other" && "Report filed for reasons not covered by standard categories. See full content for details."}
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-2">Internal Moderator Note</h4>
                <Textarea
                  placeholder="Add notes for other moderators..."
                  value={moderatorNote}
                  onChange={(e) => setModeratorNote(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleAction("Dismiss Report")}>
              <XCircle className="h-4 w-4" />
              Dismiss
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-amber-600 border-amber-300 hover:bg-amber-50" onClick={() => handleAction("Warn User")}>
              <AlertTriangle className="h-4 w-4" />
              Warn
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-rose-600 border-rose-300 hover:bg-rose-50" onClick={() => handleAction("Remove Content")}>
              <Trash2 className="h-4 w-4" />
              Remove
            </Button>
            <Button variant="destructive" size="sm" className="gap-1.5" onClick={() => handleAction("Ban User")}>
              <Ban className="h-4 w-4" />
              Ban
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ModerationContent;
