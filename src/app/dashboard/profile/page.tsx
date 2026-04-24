"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Pencil,
  MapPin,
  Calendar,
  Star,
  Clock,
  MessageCircle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Mail,
  Phone,
  CreditCard,
  Wallet,
  Share2,
  ExternalLink,
  Plus,
  X,
  Users,
  Award,
  TrendingUp,
  Save,
} from "lucide-react";

const socialPlatforms = [
  { id: 'whatsapp', name: 'WhatsApp', placeholder: 'https://wa.me/234...', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  { id: 'telegram', name: 'Telegram', placeholder: 'https://t.me/yourhandle', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
  { id: 'instagram', name: 'Instagram', placeholder: 'https://instagram.com/yourhandle', color: 'text-emerald-600', bg: 'bg-pink-50', border: 'border-pink-200' },
  { id: 'twitter', name: 'Twitter / X', placeholder: 'https://x.com/yourhandle', color: 'text-gray-800', bg: 'bg-gray-50', border: 'border-gray-200' },
  { id: 'facebook', name: 'Facebook', placeholder: 'https://facebook.com/yourpage', color: 'text-emerald-600', bg: 'bg-blue-50', border: 'border-blue-200' },
];

const skills = [
  "Web Design",
  "Graphic Design",
  "WordPress",
  "React",
  "Python",
  "Data Analysis",
  "Social Media",
  "SEO",
];

const verificationTiers = [
  {
    label: "Email",
    icon: Mail,
    verified: true,
    description: "Email address verified",
  },
  {
    label: "Phone",
    icon: Phone,
    verified: true,
    description: "Phone number verified",
  },
  {
    label: "Government ID",
    icon: ShieldCheck,
    verified: false,
    description: "Upload a valid government-issued ID",
  },
  {
    label: "Bank Account",
    icon: Wallet,
    verified: false,
    description: "Connect and verify your bank account",
  },
];

const profileStats = [
  {
    label: "Tasks Completed",
    value: "24",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Rating",
    value: "4.8/5.0",
    icon: Star,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    label: "Response Time",
    value: "< 1 hr",
    icon: Clock,
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    label: "Reviews",
    value: "18",
    icon: MessageCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [isPublic, setIsPublic] = useState(true);
  const [editableSkills, setEditableSkills] = useState(skills);
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({
    whatsapp: '',
    telegram: '',
    instagram: '',
    twitter: '',
    facebook: '',
  });
  const [editingSocial, setEditingSocial] = useState<string | null>(null);

  const saveSocialLink = (id: string) => {
    setEditingSocial(null);
    toast.success(`${socialPlatforms.find(p => p.id === id)?.name} link saved!`);
  };
  const [newSkill, setNewSkill] = useState("");
  const [isEditingSkills, setIsEditingSkills] = useState(false);

  const addSkill = () => {
    if (newSkill.trim() && !editableSkills.includes(newSkill.trim())) {
      setEditableSkills([...editableSkills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setEditableSkills(editableSkills.filter((s) => s !== skill));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-emerald-600" />
            My Profile
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your public profile and verification
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1.5 text-sm">
            <Share2 className="h-4 w-4" />
            Share Profile
          </Button>
          <Button className="gap-1.5 text-sm">
            <Pencil className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Profile Header Card */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400" />
        <CardContent className="p-6 -mt-12 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold">
                  {user?.username || "User"}
                </h2>
                {user?.isVerified && (
                  <Badge className="bg-emerald-100 text-emerald-700 text-xs gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                Creative professional specializing in web design, graphic design,
                and digital marketing. I love bringing ideas to life!
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  Lagos, Nigeria
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Member since June 2024
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-amber-500" />
                  4.8 (18 reviews)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {profileStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <div
                  className={`h-10 w-10 rounded-full ${stat.bg} flex items-center justify-center mx-auto mb-2`}
                >
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Tags */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-500" />
              Skills
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8"
              onClick={() => setIsEditingSkills(!isEditingSkills)}
            >
              <Pencil className="h-3 w-3 mr-1" />
              {isEditingSkills ? "Done" : "Edit"}
            </Button>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex flex-wrap gap-2">
              {editableSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="px-3 py-1.5 text-sm font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                >
                  {skill}
                  {isEditingSkills && (
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-1.5 hover:text-rose-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
              {isEditingSkills && (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                    placeholder="Add skill..."
                    className="h-7 w-24 text-xs border rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={addSkill}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Verification */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-3">
              {verificationTiers.map((tier) => {
                const Icon = tier.icon;
                return (
                  <div
                    key={tier.label}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                  >
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        tier.verified
                          ? "bg-emerald-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          tier.verified
                            ? "text-emerald-600"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{tier.label}</p>
                        {tier.verified ? (
                          <Badge
                            variant="secondary"
                            className="text-[10px] bg-emerald-100 text-emerald-700"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-0.5" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="text-[10px] bg-gray-100 text-gray-600"
                          >
                            <XCircle className="h-3 w-3 mr-0.5" />
                            Not Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {tier.description}
                      </p>
                    </div>
                    {!tier.verified && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8 shrink-0"
                      >
                        Verify
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Social Links Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Share2 className="h-4 w-4 text-emerald-500" />
            Social Links
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          {socialPlatforms.map((platform) => (
            <div key={platform.id} className="flex items-center gap-3">
              <div className={`h-9 w-9 rounded-lg ${platform.bg} flex items-center justify-center shrink-0`}>
                <span className={`text-xs font-bold ${platform.color}`}>{platform.name.slice(0, 2).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{platform.name}</p>
                {editingSocial === platform.id ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="url"
                      placeholder={platform.placeholder}
                      value={socialLinks[platform.id]}
                      onChange={(e) => setSocialLinks(prev => ({ ...prev, [platform.id]: e.target.value }))}
                      className="h-8 w-full text-xs border rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-primary"
                      autoFocus
                    />
                    <Button size="sm" className="h-8 px-2 text-xs gap-1" onClick={() => saveSocialLink(platform.id)}>
                      <Save className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {socialLinks[platform.id] || 'Not connected'}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8 shrink-0"
                onClick={() => setEditingSocial(editingSocial === platform.id ? null : platform.id)}
              >
                <Pencil className="h-3 w-3 mr-1" />
                {editingSocial === platform.id ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          ))}

          {/* Social Preview */}
          <div className="flex items-center gap-2 pt-3 border-t mt-3">
            <span className="text-xs text-muted-foreground">Preview:</span>
            <div className="flex items-center gap-1.5">
              {socialPlatforms.map((platform) => (
                <div
                  key={platform.id}
                  className={`h-8 w-8 rounded-lg border flex items-center justify-center transition-colors ${socialLinks[platform.id] ? `${platform.bg} ${platform.border} cursor-pointer hover:opacity-80` : 'bg-muted border-muted-foreground/20 opacity-40'}`}
                  title={socialLinks[platform.id] ? platform.name : `${platform.name} - not connected`}
                >
                  <span className={`text-[10px] font-bold ${socialLinks[platform.id] ? platform.color : 'text-muted-foreground'}`}>
                    {platform.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Public Profile Toggle */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Public Profile</h3>
                <Badge
                  variant="secondary"
                  className={`text-[10px] ${isPublic ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}
                >
                  {isPublic ? "Visible" : "Hidden"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isPublic
                  ? "Your profile is visible to other users on the marketplace."
                  : "Your profile is hidden from other users."}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
              {isPublic && (
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Preview
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
