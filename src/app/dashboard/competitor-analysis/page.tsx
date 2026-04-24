'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  ChartColumnIncreasing,
  TrendingUp,
  Trophy,
  Star,
  Eye,
  Smartphone,
  Search,
  Shield,
  SlidersHorizontal,
  Users,
  ChevronRight,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Wrench,
} from 'lucide-react'

type Platform = 'postall' | 'jiji' | 'olx' | 'fbmarketplace' | 'craigslist'

interface CategoryScore {
  name: string
  icon: React.ReactNode
  postall: number
  jiji: number
  olx: number
  fbmarketplace: number
  craigslist: number
  postallLead: boolean
}

const categories: CategoryScore[] = [
  {
    name: 'Visual Design',
    icon: <Eye className="h-4 w-4" />,
    postall: 92,
    jiji: 78,
    olx: 75,
    fbmarketplace: 70,
    craigslist: 45,
    postallLead: true,
  },
  {
    name: 'Navigation UX',
    icon: <Search className="h-4 w-4" />,
    postall: 90,
    jiji: 82,
    olx: 77,
    fbmarketplace: 74,
    craigslist: 50,
    postallLead: true,
  },
  {
    name: 'Mobile Experience',
    icon: <Smartphone className="h-4 w-4" />,
    postall: 95,
    jiji: 80,
    olx: 72,
    fbmarketplace: 85,
    craigslist: 35,
    postallLead: true,
  },
  {
    name: 'Search & Filters',
    icon: <Search className="h-4 w-4" />,
    postall: 88,
    jiji: 85,
    olx: 80,
    fbmarketplace: 76,
    craigslist: 55,
    postallLead: false,
  },
  {
    name: 'Trust & Safety UI',
    icon: <Shield className="h-4 w-4" />,
    postall: 94,
    jiji: 72,
    olx: 68,
    fbmarketplace: 60,
    craigslist: 40,
    postallLead: true,
  },
  {
    name: 'Seller Tools',
    icon: <Wrench className="h-4 w-4" />,
    postall: 91,
    jiji: 70,
    olx: 65,
    fbmarketplace: 55,
    craigslist: 30,
    postallLead: true,
  },
  {
    name: 'Community Features',
    icon: <Users className="h-4 w-4" />,
    postall: 89,
    jiji: 55,
    olx: 50,
    fbmarketplace: 80,
    craigslist: 65,
    postallLead: true,
  },
  {
    name: 'Overall Score',
    icon: <Star className="h-4 w-4" />,
    postall: 92,
    jiji: 75,
    olx: 70,
    fbmarketplace: 71,
    craigslist: 46,
    postallLead: true,
  },
]

const platforms = [
  { key: 'postall' as Platform, name: 'PostAll', color: 'bg-emerald-500', textColor: 'text-emerald-600', isOurs: true },
  { key: 'jiji' as Platform, name: 'Jiji', color: 'bg-gray-400', textColor: 'text-gray-600', isOurs: false },
  { key: 'olx' as Platform, name: 'OLX', color: 'bg-gray-400', textColor: 'text-gray-500', isOurs: false },
  { key: 'fbmarketplace' as Platform, name: 'FB Marketplace', color: 'bg-gray-400', textColor: 'text-gray-500', isOurs: false },
  { key: 'craigslist' as Platform, name: 'Craigslist', color: 'bg-gray-400', textColor: 'text-gray-500', isOurs: false },
]

function ScoreBar({ score, color, maxScore = 100 }: { score: number; color: string; maxScore?: number }) {
  const width = `${(score / maxScore) * 100}%`
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width }}
        />
      </div>
      <span className="text-xs font-semibold w-8 text-right">{score}</span>
    </div>
  )
}

function getScoreColor(score: number): string {
  if (score >= 90) return 'bg-emerald-500'
  if (score >= 80) return 'bg-emerald-400'
  if (score >= 70) return 'bg-amber-400'
  if (score >= 60) return 'bg-orange-400'
  return 'bg-rose-400'
}

