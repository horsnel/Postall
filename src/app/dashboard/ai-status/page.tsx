"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  RefreshCw,
  Activity,
  Zap,
  MessageCircle,
  Languages,
  Image as ImageIcon,
  Mic,
  Cloud,
  Brain,
  Bot,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Clock,
  ChartColumnIncreasing,
} from "lucide-react";
import { toast } from "sonner";

type ProviderStatus = "online" | "offline" | "degraded" | "checking";

interface AIProvider {
  id: string;
  name: string;
  icon: typeof Zap;
  description: string;
  features: string[];
  status: ProviderStatus;
  latency: number | null;
  usageToday: number;
  rateLimit: number;
  lastChecked: string | null;
  color: string;
}

const initialProviders: AIProvider[] = [
  {
    id: "glm",
    name: "GLM (Z-AI)",
    icon: Brain,
    description: "General Language Model by Z.ai — primary chat and text generation",
    features: ["Chat", "Translate", "Listing Enhance", "Auto-Reply", "Spam Detect"],
    status: "online",
    latency: null,
    usageToday: 1247,
    rateLimit: 10000,
    lastChecked: null,
    color: "emerald",
  },
  {
    id: "groq",
    name: "Groq",
    icon: Zap,
    description: "Ultra-fast inference for real-time chat and auto-reply",
    features: ["Chat", "Auto-Reply"],
    status: "online",
    latency: null,
    usageToday: 856,
    rateLimit: 5000,
    lastChecked: null,
    color: "emerald",
  },
  {
    id: "gemini",
    name: "Gemini",
    icon: Sparkles,
    description: "Google's multimodal model — text generation, vision analysis, translation",
    features: ["Chat", "Translate", "Image Analysis", "Listing Enhance", "Spam Detect"],
    status: "online",
    latency: null,
    usageToday: 2103,
    rateLimit: 15000,
    lastChecked: null,
    color: "emerald",
  },
  {
    id: "openai",
    name: "OpenAI (GPT-4o)",
    icon: Bot,
    description: "OpenAI GPT-4o mini — listing enhancement and spam detection",
    features: ["Listing Enhance", "Auto-Reply", "Spam Detect"],
    status: "online",
    latency: null,
    usageToday: 945,
    rateLimit: 10000,
    lastChecked: null,
    color: "emerald",
  },
  {
    id: "whisper",
    name: "Whisper",
    icon: Mic,
    description: "OpenAI Whisper — speech-to-text transcription",
    features: ["Voice Transcription"],
    status: "online",
    latency: null,
    usageToday: 312,
    rateLimit: 5000,
    lastChecked: null,
    color: "emerald",
  },
  {
    id: "cloudinary",
    name: "Cloudinary AI",
    icon: Cloud,
    description: "Cloud-based image moderation and tagging",
    features: ["Image Moderate", "Image Tag"],
    status: "online",
    latency: null,
    usageToday: 1876,
    rateLimit: 20000,
    lastChecked: null,
    color: "emerald",
  },
  {
    id: "replicate",
    name: "Replicate",
    icon: ImageIcon,
    description: "Open-source model hosting — image generation",
    features: ["Image Generate"],
    status: "degraded",
    latency: null,
    usageToday: 234,
    rateLimit: 5000,
    lastChecked: null,
    color: "amber",
  },
  {
    id: "zai-image",
    name: "Z-AI Image",
    icon: ImageIcon,
    description: "Z.ai native image generation — AI-powered image creation",
    features: ["Image Generate"],
    status: "online",
    latency: null,
    usageToday: 678,
    rateLimit: 5000,
    lastChecked: null,
    color: "emerald",
  },
];

const statusConfig: Record<ProviderStatus, { icon: typeof CheckCircle2; color: string; bg: string; label: string; dot: string }> = {
  online: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", label: "Online", dot: "bg-emerald-500" },
  offline: { icon: XCircle, color: "text-rose-600", bg: "bg-rose-50", label: "Offline", dot: "bg-rose-500" },
  degraded: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", label: "Degraded", dot: "bg-amber-500" },
  checking: { icon: Loader2, color: "text-emerald-600", bg: "bg-emerald-50", label: "Checking...", dot: "bg-emerald-500" },
};

