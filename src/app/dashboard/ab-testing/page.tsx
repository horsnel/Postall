// @ts-nocheck
"use client";

import { useState } from "react";
import {
  FlaskConical,
  Plus,
  ChartColumnIncreasing,
  TrendingUp,
  Users,
  Zap,
  Eye,
  Pencil,
  Trash2,
  Trophy,
  Calendar,
  CheckCircle,
  Beaker,
  ChevronRight,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useABTestingStore, type ABTestingFeatureFlag } from "@/lib/ab-testing";
import { toast } from "sonner";

type FeatureFlag = ABTestingFeatureFlag;

// --- Experiment History ---
const experimentHistory = [
  {
    name: "Search Auto-Suggest",
    winner: "Variant B",
    impact: "+18% search usage",
    duration: "21 days",
    completedDate: "2024-02-28",
  },
  {
    name: "Listing Image Carousel",
    winner: "Variant A",
    impact: "+12% engagement",
    duration: "14 days",
    completedDate: "2024-02-15",
  },
  {
    name: "Chat Quick Reactions",
    winner: "Control",
    impact: "No significant diff",
    duration: "30 days",
    completedDate: "2024-01-31",
  },
];

const statusColor: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  Paused: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  Completed: "bg-emerald-100 text-emerald-800",
};

