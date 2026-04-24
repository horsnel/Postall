"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Bell,
  Users,
  Wallet,
  TrendingUp,
  AlertTriangle,
  Eye,
  Ban,
  ArrowUpRight,
  ArrowDownLeft,
  RotateCcw,
  Activity,
  DollarSign,
  Zap,
  FileText,
  ShieldCheck,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  CircleUserRound,
} from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

// ─── Sample Data ───────────────────────────────────────────────
const taskAssignmentsLog = [
  {
    id: "TA-001",
    task: "Landing Page Design",
    poster: "DemoUser",
    worker: "Emeka Okafor",
    status: "accepted",
    timestamp: "Dec 16, 2024, 11:05 AM",
    amount: "₦75,000",
  },
  {
    id: "TA-002",
    task: "WordPress Blog Setup",
    poster: "DemoUser",
    worker: "Amina Kaduna",
    status: "completed",
    timestamp: "Dec 15, 2024, 4:30 PM",
    amount: "₦90,000",
  },
  {
    id: "TA-003",
    task: "Logo Design Project",
    poster: "DemoUser",
    worker: "Kwame Mensah",
    status: "expired",
    timestamp: "Dec 14, 2024, 9:00 PM",
    amount: "₦50,000",
  },
];

const withdrawalQueue = [
  {
    id: "WD-001",
    name: "Emeka Chukwu",
    amount: 150000,
    bank: "GTBank",
    account: "****4523",
    status: "pending",
    timestamp: "Dec 16, 2024, 3:45 PM",
  },
  {
    id: "WD-002",
    name: "Fatima Al-Rashid",
    amount: 200000,
    bank: "Access Bank",
    account: "****8821",
    status: "pending",
    timestamp: "Dec 16, 2024, 2:10 PM",
  },
  {
    id: "WD-003",
    name: "Chinedu Eze",
    amount: 100000,
    bank: "OPay",
    account: "****3345",
    status: "pending",
    timestamp: "Dec 16, 2024, 12:30 PM",
  },
];

const balanceUpdateLog = [
  {
    id: "BU-001",
    user: "Emeka Okafor",
    type: "task_completed",
    description: "Task completed: Landing Page Design",
    change: "+₦75,000",
    balance: "₦275,000",
    timestamp: "Dec 16, 2024, 11:05 AM",
    changePositive: true,
  },
  {
    id: "BU-002",
    user: "Amina Kaduna",
    type: "task_completed",
    description: "Task completed: WordPress Blog Setup",
    change: "+₦90,000",
    balance: "₦340,000",
    timestamp: "Dec 15, 2024, 4:30 PM",
    changePositive: true,
  },
  {
    id: "BU-003",
    user: "DemoUser",
    type: "item_sold",
    description: "Item sold: iPhone 15 Pro Max",
    change: "+₦650,000",
    balance: "₦1,250,000",
    timestamp: "Dec 14, 2024, 10:00 AM",
    changePositive: true,
  },
  {
    id: "BU-004",
    user: "Kwame Mensah",
    type: "refund",
    description: "Refund: Logo Design Project (expired)",
    change: "+₦50,000",
    balance: "₦120,000",
    timestamp: "Dec 14, 2024, 9:05 PM",
    changePositive: true,
  },
  {
    id: "BU-005",
    user: "Emeka Chukwu",
    type: "withdrawal",
    description: "Withdrawal to GTBank ****4523",
    change: "-₦150,000",
    balance: "₦225,000",
    timestamp: "Dec 13, 2024, 3:00 PM",
    changePositive: false,
  },
];

const systemAlerts = [
  {
    id: "SA-001",
    type: "refund",
    title: "Expired Task Refund",
    message: "Task 'Logo Design Project' expired. ₦50,000 refunded to poster Kwame Mensah.",
    timestamp: "Dec 14, 2024, 9:05 PM",
    severity: "warning",
  },
  {
    id: "SA-002",
    type: "registration",
    title: "New Seller Registration",
    message: "New seller 'TechHub Lagos' registered and completed verification. 12 listings pending review.",
    timestamp: "Dec 16, 2024, 8:00 AM",
    severity: "info",
  },
  {
    id: "SA-003",
    type: "suspicious",
    title: "Suspicious Activity Detected",
    message: "User 'quickbuyer99' attempted 5 rapid transactions within 1 minute. Account flagged for review.",
    timestamp: "Dec 15, 2024, 11:30 PM",
    severity: "critical",
  },
];

