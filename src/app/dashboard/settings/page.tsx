"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Phone,
  Mail,
  User,
  Trash2,
  Bell,
  MessageCircle,
  Smartphone,
  Shield,
  Globe,
  Eye,
  Lock,
  Monitor,
  Building2,
  Smartphone as MobileMoneyIcon,
  CreditCard,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Pencil,
  Save,
  Share2,
  Link2,
  ArrowLeft,
} from "lucide-react";

const activeSessions = [
  {
    id: "s1",
    device: "Chrome on Windows",
    location: "Lagos, Nigeria",
    lastActive: "Active now",
    isCurrent: true,
  },
  {
    id: "s2",
    device: "Safari on iPhone 15",
    location: "Lagos, Nigeria",
    lastActive: "2 hours ago",
    isCurrent: false,
  },
];

const loginHistory = [
  { date: "Dec 16, 2024", device: "Chrome on Windows", location: "Lagos, Nigeria", status: "success" },
  { date: "Dec 15, 2024", device: "Safari on iPhone", location: "Lagos, Nigeria", status: "success" },
  { date: "Dec 14, 2024", device: "Firefox on Mac", location: "Lagos, Nigeria", status: "failed" },
  { date: "Dec 13, 2024", device: "Chrome on Windows", location: "Lagos, Nigeria", status: "success" },
];

const bankAccounts = [
  { id: "b1", bank: "GTBank", account: "****4523", name: "John Doe", isDefault: true },
  { id: "b2", bank: "Access Bank", account: "****7891", name: "John Doe", isDefault: false },
];

const mobileMoneyAccounts = [
  { id: "mm1", provider: "MTN Mobile Money", number: "080***1234", name: "John Doe" },
  { id: "mm2", provider: "Vodafone Cash", number: "020***5678", name: "John Doe" },
];

