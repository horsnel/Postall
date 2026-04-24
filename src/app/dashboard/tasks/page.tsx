"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Timer,
  Calendar,
  User,
  Loader2,
  ShieldCheck,
  ArrowUpRight,
  Bell,
  Zap,
} from "lucide-react";

interface ActiveTask {
  id: string;
  title: string;
  assignedTo: string;
  assignedToInitials: string;
  duration: string;
  durationMs: number;
  startedAt: number; // timestamp ms
  status: "in_progress" | "time_running_out" | "expired" | "completed";
  progress: number;
  amount: number;
}

const initialTasks: ActiveTask[] = [
  {
    id: "t1",
    title: "Landing Page Design for Restaurant",
    assignedTo: "Emeka Okafor",
    assignedToInitials: "EO",
    duration: "24 hours",
    durationMs: 24 * 60 * 60 * 1000,
    startedAt: Date.now() - 20 * 60 * 60 * 1000, // started 20 hrs ago
    status: "time_running_out",
    progress: 75,
    amount: 75000,
  },
  {
    id: "t2",
    title: "WordPress Blog Setup & Theme",
    assignedTo: "Amina Kaduna",
    assignedToInitials: "AK",
    duration: "48 hours",
    durationMs: 48 * 60 * 60 * 1000,
    startedAt: Date.now() - 6 * 60 * 60 * 1000,
    status: "in_progress",
    progress: 40,
    amount: 90000,
  },
  {
    id: "t3",
    title: "Logo Design for Startup Brand",
    assignedTo: "Kwame Mensah",
    assignedToInitials: "KM",
    duration: "12 hours",
    durationMs: 12 * 60 * 60 * 1000,
    startedAt: Date.now() - 11.5 * 60 * 60 * 1000, // started 11.5 hrs ago
    status: "in_progress",
    progress: 90,
    amount: 50000,
  },
];