function formatFlagName(name: string) {
  return name
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function ABTestingPage() {
  const { flags, setFlag, createFlag, deleteFlag } = useABTestingStore();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [resultsDialogOpen, setResultsDialogOpen] = useState(false);

  // New experiment form state
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newRollout, setNewRollout] = useState(50);
  const [newMetric, setNewMetric] = useState("Conversion Rate");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newVariants, setNewVariants] = useState(["control", "variant_a"]);

  const enabledCount = flags.filter((f) => f.enabled).length;
  const activeCount = flags.filter(
    (f) => f.enabled && (!f.endDate || new Date(f.endDate) >= new Date())
  ).length;

  const handleCreate = () => {
    if (!newName.trim()) {
      toast.error("Experiment name is required");
      return;
    }
    createFlag({
      name: newName.trim().toLowerCase().replace(/\s+/g, "_"),
      description: newDescription.trim(),
      enabled: false,
      variant: newVariants.length > 1 ? (newVariants[newVariants.length - 1] as FeatureFlag["variant"]) : "control",
      rolloutPercentage: newRollout,
      startDate: newStartDate || new Date().toISOString().split("T")[0],
      endDate: newEndDate || "",
      metric: newMetric,
    });
    toast.success("Experiment created successfully");
    resetForm();
    setCreateDialogOpen(false);
  };

  const resetForm = () => {
    setNewName("");
    setNewDescription("");
    setNewRollout(50);
    setNewMetric("Conversion Rate");
    setNewStartDate("");
    setNewEndDate("");
    setNewVariants(["control", "variant_a"]);
  };

  const handleToggle = (id: string, enabled: boolean) => {
    setFlag(id, enabled);
    toast.success(enabled ? "Experiment enabled" : "Experiment paused");
  };

  const handleDelete = (id: string) => {
    deleteFlag(id);
    toast.success("Experiment deleted");
  };

  const addVariant = () => {
    const num = newVariants.length;
    setNewVariants([...newVariants, `variant_${String.fromCharCode(97 + num)}`]);
  };

  const removeVariant = (index: number) => {
    if (newVariants.length <= 2) return;
    setNewVariants(newVariants.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <FlaskConical className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">A/B Testing & Feature Flags</h1>
            <p className="text-muted-foreground text-sm">Manage experiments and feature rollouts</p>
          </div>
        </div>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Create New Experiment
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Active Experiments",
            value: activeCount,
            icon: Beaker,
            color: "text-emerald-600",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
          },
          {
            label: "Total Users in Tests",
            value: "12,450",
            icon: Users,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Best Performing Variant",
            value: "variant_b",
            sub: "+23% conversion",
            icon: TrendingUp,
            color: "text-amber-600",
            bg: "bg-amber-50 dark:bg-amber-900/20",
          },
          {
            label: "Flags Enabled",
            value: `${enabledCount}/${flags.length}`,
            icon: Zap,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`h-9 w-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              {stat.sub && (
                <p className="text-xs text-emerald-600 font-medium mt-0.5">{stat.sub}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Experiments Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <ChartColumnIncreasing className="h-5 w-5 text-emerald-600" />
            Active Experiments
          </CardTitle>
          <CardDescription>Manage and monitor all feature flags and experiments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Experiment</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead>Variants</TableHead>
                  <TableHead>Rollout</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Metric</TableHead>
                  <TableHead className="hidden lg:table-cell">Start Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flags.map((flag) => {
                  const status = flag.enabled
                    ? flag.endDate && new Date(flag.endDate) < new Date()
                      ? "Completed"
                      : "Active"
                    : "Paused";
                  return (
                    <TableRow key={flag.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FlaskConical className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{formatFlagName(flag.name)}</p>
                            <p className="text-xs text-muted-foreground md:hidden">{flag.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-[200px]">
                        <p className="text-xs text-muted-foreground truncate">{flag.description}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Badge variant="outline" className="text-xs">Control</Badge>
                          {flag.variant && (
                            <Badge className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                              {flag.variant === "variant_a" ? "A" : "B"}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full transition-all"
                              style={{ width: `${flag.rolloutPercentage}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{flag.rolloutPercentage}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${statusColor[status]}`}>{status}</Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="outline" className="text-xs">{flag.metric}</Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                        {flag.startDate}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Switch
                            checked={flag.enabled}
                            onCheckedChange={(checked) => handleToggle(flag.id, checked)}
                            className="data-[state=checked]:bg-emerald-600"
                            title={flag.enabled ? "Pause experiment" : "Enable experiment"}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setResultsDialogOpen(true)}
                            title="View results"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            title="Edit experiment"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-rose-500 hover:text-rose-600"
                            onClick={() => handleDelete(flag.id)}
                            title="Delete experiment"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Experiment Results Preview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                Experiment Results Preview
              </CardTitle>
              <CardDescription className="mt-1">
                new_homepage_design — Started Mar 1, 2024
              </CardDescription>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
              <CheckCircle className="h-3.5 w-3.5 mr-1" />
              95% confident variant_b is better
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Control */}
            <div className="rounded-lg border p-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-500">A</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Control (Current Design)</p>
                  <p className="text-xs text-muted-foreground">6,200 visitors</p>
                </div>
              </div>

              {/* Metrics Comparison Bars */}
              <div className="space-y-3">
                {[
                  { label: "Conversions", value: "380", percent: 52 },
                  { label: "Revenue", value: "₦1.2M", percent: 44 },
                  { label: "Bounce Rate", value: "42%", percent: 42 },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{metric.label}</span>
                      <span className="font-medium">{metric.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-gray-400 rounded-full transition-all"
                        style={{ width: `${metric.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Variant B */}
            <div className="rounded-lg border p-4 border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-900/10 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                  <span className="text-sm font-bold text-emerald-600">B</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Variant B (New Design)</p>
                  <p className="text-xs text-muted-foreground">6,250 visitors</p>
                </div>
                <Badge className="ml-auto bg-emerald-600 text-white text-xs">Winner</Badge>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Conversions", value: "467", percent: 64, change: "+22.9%" },
                  { label: "Revenue", value: "₦1.5M", percent: 56, change: "+25%" },
                  { label: "Bounce Rate", value: "35%", percent: 35, change: "-16.7%" },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{metric.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{metric.value}</span>
                        <span
                          className={`text-xs font-semibold ${
                            metric.label === "Bounce Rate"
                              ? "text-emerald-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {metric.change}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${metric.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: "Total Visitors", control: "6,200", variant: "6,250" },
              { label: "Conversions", control: "380", variant: "467" },
              { label: "Revenue", control: "₦1.2M", variant: "₦1.5M" },
              { label: "Bounce Rate", control: "42%", variant: "35%" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-sm">
                  <span className="text-gray-500">{stat.control}</span>
                  <ChevronRight className="h-3 w-3 inline mx-1 text-muted-foreground" />
                  <span className="font-semibold text-emerald-600">{stat.variant}</span>
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Experiment History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-600" />
            Experiment History
          </CardTitle>
          <CardDescription>Completed experiments and their results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Experiment</TableHead>
                  <TableHead>Winner</TableHead>
                  <TableHead className="hidden md:table-cell">Impact</TableHead>
                  <TableHead className="hidden md:table-cell">Duration</TableHead>
                  <TableHead className="hidden lg:table-cell">Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {experimentHistory.map((exp, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FlaskConical className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{exp.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-xs ${
                          exp.winner === "Control"
                            ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                        }`}
                      >
                        <Trophy className="h-3 w-3 mr-1" />
                        {exp.winner}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span
                        className={`text-sm font-medium ${
                          exp.impact.includes("No significant")
                            ? "text-muted-foreground"
                            : "text-emerald-600"
                        }`}
                      >
                        {exp.impact}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                      {exp.duration}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                      {exp.completedDate}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create New Experiment Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-emerald-600" />
              Create New Experiment
            </DialogTitle>
            <DialogDescription>Set up a new A/B test or feature flag</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <Label htmlFor="exp-name">Experiment Name</Label>
              <Input
                id="exp-name"
                placeholder="e.g., new_checkout_flow"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="mt-1.5"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="exp-desc">Description</Label>
              <Textarea
                id="exp-desc"
                placeholder="Describe what this experiment tests..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="mt-1.5 min-h-[80px]"
              />
            </div>

            {/* Variants */}
            <div>
              <Label>Variants</Label>
              <div className="mt-1.5 space-y-2">
                {newVariants.map((v, i) => (
                  <div key={v} className="flex items-center gap-2">
                    <Input value={v} disabled className="flex-1 h-9 text-sm" />
                    {i > 0 && newVariants.length > 2 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 shrink-0 text-rose-500"
                        onClick={() => removeVariant(i)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {newVariants.length < 4 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={addVariant}
                  >
                    <Plus className="h-3 w-3" />
                    Add Variant
                  </Button>
                )}
              </div>
            </div>

            {/* Rollout */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Rollout Percentage</Label>
                <span className="text-sm font-semibold text-emerald-600">{newRollout}%</span>
              </div>
              <Slider
                value={[newRollout]}
                onValueChange={(v) => setNewRollout(v[0])}
                min={0}
                max={100}
                step={5}
                className="data-[orientation=horizontal]>[role=slider]:bg-emerald-600"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Target Metric */}
            <div>
              <Label>Target Metric</Label>
              <Select value={newMetric} onValueChange={setNewMetric}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Conversion Rate">Conversion Rate</SelectItem>
                  <SelectItem value="Click-Through Rate">Click-Through Rate</SelectItem>
                  <SelectItem value="Revenue">Revenue</SelectItem>
                  <SelectItem value="Engagement">Engagement</SelectItem>
                  <SelectItem value="Sign-ups">Sign-ups</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date (Optional)</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setCreateDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              className="bg-emerald-600 hover:bg-emerald-700 gap-2"
            >
              <Beaker className="h-4 w-4" />
              Create Experiment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Results Dialog */}
      <Dialog open={resultsDialogOpen} onOpenChange={setResultsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ChartColumnIncreasing className="h-5 w-5 text-emerald-600" />
              Experiment Results
            </DialogTitle>
            <DialogDescription>Detailed results for selected experiment</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold text-emerald-600">6,250</p>
                <p className="text-xs text-muted-foreground">Total Visitors</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold text-emerald-600">467</p>
                <p className="text-xs text-muted-foreground">Conversions</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold text-emerald-600">₦1.5M</p>
                <p className="text-xs text-muted-foreground">Revenue (Variant B)</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold text-emerald-600">95%</p>
                <p className="text-xs text-muted-foreground">Confidence Level</p>
              </div>
            </div>
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4">
              <div className="flex items-start gap-2">
                <ChartColumnIncreasing className="h-4 w-4 text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                  Variant B shows a +22.9% improvement in conversions with 95% statistical confidence.
                  Recommended action: Gradually roll out Variant B to 100% of users.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResultsDialogOpen(false)}>
              Close
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">Apply Winner</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