export default function SettingsPage() {
  const [whatsappNotif, setWhatsappNotif] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [profileVisible, setProfileVisible] = useState(true);
  const [searchIndex, setSearchIndex] = useState(true);
  const [showSocialOnProfile, setShowSocialOnProfile] = useState(true);
  const [allowWhatsAppContact, setAllowWhatsAppContact] = useState(true);
  const [connectedAccounts, setConnectedAccounts] = useState<Record<string, string>>({
    whatsapp: '',
    telegram: '',
    instagram: '',
    twitter: '',
    facebook: '',
  });
  const [editingAccount, setEditingAccount] = useState<string | null>(null);

  const socialPlatforms = [
    { id: 'whatsapp', name: 'WhatsApp', placeholder: 'https://wa.me/234...', color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'telegram', name: 'Telegram', placeholder: 'https://t.me/yourhandle', color: 'text-emerald-600', bg: 'bg-blue-50' },
    { id: 'instagram', name: 'Instagram', placeholder: 'https://instagram.com/yourhandle', color: 'text-pink-600', bg: 'bg-pink-50' },
    { id: 'twitter', name: 'Twitter / X', placeholder: 'https://x.com/yourhandle', color: 'text-gray-800', bg: 'bg-gray-50' },
    { id: 'facebook', name: 'Facebook', placeholder: 'https://facebook.com/yourpage', color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const saveAccount = (id: string) => {
    setEditingAccount(null);
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="p-2 -ml-2 rounded-lg hover:bg-[#F3F4F6] transition-colors text-[#6B7280] hover:text-[#374151]"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Lock className="h-6 w-6 text-emerald-600" />
            Settings
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your account preferences and security
          </p>
        </div>
      </div>

      {/* Account Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <User className="h-4 w-4 text-emerald-500" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-0 divide-y">
          <div className="flex items-center justify-between py-3 first:pt-0">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                <Phone className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Change Phone Number</p>
                <p className="text-xs text-muted-foreground">
                  Current: +234 801 *** **89
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-xs gap-1 h-8">
              Change <ChevronRight className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Add Backup Email</p>
                <p className="text-xs text-muted-foreground">
                  No backup email set
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-xs gap-1 h-8">
              Add <ChevronRight className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Change Username</p>
                <p className="text-xs text-muted-foreground">
                  Current: johndoe
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-xs gap-1 h-8">
              Change <ChevronRight className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-rose-100 flex items-center justify-center">
                <Trash2 className="h-4 w-4 text-rose-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-rose-600">
                  Delete Account
                </p>
                <p className="text-xs text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 border-rose-200 text-rose-600 hover:bg-rose-50"
                >
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-rose-600" />
                    Delete Account?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account, all your tasks, listings, messages, and remove
                    your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-rose-600 hover:bg-rose-700 text-white">
                    Yes, Delete My Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4 text-emerald-500" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-0 divide-y">
          <div className="flex items-center justify-between py-3 first:pt-0">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">WhatsApp Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Receive updates via WhatsApp
                </p>
              </div>
            </div>
            <Switch checked={whatsappNotif} onCheckedChange={setWhatsappNotif} />
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Email Frequency</p>
                <p className="text-xs text-muted-foreground">
                  How often to receive email updates
                </p>
              </div>
            </div>
            <Select defaultValue="instant">
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instant">Instant</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Digest</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                <Bell className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Push Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Browser push notifications
                </p>
              </div>
            </div>
            <Switch checked={pushNotif} onCheckedChange={setPushNotif} />
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">SMS Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Receive alerts via SMS
                </p>
              </div>
            </div>
            <Switch checked={smsNotif} onCheckedChange={setSmsNotif} />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-500" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-4">
          {/* Active Sessions */}
          <div>
            <h3 className="text-sm font-medium mb-2">Active Sessions</h3>
            <div className="space-y-2">
              {activeSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium flex items-center gap-2">
                        {session.device}
                        {session.isCurrent && (
                          <Badge
                            variant="secondary"
                            className="text-[9px] bg-emerald-100 text-emerald-700 py-0 px-1.5"
                          >
                            This device
                          </Badge>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.location} · {session.lastActive}
                      </p>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 text-rose-600 border-rose-200 hover:bg-rose-50"
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Login History */}
          <div>
            <h3 className="text-sm font-medium mb-2">Login History</h3>
            <div className="space-y-2">
              {loginHistory.map((entry, i) => (
                <div key={i} className="flex items-center gap-3 text-sm py-1.5">
                  <CheckCircle2
                    className={`h-4 w-4 shrink-0 ${
                      entry.status === "success"
                        ? "text-emerald-500"
                        : "text-rose-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">{entry.device}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {entry.location}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[11px] text-muted-foreground">
                      {entry.date}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`text-[9px] ${
                        entry.status === "success"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {entry.status === "success" ? "Success" : "Failed"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-emerald-500" />
            Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-0 divide-y">
          <div className="flex items-center justify-between py-3 first:pt-0">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                <Globe className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Default Currency</p>
                <p className="text-xs text-muted-foreground">
                  Used for all transactions
                </p>
              </div>
            </div>
            <Select defaultValue="ngn" disabled>
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ngn">NGN (₦)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bank Accounts */}
          <div className="py-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                Bank Accounts
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 gap-1"
              >
                <Plus className="h-3 w-3" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {bankAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg border"
                >
                  <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium">{acc.bank}</p>
                      {acc.isDefault && (
                        <Badge
                          variant="secondary"
                          className="text-[9px] bg-emerald-100 text-emerald-700 py-0 px-1.5"
                        >
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {acc.account} · {acc.name}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7"
                  >
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Money */}
          <div className="py-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <MobileMoneyIcon className="h-4 w-4 text-muted-foreground" />
                Mobile Money
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 gap-1"
              >
                <Plus className="h-3 w-3" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {mobileMoneyAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg border"
                >
                  <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                    <MobileMoneyIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">{acc.provider}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {acc.number} · {acc.name}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7"
                  >
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Link2 className="h-4 w-4 text-emerald-500" />
            Connected Accounts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-0 divide-y">
          {socialPlatforms.map((platform) => (
            <div key={platform.id} className="flex items-center justify-between py-3 first:pt-0">
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-lg ${platform.bg} flex items-center justify-center`}>
                  <span className={`text-xs font-bold ${platform.color}`}>{platform.name.slice(0, 2).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{platform.name}</p>
                  {editingAccount === platform.id ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="url"
                        placeholder={platform.placeholder}
                        value={connectedAccounts[platform.id]}
                        onChange={(e) => setConnectedAccounts(prev => ({ ...prev, [platform.id]: e.target.value }))}
                        className="h-8 w-full max-w-[250px] text-xs border rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-primary"
                        autoFocus
                      />
                      <Button size="sm" className="h-8 px-2 text-xs gap-1" onClick={() => saveAccount(platform.id)}>
                        <Save className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {connectedAccounts[platform.id] ? `Connected: ${connectedAccounts[platform.id]}` : 'Not connected'}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8 shrink-0"
                onClick={() => setEditingAccount(editingAccount === platform.id ? null : platform.id)}
              >
                <Pencil className="h-3 w-3 mr-1" />
                {editingAccount === platform.id ? 'Cancel' : connectedAccounts[platform.id] ? 'Edit' : 'Connect'}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Social Privacy Toggles */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Share2 className="h-4 w-4 text-emerald-500" />
            Social & Contact Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-0 divide-y">
          <div className="flex items-center justify-between py-3 first:pt-0">
            <div>
              <p className="text-sm font-medium">Show social links on my public profile</p>
              <p className="text-xs text-muted-foreground">
                Display connected social media links on your store and profile pages
              </p>
            </div>
            <Switch checked={showSocialOnProfile} onCheckedChange={setShowSocialOnProfile} />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium">Allow buyers to contact me via WhatsApp</p>
              <p className="text-xs text-muted-foreground">
                Show a WhatsApp button on your product listings for quick contact
              </p>
            </div>
            <Switch checked={allowWhatsAppContact} onCheckedChange={setAllowWhatsAppContact} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Privacy */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Eye className="h-4 w-4 text-emerald-500" />
              Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-0 divide-y">
            <div className="flex items-center justify-between py-3 first:pt-0">
              <div>
                <p className="text-sm font-medium">Profile Visibility</p>
                <p className="text-xs text-muted-foreground">
                  Make your profile visible to other users
                </p>
              </div>
              <Switch
                checked={profileVisible}
                onCheckedChange={setProfileVisible}
              />
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">Search Indexing</p>
                <p className="text-xs text-muted-foreground">
                  Allow search engines to index your profile
                </p>
              </div>
              <Switch checked={searchIndex} onCheckedChange={setSearchIndex} />
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-500" />
              Language
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Display Language</Label>
              <Select defaultValue="en">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                  <SelectItem value="sw">Swahili</SelectItem>
                  <SelectItem value="ha">Hausa</SelectItem>
                  <SelectItem value="yo">Yoruba</SelectItem>
                  <SelectItem value="ig">Igbo</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose the language for the interface and communications
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
