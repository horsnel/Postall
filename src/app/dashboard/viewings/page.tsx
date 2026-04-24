'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Bell,
  Building2,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  Clock,
  Compass,
  FileText,
  HourglassIcon,
  MapPin,
  MessageCircle,
  Navigation,
  Plus,
  User,
  X
} from 'lucide-react';


const stats = [
  { label: 'Upcoming', value: '3', icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'This Week', value: '8', icon: Clock, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { label: 'Completed', value: '24', icon: CalendarCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
];

const upcomingViewings = [
  {
    id: 'v1',
    property: '3BR Flat - Lekki Phase 1',
    client: 'Amina Kaduna',
    date: 'Apr 10, 2026',
    time: '10:00 AM',
    status: 'confirmed' as const,
    notes: 'Client interested in 3BR with parking',
  },
  {
    id: 'v2',
    property: '2BR Apartment - Ikoyi',
    client: 'Kwame Mensah',
    date: 'Apr 10, 2026',
    time: '2:00 PM',
    status: 'pending' as const,
    notes: 'Requested viewing via chat',
  },
  {
    id: 'v3',
    property: '4 Bedroom Duplex - Banana Island',
    client: 'Fatima Al-Rashid',
    date: 'Apr 12, 2026',
    time: '11:00 AM',
    status: 'confirmed' as const,
    notes: 'High-budget client, VIP treatment',
  },
];

const pastViewings = [
  {
    id: 'pv1',
    property: 'Studio Apartment - Victoria Island',
    client: 'Emeka Okafor',
    date: 'Apr 5, 2026',
    outcome: 'Client made an offer',
    outcomeType: 'positive' as const,
  },
  {
    id: 'pv2',
    property: '3BR Duplex - Lekki',
    client: 'Grace Adebayo',
    date: 'Apr 4, 2026',
    outcome: 'Client not interested',
    outcomeType: 'negative' as const,
  },
  {
    id: 'pv3',
    property: '2BR Flat - Yaba',
    client: 'John Mwangi',
    date: 'Apr 3, 2026',
    outcome: 'Follow-up scheduled',
    outcomeType: 'neutral' as const,
  },
  {
    id: 'pv4',
    property: 'Penthouse - Ikoyi',
    client: 'Sarah Johnson',
    date: 'Apr 2, 2026',
    outcome: 'Client made an offer',
    outcomeType: 'positive' as const,
  },
  {
    id: 'pv5',
    property: '1BR Apartment - Surulere',
    client: 'David Asante',
    date: 'Apr 1, 2026',
    outcome: 'Client not interested',
    outcomeType: 'negative' as const,
  },
];

const sampleProperties = [
  '3BR Flat - Lekki Phase 1',
  '2BR Apartment - Ikoyi',
  '4 Bedroom Duplex - Banana Island',
  'Studio Apartment - Victoria Island',
  '3BR Duplex - Lekki',
  '2BR Flat - Yaba',
];

function StatusBadge({ status }: { status: 'confirmed' | 'pending' | 'cancelled' }) {
  switch (status) {
    case 'confirmed':
      return (
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Confirmed
        </Badge>
      );
    case 'pending':
      return (
        <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">
          <HourglassIcon className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    case 'cancelled':
      return (
        <Badge variant="secondary" className="bg-rose-100 text-rose-700 hover:bg-rose-100">
          <X className="h-3 w-3 mr-1" />
          Cancelled
        </Badge>
      );
  }
}

export default function ViewingsPage() {
  const [pastOpen, setPastOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleConfirm = (id: string) => {
    setConfirmingId(id);
    setTimeout(() => setConfirmingId(null), 1000);
  };

  const handleCancel = (id: string) => {
    setCancellingId(id);
    setTimeout(() => setCancellingId(null), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Upcoming Viewings</h1>
          <p className="text-muted-foreground">Manage your property viewing schedule</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Schedule Viewing
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule New Viewing</DialogTitle>
              <DialogDescription>Add a new property viewing to your calendar</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="property">Property</Label>
                <select
                  id="property"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {sampleProperties.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Client Name</Label>
                <Input id="client" placeholder="Enter client name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Add any notes about this viewing..." rows={3} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setDialogOpen(false)}>Schedule Viewing</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upcoming Viewings */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Upcoming Viewings</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {upcomingViewings.map((viewing) => (
            <Card key={viewing.id} className="relative overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{viewing.property}</h3>
                      <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                        <User className="h-3.5 w-3.5" />
                        {viewing.client}
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={viewing.status} />
                </div>

                <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {viewing.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {viewing.time}
                  </div>
                </div>

                {viewing.notes && (
                  <div className="flex items-start gap-2 p-2.5 rounded-md bg-muted/50 mb-4">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground">{viewing.notes}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {viewing.status === 'pending' && (
                    <Button size="sm" className="gap-1.5" onClick={() => handleConfirm(viewing.id)}>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {confirmingId === viewing.id ? 'Confirmed!' : 'Confirm'}
                    </Button>
                  )}
                  {viewing.status === 'confirmed' && (
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => handleCancel(viewing.id)}>
                      <X className="h-3.5 w-3.5" />
                      {cancellingId === viewing.id ? 'Cancelled' : 'Cancel'}
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Reschedule
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <Bell className="h-3.5 w-3.5" />
                    Send Reminder
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <Navigation className="h-3.5 w-3.5" />
                    Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Past Viewings */}
      <Collapsible open={pastOpen} onOpenChange={setPastOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <button className="w-full">
              <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Past Viewings</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{pastViewings.length} completed</Badge>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${pastOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </CardHeader>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-3">
                {pastViewings.map((viewing) => (
                  <div key={viewing.id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{viewing.property}</p>
                      <p className="text-xs text-muted-foreground">
                        {viewing.client} &middot; {viewing.date}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`shrink-0 ${
                        viewing.outcomeType === 'positive'
                          ? 'bg-emerald-100 text-emerald-700'
                          : viewing.outcomeType === 'negative'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {viewing.outcome}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