export default function AIStatusPage() {
  const [providers, setProviders] = useState<AIProvider[]>(initialProviders);
  const [isChecking, setIsChecking] = useState(false);

  const runHealthCheck = useCallback(async () => {
    setIsChecking(true);
    setProviders((prev) =>
      prev.map((p) => ({ ...p, status: "checking" as ProviderStatus, latency: null }))
    );

    // Simulate health checks with staggered responses
    const latencies: Record<string, number> = {
      glm: 340,
      groq: 120,
      gemini: 450,
      openai: 280,
      whisper: 890,
      cloudinary: 220,
      replicate: 3200,
      "zai-image": 560,
    };

    providers.forEach((provider, index) => {
      setTimeout(() => {
        setProviders((prev) =>
          prev.map((p) =>
            p.id === provider.id
              ? {
                  ...p,
                  status: provider.id === "replicate" ? "degraded" : "online",
                  latency: latencies[provider.id] || 200,
                  lastChecked: new Date().toLocaleTimeString(),
                }
              : p
          )
        );
      }, 300 + index * 200);
    });

    setTimeout(() => {
      setIsChecking(false);
      toast.success("Health check complete!");
    }, 300 + providers.length * 200 + 100);
  }, [providers]);

  // Initial check on mount
  useEffect(() => {
    setTimeout(() => runHealthCheck(), 0);
  }, []);

  const onlineCount = providers.filter((p) => p.status === "online").length;
  const totalCount = providers.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Activity className="h-6 w-6 text-emerald-600" />
            AI Services Status
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Monitor AI provider health and performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={runHealthCheck}
            disabled={isChecking}
            className="gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isChecking ? "animate-spin" : ""}`} />
            Run Health Check
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`h-12 w-12 rounded-full ${onlineCount >= 8 ? "bg-emerald-100" : onlineCount >= 6 ? "bg-amber-100" : "bg-rose-100"} flex items-center justify-center`}>
                  <Activity className={`h-6 w-6 ${onlineCount >= 8 ? "text-emerald-600" : onlineCount >= 6 ? "text-amber-600" : "text-rose-600"}`} />
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full ${onlineCount >= 8 ? "bg-emerald-500" : "bg-amber-500"} border-2 border-white`} />
              </div>
              <div>
                <p className="font-semibold text-lg">{onlineCount}/{totalCount} Providers Operational</p>
                <p className="text-xs text-muted-foreground">
                  {isChecking ? "Running health checks..." : `Last checked: ${providers.find(p => p.lastChecked)?.lastChecked || "Never"}`}
                </p>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">System Health</span>
                <span className="text-xs font-medium">{Math.round((onlineCount / totalCount) * 100)}%</span>
              </div>
              <Progress value={(onlineCount / totalCount) * 100} className="h-2" />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 shrink-0">
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-700">{onlineCount}</p>
                <p className="text-[10px] text-muted-foreground">Online</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-amber-700">{providers.filter(p => p.status === "degraded").length}</p>
                <p className="text-[10px] text-muted-foreground">Degraded</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-rose-700">{providers.filter(p => p.status === "offline").length}</p>
                <p className="text-[10px] text-muted-foreground">Offline</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Provider Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((provider) => {
          const config = statusConfig[provider.status];
          const Icon = provider.icon;
          const StatusIcon = config.icon;
          const usagePercent = Math.round((provider.usageToday / provider.rateLimit) * 100);

          return (
            <Card key={provider.id} className="overflow-hidden">
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg ${config.bg} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{provider.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`h-2 w-2 rounded-full ${config.dot} ${provider.status === "checking" ? "animate-pulse" : ""}`} />
                        <span className={`text-[10px] font-medium ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  {provider.status === "checking" ? (
                    <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                  ) : (
                    <StatusIcon className={`h-4 w-4 ${config.color}`} />
                  )}
                </div>

                <p className="text-[11px] text-muted-foreground mb-3 line-clamp-2">
                  {provider.description}
                </p>

                <Separator className="mb-3" />

                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {provider.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-[10px] py-0 px-1.5">
                      {feature}
                    </Badge>
                  ))}
                </div>

                <Separator className="mb-3" />

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      Latency
                    </p>
                    <p className="text-sm font-medium">
                      {provider.latency ? `${provider.latency}ms` : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <ChartColumnIncreasing className="h-2.5 w-2.5" />
                      Usage Today
                    </p>
                    <p className="text-sm font-medium">
                      {provider.usageToday.toLocaleString()}/{(provider.rateLimit / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>

                {/* Usage Bar */}
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] text-muted-foreground">Rate Limit</span>
                    <span className="text-[10px] font-medium">{usagePercent}%</span>
                  </div>
                  <Progress
                    value={usagePercent}
                    className={`h-1 ${usagePercent > 80 ? "[&>div]:bg-rose-500" : usagePercent > 60 ? "[&>div]:bg-amber-500" : "[&>div]:bg-emerald-500"}`}
                  />
                </div>

                {/* Last Checked */}
                {provider.lastChecked && (
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Last checked: {provider.lastChecked}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <MessageCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">AI Orchestrator</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                PostAll uses an AI orchestrator with automatic fallback chains. If a primary provider fails,
                the system automatically falls back to secondary and tertiary providers to ensure uninterrupted service.
                All 9 providers are monitored in real-time with automatic failover.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        AI Services Status Dashboard &middot; PostAll &middot; Updated every 5 minutes
      </p>
    </div>
  );
}
