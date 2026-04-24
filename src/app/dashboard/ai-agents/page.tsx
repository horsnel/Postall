// @ts-nocheck
"use client";

import { useState } from "react";
import { useAIAgents, type AgentLogEntry } from "@/lib/ai/agents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Bot,
  Sparkles,
  FileText,
  ShieldCheck,
  TrendingUp,
  Heart,
  MessageCircle,
  Eye,
  Globe,
  Activity,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronRight,
  Terminal,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  FileText,
  ShieldCheck,
  TrendingUp,
  Heart,
  MessageCircle,
  Eye,
  Globe,
};

const STATUS_COLORS = {
  active: "bg-emerald-500",
  idle: "bg-amber-400",
  error: "bg-rose-500",
};

const STATUS_LABEL_COLORS = {
  active: "bg-emerald-100 text-emerald-700",
  idle: "bg-amber-100 text-amber-700",
  error: "bg-rose-100 text-rose-700",
};

const LOG_TYPE_COLORS: Record<string, string> = {
  info: "text-blue-600",
  success: "text-emerald-600",
  warning: "text-amber-600",
  error: "text-rose-600",
};

const LOG_TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertTriangle,
};

function AgentLogsDialog({ agentId, logs }: { agentId: string; logs: AgentLogEntry[] }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <Terminal className="h-3 w-3" />
          View Logs
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Agent Logs
          </DialogTitle>
          <DialogDescription>
            Recent activity for agent: {agentId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-96 overflow-y-auto">
          <div className="space-y-2 pr-4">
            {logs.map((log) => {
              const LogIcon = LOG_TYPE_ICONS[log.type] || Info;
              return (
                <div
                  key={log.id}
                  className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/30 transition-colors"
                >
                  <LogIcon className={`h-4 w-4 shrink-0 mt-0.5 ${LOG_TYPE_COLORS[log.type]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{log.message}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {log.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
            {logs.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent activity
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function AgentCard({
  agent,
  onToggle,
}: {
  agent: ReturnType<typeof useAIAgents>["agents"][0];
  onToggle: (id: string) => void;
}) {
  const Icon = ICON_MAP[agent.icon] || Bot;
  const isActive = agent.status === "active" && agent.enabled;

  return (
    <Card
      className={`relative overflow-hidden transition-all ${
        isActive
          ? "border-emerald-200 shadow-sm shadow-emerald-100/50"
          : agent.status === "error"
            ? "border-rose-200"
            : "border-border"
      }`}
    >
      {/* Pulse indicator for active agents */}
      {isActive && (
        <div className="absolute top-3 left-3">
          <span className="flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                isActive
                  ? "bg-emerald-100 text-emerald-600"
                  : agent.status === "error"
                    ? "bg-rose-100 text-rose-600"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-sm font-semibold truncate">
                {agent.name}
              </CardTitle>
              <Badge
                className={`mt-1 text-[10px] ${STATUS_LABEL_COLORS[agent.status]}`}
                variant="secondary"
              >
                {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
              </Badge>
            </div>
          </div>
          <Switch
            checked={agent.enabled}
            onCheckedChange={() => onToggle(agent.id)}
            className="scale-90"
          />
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {agent.description}
        </p>

        <Separator />

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {agent.lastRun}
            </span>
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Every {agent.runInterval}s
            </span>
          </div>
          <span className="font-medium text-foreground">
            {agent.processesToday.toLocaleString()} today
          </span>
        </div>

        <AgentLogsDialog agentId={agent.id} logs={agent.logs} />
      </CardContent>
    </Card>
  );
}

export function AIAgentsContent() {
  const { agents, totalProcesses, activeCount, idleCount, errorCount, toggleAgent } =
    useAIAgents();
  const [filter, setFilter] = useState<"all" | "active" | "idle" | "error">("all");

  const filteredAgents = agents.filter((a) => {
    if (filter === "all") return true;
    if (filter === "idle") return a.status === "idle" || !a.enabled;
    return a.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Agents</h1>
            <p className="text-sm text-muted-foreground">
              Background AI system powering PostAll&apos;s intelligent features
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">Active</span>
            </div>
            <p className="text-2xl font-bold text-emerald-700">{activeCount}</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-medium text-amber-700">Idle</span>
            </div>
            <p className="text-2xl font-bold text-amber-700">{idleCount}</p>
          </CardContent>
        </Card>
        <Card className="border-rose-200 bg-rose-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              <span className="text-xs font-medium text-rose-700">Error</span>
            </div>
            <p className="text-2xl font-bold text-rose-700">{errorCount}</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-primary">Total Processes</span>
            </div>
            <p className="text-2xl font-bold text-primary">{totalProcesses.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">today</p>
          </CardContent>
        </Card>
      </div>

      {/* System Status Banner */}
      <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50/50 to-teal-50/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-emerald-800">System Operational</span>
            <span className="text-xs text-emerald-600">
              — All core agents running smoothly
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(["all", "active", "idle", "error"] as const).map((tab) => (
          <Button
            key={tab}
            variant={filter === tab ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(tab)}
            className={
              filter === tab
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            }
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === "all" && (
              <Badge variant="secondary" className="ml-1.5 h-5 min-w-[20px] justify-center px-1.5 text-[10px]">
                {agents.length}
              </Badge>
            )}
            {tab === "active" && (
              <Badge variant="secondary" className="ml-1.5 h-5 min-w-[20px] justify-center px-1.5 text-[10px] bg-emerald-100 text-emerald-700">
                {activeCount}
              </Badge>
            )}
            {tab === "idle" && (
              <Badge variant="secondary" className="ml-1.5 h-5 min-w-[20px] justify-center px-1.5 text-[10px] bg-amber-100 text-amber-700">
                {idleCount}
              </Badge>
            )}
            {tab === "error" && (
              <Badge variant="secondary" className="ml-1.5 h-5 min-w-[20px] justify-center px-1.5 text-[10px] bg-rose-100 text-rose-700">
                {errorCount}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAgents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} onToggle={toggleAgent} />
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No agents matching filter &quot;{filter}&quot;
          </p>
        </div>
      )}
    </div>
  );
}

export default AIAgentsContent;
