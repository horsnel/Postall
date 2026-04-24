'use client';

import Link from "next/link";

import { useState, useMemo } from 'react';
import { categories, cities } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  ChevronLeft,
  ChartColumnIncreasing,
  TrendingUp,
  TrendingDown,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Flame,
  Sparkles,
  Info,
  Zap,
  SlidersHorizontal,
  Briefcase,
  ShoppingCart,
  Home,
  Users,
  DollarSign,
} from 'lucide-react';

// Simulated data
const budgetData = [
  { category: 'Gigs', budget: 85, color: '#059669' },
  { category: 'Services', budget: 220, color: '#0d9488' },
  { category: 'Jobs', budget: 450, color: '#06b6d4' },
  { category: 'For Sale', budget: 180, color: '#d97706' },
  { category: 'Housing', budget: 650, color: '#ea580c' },
  { category: 'Community', budget: 35, color: '#e11d48' },
];

const dailyTasksData = [
  { day: 'Mon', tasks: 142 },
  { day: 'Tue', tasks: 168 },
  { day: 'Wed', tasks: 195 },
  { day: 'Thu', tasks: 178 },
  { day: 'Fri', tasks: 220 },
  { day: 'Sat', tasks: 156 },
  { day: 'Sun', tasks: 112 },
];

const categoryDistribution = [
  { name: 'Gigs', value: 35, color: '#059669' },
  { name: 'Services', value: 25, color: '#0d9488' },
  { name: 'Jobs', value: 15, color: '#06b6d4' },
  { name: 'For Sale', value: 12, color: '#d97706' },
  { name: 'Housing', value: 8, color: '#ea580c' },
  { name: 'Community', value: 5, color: '#e11d48' },
];

const topCitiesData = [
  { city: 'Lagos', activeTasks: 3240, avgBudget: 185000, growth: 12.5 },
  { city: 'Ibadan', activeTasks: 2180, avgBudget: 165000, growth: 18.2 },
  { city: 'Port Harcourt', activeTasks: 1890, avgBudget: 140000, growth: 15.8 },
  { city: 'Benin City', activeTasks: 1560, avgBudget: 210000, growth: 8.4 },
  { city: 'Kano', activeTasks: 1120, avgBudget: 95000, growth: 22.1 },
  { city: 'Enugu', activeTasks: 890, avgBudget: 320000, growth: 28.6 },
  { city: 'Aba', activeTasks: 680, avgBudget: 275000, growth: 5.2 },
  { city: 'Ilorin', activeTasks: 520, avgBudget: 310000, growth: -2.1 },
];

const trendingSkills = [
  { skill: 'Web Development', growth: 34, demand: 'Very High' },
  { skill: 'Graphic Design', growth: 28, demand: 'High' },
  { skill: 'Data Analysis', growth: 45, demand: 'Very High' },
  { skill: 'Social Media Marketing', growth: 22, demand: 'High' },
  { skill: 'Mobile App Development', growth: 38, demand: 'Very High' },
  { skill: 'Content Writing', growth: 15, demand: 'Medium' },
  { skill: 'Video Editing', growth: 31, demand: 'High' },
  { skill: 'UI/UX Design', growth: 42, demand: 'Very High' },
  { skill: 'Plumbing', growth: 18, demand: 'High' },
  { skill: 'Electrical Work', growth: 20, demand: 'High' },
];

const categoryIcons: Record<string, React.ElementType> = {
  gigs: Zap,
  services: SlidersHorizontal,
  jobs: Briefcase,
  'for-sale': ShoppingCart,
  housing: Home,
  community: Users,
};

const demandColors: Record<string, string> = {
  'Very High': 'bg-emerald-100 text-emerald-700',
  'High': 'bg-teal-100 text-teal-700',
  'Medium': 'bg-amber-100 text-amber-700',
};