function useCountdown(targetTime: number) {
  const [timeLeft, setTimeLeft] = useState(targetTime - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = targetTime - Date.now();
      setTimeLeft(remaining);
    }, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  return timeLeft;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "Expired";
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function TaskCard({
  task,
  onComplete,
  onExtend,
}: {
  task: ActiveTask;
  onComplete: (id: string) => void;
  onExtend: (id: string) => void;
}) {
  const endTime = task.startedAt + task.durationMs;
  const timeLeft = useCountdown(endTime);

  const isExpired = timeLeft <= 0;
  const isTimeRunningOut = !isExpired && timeLeft < 2 * 60 * 60 * 1000; // < 2hrs

  const statusLabel = isExpired
    ? "Overdue"
    : isTimeRunningOut
    ? "Time Running Out"
    : task.status === "completed"
    ? "Completed"
    : "In Progress";

  const statusClass = isExpired
    ? "bg-rose-100 text-rose-700"
    : isTimeRunningOut
    ? "bg-amber-100 text-amber-700"
    : task.status === "completed"
    ? "bg-teal-100 text-teal-700"
    : "bg-emerald-100 text-emerald-700";

  const StatusIcon = isExpired
    ? AlertTriangle
    : isTimeRunningOut
    ? Zap
    : task.status === "completed"
    ? CheckCircle2
    : Timer;

  return (
    <Card className={`overflow-hidden ${isExpired ? "border-rose-200" : ""}`}>
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <ClipboardList className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm truncate">{task.title}</h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{task.assignedTo}</span>
                <span className="text-muted-foreground/50">·</span>
                <span>₦{task.amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <Badge className={`${statusClass} gap-1 text-xs shrink-0 ${isTimeRunningOut && !isExpired ? "animate-pulse" : ""}`}>
            <StatusIcon className="h-3 w-3" />
            {statusLabel}
          </Badge>
        </div>

        {/* Countdown Timer */}
        <div className="rounded-lg bg-muted/50 border p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Time Remaining</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Duration: {task.duration}</span>
            </div>
          </div>
          <p
            className={`text-2xl font-bold font-mono tracking-wider ${
              isExpired
                ? "text-rose-600"
                : isTimeRunningOut
                ? "text-amber-600"
                : "text-foreground"
            }`}
          >
            {isExpired ? (
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="h-5 w-5 text-rose-600" />
                  Expired
                </span>
              ) : formatCountdown(timeLeft)}
          </p>
          {isTimeRunningOut && !isExpired && (
            <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Less than 2 hours remaining!
            </p>
          )}
          {isExpired && (
            <p className="text-[10px] text-rose-600 mt-1 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Task expired — Admin notified, refund processing
            </p>
          )}
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{task.progress}%</span>
          </div>
          <Progress value={task.progress} className="h-2" />
        </div>

        {/* Actions */}
        {!isExpired && task.status !== "completed" && (
          <div className="flex gap-2 pt-1">
            <Button
              className="flex-1 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              size="sm"
              onClick={() => onComplete(task.id)}
            >
              <CheckCircle2 className="h-4 w-4" />
              Mark Complete
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => onExtend(task.id)}
            >
              <ArrowUpRight className="h-4 w-4" />
              Request Extension
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<ActiveTask[]>(initialTasks);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const activeTasks = tasks.filter((t) => t.status !== "completed" && t.status !== "expired");
  const completedTasks = tasks.filter((t) => t.status === "completed");
  const expiredTasks = tasks.filter((t) => t.status === "expired");

  // Auto-expire tasks when countdown reaches 0
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prev) =>
        prev.map((task) => {
          const endTime = task.startedAt + task.durationMs;
          if (task.status !== "completed" && task.status !== "expired" && Date.now() >= endTime) {
            console.log(`[Admin] Task "${task.title}" expired. Admin notified — refund processing.`);
            return { ...task, status: "expired" as const };
          }
          // Auto-detect time running out
          if (task.status === "in_progress" && endTime - Date.now() < 2 * 60 * 60 * 1000) {
            return { ...task, status: "time_running_out" as const };
          }
          return task;
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleComplete = (taskId: string) => {
    setSelectedTaskId(taskId);
    setCompleteDialogOpen(true);
  };

  const confirmComplete = async () => {
    if (!selectedTaskId) return;
    setIsProcessing(true);
    try {
      await fetch(`/api/tasks/${selectedTaskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete" }),
      });
    } catch {
      // Silently handle API call
    }
    setTimeout(() => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === selectedTaskId ? { ...t, status: "completed" as const, progress: 100 } : t
        )
      );
      setIsProcessing(false);
      setCompleteDialogOpen(false);
      setSelectedTaskId(null);
      toast.success("Task marked as complete!", {
        description: "Admin has been notified.",
      });
    }, 1500);
  };

  const handleExtend = (taskId: string) => {
    setSelectedTaskId(taskId);
    setExtendDialogOpen(true);
  };

  const confirmExtend = async () => {
    if (!selectedTaskId) return;
    setIsProcessing(true);
    try {
      await fetch(`/api/tasks/${selectedTaskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "extend", hours: 12 }),
      });
    } catch {
      // Silently handle API call
    }
    setTimeout(() => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === selectedTaskId
            ? { ...t, startedAt: t.startedAt + 12 * 60 * 60 * 1000, status: "in_progress" as const }
            : t
        )
      );
      setIsProcessing(false);
      setExtendDialogOpen(false);
      setSelectedTaskId(null);
      toast.success("Extension granted! +12 hours added.", {
        description: "Worker has been notified.",
      });
    }, 1500);
  };

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-emerald-600" />
          My Tasks
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track active tasks, deadlines, and completion status
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Tasks", value: activeTasks.length, icon: ClipboardList, color: "text-emerald-600 bg-emerald-50" },
          { label: "Time Running Out", value: tasks.filter((t) => t.status === "time_running_out").length, icon: Zap, color: "text-amber-600 bg-amber-50" },
          { label: "Completed", value: completedTasks.length, icon: CheckCircle2, color: "text-teal-600 bg-teal-50" },
          { label: "Overdue", value: expiredTasks.length, icon: AlertTriangle, color: "text-rose-600 bg-rose-50" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`h-9 w-9 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className="text-xs font-semibold">
                    {stat.value}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Timer className="h-5 w-5 text-emerald-600" />
            Active Tasks
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {tasks
              .filter((t) => t.status === "in_progress" || t.status === "time_running_out")
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={handleComplete}
                  onExtend={handleExtend}
                />
              ))}
          </div>
        </div>
      )}

      {/* Expired Tasks */}
      {expiredTasks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
            Overdue Tasks
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {expiredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleComplete}
                onExtend={handleExtend}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-teal-600" />
            Completed Tasks
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleComplete}
                onExtend={handleExtend}
              />
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="font-semibold">No tasks yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              When you assign tasks through chat, they&apos;ll appear here with live timers.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Complete Task Dialog */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              Mark Task as Complete
            </DialogTitle>
            <DialogDescription>
              Confirm task completion and release payment
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4 py-2">
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4">
                <p className="text-sm font-semibold">{selectedTask.title}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><User className="h-3 w-3" /> {selectedTask.assignedTo}</span>
                  <span>₦{selectedTask.amount.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                This will mark the task as complete, release escrow payment to {selectedTask.assignedTo}, and notify the admin.
              </p>
              <DialogFooter className="gap-2 sm:gap-0">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={confirmComplete}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Completion"
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Extend Task Dialog */}
      <Dialog open={extendDialogOpen} onOpenChange={setExtendDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5 text-amber-600" />
              Request Extension
            </DialogTitle>
            <DialogDescription>
              Extend the task deadline
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4 py-2">
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                <p className="text-sm font-semibold">{selectedTask.title}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><User className="h-3 w-3" /> {selectedTask.assignedTo}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                This will extend the deadline by 12 hours and notify {selectedTask.assignedTo}.
              </p>
              <DialogFooter className="gap-2 sm:gap-0">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  className="bg-amber-600 hover:bg-amber-700"
                  onClick={confirmExtend}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                      Processing...
                    </>
                  ) : (
                    "Extend +12 Hours"
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
