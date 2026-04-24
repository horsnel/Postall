'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  FlaskConical,
  Plus,
  Play,
  Pause,
  CheckCircle2,
  ChartColumnIncreasing,
  TrendingUp,
  Users,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────
interface ABExperiment {
  id: string;
  name: string;
  description: string;
  variants: { name: string; weight: number }[];
  status: 'active' | 'paused' | 'completed';
  startDate: string;
  endDate?: string;
  metrics: { variant: string; conversions: number; visitors: number }[];
}

type FilterTab = 'all' | 'active' | 'paused' | 'completed';

// ─── Sample Experiments ───────────────────────────────────────
const sampleExperiments: ABExperiment[] = [
  {
    id: 'checkout_redesign',
    name: 'Checkout Flow Redesign',
    description: 'Testing new streamlined checkout process with fewer steps',
    variants: [{ name: 'control', weight: 50 }, { name: 'new_flow', weight: 50 }],
    status: 'active',
    startDate: '2024-12-01',
    endDate: '2026-02-01',
    metrics: [
      { variant: 'control', conversions: 245, visitors: 4820 },
      { variant: 'new_flow', conversions: 312, visitors: 4890 },
    ],
  },
  {
    id: 'ai_enhance_prominent',
    name: 'AI Enhance Button Position',
    description: 'Testing AI enhance button visibility in the sell form',
    variants: [{ name: 'default', weight: 50 }, { name: 'prominent', weight: 50 }],
    status: 'active',
    startDate: '2024-12-15',
    endDate: '2026-02-15',
    metrics: [
      { variant: 'default', conversions: 89, visitors: 3240 },
      { variant: 'prominent', conversions: 156, visitors: 3180 },
    ],
  },
  {
    id: 'social_proof_v2',
    name: 'Social Proof Badges',
    description: 'Testing seller badges and "X people viewing" impact on conversion',
    variants: [{ name: 'minimal', weight: 50 }, { name: 'enhanced', weight: 50 }],
    status: 'active',
    startDate: '2026-01-01',
    endDate: '2026-03-01',
    metrics: [
      { variant: 'minimal', conversions: 178, visitors: 5120 },
      { variant: 'enhanced', conversions: 210, visitors: 5080 },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────
function getConversionRate(conversions: number, visitors: number): string {
  return visitors > 0 ? ((conversions / visitors) * 100).toFixed(2) : '0.00';
}

function getConfidenceLevel(conversions: number, visitors: number): { label: string; color: string } {
  if (visitors < 100) return { label: 'Low', color: 'bg-gray-100 text-gray-600' };
  if (visitors < 1000) return { label: 'Medium', color: 'bg-amber-100 text-amber-700' };
  if (visitors < 3000) return { label: 'High', color: 'bg-cyan-100 text-cyan-700' };
  return { label: 'Very High', color: 'bg-emerald-100 text-emerald-700' };
}

function getStatusBadge(status: ABExperiment['status']) {
  const styles = {
    active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    paused: 'bg-amber-100 text-amber-700 border-amber-200',
    completed: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  return styles[status];
}

// ─── Experiment Card ──────────────────────────────────────────
function ExperimentCard({ experiment }: { experiment: ABExperiment }) {
  const totalVisitors = experiment.metrics.reduce((sum, m) => sum + m.visitors, 0);
  const totalConversions = experiment.metrics.reduce((sum, m) => sum + m.conversions, 0);
  const controlMetric = experiment.metrics[0];
  const treatmentMetric = experiment.metrics[1];
  const controlRate = getConversionRate(controlMetric.conversions, controlMetric.visitors);
  const treatmentRate = getConversionRate(treatmentMetric.conversions, treatmentMetric.visitors);
  const lift = parseFloat(treatmentRate) - parseFloat(controlRate);
  const isPositive = lift > 0;
  const confidence = getConfidenceLevel(totalConversions, totalVisitors);

  const maxVisitors = Math.max(...experiment.metrics.map((m) => m.visitors));

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-base">{experiment.name}</CardTitle>
              <Badge variant="outline" className={`text-[10px] ${getStatusBadge(experiment.status)}`}>
                {experiment.status === 'active' && <><Play className="h-2 w-2 mr-1" />Active</>}
                {experiment.status === 'paused' && <><Pause className="h-2 w-2 mr-1" />Paused</>}
                {experiment.status === 'completed' && <><CheckCircle2 className="h-2 w-2 mr-1" />Completed</>}
              </Badge>
            </div>
            <CardDescription className="mt-1">{experiment.description}</CardDescription>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {experiment.status === 'active' ? (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={() => toast.info(`Pausing "${experiment.name}"`)}
              >
                <Pause className="h-3 w-3" />
                Pause
              </Button>
            ) : experiment.status === 'paused' ? (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                onClick={() => toast.success(`Resuming "${experiment.name}"`)}
              >
                <Play className="h-3 w-3" />
                Resume
              </Button>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {/* Variants & Traffic Split */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="font-medium">{experiment.variants[0].name}</span>
              <span className="text-muted-foreground text-xs">{experiment.variants[0].weight}% traffic</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gray-300 to-gray-400 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
          <span className="text-xs text-muted-foreground font-medium">VS</span>
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="font-medium">{experiment.variants[1].name}</span>
              <span className="text-muted-foreground text-xs">{experiment.variants[1].weight}% traffic</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Control Rate</p>
            <p className="text-lg font-bold">{controlRate}%</p>
            <p className="text-[10px] text-muted-foreground">{controlMetric.conversions} / {controlMetric.visitors.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Treatment Rate</p>
            <p className="text-lg font-bold text-emerald-600">{treatmentRate}%</p>
            <p className="text-[10px] text-muted-foreground">{treatmentMetric.conversions} / {treatmentMetric.visitors.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Lift</p>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-rose-500" />
              )}
              <p className={`text-lg font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                {isPositive ? '+' : ''}{lift.toFixed(2)}%
              </p>
            </div>
            <p className="text-[10px] text-muted-foreground">vs control</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Confidence</p>
            <Badge variant="secondary" className={`text-xs ${confidence.color}`}>
              {confidence.label}
            </Badge>
            <p className="text-[10px] text-muted-foreground">{totalVisitors.toLocaleString()} samples</p>
          </div>
        </div>

        {/* Progress bars showing variant performance */}
        <div className="mt-4 space-y-2">
          {experiment.metrics.map((metric) => {
            const rate = getConversionRate(metric.conversions, metric.visitors);
            const percentage = Math.min((parseFloat(rate) / 10) * 100, 100);
            return (
              <div key={metric.variant} className="flex items-center gap-3">
                <span className="text-xs font-medium w-20 truncate">{metric.variant}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      metric.variant === experiment.variants[0].name
                        ? 'bg-gradient-to-r from-gray-300 to-gray-400'
                        : 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                    }`}
                    style={{ width: `${Math.max(percentage, 5)}%` }}
                  />
                </div>
                <span className="text-xs font-semibold w-12 text-right">{rate}%</span>
              </div>
            );
          })}
        </div>

        {/* Date info */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t text-[10px] text-muted-foreground">
          <span>Started: {experiment.startDate}</span>
          {experiment.endDate && <span>Ends: {experiment.endDate}</span>}
          <span>Total visitors: {totalVisitors.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export function ExperimentsContent() {
  const [filter, setFilter] = useState<FilterTab>('all');
  const [experiments, setExperiments] = useState<ABExperiment[]>(sampleExperiments);
  const [createOpen, setCreateOpen] = useState(false);

  // Create experiment form state
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const filtered = experiments.filter((e) => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  const activeCount = experiments.filter((e) => e.status === 'active').length;
  const pausedCount = experiments.filter((e) => e.status === 'paused').length;
  const completedCount = experiments.filter((e) => e.status === 'completed').length;

  const handleCreateExperiment = () => {
    if (!newName.trim()) {
      toast.error('Please enter an experiment name');
      return;
    }
    const newExperiment: ABExperiment = {
      id: `exp-${Date.now()}`,
      name: newName.trim(),
      description: newDescription.trim() || 'New A/B test experiment',
      variants: [
        { name: 'control', weight: 50 },
        { name: 'treatment', weight: 50 },
      ],
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      metrics: [
        { variant: 'control', conversions: 0, visitors: 0 },
        { variant: 'treatment', conversions: 0, visitors: 0 },
      ],
    };
    setExperiments((prev) => [newExperiment, ...prev]);
    setCreateOpen(false);
    setNewName('');
    setNewDescription('');
    toast.success('Experiment created', {
      description: `"${newName.trim()}" is now running with 50/50 traffic split`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-emerald-600" />
            A/B Experiments
          </h1>
          <p className="text-muted-foreground mt-1">
            Run experiments to optimize your marketplace experience
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) { setNewName(''); setNewDescription(''); }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4" />
              Create Experiment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-emerald-600" />
                Create New Experiment
              </DialogTitle>
              <DialogDescription>
                Set up a new A/B test with two variants and 50/50 traffic split
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="exp-name">Experiment Name *</Label>
                <Input
                  id="exp-name"
                  placeholder="e.g. New Pricing Display"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-desc">Description</Label>
                <Textarea
                  id="exp-desc"
                  placeholder="What are you testing and why?"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                <p className="text-sm font-medium">Traffic Split</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium">Control</span>
                      <span className="text-muted-foreground">50%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gray-400 rounded-full" style={{ width: '50%' }} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium">Treatment</span>
                      <span className="text-muted-foreground">50%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full ml-auto" style={{ width: '50%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateExperiment} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                <FlaskConical className="h-4 w-4" />
                Start Experiment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Play className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{activeCount}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Pause className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{pausedCount}</p>
                <p className="text-xs text-muted-foreground">Paused</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-600">{completedCount}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterTab)}>
        <TabsList className="h-9">
          <TabsTrigger value="all" className="text-xs h-7 px-3">
            All ({experiments.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="text-xs h-7 px-3">
            Active ({activeCount})
          </TabsTrigger>
          <TabsTrigger value="paused" className="text-xs h-7 px-3">
            Paused ({pausedCount})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs h-7 px-3">
            Completed ({completedCount})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Experiment Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FlaskConical className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-lg font-semibold">No experiments found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {filter === 'all' ? 'Create your first experiment to start testing' : `No ${filter} experiments`}
              </p>
              {filter === 'all' && (
                <Button className="mt-4 gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => setCreateOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Create Experiment
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filtered.map((exp) => (
            <ExperimentCard key={exp.id} experiment={exp} />
          ))
        )}
      </div>

      {/* Info Note */}
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="p-4 flex items-start gap-3">
          <FlaskConical className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">How A/B Testing Works</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Each experiment splits your traffic evenly between a control and treatment group. The platform tracks
              conversion metrics for each variant and calculates statistical significance. Experiments run for a
              minimum of 2 weeks to ensure reliable data. Use the <strong>Confidence</strong> metric to determine
              when results are statistically significant enough to make decisions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ExperimentsContent;
