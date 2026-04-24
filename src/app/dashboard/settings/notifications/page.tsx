'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthStore } from '@/lib/auth-store';
import {
  Bell,
  CheckCircle2,
  MessageCircle,
  Wallet,
  Lock,
  Star,
  ShoppingCart,
  TrendingDown,
  Sparkles,
  Users,
  Shield,
  Mail,
  Smartphone,
  Monitor,
  Clock,
  Save,
  Moon,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

interface ChannelState {
  inApp: boolean;
  email: boolean;
  push: boolean;
  sms: boolean;
}

interface CategoryState {
  taskApplications: boolean;
  workerPicked: boolean;
  newMessages: boolean;
  paymentReceived: boolean;
  escrowUpdates: boolean;
  reviewReceived: boolean;
  listingSold: boolean;
  priceDrop: boolean;
  promotions: boolean;
  community: boolean;
  security: boolean;
  weeklyDigest: boolean;
}

const notificationChannels: {
  key: keyof ChannelState;
  label: string;
  description: string;
  icon: typeof Bell;
  defaultOn: boolean;
}[] = [
  { key: 'inApp', label: 'In-App Notifications', description: 'Notifications within the PostAll app', icon: Monitor, defaultOn: true },
  { key: 'email', label: 'Email Notifications', description: 'Receive alerts in your email inbox', icon: Mail, defaultOn: true },
  { key: 'push', label: 'Push Notifications', description: 'Browser and mobile push notifications', icon: Bell, defaultOn: false },
  { key: 'sms', label: 'SMS Notifications', description: 'Text message alerts to your phone', icon: Smartphone, defaultOn: false },
];

const notificationCategories: {
  key: keyof CategoryState;
  label: string;
  description: string;
  icon: typeof Bell;
  defaultOn: boolean;
}[] = [
  { key: 'taskApplications', label: 'Task Interest & Applications', description: 'When someone applies to your task', icon: Bell, defaultOn: true },
  { key: 'workerPicked', label: 'Worker Picked / Selected', description: 'When you\'re picked for a task', icon: CheckCircle2, defaultOn: true },
  { key: 'newMessages', label: 'New Messages', description: 'Chat and message notifications', icon: MessageCircle, defaultOn: true },
  { key: 'paymentReceived', label: 'Payment Received', description: 'Money credited to your wallet', icon: Wallet, defaultOn: true },
  { key: 'escrowUpdates', label: 'Escrow Updates', description: 'Escrow funded or released', icon: Lock, defaultOn: true },
  { key: 'reviewReceived', label: 'Review Received', description: 'New ratings and reviews', icon: Star, defaultOn: true },
  { key: 'listingSold', label: 'Listing Sold', description: 'Your item has been purchased', icon: ShoppingCart, defaultOn: true },
  { key: 'priceDrop', label: 'Price Drop Alerts', description: 'Saved item price changed', icon: TrendingDown, defaultOn: false },
  { key: 'promotions', label: 'Promotions & Deals', description: 'Marketing and Deals page offers', icon: Sparkles, defaultOn: false },
  { key: 'community', label: 'Community Updates', description: 'Forum posts, events, and activities', icon: Users, defaultOn: false },
  { key: 'security', label: 'Security Alerts', description: 'Login attempts, password changes', icon: Shield, defaultOn: true },
  { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Summary email every Monday', icon: Mail, defaultOn: true },
];

export default function NotificationPreferencesPage() {
  const user = useAuthStore((s) => s.user);

  // Notification channels
  const [channels, setChannels] = useState<ChannelState>({
    inApp: true,
    email: true,
    push: false,
    sms: false,
  });

  // Notification categories
  const [categories, setCategories] = useState<CategoryState>({
    taskApplications: true,
    workerPicked: true,
    newMessages: true,
    paymentReceived: true,
    escrowUpdates: true,
    reviewReceived: true,
    listingSold: true,
    priceDrop: false,
    promotions: false,
    community: false,
    security: true,
    weeklyDigest: true,
  });

  // Quiet hours
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietStart, setQuietStart] = useState('22:00');
  const [quietEnd, setQuietEnd] = useState('08:00');
  const [urgentOnly, setUrgentOnly] = useState(true);

  // Frequency limits
  const [maxPerHour, setMaxPerHour] = useState('20');
  const [batchMode, setBatchMode] = useState('off');

  const [isSaving, setIsSaving] = useState(false);

  const toggleChannel = (key: keyof ChannelState) => {
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCategory = (key: keyof CategoryState) => {
    setCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const formatTime = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Notification preferences saved', {
        description: `Settings updated for ${user?.username || 'your account'}`,
      });
    }, 800);
  };

  const enabledCount = Object.values(categories).filter(Boolean).length;
  const totalCategories = Object.keys(categories).length;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Bell className="h-6 w-6 text-emerald-600" />
          Notification Preferences
        </h1>
        <p className="text-muted-foreground mt-1">
          Control which notifications you receive and how they are delivered
        </p>
      </div>

      {/* Active summary badge */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
          {enabledCount}/{totalCategories} categories enabled
        </Badge>
        <Badge variant="secondary" className="bg-cyan-100 text-cyan-700">
          {Object.values(channels).filter(Boolean).length}/4 channels active
        </Badge>
      </div>

      {/* Notification Channels */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-600" />
            Notification Channels
          </CardTitle>
          <CardDescription>
            Choose where you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-0 divide-y">
          {notificationChannels.map((channel) => {
            const Icon = channel.icon;
            const isActive = channels[channel.key];
            return (
              <div key={channel.key} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-emerald-100' : 'bg-muted'
                  }`}>
                    <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-600' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{channel.label}</p>
                    <p className="text-xs text-muted-foreground">{channel.description}</p>
                  </div>
                </div>
                <Switch
                  checked={isActive}
                  onCheckedChange={() => toggleChannel(channel.key)}
                  aria-label={channel.label}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Notification Categories */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Bell className="h-4 w-4 text-emerald-600" />
                Notification Categories
              </CardTitle>
              <CardDescription>
                Granular control over what notifications you receive
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8"
              onClick={() => {
                const allEnabled = Object.values(categories).every(Boolean);
                const newState = { ...categories } as CategoryState;
                (Object.keys(newState) as (keyof CategoryState)[]).forEach((key) => {
                  newState[key] = !allEnabled;
                });
                setCategories({ ...categories, ...newState });
              }}
            >
              {enabledCount === totalCategories ? 'Disable All' : 'Enable All'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            {notificationCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = categories[cat.key];
              return (
                <div
                  key={cat.key}
                  className={`flex items-center justify-between py-3 border-b last:border-b-0 transition-colors ${
                    cat.key === notificationCategories[notificationCategories.length - 1]?.key ? '' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-emerald-100' : 'bg-muted'
                    }`}>
                      <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-600' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{cat.label}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{cat.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={isActive}
                    onCheckedChange={() => toggleCategory(cat.key)}
                    className="shrink-0 ml-2"
                    aria-label={cat.label}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Moon className="h-4 w-4 text-emerald-600" />
            Quiet Hours
          </CardTitle>
          <CardDescription>
            Silence non-urgent notifications during specific hours
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Enable Quiet Hours</p>
              <p className="text-xs text-muted-foreground">
                Mute all non-urgent notifications
              </p>
            </div>
            <Switch
              checked={quietHoursEnabled}
              onCheckedChange={setQuietHoursEnabled}
              aria-label="Enable quiet hours"
            />
          </div>

          {quietHoursEnabled && (
            <div className="space-y-4 pl-0 pt-2 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    Start Time
                  </Label>
                  <Input
                    type="time"
                    value={quietStart}
                    onChange={(e) => setQuietStart(e.target.value)}
                    className="h-9"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Currently: {formatTime(quietStart)}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    End Time
                  </Label>
                  <Input
                    type="time"
                    value={quietEnd}
                    onChange={(e) => setQuietEnd(e.target.value)}
                    className="h-9"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Currently: {formatTime(quietEnd)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border p-3 bg-amber-50/50 border-amber-200">
                <Checkbox
                  id="urgent-only"
                  checked={urgentOnly}
                  onCheckedChange={(checked) => setUrgentOnly(checked === true)}
                />
                <div className="grid gap-0.5 leading-none">
                  <Label
                    htmlFor="urgent-only"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Only allow urgent notifications
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    Security alerts and escrow updates will still come through
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                Security and payment notifications are never silenced
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Frequency Limits */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-600" />
            Frequency Limits
          </CardTitle>
          <CardDescription>
            Control how often you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Max Notifications Per Hour</p>
              <p className="text-xs text-muted-foreground">
                Limit the number of notifications per hour
              </p>
            </div>
            <Select value={maxPerHour} onValueChange={setMaxPerHour}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per hour</SelectItem>
                <SelectItem value="10">10 per hour</SelectItem>
                <SelectItem value="20">20 per hour</SelectItem>
                <SelectItem value="50">50 per hour</SelectItem>
                <SelectItem value="unlimited">Unlimited</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Batch Notifications</p>
              <p className="text-xs text-muted-foreground">
                Group notifications into digest batches
              </p>
            </div>
            <Select value={batchMode} onValueChange={setBatchMode}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="off">Off (Instant)</SelectItem>
                <SelectItem value="15min">Every 15 minutes</SelectItem>
                <SelectItem value="30min">Every 30 minutes</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {batchMode !== 'off' && (
            <div className="rounded-lg border p-3 bg-emerald-50/50 border-emerald-200">
              <p className="text-xs text-emerald-700 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" />
                Notifications will be grouped and delivered every{' '}
                {batchMode === '15min' ? '15 minutes' : batchMode === '30min' ? '30 minutes' : 'hour'}. 
                Security alerts are always delivered instantly.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-muted-foreground">
          Changes are saved to your account settings
        </p>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700"
        >
          {isSaving ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
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
