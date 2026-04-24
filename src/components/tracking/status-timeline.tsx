"use client"

import { CheckCircle2, Circle, Clock, Loader2, XCircle, MapPin, Package, Truck, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

export interface StatusStep {
  id: string
  label: string
  description: string
  status: "completed" | "in_progress" | "pending" | "failed"
  timestamp?: string
}

// Icon mapping for common step types
const stepIconMap: Record<string, React.ElementType> = {
  assigned: CheckCircle2,
  accepted: CheckCircle2,
  supplies: Package,
  on_way: Truck,
  arrived: MapPin,
  working: Loader2,
  completed: CheckCircle2,
  phone: Phone,
  default: Circle,
}

function getStepIcon(id: string): React.ElementType {
  const lower = id.toLowerCase()
  for (const [key, icon] of Object.entries(stepIconMap)) {
    if (lower.includes(key)) return icon
  }
  return stepIconMap.default
}

export function StatusTimeline({ steps }: { steps: StatusStep[] }) {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        const StepIcon = getStepIcon(step.id)

        return (
          <div key={step.id} className="relative flex gap-4">
            {/* Timeline Line */}
            {!isLast && (
              <div
                className={cn(
                  "absolute left-[19px] top-10 w-0.5 h-[calc(100%-16px)]",
                  step.status === "completed"
                    ? "bg-emerald-400"
                    : step.status === "failed"
                      ? "bg-rose-300"
                      : "bg-muted"
                )}
              />
            )}

            {/* Dot / Icon */}
            <div className="relative z-10 shrink-0">
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all",
                  step.status === "completed" &&
                    "bg-emerald-500 border-emerald-500 text-white",
                  step.status === "in_progress" &&
                    "bg-amber-50 border-amber-400 text-amber-600 dark:bg-amber-950/30",
                  step.status === "failed" &&
                    "bg-rose-50 border-rose-400 text-rose-600 dark:bg-rose-950/30",
                  step.status === "pending" &&
                    "bg-card border-border text-muted-foreground"
                )}
              >
                {step.status === "completed" ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : step.status === "in_progress" ? (
                  <div className="relative">
                    <StepIcon className="h-4 w-4" />
                    <span className="absolute inset-0 rounded-full animate-ping bg-amber-300 opacity-40" />
                  </div>
                ) : step.status === "failed" ? (
                  <XCircle className="h-5 w-5" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </div>
            </div>

            {/* Content */}
            <div className={cn("pb-6 min-w-0", isLast && "pb-0")}>
              <div className="flex items-center gap-2">
                <p
                  className={cn(
                    "font-semibold text-sm",
                    step.status === "completed" && "text-emerald-700 dark:text-emerald-400",
                    step.status === "in_progress" && "text-amber-700 dark:text-amber-400",
                    step.status === "failed" && "text-rose-700 dark:text-rose-400",
                    step.status === "pending" && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </p>
                {step.status === "in_progress" && (
                  <Loader2 className="h-3.5 w-3.5 text-amber-500 animate-spin" />
                )}
                {step.status === "completed" && (
                  <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded-full">
                    Done
                  </span>
                )}
              </div>
              <p
                className={cn(
                  "text-xs mt-0.5 text-muted-foreground"
                )}
              >
                {step.description}
              </p>
              {step.timestamp && (
                <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {step.timestamp}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
