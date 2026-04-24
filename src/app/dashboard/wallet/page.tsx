"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet as WalletIcon,
  Bitcoin,
  Lock,
  Building2,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  CreditCard,
  Send,
  QrCode,
  Copy,
  AlertCircle,
  Info,
  Banknote,
  Landmark,
  Bell,
  CalendarClock,
  Loader2,
  PartyPopper,
  ArrowLeft,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  nigerianBanks,
  supportedCryptoWallets,
  formatCurrency,
} from "@/lib/constants";

// ─── Sample Data ───────────────────────────────────────────────
const transactions = [
  { id: "T001", date: "Dec 16, 2024", description: "Payment received - Landing Page Design", amount: 75000, currency: "NGN", status: "completed", type: "credit" },
  { id: "T002", date: "Dec 15, 2024", description: "Escrow funded - Logo Design Project", amount: -100000, currency: "NGN", status: "completed", type: "debit" },
  { id: "T003", date: "Dec 14, 2024", description: "Payment received - Data Analysis", amount: 250000, currency: "NGN", status: "completed", type: "credit" },
  { id: "T004", date: "Dec 13, 2024", description: "Withdrawal to GTBank ****4523", amount: -150000, currency: "NGN", status: "pending", type: "debit" },
  { id: "T005", date: "Dec 12, 2024", description: "Platform fee - Logo Design", amount: -5000, currency: "NGN", status: "completed", type: "debit" },
  { id: "T006", date: "Dec 10, 2024", description: "Refund - Cancelled Task", amount: 25000, currency: "NGN", status: "completed", type: "credit" },
  { id: "T007", date: "Dec 8, 2024", description: "Payment received - WordPress Blog", amount: 90000, currency: "NGN", status: "completed", type: "credit" },
  { id: "T008", date: "Dec 5, 2024", description: "Add Funds - Paystack", amount: 50000, currency: "NGN", status: "completed", type: "credit" },
  { id: "T009", date: "Dec 4, 2024", description: "Bank deposit - Paystack", amount: 200000, currency: "NGN", status: "completed", type: "credit" },
  { id: "T010", date: "Dec 2, 2024", description: "Payment received - Website project", amount: 150000, currency: "NGN", status: "completed", type: "credit" },
  { id: "T011", date: "Nov 30, 2024", description: "Bank withdrawal - Paystack", amount: -50000, currency: "NGN", status: "completed", type: "debit" },
  { id: "T012", date: "Nov 28, 2024", description: "Listing fee - Housing", amount: -2500, currency: "NGN", status: "completed", type: "debit" },
];

const activeEscrows = [
  { id: "E001", task: "WordPress Blog Setup", amount: 90000, currency: "NGN", status: "in_escrow", releasedTo: "Amina Kaduna" },
  { id: "E002", task: "Social Media Campaign", amount: 125000, currency: "NGN", status: "in_escrow", releasedTo: "Fatima Al-Rashid" },
];

const savedBankAccounts = [
  { id: "ba1", bank: "GTBank", accountNumber: "****4523", accountName: "Emeka Chukwu", isDefault: true },
  { id: "ba2", bank: "OPay", accountNumber: "****7890", accountName: "Emeka Chukwu", isDefault: false },
];

// Connected bank accounts are managed via Paystack
const paymentMethods = [
  { id: "pm1", method: "GTBank", account: "****4523", type: "Bank Transfer" },
  { id: "pm2", method: "OPay", account: "****7890", type: "Mobile Money" },
];

const pendingWithdrawals = [
  { id: "WD-001", date: "Dec 16, 2024", amount: 150000, bank: "GTBank", account: "****4523", status: "Queued for Saturday", requestedAt: "Dec 16, 2024, 3:45 PM" },
  { id: "WD-002", date: "Dec 14, 2024", amount: 85000, bank: "OPay", account: "****7890", status: "Queued for Saturday", requestedAt: "Dec 14, 2024, 11:20 AM" },
  { id: "WD-003", date: "Dec 12, 2024", amount: 200000, bank: "Access Bank", account: "****3301", status: "Processing", requestedAt: "Dec 12, 2024, 9:00 AM" },
];