export default function CompetitorAnalysisPage() {
  const [viewMode, setViewMode] = useState<'bars' | 'table'>('bars')

  const postallWins = categories.filter(c => c.postallLead).length
  const avgPostall = Math.round(categories.reduce((a, c) => a + c.postall, 0) / categories.length)
  const avgJiji = Math.round(categories.reduce((a, c) => a + c.jiji, 0) / categories.length)
  const avgFb = Math.round(categories.reduce((a, c) => a + c.fbmarketplace, 0) / categories.length)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ChartColumnIncreasing className="h-6 w-6 text-emerald-500" />
          UI Analysis
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Compare PostAll&apos;s user interface against major competitors
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-700">{postallWins}/{categories.length}</p>
                <p className="text-xs text-emerald-600">Categories Leading</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Star className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgPostall}</p>
                <p className="text-xs text-muted-foreground">Avg. PostAll Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">+{avgPostall - Math.max(avgJiji, avgFb)}</p>
                <p className="text-xs text-muted-foreground">Points Above Nearest</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'bars' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('bars')}
          className="gap-1.5"
        >
          <ChartColumnIncreasing className="h-3.5 w-3.5" />
          Score Bars
        </Button>
        <Button
          variant={viewMode === 'table' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('table')}
          className="gap-1.5"
        >
          Table View
        </Button>
      </div>

      {/* Score Bars View */}
      {viewMode === 'bars' && (
        <div className="space-y-4">
          {categories.map((cat) => (
            <Card key={cat.name} className={cat.postallLead ? 'border-emerald-200' : ''}>
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${cat.postallLead ? 'bg-emerald-100 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                    {cat.icon}
                  </div>
                  <h3 className="font-semibold text-sm">{cat.name}</h3>
                  {cat.postallLead && (
                    <Badge className="bg-emerald-100 text-emerald-700 text-[10px] gap-1 ml-auto">
                      <CheckCircle2 className="h-3 w-3" />
                      PostAll Leads
                    </Badge>
                  )}
                </div>
                <div className="space-y-2.5">
                  {/* PostAll */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium w-28 shrink-0 text-emerald-700">PostAll</span>
                    <ScoreBar score={cat.postall} color="bg-emerald-500" />
                  </div>
                  {/* Competitors */}
                  {platforms.filter(p => !p.isOurs).map((platform) => (
                    <div key={platform.key} className="flex items-center gap-3">
                      <span className="text-xs font-medium w-28 shrink-0 text-muted-foreground">{platform.name}</span>
                      <ScoreBar score={cat[platform.key]} color="bg-gray-300" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left text-xs font-semibold p-3">Category</th>
                    {platforms.map((p) => (
                      <th key={p.key} className="text-center text-xs font-semibold p-3">
                        <span className={p.isOurs ? 'text-emerald-700' : ''}>{p.name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, i) => (
                    <tr key={cat.name} className={`border-b ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                      <td className="p-3 text-sm font-medium flex items-center gap-2">
                        <div className={`h-6 w-6 rounded flex items-center justify-center ${cat.postallLead ? 'bg-emerald-100 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                          {cat.icon}
                        </div>
                        {cat.name}
                        {cat.postallLead && (
                          <Trophy className="h-3 w-3 text-emerald-500" />
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`text-sm font-bold ${getScoreColor(cat.postall).replace('bg-', 'text-').replace('-500', '-600').replace('-400', '-500')}`}>
                          {cat.postall}
                        </span>
                      </td>
                      {platforms.filter(p => !p.isOurs).map((platform) => (
                        <td key={platform.key} className="p-3 text-center text-sm text-muted-foreground">
                          {cat[platform.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-700">Strongest Categories</p>
                <p className="text-xs text-emerald-600/80 mt-1">
                  PostAll leads in {postallWins}/{categories.length} categories. Trust & Safety (94), Mobile Experience (95), and Seller Tools (91) are our strongest areas.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
              <ArrowUpRight className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-700">Opportunity Areas</p>
                <p className="text-xs text-amber-600/80 mt-1">
                  Search & Filters (88) is close to Jiji (85). Continued investment in search UX can widen this gap.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
              <Shield className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-700">Trust Differentiator</p>
                <p className="text-xs text-emerald-600/80 mt-1">
                  PostAll&apos;s Trust & Safety UI (94) significantly outperforms all competitors. Escrow, verification, and safety features are key selling points.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <Users className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-purple-700">Community Edge</p>
                <p className="text-xs text-emerald-600/80 mt-1">
                  Community Features (89) give PostAll an edge over classifieds competitors. FB Marketplace is closest at 80.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Methodology Note */}
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold">Methodology:</span> Scores are based on internal UI/UX evaluation across 8 key categories.
            Each category is scored 0-100 based on design quality, usability testing, feature completeness, and user feedback.
            Data reflects analysis as of Q1 2026. Competitor platforms were evaluated on their Nigerian/African market versions.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
