"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  History,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Play,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  User,
  Wrench
} from 'lucide-react';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusTimeline } from "@/components/tracking/status-timeline";
import type { StatusStep } from "@/components/tracking/status-timeline";

// ─── Types ───────────────────────────────────────────────────
interface TaskStatus {
  id: string;
  label: string;
  description: string;
  status: "completed" | "in_progress" | "pending";
  timestamp?: string;
}

interface HistoryTask {
  id: string;
  title: string;
  status: "completed" | "cancelled" | "disputed";
  completionTime: string;
  amount: number;
  workerName: string;
  date: string;
}

// ─── Data ────────────────────────────────────────────────────
const initialSteps: TaskStatus[] = [
  { id: "assigned", label: "Task Assigned", description: "Your task has been matched to a worker", status: "completed", timestamp: "10:30 AM" },
  { id: "accepted", label: "Worker Accepted", description: "Babatunde accepted your task", status: "completed", timestamp: "10:35 AM" },
  { id: "supplies", label: "Picking Up Supplies", description: "Worker is getting materials and tools", status: "in_progress" },
  { id: "on_way", label: "On The Way", description: "Worker is heading to your location", status: "pending" },
  { id: "arrived", label: "Arrived at Location", description: "Worker has arrived at your address", status: "pending" },
  { id: "working", label: "Work In Progress", description: "Task is being completed", status: "pending" },
  { id: "completed", label: "Completed", description: "Task has been marked as complete", status: "pending" },
];

const historyTasks: HistoryTask[] = [
  { id: "h1", title: "Electrical Wiring Fix", status: "completed", completionTime: "1h 45m", amount: 15000, workerName: "Chidi E.", date: "Yesterday" },
  { id: "h2", title: "AC Repair & Service", status: "completed", completionTime: "2h 10m", amount: 25000, workerName: "Tunde O.", date: "3 days ago" },
  { id: "h3", title: "Interior Painting (2 rooms)", status: "completed", completionTime: "4h 30m", amount: 45000, workerName: "Kwame A.", date: "1 week ago" },
  { id: "h4", title: "Plumbing - Kitchen Sink", status: "cancelled", completionTime: "—", amount: 8000, workerName: "Emeka N.", date: "2 weeks ago" },
];

// ─── Timer Hook ──────────────────────────────────────────────
function useElapsedTimer(startMs: number) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - startMs);
    }, 1000);
    return () => clearInterval(interval);
  }, [startMs]);

  const hours = Math.floor(elapsed / 3600000);
  const minutes = Math.floor((elapsed % 3600000) / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);

  return {
    display: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
    minutes: Math.floor(elapsed / 60000),
  };
}

