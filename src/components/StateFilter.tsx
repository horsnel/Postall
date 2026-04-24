"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { nigerianStates } from "@/lib/constants";

interface StateFilterProps {
  selected?: string;
  onChange?: (state: string) => void;
}

export function StateFilter({ selected, onChange }: StateFilterProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
        <MapPin className="h-3.5 w-3.5" />
        State
      </div>
      <Select value={selected || "all"} onValueChange={(val) => onChange?.(val === "all" ? "" : val)}>
        <SelectTrigger className="h-9 text-sm">
          <SelectValue placeholder="All States" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All States</SelectItem>
          {nigerianStates.map((state) => (
            <SelectItem key={state.name} value={state.name}>
              {state.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
