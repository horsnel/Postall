"use client";

import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const DISTANCES = [
  { label: "5 km", value: 5 },
  { label: "10 km", value: 10 },
  { label: "25 km", value: 25 },
  { label: "50 km", value: 50 },
  { label: "100 km", value: 100 },
] as const;

interface DistanceFilterProps {
  selected?: number;
  onChange?: (distance: number) => void;
}

export function DistanceFilter({ selected, onChange }: DistanceFilterProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
        <MapPin className="h-3.5 w-3.5" />
        Distance
      </div>
      <div className="flex flex-wrap gap-1.5">
        {DISTANCES.map((d) => (
          <Button
            key={d.value}
            variant={selected === d.value ? "default" : "outline"}
            size="sm"
            className={`h-7 text-xs ${
              selected === d.value
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : ""
            }`}
            onClick={() => onChange?.(d.value)}
          >
            {d.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
