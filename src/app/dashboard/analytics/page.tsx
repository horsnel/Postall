'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuthStore } from '@/lib/auth-store';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  MessageCircle,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
  ChartColumnIncreasing,
  MapPin,
  Clock,
  Zap,
  Target,
  Timer,
  CheckCircle2,
  AlertTriangle,
  Award,
  Activity,
  Download,
  GitCompare,
  Calendar,
  Hash,
} from 'lucide-react';
import { toast } from 'sonner';

// Time range selector
type TimeRange = '7d' | '30d' | '90d' | 'year';

// Key metrics data
const keyMetrics = [
  { label: 'Total Views', value: '45.2K', change: '+18.3%', icon: Eye, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Inquiries', value: '1,280', change: '+24.1%', icon: MessageCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Conversion Rate', value: '8.5%', change: '+1.2%', icon: Target, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Avg Response Time', value: '23min', change: '-3min', icon: Timer, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Revenue', value: '₦2.8M', change: '+32.4%', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Active Listings', value: '47', change: '+5', icon: ShoppingCart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

// Daily active users (simulated)
const dailyActiveUsers = [
  { day: 'Mon', users: 3200 },
  { day: 'Tue', users: 3800 },
  { day: 'Wed', users: 3500 },
  { day: 'Thu', users: 4100 },
  { day: 'Fri', users: 4600 },
  { day: 'Sat', users: 2800 },
  { day: 'Sun', users: 2200 },
];

// Weekly Activity levels (spec: 7 mini bars for each day)
const weeklyActivity = [
  { day: 'Mon', level: 72 },
  { day: 'Tue', level: 85 },
  { day: 'Wed', level: 68 },
  { day: 'Thu', level: 90 },
  { day: 'Fri', level: 95 },
  { day: 'Sat', level: 45 },
  { day: 'Sun', level: 30 },
];

// Conversion funnel (spec: Views 45.2K → Inquiries 1,280 → Offers 340 → Sales 89)
const conversionFunnel = [
  { stage: 'Views', count: 45200, percentage: 100, color: 'bg-gradient-to-r from-emerald-500 to-emerald-400' },
  { stage: 'Inquiries', count: 1280, percentage: 2.83, color: 'bg-gradient-to-r from-cyan-500 to-cyan-400' },
  { stage: 'Offers', count: 340, percentage: 0.75, color: 'bg-gradient-to-r from-teal-500 to-teal-400' },
  { stage: 'Sales', count: 89, percentage: 0.2, color: 'bg-gradient-to-r from-amber-500 to-amber-400' },
];

// Top categories (spec values)
const topCategories = [
  { name: 'Electronics', percentage: 35, color: 'bg-emerald-500', lightColor: 'bg-emerald-100', textColor: 'text-emerald-700' },
  { name: 'Services', percentage: 25, color: 'bg-cyan-500', lightColor: 'bg-cyan-100', textColor: 'text-emerald-700' },
  { name: 'Housing', percentage: 20, color: 'bg-teal-500', lightColor: 'bg-teal-100', textColor: 'text-teal-700' },
  { name: 'Vehicles', percentage: 12, color: 'bg-amber-500', lightColor: 'bg-amber-100', textColor: 'text-amber-700' },
  { name: 'Others', percentage: 8, color: 'bg-gray-500', lightColor: 'bg-gray-100', textColor: 'text-gray-700' },
];

// Revenue by payment method
const paymentMethods = [
  { method: 'Paystack', percentage: 72, amount: '₦2.02M', color: 'bg-emerald-600' },
  { method: 'Crypto', percentage: 28, amount: '₦784K', color: 'bg-amber-500' },
];

// Weekly sparklines for performance trends
const weeklyTrends = [
  { label: 'Views', data: [65, 72, 58, 80, 75, 90, 85], color: 'bg-emerald-400' },
  { label: 'Clicks', data: [40, 45, 38, 52, 48, 55, 50], color: 'bg-cyan-400' },
  { label: 'Messages', data: [12, 15, 10, 18, 14, 20, 16], color: 'bg-teal-400' },
  { label: 'Sales', data: [5, 8, 6, 9, 7, 11, 10], color: 'bg-amber-400' },
  { label: 'Revenue', data: [70, 78, 65, 85, 80, 92, 88], color: 'bg-emerald-500' },
  { label: 'New Users', data: [30, 35, 28, 40, 38, 45, 42], color: 'bg-cyan-500' },
  { label: 'Rating', data: [88, 90, 87, 92, 89, 93, 91], color: 'bg-teal-500' },
];

// Overview stats
const overviewStats = [
  { label: 'Total Revenue', value: '₦2,800,000', change: '+32.4%', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'up' },
  { label: 'Total Sales', value: '47', change: '+8 this month', icon: ShoppingCart, color: 'text-emerald-600', bg: 'bg-cyan-50', trend: 'up' },
  { label: 'Avg Order Value', value: '₦59,574', change: '+5%', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'up' },
  { label: 'Repeat Customers', value: '34%', change: '+2.1%', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50', trend: 'up' },
];

// Monthly revenue
const monthlyRevenue = [
  { month: 'Aug', revenue: 850000, growth: 0 },
  { month: 'Sep', revenue: 1100000, growth: 29.4 },
  { month: 'Oct', revenue: 980000, growth: -10.9 },
  { month: 'Nov', revenue: 1300000, growth: 32.7 },
  { month: 'Dec', revenue: 1500000, growth: 15.4 },
  { month: 'Jan', revenue: 2800000, growth: 86.7 },
];

// Top listings
const topListings = [
  { title: 'iPhone 14 Pro Max 256GB', category: 'Electronics', views: 1245, inquiries: 89, sold: 3, revenue: 1950000, trend: 'up' },
  { title: 'MacBook Air M2 512GB', category: 'Electronics', views: 892, inquiries: 45, sold: 2, revenue: 1600000, trend: 'up' },
  { title: 'Plumbing & Home Repair', category: 'Services', views: 434, inquiries: 56, sold: 34, revenue: 1360000, trend: 'up' },
  { title: 'WordPress Website Dev', category: 'Gigs', views: 567, inquiries: 23, sold: 8, revenue: 600000, trend: 'up' },
  { title: 'Samsung 55" Smart TV', category: 'Electronics', views: 345, inquiries: 12, sold: 1, revenue: 350000, trend: 'down' },
];

// Performance tips
const performanceTips = [
  { icon: Clock, title: 'Speed Up Responses', text: 'Responding within 15 min increases conversion by 15%. Your avg is 23 min.', type: 'improvement' as const },
  { icon: TrendingUp, title: 'Leverage Top Performer', text: 'Your "iPhone 14 Pro Max" gets 3x more views. Promote similar listings.', type: 'insight' as const },
  { icon: Award, title: 'Great Repeat Rate', text: '34% repeat rate is above the 22% platform average. Keep engaging past buyers!', type: 'positive' as const },
];

function formatCurrencyShort(amount: number): string {
  if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `₦${(amount / 1000).toFixed(0)}K`;
  return `₦${amount.toLocaleString()}`;
}

export default function AnalyticsDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [comparePeriods, setComparePeriods] = useState(false);

  const maxRevenue = Math.max(...monthlyRevenue.map((d) => d.revenue));
  const maxUsers = Math.max(...dailyActiveUsers.map((d) => d.users));
  const maxTrend = 100;
  const maxActivity = Math.max(...weeklyActivity.map((d) => d.level));

  const handleExport = () => {
    toast.success('Report exported as PDF', { description: 'Analytics report for ' + timeRange + ' has been generated and downloaded.' });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ChartColumnIncreasing className="h-6 w-6 text-emerald-600" />
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your marketplace performance and grow your business
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
            <TabsList className="h-9">
              <TabsTrigger value="7d" className="text-xs h-7 px-3">7 Days</TabsTrigger>
              <TabsTrigger value="30d" className="text-xs h-7 px-3">30 Days</TabsTrigger>
              <TabsTrigger value="90d" className="text-xs h-7 px-3">90 Days</TabsTrigger>
              <TabsTrigger value="year" className="text-xs h-7 px-3">This Year</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            variant="outline"
            size="sm"
            className={`gap-1.5 text-xs ${comparePeriods ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : ''}`}
            onClick={() => setComparePeriods(!comparePeriods)}
          >
            <GitCompare className="h-3.5 w-3.5" />
            Compare Periods
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleExport}>
            <Download className="h-3.5 w-3.5" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {keyMetrics.map((metric) => {
          const Icon = metric.icon;
          const isPositive = !metric.change.startsWith('-');
          return (
            <Card key={metric.label} className="relative overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`h-8 w-8 rounded-lg ${metric.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-4 w-4 ${metric.color}`} />
                  </div>
                  <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {isPositive ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
                    {metric.change}
                  </span>
                </div>
                <p className="text-lg font-bold">{metric.value}</p>
                <p className="text-[10px] text-muted-foreground">{metric.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <ChartColumnIncreasing className="h-4 w-4 text-emerald-600" />
                Revenue Overview
              </CardTitle>
              <CardDescription>Monthly revenue trend — last 6 months</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
              +86.7% this month
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 sm:gap-4 h-56">
            {monthlyRevenue.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5">
                <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                  item.growth > 0 ? 'text-emerald-600' : item.growth < 0 ? 'text-rose-500' : 'text-muted-foreground'
                }`}>
                  {item.growth > 0 ? <><ArrowUpRight className="h-2.5 w-2.5" />+{item.growth}%</> : item.growth < 0 ? <><ArrowDownRight className="h-2.5 w-2.5" />{item.growth}%</> : '—'}
                </span>
                <span className="text-[11px] font-medium text-muted-foreground hidden sm:block">{formatCurrencyShort(item.revenue)}</span>
                <div className="w-full relative group cursor-pointer" style={{ height: '160px' }}>
                  <div className="absolute bottom-0 w-full bg-emerald-100 rounded-t-md" style={{ height: '100%' }}>
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md transition-all duration-700 group-hover:from-emerald-700 group-hover:to-emerald-500" style={{ height: `${(item.revenue / maxRevenue) * 100}%` }} />
                    {comparePeriods && (
                      <div className="absolute bottom-0 w-full bg-emerald-200/40 rounded-t-md" style={{ height: `${(item.revenue / maxRevenue) * 100 * 0.7}%` }} />
                    )}
                  </div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    ₦{item.revenue.toLocaleString()}
                  </div>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">{item.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Active Users + Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Active Users */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-600" />
              Daily Active Users
            </CardTitle>
            <CardDescription>Average user engagement by day of week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-40">
              {dailyActiveUsers.map((day) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {(day.users / 1000).toFixed(1)}K
                  </span>
                  <div className="w-full relative group cursor-pointer" style={{ height: '100px' }}>
                    <div className="absolute bottom-0 w-full bg-emerald-100 rounded-t-sm" style={{ height: '100%' }}>
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t-sm transition-all duration-500 group-hover:from-emerald-600 group-hover:to-emerald-400"
                        style={{ height: `${(day.users / maxUsers) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-600" />
              Conversion Funnel
            </CardTitle>
            <CardDescription>Views → Inquiries → Offers → Sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conversionFunnel.map((stage, i) => (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">{stage.stage}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">{stage.count.toLocaleString()}</span>
                      <Badge variant="secondary" className={`text-[10px] ${i === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                        {stage.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <div className="h-8 bg-muted rounded-md overflow-hidden">
                    <div
                      className={`h-full ${stage.color} rounded-md transition-all duration-700 flex items-center px-3`}
                      style={{ width: `${Math.max(stage.percentage, 2)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Categories + Revenue by Payment Method */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Hash className="h-4 w-4 text-emerald-600" />
              Top Categories Breakdown
            </CardTitle>
            <CardDescription>Sales distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCategories.map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-muted-foreground font-semibold">{cat.percentage}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${cat.color} transition-all duration-700`} style={{ width: `${cat.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Payment Method */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              Revenue by Payment Method
            </CardTitle>
            <CardDescription>Paystack vs Crypto breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-6">
              {/* Donut-like CSS display */}
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#059669" strokeWidth="20" strokeDasharray={`${72 * 2.51} ${100 * 2.51}`} strokeLinecap="round" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="20" strokeDasharray={`${28 * 2.51} ${100 * 2.51}`} strokeDashoffset={`${-72 * 2.51}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xl font-bold">₦2.8M</p>
                  <p className="text-[10px] text-muted-foreground">Total Revenue</p>
                </div>
              </div>
              <div className="ml-8 space-y-4">
                {paymentMethods.map((pm) => (
                  <div key={pm.method} className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${pm.color}`} />
                    <div>
                      <p className="text-sm font-medium">{pm.method}</p>
                      <p className="text-xs text-muted-foreground">{pm.percentage}% — {pm.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-600" />
            Performance Trends
          </CardTitle>
          <CardDescription>7-day sparkline overview for key metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {weeklyTrends.map((trend) => (
              <div key={trend.label} className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">{trend.label}</p>
                <div className="flex items-end gap-[3px] h-12">
                  {trend.data.map((val, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-sm ${trend.color} transition-all duration-300`}
                      style={{ height: `${(val / maxTrend) * 100}%` }}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground">Mon–Sun</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-600" />
            Weekly Activity
          </CardTitle>
          <CardDescription>Activity levels by day of week — this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 h-40">
            {weeklyActivity.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-semibold text-emerald-600">{day.level}%</span>
                <div className="w-full relative group cursor-pointer" style={{ height: '100px' }}>
                  <div className="absolute bottom-0 w-full bg-emerald-100 rounded-t-sm" style={{ height: '100%' }}>
                    <div
                      className={`absolute bottom-0 w-full rounded-t-sm transition-all duration-500 ${
                        day.level >= 80 ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 group-hover:from-emerald-700 group-hover:to-emerald-500'
                        : day.level >= 50 ? 'bg-gradient-to-t from-teal-500 to-teal-300 group-hover:from-teal-600 group-hover:to-teal-400'
                        : 'bg-gradient-to-t from-amber-400 to-amber-200 group-hover:from-amber-500 group-hover:to-amber-300'
                      }`}
                      style={{ height: `${(day.level / maxActivity) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">{day.day}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Listings */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="h-4 w-4 text-emerald-600" />
                Top Performing Listings
              </CardTitle>
              <CardDescription>Your best-performing listings ranked by revenue</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">{topListings.length} listings</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">#</TableHead>
                  <TableHead>Listing</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="text-center"><Eye className="h-3.5 w-3.5 inline" /></TableHead>
                  <TableHead className="text-center"><MessageCircle className="h-3.5 w-3.5 inline" /></TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Sold</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-center w-[60px]">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topListings.map((item, i) => (
                  <TableRow key={i} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-bold text-muted-foreground text-sm">#{i + 1}</TableCell>
                    <TableCell><span className="font-medium text-sm">{item.title}</span></TableCell>
                    <TableCell className="hidden md:table-cell"><Badge variant="outline" className="text-xs">{item.category}</Badge></TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">{item.views.toLocaleString()}</TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">{item.inquiries}</TableCell>
                    <TableCell className="text-center hidden sm:table-cell"><span className="font-semibold text-emerald-600 text-sm">{item.sold}</span></TableCell>
                    <TableCell className="text-right"><span className="font-bold text-sm">₦{item.revenue.toLocaleString()}</span></TableCell>
                    <TableCell className="text-center">
                      {item.trend === 'up' ? <TrendingUp className="h-4 w-4 text-emerald-500 inline" /> : <TrendingDown className="h-4 w-4 text-rose-500 inline" />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Tips */}
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-emerald-600" />
            Performance Tips
          </CardTitle>
          <CardDescription>Actionable insights based on your analytics data</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-4">
            {performanceTips.map((tip, i) => {
              const Icon = tip.icon;
              return (
                <div key={i} className={`flex items-start gap-4 p-4 rounded-lg border ${
                  tip.type === 'positive' ? 'border-emerald-200 bg-emerald-50/50' : tip.type === 'improvement' ? 'border-amber-200 bg-amber-50/50' : 'border-cyan-200 bg-cyan-50/50'
                }`}>
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                    tip.type === 'positive' ? 'bg-emerald-100' : tip.type === 'improvement' ? 'bg-amber-100' : 'bg-cyan-100'
                  }`}>
                    <Icon className={`h-5 w-5 ${tip.type === 'positive' ? 'text-emerald-600' : tip.type === 'improvement' ? 'text-amber-600' : 'text-emerald-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold">{tip.title}</h4>
                      {tip.type === 'improvement' && <Badge variant="secondary" className="text-[9px] bg-amber-100 text-amber-700 py-0 px-1.5">Improvement</Badge>}
                      {tip.type === 'positive' && <Badge variant="secondary" className="text-[9px] bg-emerald-100 text-emerald-700 py-0 px-1.5">Great Job</Badge>}
                      {tip.type === 'insight' && <Badge variant="secondary" className="text-[9px] bg-cyan-100 text-emerald-700 py-0 px-1.5">Insight</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tip.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