const withdrawalHistory = [
  { id: "WH-001", date: "Dec 7, 2024", amount: 100000, bank: "GTBank", account: "****4523", status: "Completed", adminNote: "Processed on time" },
  { id: "WH-002", date: "Dec 1, 2024", amount: 250000, bank: "GTBank", account: "****4523", status: "Completed", adminNote: "Batch payout" },
  { id: "WH-003", date: "Nov 24, 2024", amount: 75000, bank: "OPay", account: "****7890", status: "Completed", adminNote: "" },
  { id: "WH-004", date: "Nov 17, 2024", amount: 300000, bank: "GTBank", account: "****4523", status: "Completed", adminNote: "VIP user - priority" },
  { id: "WH-005", date: "Nov 10, 2024", amount: 50000, bank: "Access Bank", account: "****3301", status: "Completed", adminNote: "" },
];

const statusBadge: Record<string, { class: string; icon: typeof CheckCircle2 }> = {
  completed: { class: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  pending: { class: "bg-amber-100 text-amber-700", icon: Clock },
  failed: { class: "bg-rose-100 text-rose-700", icon: XCircle },
  processing: { class: "bg-emerald-100 text-emerald-700", icon: Loader2 },
};

const withdrawStatusBadge: Record<string, { class: string }> = {
  Completed: { class: "bg-emerald-100 text-emerald-700" },
  Pending: { class: "bg-amber-100 text-amber-700" },
  Processing: { class: "bg-emerald-100 text-emerald-700" },
  "Queued for Saturday": { class: "bg-amber-50 text-amber-700" },
};

function getNextSaturday(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilSaturday = dayOfWeek === 6 ? 7 : (6 - dayOfWeek + 7) % 7 || 7;
  const nextSat = new Date(now);
  nextSat.setDate(now.getDate() + daysUntilSaturday);
  return nextSat.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}

// ─── Main Component ────────────────────────────────────────────
export default function WalletPage() {
  const [txFilter, setTxFilter] = useState("all");
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [weekendWarningOpen, setWeekendWarningOpen] = useState(false);
  const [withdrawTab, setWithdrawTab] = useState("bank");
  const [withdrawBank, setWithdrawBank] = useState("");
  const [withdrawAccountNumber, setWithdrawAccountNumber] = useState("");
  // Crypto withdrawal removed - all withdrawals via Paystack to Nigerian banks
  const [withdrawWalletAddress, setWithdrawWalletAddress] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [verifiedName, setVerifiedName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredTransactions = transactions.filter((t) => {
    if (txFilter === "all") return true;
    if (txFilter === "naira") return t.currency === "NGN";
    if (txFilter === "income") return t.type === "credit";
    if (txFilter === "expense") return t.type === "debit";
    return true;
  });

  const verifyAccount = () => {
    if (withdrawAccountNumber.length === 10 && withdrawBank) {
      setIsVerifying(true);
      setTimeout(() => {
        setVerifiedName("Emeka Chukwu");
        setIsVerifying(false);
      }, 1500);
    }
  };

  const formatTxAmount = (amount: number, currency: string, type: string) => {
    const prefix = type === "credit" ? "+" : "";
    return `${prefix}${formatCurrency(Math.abs(amount), currency)}`;
  };

  // Withdrawal is via Paystack to linked Nigerian bank accounts

  // No crypto - all withdrawals via Paystack to Nigerian banks

  const handleWithdrawClick = () => {
    // Check if it's a bank withdrawal and not weekend
    if (withdrawTab === "bank" && !isWeekend()) {
      setWeekendWarningOpen(true);
    } else {
      setWithdrawOpen(true);
    }
  };

  const handleWithdrawSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setWithdrawOpen(false);
      const bankName = withdrawBank || "Bank";
      const amount = Number(withdrawAmount || 0);
      toast.success(`Withdrawal request sent to admin. ${withdrawTab === "bank" ? `Bank: ${bankName}` : `Wallet: ${bankName}`}, Amount: ₦${amount.toLocaleString()}. Processing within 24-48 hours.`);
    }, 2000);
  };

  const nextSaturday = useMemo(() => getNextSaturday(), []);

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="p-2 -ml-2 rounded-lg hover:bg-[#F3F4F6] transition-colors text-[#6B7280] hover:text-[#374151]"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <WalletIcon className="h-6 w-6 text-emerald-600" />
            Wallet
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your funds, transactions, and payment methods
          </p>
        </div>
      </div>

      {/* Platform Commission Notice */}
      <div className="rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Info className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-amber-800">Platform Service Fee — 10%</h3>
            <p className="text-xs text-amber-700 mt-1">
              PostAll charges a <strong>10% service fee</strong> on all earnings (task completions, product sales, service payments, and errand payouts). 
              This fee is automatically deducted before your available balance is updated. For example, if you complete a task worth ₦50,000, 
              your balance will be credited with <strong>₦45,000</strong> after the 10% platform fee.
              The fee helps us maintain secure payments, escrow protection, 24/7 support, and platform infrastructure.
            </p>
          </div>
        </div>
      </div>

      {/* Weekend-only withdrawal notice */}
      <div className="rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 p-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <CalendarClock className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-emerald-800">Weekend-Only Withdrawals</h3>
            <p className="text-xs text-emerald-600 mt-1">
              Bank withdrawals are processed on <strong>Saturdays &amp; Sundays only</strong>. 
              Requests submitted during the week will be queued and processed on the next Saturday.
              {isWeekend() ? (
                <span className="font-semibold text-emerald-700 inline-flex items-center gap-1.5"><PartyPopper className="h-3.5 w-3.5" /> It&apos;s the weekend! Withdrawals will be processed today.</span>
              ) : (
                <span> Next processing date: <strong>{nextSaturday}</strong></span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Balance & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Balance Card */}
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Available Balance</p>
                <p className="text-4xl font-bold mt-1">₦1,250,000</p>
                <p className="text-emerald-200 text-xs mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +₦350,000 this month
                </p>
              </div>
              <div className="flex gap-2">
                {/* Withdraw Button - NO Add Funds button */}
                <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="gap-1.5 border-white/30 text-white hover:bg-white/10"
                      onClick={handleWithdrawClick}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                      Withdraw
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Send className="h-5 w-5 text-emerald-600" />
                        Withdraw Funds
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <Tabs value={withdrawTab} onValueChange={setWithdrawTab}>
                        <TabsList className="grid w-full grid-cols-1">
                          <TabsTrigger value="bank" className="gap-1.5 text-xs">
                            <Building2 className="h-3.5 w-3.5" />
                            Bank Transfer
                          </TabsTrigger>
                        </TabsList>

                        {/* Bank Transfer Tab */}
                        <TabsContent value="bank" className="space-y-4 mt-3">
                          <div className="space-y-2">
                            <Label>Select Bank</Label>
                            <Select value={withdrawBank} onValueChange={setWithdrawBank}>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose your bank" />
                              </SelectTrigger>
                              <SelectContent className="max-h-64 overflow-y-auto">
                                {nigerianBanks.map((bank) => (
                                  <SelectItem key={bank} value={bank}>
                                    {bank}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Account Number</Label>
                            <Input
                              placeholder="10-digit account number"
                              value={withdrawAccountNumber}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                                setWithdrawAccountNumber(val);
                                setVerifiedName("");
                              }}
                              maxLength={10}
                              className={withdrawAccountNumber.length > 0 && withdrawAccountNumber.length !== 10 ? "border-rose-300" : ""}
                            />
                            {withdrawAccountNumber.length > 0 && withdrawAccountNumber.length !== 10 && (
                              <p className="text-[10px] text-rose-500 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Account number must be 10 digits
                              </p>
                            )}
                          </div>

                          {withdrawAccountNumber.length === 10 && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={verifyAccount}
                              disabled={isVerifying}
                            >
                              {isVerifying ? (
                                <>
                                  <span className="h-3.5 w-3.5 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin" />
                                  Verifying...
                                </>
                              ) : (
                                "Verify Account Number"
                              )}
                            </Button>
                          )}

                          {verifiedName && (
                            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
                              <p className="text-xs text-emerald-600 font-medium">Account Name:</p>
                              <p className="text-sm font-semibold text-emerald-700">{verifiedName}</p>
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label>Amount (₦)</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₦</span>
                              <Input
                                type="number"
                                placeholder="0"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                className="pl-7"
                                min={2000}
                              />
                            </div>
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Info className="h-3 w-3" />
                              Minimum withdrawal: ₦2,000. ₦50 fee applies.
                            </p>
                          </div>
                        </TabsContent>
                      </Tabs>

                      {/* 10% Fee Reminder */}
                      <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                        <p className="text-[10px] text-amber-700 flex items-start gap-1.5">
                          <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          <span><strong>Reminder:</strong> Your available balance already reflects the 10% platform service fee deduction. The amount shown is your net earnings after the fee has been applied.</span>
                        </p>
                      </div>

                      {/* Withdraw Button */}
                      <Button
                        className="w-full gap-2"
                        size="lg"
                        disabled={
                          !withdrawAmount ||
                          Number(withdrawAmount) < 2000 ||
                          isProcessing ||
                          (withdrawTab === "bank" && (!withdrawBank || !verifiedName))
                        }
                        onClick={handleWithdrawSubmit}
                      >
                        {isProcessing ? (
                          <>
                            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Withdraw ₦{Number(withdrawAmount || 0).toLocaleString()}
                          </>
                        )}
                      </Button>

                      <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                        <p className="text-[10px] text-amber-700 flex items-start gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          {withdrawTab === "bank" && !isWeekend()
                            ? `Your request will be queued and processed on ${nextSaturday}. Bank withdrawals are processed on weekends only.`
                            : "Withdrawals are processed within 1-24 hours. Ensure your details are correct as transactions cannot be reversed once confirmed."
                          }
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-emerald-600">₦2,870,000</p>
                <p className="text-xs text-muted-foreground">Total Earned</p>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground font-bold">₦215,000</p>
                <p className="text-xs text-muted-foreground">In Escrow</p>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground font-bold">₦1,405,000</p>
                <p className="text-xs text-muted-foreground">Withdrawn</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <WalletIcon className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold">Payment Methods</p>
                <p className="text-xs text-muted-foreground">Powered by Paystack</p>
              </div>
            </div>
            <Separator className="mb-3" />
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground">GTBank</span>
                </div>
                <span className="font-medium">****4523</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <span className="text-muted-foreground">OPay</span>
                </div>
                <span className="font-medium">****7890</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Total Balance</span>
                <span>₦710,000</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Withdrawals */}
      {pendingWithdrawals.length > 0 && (
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-500" />
              Pending Withdrawals
              <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 text-[10px]">
                {pendingWithdrawals.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {pendingWithdrawals.map((wd) => (
                <div key={wd.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                        <Banknote className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-rose-600">₦{wd.amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          {wd.bank} · {wd.account}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Requested: {wd.requestedAt}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] shrink-0 ${withdrawStatusBadge[wd.status]?.class || "bg-gray-100 text-gray-700"}`}
                    >
                      {wd.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction History */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">Transaction History</CardTitle>
          <div className="flex items-center gap-1 flex-wrap">
            {[
              { value: "all", label: "All" },
              { value: "naira", label: "Naira" },
              { value: "escrow", label: "Escrow" },
              { value: "income", label: "Income" },
              { value: "expense", label: "Expense" },
            ].map((filter) => (
              <Button
                key={filter.value}
                variant={txFilter === filter.value ? "default" : "ghost"}
                size="sm"
                className="text-xs h-8"
                onClick={() => setTxFilter(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs">Description</TableHead>
                  <TableHead className="text-xs text-right">Amount</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((tx) => {
                  const StatusIcon = statusBadge[tx.status]?.icon || CheckCircle2;
                  const isCrypto = tx.currency !== "NGN";
                  return (
                    <TableRow key={tx.id}>
                      <TableCell className="text-xs text-muted-foreground py-3">
                        {tx.date}
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-7 w-7 rounded-full flex items-center justify-center ${
                              tx.type === "credit" ? "bg-emerald-100" : "bg-rose-100"
                            }`}
                          >
                            {tx.type === "credit" ? (
                              <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <ArrowUpRight className="h-3.5 w-3.5 text-rose-600" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="text-sm truncate block max-w-[240px]">
                              {tx.description}
                            </span>
                            {isCrypto && (
                              <Badge variant="secondary" className="text-[9px] bg-amber-100 text-amber-700 py-0 px-1 mt-0.5">
                                {tx.currency}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell
                        className={`text-right font-semibold text-sm py-3 ${
                          tx.type === "credit" ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {formatTxAmount(tx.amount, tx.currency, tx.type)}
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] gap-1 ${statusBadge[tx.status]?.class}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal History Table */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Landmark className="h-4 w-4 text-emerald-600" />
            Withdrawal Requests
          </CardTitle>
          <Badge variant="secondary" className="text-[10px] bg-emerald-100 text-emerald-700">
            {withdrawalHistory.length} total
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs">Amount</TableHead>
                  <TableHead className="text-xs">Bank</TableHead>
                  <TableHead className="text-xs">Account</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Admin Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...pendingWithdrawals.map(pw => ({ ...pw, adminNote: "—" })), ...withdrawalHistory].map((wd) => (
                  <TableRow key={wd.id}>
                    <TableCell className="text-xs text-muted-foreground py-3">
                      {wd.date}
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-rose-600 py-3">
                      ₦{wd.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs py-3">{wd.bank}</TableCell>
                    <TableCell className="text-xs font-mono py-3">{wd.account}</TableCell>
                    <TableCell className="py-3">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] ${withdrawStatusBadge[wd.status]?.class || "bg-gray-100 text-gray-700"}`}
                      >
                        {wd.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground py-3 max-w-[150px] truncate">
                      {wd.adminNote || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Active Escrows */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Lock className="h-4 w-4 text-amber-500" />
              Active Escrows
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {activeEscrows.map((escrow) => (
                <div key={escrow.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{escrow.task}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Released to {escrow.releasedTo}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-amber-600">
                        {formatCurrency(escrow.amount, escrow.currency)}
                      </p>
                      <Badge
                        variant="secondary"
                        className="text-[10px] bg-amber-100 text-amber-700 mt-1"
                      >
                        In Escrow
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Linked Bank Accounts */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Linked Bank Accounts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {savedBankAccounts.map((account) => (
                <div key={account.id} className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <Landmark className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{account.bank}</p>
                        {account.isDefault && (
                          <Badge
                            variant="secondary"
                            className="text-[9px] bg-emerald-100 text-emerald-700 py-0 px-1.5"
                          >
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {account.accountNumber} &bull; {account.accountName}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs h-8">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekend Warning Dialog */}
      <Dialog open={weekendWarningOpen} onOpenChange={setWeekendWarningOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-emerald-600" />
              Weekend Withdrawal
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-lg bg-amber-50 border border-amber-100 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-emerald-800">Withdrawals are processed on weekends only</p>
                  <p className="text-sm text-emerald-600 mt-1">
                    Your request will be queued and processed on <strong>{nextSaturday}</strong>.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setWeekendWarningOpen(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => {
                  setWeekendWarningOpen(false);
                  setWithdrawOpen(true);
                }}
              >
                <CheckCircle2 className="h-4 w-4" />
                Queue Withdrawal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
