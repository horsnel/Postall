'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Clock,
  MessageCircle,
  Users,
  TrendingUp,
  Lightbulb,
  Send,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  HourglassIcon,
} from 'lucide-react';

const statsCards = [
  {
    label: 'Average Response Time',
    value: '23 min',
    description: 'Under 1 hour target',
    icon: Clock,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    positive: true,
  },
  {
    label: 'Response Rate',
    value: '94%',
    description: 'of inquiries replied to',
    icon: MessageCircle,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    positive: true,
  },
  {
    label: 'Total Conversations',
    value: '156',
    description: 'this month',
    icon: Users,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    positive: true,
  },
  {
    label: 'Conversion Rate',
    value: '34%',
    description: 'led to a sale/completion',
    icon: TrendingUp,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    positive: true,
  },
];

const weeklyData = [
  { day: 'Mon', avg: 18, responses: 24 },
  { day: 'Tue', avg: 25, responses: 19 },
  { day: 'Wed', avg: 12, responses: 31 },
  { day: 'Thu', avg: 45, responses: 15 },
  { day: 'Fri', avg: 30, responses: 22 },
  { day: 'Sat', avg: 8, responses: 28 },
  { day: 'Sun', avg: 15, responses: 17 },
];

const maxAvg = Math.max(...weeklyData.map((d) => d.avg));

function getBarColor(avg: number) {
  if (avg < 30) return 'bg-emerald-500';
  if (avg <= 60) return 'bg-amber-500';
  return 'bg-rose-500';
}

function getBarBg(avg: number) {
  if (avg < 30) return 'bg-emerald-100';
  if (avg <= 60) return 'bg-amber-100';
  return 'bg-rose-100';
}

const tips = [
  'Responding within 1 hour increases your chances of closing a deal by 60%',
  'Buyers are 3x more likely to choose a seller who responds quickly',
  'Enable auto-reply for when you\'re unavailable',
];

const recentActivity = [
  { inquiry: 'iPhone 14 Pro Max - Is it available?', from: 'Amina K.', listing: 'iPhone 14 Pro Max', receivedAt: '10:30 AM', respondedAt: '10:42 AM', responseTime: '12min', status: 'replied' as const },
  { inquiry: 'Can you do ₦600K?', from: 'Kwame M.', listing: 'iPhone 14 Pro Max', receivedAt: '11:15 AM', respondedAt: null, responseTime: '45min', status: 'pending' as const },
  { inquiry: 'Is the laptop still available?', from: 'Fatima A.', listing: 'MacBook Air M2', receivedAt: '9:00 AM', respondedAt: '9:05 AM', responseTime: '5min', status: 'replied' as const },
  { inquiry: 'What\'s your best price?', from: 'Chinedu E.', listing: 'Samsung 55" TV', receivedAt: 'Yesterday', respondedAt: 'Yesterday', responseTime: '2hrs', status: 'replied' as const },
  { inquiry: 'Can I see the apartment today?', from: 'Blessing O.', listing: '3BR Flat Lekki', receivedAt: 'Yesterday', respondedAt: null, responseTime: '1d+', status: 'missed' as const },
];

function StatusBadge({ status }: { status: 'replied' | 'pending' | 'missed' }) {
  switch (status) {
    case 'replied':
      return (
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Replied
        </Badge>
      );
    case 'pending':
      return (
        <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">
          <HourglassIcon className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    case 'missed':
      return (
        <Badge variant="secondary" className="bg-rose-100 text-rose-700 hover:bg-rose-100">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Missed
        </Badge>
      );
  }
}

const pendingInquiries = recentActivity.filter((a) => a.status === 'pending' || a.status === 'missed');

export default function ResponseDashboardPage() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'replied' | 'pending' | 'missed'>('all');

  const filteredActivity = recentActivity.filter((a) => {
    if (selectedFilter === 'all') return true;
    return a.status === selectedFilter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Response Dashboard</h1>
        <p className="text-muted-foreground">Track your response times and communication performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
              {stat.positive && (
                <div className="absolute top-3 right-3">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Chart + Tips Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Response Time Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Response Time - Last 7 Days</CardTitle>
            <CardDescription>Average response time per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weeklyData.map((item) => (
                <div key={item.day} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-8 shrink-0">{item.day}</span>
                  <div className={`flex-1 h-7 rounded-md ${getBarBg(item.avg)} relative overflow-hidden`}>
                    <div
                      className={`h-full rounded-md ${getBarColor(item.avg)} transition-all duration-500 flex items-center justify-end pr-2`}
                      style={{ width: `${Math.max((item.avg / maxAvg) * 100, 12)}%` }}
                    >
                      <span className="text-xs font-semibold text-white whitespace-nowrap">
                        {item.avg}min
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground w-16 text-right shrink-0">
                    {item.responses} msgs
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-sm bg-emerald-500" />
                <span className="text-xs text-muted-foreground">&lt; 30min</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-sm bg-amber-500" />
                <span className="text-xs text-muted-foreground">30-60min</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-sm bg-rose-500" />
                <span className="text-xs text-muted-foreground">&gt; 60min</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response Tips */}
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-emerald-600" />
              Response Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tips.map((tip, i) => (
                <div key={i} className="flex gap-2">
                  <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-emerald-700">{i + 1}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Respond */}
      {pendingInquiries.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Quick Respond
            </CardTitle>
            <CardDescription>You have {pendingInquiries.length} pending inquiry{pendingInquiries.length > 1 ? 'ies' : 'y'} that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingInquiries.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-background border">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <MessageCircle className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.inquiry}</p>
                    <p className="text-xs text-muted-foreground">
                      From {item.from} &middot; {item.listing} &middot; {item.receivedAt}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                  <Button size="sm" className="gap-1.5 shrink-0">
                    <Send className="h-3.5 w-3.5" />
                    Reply Now
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Response Activity */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base">Recent Response Activity</CardTitle>
              <CardDescription>All recent inquiries and your responses</CardDescription>
            </div>
            <div className="flex items-center gap-1.5">
              {(['all', 'replied', 'pending', 'missed'] as const).map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? 'default' : 'outline'}
                  size="sm"
                  className="h-7 text-xs capitalize"
                  onClick={() => setSelectedFilter(filter)}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Inquiry</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4 hidden md:table-cell">From</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4 hidden lg:table-cell">Listing</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Received</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4 hidden sm:table-cell">Responded</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Response Time</th>
                  <th className="text-left font-medium text-muted-foreground pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivity.map((item, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 pr-4">
                      <p className="font-medium truncate max-w-[200px]">{item.inquiry}</p>
                    </td>
                    <td className="py-3 pr-4 hidden md:table-cell">
                      <span className="text-muted-foreground">{item.from}</span>
                    </td>
                    <td className="py-3 pr-4 hidden lg:table-cell">
                      <Badge variant="outline" className="text-xs">{item.listing}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">{item.receivedAt}</td>
                    <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap hidden sm:table-cell">
                      {item.respondedAt || '—'}
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <span className={`font-medium ${
                        item.status === 'missed' ? 'text-rose-600' :
                        item.status === 'pending' ? 'text-amber-600' :
                        'text-emerald-600'
                      }`}>
                        {item.responseTime}
                      </span>
                    </td>
                    <td className="py-3">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