// ─── Main Component ──────────────────────────────────────────
export default function TrackingPage() {
  const [steps, setSteps] = useState<TaskStatus[]>(initialSteps);
  const [showHistory, setShowHistory] = useState(false);
  const taskStart = useState(() => Date.now() - 23 * 60000)[0]; // 23 min ago
  const timer = useElapsedTimer(taskStart);

  const simulateNextStep = useCallback(() => {
    setSteps((prev) => {
      const next = [...prev];
      const currentIdx = next.findIndex((s) => s.status === "in_progress");
      if (currentIdx === -1) return prev;

      next[currentIdx] = {
        ...next[currentIdx],
        status: "completed",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      if (currentIdx + 1 < next.length) {
        next[currentIdx + 1] = { ...next[currentIdx + 1], status: "in_progress" };
      }

      return next;
    });
  }, []);

  const isAllDone = steps.every((s) => s.status === "completed");

  // Convert to StatusStep format for timeline component
  const timelineSteps: StatusStep[] = steps.map((s) => ({
    id: s.id,
    label: s.label,
    description: s.description,
    status: s.status,
    timestamp: s.timestamp,
  }));

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* ─── Active Task Header ─── */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Wrench className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Task Tracking</h1>
            <p className="text-muted-foreground text-sm">Live status updates</p>
          </div>
        </div>

        <Card className="overflow-hidden border-emerald-200 dark:border-emerald-800">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-2">
                  <span className="relative flex h-2 w-2 mr-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-200" />
                  </span>
                  Active Task
                </Badge>
                <h2 className="text-lg font-bold">Plumbing Repair at Lekki Phase 1</h2>
                <p className="text-emerald-100 text-sm mt-1">Bathroom pipe leak &amp; faucet replacement</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-bold">₦18,000</p>
                <p className="text-emerald-200 text-xs">Task Budget</p>
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Elapsed: </span>
                <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">{timer.display}</span>
                <span className="text-xs">({timer.minutes} min)</span>
              </div>
              <div className="flex items-center gap-2">
                {!isAllDone && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    onClick={simulateNextStep}
                  >
                    <Play className="h-3.5 w-3.5" />
                    Simulate Next Step
                  </Button>
                )}
                {isAllDone && (
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    All Steps Completed
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Status Timeline + Side Info ─── */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Timeline */}
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              Live Status Timeline
            </h3>
            <StatusTimeline steps={timelineSteps} />
          </CardContent>
        </Card>

        {/* Side Column */}
        <div className="space-y-4">
          {/* Live Map Placeholder */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 h-36 flex flex-col items-center justify-center text-gray-400">
              <MapPin className="h-8 w-8 mb-2" />
              <p className="text-sm font-medium text-gray-500">Live tracking coming soon</p>
              <p className="text-xs text-gray-400">Real-time GPS map view</p>
            </div>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 inline mr-1" />
                Lekki Phase 1, Lagos
              </p>
            </CardContent>
          </Card>

          {/* Worker Info Card */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-3">Assigned Worker</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  BA
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-sm truncate">Babatunde A.</p>
                    <ShieldCheck className="h-4 w-4 text-blue-500 shrink-0" />
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium">4.8</span>
                    <span className="text-xs text-muted-foreground">(142 reviews)</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    Phone
                  </span>
                  <span className="font-medium">+234 801 234 5678</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Navigation className="h-3.5 w-3.5" />
                    Distance
                  </span>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 text-[10px] px-2 py-0.5">
                    2 mins away
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Completed Jobs
                  </span>
                  <span className="font-medium">248</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700">
              <MessageCircle className="h-4 w-4" />
              Contact Worker (WhatsApp)
            </Button>
            <Button variant="outline" className="w-full gap-2 border-rose-200 text-rose-600 hover:bg-rose-50">
              <AlertTriangle className="h-4 w-4" />
              Report Issue
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2"
              disabled={!isAllDone}
            >
              <CheckCircle2 className="h-4 w-4" />
              Mark Complete
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Task History ─── */}
      <Card>
        <CardContent className="p-4">
          <button
            className="w-full flex items-center justify-between"
            onClick={() => setShowHistory(!showHistory)}
          >
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Past Tasks</h3>
              <Badge variant="secondary" className="text-[10px]">
                {historyTasks.length}
              </Badge>
            </div>
            <ChevronRight
              className={`h-4 w-4 text-muted-foreground transition-transform ${showHistory ? "rotate-90" : ""}`}
            />
          </button>

          {showHistory && (
            <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
              {historyTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                      task.status === "completed"
                        ? "bg-emerald-100 text-emerald-600"
                        : task.status === "cancelled"
                          ? "bg-rose-100 text-rose-600"
                          : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{task.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>{task.workerName}</span>
                      <span>·</span>
                      <span>{task.date}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-sm text-emerald-700">
                      ₦{task.amount.toLocaleString()}
                    </p>
                    <Badge
                      className={`text-[10px] px-1.5 py-0 ${
                        task.status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : task.status === "cancelled"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {task.status === "completed"
                        ? `Done · ${task.completionTime}`
                        : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