export default function MarketInsightsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');

  const filteredBudgetData = useMemo(() => {
    if (selectedCategory === 'all') return budgetData;
    return budgetData.filter((d) => d.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory);
  }, [selectedCategory]);

  const filteredCitiesData = useMemo(() => {
    if (selectedCity === 'all') return topCitiesData;
    return topCitiesData.filter((d) => d.city === selectedCity);
  }, [selectedCity]);

  return (
    <div className="min-h-[60vh]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <ChartColumnIncreasing className="h-6 w-6" />
            </div>
            <Badge className="bg-white/20 text-white hover:bg-white/30 border-white/30">
              Insights Tool
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Market Insights
          </h1>
          <p className="text-lg sm:text-xl text-emerald-100 max-w-2xl mb-8">
            Discover market trends, track pricing, and make smarter decisions with
            real-time data from the PostAll marketplace.
          </p>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg">
            <div className="flex-1 space-y-1">
              <Label className="text-xs text-emerald-200">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-1">
              <Label className="text-xs text-emerald-200">City</Label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        <Link href="/browse#tools" className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mt-6">
            <ChevronLeft className="h-4 w-4" />Back to All Tools
          </Link>
        </div>
      </div>

      {/* Charts Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart - Average Budget by Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                Average Task Budget by Category
              </CardTitle>
              <CardDescription>
                Average budget in ₦ (Naira) for tasks in each category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredBudgetData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="category"
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      formatter={(value: number) => [`$${value}`, 'Avg Budget']}
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Bar
                      dataKey="budget"
                      radius={[6, 6, 0, 0]}
                      fill="#059669"
                    >
                      {budgetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Line Chart - Tasks Posted Over Last 7 Days */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-teal-600" />
                Tasks Posted — Last 7 Days
              </CardTitle>
              <CardDescription>
                Daily task posting volume across all cities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyTasksData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip
                      formatter={(value: number) => [value, 'Tasks Posted']}
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="tasks"
                      stroke="#0d9488"
                      strokeWidth={3}
                      dot={{ fill: '#0d9488', strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pie Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Task Distribution by Category
            </CardTitle>
            <CardDescription>
              Percentage of total tasks in each category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }: { name: string; percent: number }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={{ stroke: '#d1d5db' }}
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, 'Share']}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Legend
                    verticalAlign="middle"
                    align="right"
                    iconType="circle"
                    iconSize={10}
                    wrapperStyle={{ fontSize: '13px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Top Cities Table & Trending Skills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Top Cities Table */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                Top Cities by Activity
              </CardTitle>
              <CardDescription>
                Most active marketplace cities ranked by task volume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 pr-4">#</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 pr-4">City</th>
                      <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 pr-4">Active Tasks</th>
                      <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 pr-4">Avg Budget</th>
                      <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCitiesData.map((row, index) => (
                      <tr key={row.city} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="py-3 pr-4 text-sm font-medium text-gray-400">{index + 1}</td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-sm font-medium text-gray-900">{row.city}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-right text-sm text-gray-700 font-mono">
                          {row.activeTasks.toLocaleString()}
                        </td>
                        <td className="py-3 pr-4 text-right text-sm text-gray-700 font-mono">
                          ₦{row.avgBudget.toLocaleString()}
                        </td>
                        <td className="py-3 text-right">
                          <Badge
                            variant="secondary"
                            className={`text-xs font-medium ${
                              row.growth >= 0
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {row.growth >= 0 ? (
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                            )}
                            {Math.abs(row.growth)}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Trending Skills */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Flame className="h-5 w-5 text-amber-500" />
                Trending Skills
              </CardTitle>
              <CardDescription>
                Most in-demand skills with growth rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {trendingSkills.map((item) => (
                  <div
                    key={item.skill}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.skill}</p>
                      <Badge
                        variant="secondary"
                        className={`text-xs mt-1 ${demandColors[item.demand] || ''}`}
                      >
                        {item.demand}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-bold text-emerald-700">+{item.growth}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Updated Note */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center gap-3 text-sm text-gray-400 justify-center">
          <Info className="h-4 w-4" />
          <span>Insights are updated daily based on marketplace activity. Data shown is for demonstration purposes.</span>
        </div>
      </section>
    </div>
  );
}