const taskStatusBadge: Record<string, { class: string; icon: typeof CheckCircle2 }> = {
  accepted: { class: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  completed: { class: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  expired: { class: "bg-rose-100 text-rose-700", icon: XCircle },
};

const withdrawalStatusBadge: Record<string, { class: string }> = {
  pending: { class: "bg-amber-100 text-amber-700" },
  approved: { class: "bg-emerald-100 text-emerald-700" },
  rejected: { class: "bg-rose-100 text-rose-700" },
};

const alertSeverityBadge: Record<string, { class: string; icon: typeof AlertTriangle }> = {
  info: { class: "bg-emerald-100 text-emerald-700", icon: Activity },
  warning: { class: "bg-amber-100 text-amber-700", icon: AlertTriangle },
  critical: { class: "bg-rose-100 text-rose-700", icon: ShieldAlert },
};

// ─── Verification Types ─────────────────────────────────────────

const documentTypeLabels: Record<string, string> = {
  nin: 'National ID (NIN)',
  voters_card: "Voter's Card",
  passport: 'International Passport',
  drivers_license: "Driver's License",
  cac: 'CAC Certificate',
};

interface VerificationItem {
  id: string;
  userId: string;
  type: string;
  status: string;
  documentUrl: string | null;
  reviewedAt: string | null;
  createdAt: string;
  user: {
    id: string;
    username: string;
    fullName: string | null;
    email: string | null;
    phone: string | null;
    role: string;
  };
}

export function AdminContent() {
  const { user } = useAuthStore();
  const [withdrawalActions, setWithdrawalActions] = useState<Record<string, "approved" | "rejected">>({});
  const [verifications, setVerifications] = useState<VerificationItem[]>([]);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<{ url: string; name: string } | null>(null);

  // Fetch pending verifications
  const fetchVerifications = async () => {
    setVerificationLoading(true);
    try {
      const res = await fetch('/api/admin/verifications');
      const data = await res.json();
      if (data.success) {
        setVerifications(data.verifications || []);
      }
    } catch {
      // ignore
    }
    setVerificationLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVerifications();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleApproveWithdrawal = (id: string, name: string, amount: number) => {
    setWithdrawalActions(prev => ({ ...prev, [id]: "approved" }));
    toast.success(`Approved withdrawal for ${name}: ₦${amount.toLocaleString()}`);
  };

  const handleRejectWithdrawal = (id: string, name: string) => {
    setWithdrawalActions(prev => ({ ...prev, [id]: "rejected" }));
    toast.error(`Rejected withdrawal for ${name}`);
  };

  const handleReviewVerification = async (verificationId: string, action: 'approve' | 'reject') => {
    setReviewingId(verificationId);
    try {
      const res = await fetch('/api/admin/verifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationId,
          action,
          adminId: user?.id || 'admin',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to update verification');
        return;
      }

      toast.success(
        action === 'approve'
          ? 'Verification approved successfully'
          : 'Verification rejected'
      );

      // Remove from list and refresh
      setVerifications((prev) => prev.filter((v) => v.id !== verificationId));
    } catch {
      toast.error('Network error. Please try again.');
    }
    setReviewingId(null);
  };

  const pendingVerificationsCount = verifications.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <ShieldAlert className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-emerald-600" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage tasks, withdrawals, verifications, and system alerts
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: "Pending Withdrawals",
            value: "₦450,000",
            icon: Wallet,
            color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
            badge: "3 pending",
          },
          {
            label: "ID Verifications",
            value: String(pendingVerificationsCount),
            icon: ShieldCheck,
            color: "text-emerald-600 bg-emerald-50",
            badge: pendingVerificationsCount > 0 ? `${pendingVerificationsCount} pending` : "All clear",
          },
          {
            label: "Tasks Active",
            value: "12",
            icon: FileText,
            color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
            badge: "2 expiring",
          },
          {
            label: "Revenue Today",
            value: "₦125,000",
            icon: DollarSign,
            color: "text-emerald-600 bg-emerald-50",
            badge: "+12% vs yesterday",
          },
          {
            label: "System Alerts",
            value: "3",
            icon: Bell,
            color: "text-rose-600 bg-rose-50 dark:bg-rose-900/20",
            badge: "1 critical",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`h-9 w-9 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-semibold">
                    {stat.badge}
                  </Badge>
                </div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ID Verification Review Section */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            ID Verification Queue
            <Badge className={`text-[10px] ${
              pendingVerificationsCount > 0
                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
            }`}>
              {pendingVerificationsCount > 0 ? `${pendingVerificationsCount} pending` : 'All clear'}
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={fetchVerifications}
            disabled={verificationLoading}
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${verificationLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {verificationLoading && verifications.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : verifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">No pending verifications</p>
              <p className="text-xs text-muted-foreground mt-1">
                All ID verification requests have been reviewed.
              </p>
            </div>
          ) : (
            <ScrollArea className="max-h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">User</TableHead>
                    <TableHead className="text-xs">Document Type</TableHead>
                    <TableHead className="text-xs">Submitted</TableHead>
                    <TableHead className="text-xs">Document</TableHead>
                    <TableHead className="text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {verifications.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="text-xs py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                            {(v.user.fullName || v.user.username).split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-medium">{v.user.fullName || v.user.username}</p>
                            <p className="text-[10px] text-muted-foreground">{v.user.email}</p>
                            <Badge variant="secondary" className="text-[9px] mt-0.5">
                              {v.user.role.replace(/_/g, ' ')}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs py-3">
                        {documentTypeLabels[v.type] || v.type}
                      </TableCell>
                      <TableCell className="text-[10px] text-muted-foreground py-3">
                        {new Date(v.createdAt).toLocaleDateString('en-NG', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell className="py-3">
                        {v.documentUrl ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs gap-1"
                            onClick={() => setPreviewDoc({
                              url: v.documentUrl!,
                              name: `${v.user.fullName || v.user.username} — ${documentTypeLabels[v.type]}`,
                            })}
                          >
                            <ImageIcon className="h-3 w-3" />
                            Preview
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">No image</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            disabled={reviewingId === v.id}
                            onClick={() => handleReviewVerification(v.id, 'approve')}
                            title="Approve"
                          >
                            {reviewingId === v.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                            disabled={reviewingId === v.id}
                            onClick={() => handleReviewVerification(v.id, 'reject')}
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Document Preview Dialog */}
      <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Document Preview
            </DialogTitle>
            <DialogDescription>{previewDoc?.name}</DialogDescription>
          </DialogHeader>
          {previewDoc && (
            <div className="rounded-lg border overflow-hidden bg-muted/20">
              <img
                src={previewDoc.url}
                alt={previewDoc.name}
                className="w-full max-h-[500px] object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Assignments Log */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-600" />
              Task Assignments Log
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px]">
                {taskAssignmentsLog.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="max-h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Task</TableHead>
                    <TableHead className="text-xs">Worker</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">Amount</TableHead>
                    <TableHead className="text-xs">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taskAssignmentsLog.map((ta) => {
                    const statusCfg = taskStatusBadge[ta.status];
                    const StatusIcon = statusCfg?.icon || Clock;
                    return (
                      <TableRow key={ta.id}>
                        <TableCell className="text-xs font-medium py-3 max-w-[120px] truncate">
                          {ta.task}
                        </TableCell>
                        <TableCell className="text-xs py-3">{ta.worker}</TableCell>
                        <TableCell className="py-3">
                          <Badge
                            variant="secondary"
                            className={`text-[10px] gap-1 ${statusCfg?.class}`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {ta.status.charAt(0).toUpperCase() + ta.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-emerald-600 py-3">
                          {ta.amount}
                        </TableCell>
                        <TableCell className="text-[10px] text-muted-foreground py-3">
                          {ta.timestamp}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Withdrawal Requests Queue */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Wallet className="h-4 w-4 text-amber-500" />
              Withdrawal Requests Queue
              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px]">
                {withdrawalQueue.length} pending
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="max-h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Name</TableHead>
                    <TableHead className="text-xs">Amount</TableHead>
                    <TableHead className="text-xs">Bank</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawalQueue.map((wd) => {
                    const action = withdrawalActions[wd.id];
                    const currentStatus = action || wd.status;
                    return (
                      <TableRow key={wd.id}>
                        <TableCell className="text-xs py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                              {wd.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium">{wd.name}</p>
                              <p className="text-[10px] text-muted-foreground font-mono">{wd.account}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-rose-600 py-3">
                          ₦{wd.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-xs py-3">{wd.bank}</TableCell>
                        <TableCell className="py-3">
                          <Badge
                            variant="secondary"
                            className={`text-[10px] ${withdrawalStatusBadge[currentStatus]?.class || "bg-gray-100 text-gray-700"}`}
                          >
                            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3">
                          {!action ? (
                            <div className="flex gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                onClick={() => handleApproveWithdrawal(wd.id, wd.name, wd.amount)}
                                title="Approve"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                onClick={() => handleRejectWithdrawal(wd.id, wd.name)}
                                title="Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">Done</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Balance Update Log */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            Balance Update Log
            <Badge variant="secondary" className="text-[10px]">
              {balanceUpdateLog.length} entries
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="max-h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Time</TableHead>
                  <TableHead className="text-xs">User</TableHead>
                  <TableHead className="text-xs">Description</TableHead>
                  <TableHead className="text-xs">Change</TableHead>
                  <TableHead className="text-xs">Balance After</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {balanceUpdateLog.map((bu) => (
                  <TableRow key={bu.id}>
                    <TableCell className="text-[10px] text-muted-foreground py-3 whitespace-nowrap">
                      {bu.timestamp}
                    </TableCell>
                    <TableCell className="text-xs py-3">{bu.user}</TableCell>
                    <TableCell className="text-xs py-3 max-w-[250px] truncate">
                      <div className="flex items-center gap-1.5">
                        {bu.type === "task_completed" && <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />}
                        {bu.type === "item_sold" && <Zap className="h-3 w-3 text-emerald-500 shrink-0" />}
                        {bu.type === "refund" && <RotateCcw className="h-3 w-3 text-amber-500 shrink-0" />}
                        {bu.type === "withdrawal" && <ArrowUpRight className="h-3 w-3 text-rose-500 shrink-0" />}
                        {bu.description}
                      </div>
                    </TableCell>
                    <TableCell className={`text-xs font-semibold py-3 ${bu.changePositive ? "text-emerald-600" : "text-rose-600"}`}>
                      {bu.change}
                    </TableCell>
                    <TableCell className="text-xs font-medium py-3">{bu.balance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4 text-rose-500" />
            System Alerts
            <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 text-[10px]">
              {systemAlerts.length} active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          {systemAlerts.map((alert) => {
            const severityCfg = alertSeverityBadge[alert.severity];
            const AlertIcon = severityCfg?.icon || AlertTriangle;
            return (
              <div
                key={alert.id}
                className={`rounded-lg border p-4 ${
                  alert.severity === "critical"
                    ? "bg-rose-50 border-rose-200"
                    : alert.severity === "warning"
                    ? "bg-amber-50 border-amber-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                      alert.severity === "critical"
                        ? "bg-rose-100"
                        : alert.severity === "warning"
                        ? "bg-amber-100"
                        : "bg-emerald-100"
                    }`}
                  >
                    <AlertIcon className="h-4 w-4 text-current" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold">{alert.title}</p>
                      <Badge
                        variant="secondary"
                        className={`text-[9px] ${severityCfg?.class}`}
                      >
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{alert.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1.5">{alert.timestamp}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      title="View Details"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      title="Dismiss"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminContent;
