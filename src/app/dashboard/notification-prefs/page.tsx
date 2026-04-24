'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Bell,
  Mail,
  Smartphone,
  Monitor,
  Clock,
  Moon,
  Zap,
  MessageCircle,
  CreditCard,
  CheckCircle2,
  Star,
  Lock,
  Tag,
  TrendingDown,
  Settings,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';

interface NotificationType {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  email: boolean;
  push: boolean;
}

const initialNotificationTypes: NotificationType[] = [
  { id: 'task_interest', label: 'Task Interest', description: 'When someone shows interest in your task', icon: Zap, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-100', email: true, push: true },
  { id: 'worker_picked', label: 'Worker Picked', description: 'When a worker accepts your task offer', icon: CheckCircle2, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-100', email: true, push: true },
  { id: 'payment_received', label: 'Payment Received', description: 'When you receive a payment', icon: CreditCard, iconColor: 'text-teal-600', iconBg: 'bg-teal-100', email: true, push: false },
  { id: 'new_message', label: 'New Message', description: 'When you receive a new message', icon: MessageCircle, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-100', email: false, push: true },
  { id: 'task_completed', label: 'Task Completed', description: 'When a task you posted is completed', icon: CheckCircle2, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-100', email: true, push: true },
  { id: 'review_received', label: 'Review Received', description: 'When you receive a new review', icon: Star, iconColor: 'text-amber-600', iconBg: 'bg-amber-100', email: true, push: false },
  { id: 'escrow_released', label: 'Escrow Released', description: 'When escrow funds are released', icon: Lock, iconColor: 'text-teal-600', iconBg: 'bg-teal-100', email: true, push: true },
  { id: 'listing_sold', label: 'Listing Sold', description: 'When your listing is sold', icon: Tag, iconColor: 'text-cyan-600', iconBg: 'bg-cyan-100', email: true, push: true },
  { id: 'price_drop', label: 'Price Drop', description: 'When a saved listing drops in price', icon: TrendingDown, iconColor: 'text-rose-600', iconBg: 'bg-rose-100', email: false, push: false },
];

export default function NotificationPreferencesPage() {
  const [notificationTypes, setNotificationTypes] = useState<NotificationType[]>(initialNotificationTypes);
  const [quietHours, setQuietHours] = useState(false);
  const [alertFrequency, setAlertFrequency] = useState('instant');
  const [isSaving, setIsSaving] = useState(false);

  const toggleEmail = (id: string) => {
    setNotificationTypes(prev =>
      prev.map(n => (n.id === id ? { ...n, email: !n.email } : n))
    );
  };

  const togglePush = (id: string) => {
    setNotificationTypes(prev =>
      prev.map(n => (n.id === id ? { ...n, push: !n.push } : n))
    );
  };

  const enableAllEmails = () => {
    setNotificationTypes(prev => prev.map(n => ({ ...n, email: true })));
  };

  const disableAllEmails = () => {
    setNotificationTypes(prev => prev.map(n => ({ ...n, email: false })));
  };

  const enableAllPush = () => {
    setNotificationTypes(prev => prev.map(n => ({ ...n, push: true })));
  };

  const disableAllPush = () => {
    setNotificationTypes(prev => prev.map(n => ({ ...n, push: false })));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Preferences saved', {
        description: 'Your notification preferences have been updated successfully.',
      });
    }, 1200);
  };

  const emailEnabledCount = notificationTypes.filter(n => n.email).length;
  const pushEnabledCount = notificationTypes.filter(n => n.push).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-emerald-600" />
          Notification Preferences
        </h1>
        <p className="text-muted-foreground mt-1">
          Choose how and when you want to be notified about activity on PostAll
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Bell className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">9</p>
                <p className="text-xs text-muted-foreground">Notification Types</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{emailEnabledCount}</p>
                <p className="text-xs text-muted-foreground">Email Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-violet-600">{pushEnabledCount}</p>
                <p className="text-xs text-muted-foreground">Push Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Moon className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{quietHours ? 'On' : 'Off'}</p>
                <p className="text-xs text-muted-foreground">Quiet Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Types Grid */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4 text-emerald-600" />
                Notification Channels
              </CardTitle>
              <CardDescription>
                In-App notifications are always on. Toggle Email and Push per type.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-xs gap-1.5 h-8" onClick={enableAllEmails}>
                <Mail className="h-3 w-3" />
                All Email On
              </Button>
              <Button variant="outline" size="sm" className="text-xs gap-1.5 h-8" onClick={disableAllEmails}>
                <Mail className="h-3 w-3" />
                All Email Off
              </Button>
              <Button variant="outline" size="sm" className="text-xs gap-1.5 h-8" onClick={enableAllPush}>
                <Smartphone className="h-3 w-3" />
                All Push On
              </Button>
              <Button variant="outline" size="sm" className="text-xs gap-1.5 h-8" onClick={disableAllPush}>
                <Smartphone className="h-3 w-3" />
                All Push Off
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {/* Channel Headers */}
          <div className="hidden sm:grid grid-cols-[1fr_80px_80px_80px] gap-4 px-4 pb-2 text-xs font-medium text-muted-foreground border-b mb-3">
            <span>Notification Type</span>
            <span className="text-center flex items-center justify-center gap-1">
              <Monitor className="h-3 w-3" /> In-App
            </span>
            <span className="text-center flex items-center justify-center gap-1">
              <Mail className="h-3 w-3" /> Email
            </span>
            <span className="text-center flex items-center justify-center gap-1">
              <Smartphone className="h-3 w-3" /> Push
            </span>
          </div>

          <div className="space-y-1">
            {notificationTypes.map((nt) => {
              const Icon = nt.icon;
              return (
                <div
                  key={nt.id}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_80px_80px_80px] gap-3 sm:gap-4 items-center rounded-lg px-4 py-3 hover:bg-muted/50 transition-colors"
                >
                  {/* Type Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-9 w-9 rounded-lg ${nt.iconBg} flex items-center justify-center shrink-0`}>
                      <Icon className={`h-4 w-4 ${nt.iconColor}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{nt.label}</p>
                      <p className="text-xs text-muted-foreground truncate hidden sm:block">{nt.description}</p>
                    </div>
                  </div>

                  {/* In-App - Always On */}
                  <div className="flex items-center justify-center">
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px] px-2 py-0.5">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      On
                    </Badge>
                  </div>

                  {/* Email Toggle */}
                  <div className="flex items-center justify-center">
                    <Switch
                      checked={nt.email}
                      onCheckedChange={() => toggleEmail(nt.id)}
                      aria-label={`${nt.label} email`}
                    />
                  </div>

                  {/* Push Toggle */}
                  <div className="flex items-center justify-center">
                    <Switch
                      checked={nt.push}
                      onCheckedChange={() => togglePush(nt.id)}
                      aria-label={`${nt.label} push`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Alert Frequency + Quiet Hours Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Alert Frequency */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-600" />
              Alert Frequency
            </CardTitle>
            <CardDescription>
              Choose how often you receive notification bundles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Delivery Speed</Label>
              <Select value={alertFrequency} onValueChange={setAlertFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instant">
                    <span className="flex items-center gap-2">
                      <Zap className="h-3.5 w-3.5 text-emerald-600" />
                      Instant — Notify immediately
                    </span>
                  </SelectItem>
                  <SelectItem value="hourly">
                    <span className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-blue-600" />
                      Hourly Digest — Every hour
                    </span>
                  </SelectItem>
                  <SelectItem value="daily">
                    <span className="flex items-center gap-2">
                      <Bell className="h-3.5 w-3.5 text-amber-600" />
                      Daily Digest — Once per day
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">
                <strong>Instant</strong> sends each notification right away.{' '}
                <strong>Hourly Digest</strong> bundles up to 1 hour.{' '}
                <strong>Daily Digest</strong> sends a summary at 9 AM WAT.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quiet Hours */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Moon className="h-4 w-4 text-amber-500" />
              Quiet Hours
            </CardTitle>
            <CardDescription>
              Silence non-urgent notifications during sleep hours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Enable Quiet Hours</p>
                <p className="text-xs text-muted-foreground">Mute notifications overnight</p>
              </div>
              <Switch
                checked={quietHours}
                onCheckedChange={setQuietHours}
              />
            </div>

            {quietHours && (
              <>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center">
                      <Moon className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">10:00 PM — 8:00 AM</p>
                      <p className="text-xs text-muted-foreground">10 hours of uninterrupted sleep</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                  <p className="text-xs text-amber-700 flex items-start gap-1.5">
                    <Moon className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    During quiet hours, only urgent notifications (payments, escrow) will come through.
                  </p>
                </div>
              </>
            )}

            {!quietHours && (
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">
                  When enabled, non-urgent notifications will be silenced from <strong>10 PM to 8 AM</strong>. Urgent alerts like payments and escrow will still come through.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Changes are saved locally in demo mode
        </p>
        <Button
          className="gap-2 bg-emerald-600 hover:bg-emerald-700"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Preferences
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
