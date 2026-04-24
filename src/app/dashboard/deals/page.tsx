'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  TrendingDown,
  Plus,
  MapPin,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Laptop,
  Smartphone,
  Tv,
  Monitor,
  Armchair,
  Bike,
  Headphones,
} from 'lucide-react'

interface ActiveAlert {
  id: string
  item: string
  originalPrice: string
  currentPrice?: string
  targetPrice?: string
  drop: string
  city: string
  icon: string
  created: string
  active: boolean
}

interface TriggeredAlert {
  id: string
  item: string
  originalPrice: string
  currentPrice: string
  drop: string
  city: string
  icon: string
  triggeredDate: string
}

interface ExpiredAlert {
  id: string
  item: string
  originalPrice: string
  lowestPrice: string
  drop: string
  city: string
  icon: string
  expiredDate: string
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  laptop: Laptop,
  smartphone: Smartphone,
  tv: Tv,
  desk: Monitor,
  chair: Armchair,
  bike: Bike,
  headphones: Headphones,
}

const activeAlerts: ActiveAlert[] = [
  { id: 'a1', item: 'MacBook Air M2', originalPrice: '₦900,000', currentPrice: '₦800,000', drop: '11%', city: 'Lagos', icon: 'laptop', created: '3d ago', active: true },
  { id: 'a2', item: 'iPhone 14 Pro Max', originalPrice: '₦700,000', targetPrice: '₦600,000', drop: '0%', city: 'Lagos', icon: 'smartphone', created: '5d ago', active: true },
  { id: 'a3', item: 'Samsung 55" TV', originalPrice: '₦400,000', targetPrice: '₦350,000', drop: '8%', city: 'Abuja', icon: 'tv', created: '1w ago', active: true },
  { id: 'a4', item: 'Standing Desk', originalPrice: '₦350,000', targetPrice: '₦280,000', drop: '20%', city: 'Lagos', icon: 'desk', created: '4d ago', active: true },
]

const triggeredAlerts: TriggeredAlert[] = [
  { id: 't1', item: 'Gaming Chair', originalPrice: '₦300,000', currentPrice: '₦250,000', drop: '17%', city: 'Lagos', icon: 'chair', triggeredDate: '1d ago' },
  { id: 't2', item: 'Mountain Bike', originalPrice: '₦450,000', currentPrice: '₦400,000', drop: '11%', city: 'Lagos', icon: 'bike', triggeredDate: '3d ago' },
  { id: 't3', item: 'AirPods Pro', originalPrice: '₦180,000', currentPrice: '₦150,000', drop: '17%', city: 'Lagos', icon: 'headphones', triggeredDate: '5h ago' },
]

const expiredAlerts: ExpiredAlert[] = [
  { id: 'e1', item: 'PS5 Controller', originalPrice: '₦65,000', lowestPrice: '₦55,000', drop: '15%', city: 'Lagos', icon: 'gaming', expiredDate: '3d ago' },
  { id: 'e2', item: 'Wireless Mouse', originalPrice: '₦25,000', lowestPrice: '₦20,000', drop: '20%', city: 'Abuja', icon: 'laptop', expiredDate: '1w ago' },
]

function AlertIcon({ type, className }: { type: string; className?: string }) {
  const Icon = iconMap[type] || Laptop
  return <Icon className={className} />
}

export default function DealsPage() {
  const [activeTab, setActiveTab] = useState('active')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <TrendingDown className="h-6 w-6 text-primary" />
            Price Alerts & Deals
          </h1>
          <p className="text-muted-foreground mt-1">
            Get notified when prices drop on items you&apos;re watching.
          </p>
        </div>
        <Link href="/browse">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Alert
          </Button>
        </Link>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active Alerts</p>
            <p className="text-2xl font-bold">{activeAlerts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Triggered</p>
            <p className="text-2xl font-bold text-emerald-600">{triggeredAlerts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Savings</p>
            <p className="text-2xl font-bold text-emerald-600">₦190,000</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Expired</p>
            <p className="text-2xl font-bold text-muted-foreground">{expiredAlerts.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active" className="gap-1.5">
            Active Alerts
            <Badge variant="secondary" className="ml-1 bg-primary/10 text-primary">{activeAlerts.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="triggered" className="gap-1.5">
            Triggered
            <Badge variant="secondary" className="ml-1 bg-emerald-100 text-emerald-700">{triggeredAlerts.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="expired" className="gap-1.5">
            Expired
            <Badge variant="secondary" className="ml-1 bg-gray-100 text-gray-700">{expiredAlerts.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Active Alerts Tab */}
        <TabsContent value="active" className="space-y-3 mt-4">
          {activeAlerts.map((alert) => (
            <Card key={alert.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 md:p-5">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <AlertIcon type={alert.icon} className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{alert.item}</h3>
                      {Number(alert.drop) > 0 && (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 gap-1">
                          <ArrowDownRight className="h-3 w-3" />
                          {alert.drop} drop
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm flex-wrap">
                      <span className="text-muted-foreground line-through">{alert.originalPrice}</span>
                      <span className="font-semibold text-emerald-600">
                        {alert.currentPrice || alert.targetPrice}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {alert.city}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        Created {alert.created}
                      </span>
                    </div>
                    {alert.targetPrice && !alert.currentPrice && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Waiting for price to drop to {alert.targetPrice}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link href="/browse">
                      <Button size="sm" variant="outline">View</Button>
                    </Link>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Triggered Alerts Tab */}
        <TabsContent value="triggered" className="space-y-3 mt-4">
          {triggeredAlerts.map((alert) => (
            <Card key={alert.id} className="border-emerald-200 bg-emerald-50/30 hover:shadow-md transition-shadow">
              <CardContent className="p-4 md:p-5">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{alert.item}</h3>
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 gap-1">
                        <ArrowDownRight className="h-3 w-3" />
                        {alert.drop} dropped
                      </Badge>
                      <Badge variant="secondary" className="bg-emerald-500 text-white">
                        Price Reached!
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm flex-wrap">
                      <span className="text-muted-foreground line-through">{alert.originalPrice}</span>
                      <span className="font-bold text-emerald-600">{alert.currentPrice}</span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {alert.city}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-600">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Triggered {alert.triggeredDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link href="/browse">
                      <Button size="sm" className="gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Buy Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Expired Alerts Tab */}
        <TabsContent value="expired" className="space-y-3 mt-4">
          {expiredAlerts.map((alert) => (
            <Card key={alert.id} className="opacity-60 hover:opacity-80 transition-opacity">
              <CardContent className="p-4 md:p-5">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <AlertIcon type={alert.icon} className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-muted-foreground">{alert.item}</h3>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600 gap-1">
                        <XCircle className="h-3 w-3" />
                        Expired
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                      <span className="line-through">{alert.originalPrice}</span>
                      <span>Lowest: {alert.lowestPrice}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {alert.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Expired {alert.expiredDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline">Re-create</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Info note */}
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="p-4 flex items-start gap-3">
          <TrendingDown className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">How Price Alerts Work</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Set a target price for any item. When the listing price drops to or below your target, we&apos;ll notify you immediately.
              Triggered alerts stay active for 7 days. Browse items and click &quot;Set Price Alert&quot; to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
