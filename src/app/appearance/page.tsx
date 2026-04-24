"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sun,
  Moon,
  ArrowLeft,
  Monitor,
  Type,
  Bell,
  Globe,
  Palette,
  Eye,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

// ─── Theme Colors ──────────────────────────────────────────────
const accentColors = [
  { name: "Forest Green", value: "#0D8A5C", ring: "ring-[#0D8A5C]" },
  { name: "Navy Blue", value: "#1E3A5F", ring: "ring-[#1E3A5F]" },
  { name: "Royal Purple", value: "#6D28D9", ring: "ring-[#6D28D9]" },
  { name: "Crimson Red", value: "#DC2626", ring: "ring-[#DC2626]" },
  { name: "Ocean Teal", value: "#0D9488", ring: "ring-[#0D9488]" },
  { name: "Warm Orange", value: "#EA580C", ring: "ring-[#EA580C]" },
];

const fontSizes = [
  { label: "Small", value: "sm", desc: "Compact text for more content" },
  { label: "Medium", value: "md", desc: "Default comfortable size" },
  { label: "Large", value: "lg", desc: "Larger text for readability" },
];

const densityOptions = [
  { label: "Compact", value: "compact", desc: "More content on screen" },
  { label: "Default", value: "default", desc: "Balanced layout" },
  { label: "Comfortable", value: "comfortable", desc: "More spacing and breathing room" },
];

// ─── Main Component ────────────────────────────────────────────
export default function AppearancePage() {
  const [accentColor, setAccentColor] = useState("#0D8A5C");
  const [fontSize, setFontSize] = useState("md");
  const [density, setDensity] = useState("default");
  const [showAnimations, setShowAnimations] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  const handleSave = () => {
    toast.success("Appearance settings saved!", {
      description: "Your preferences have been updated.",
    });
  };

  const handleReset = () => {
    setAccentColor("#0D8A5C");
    setFontSize("md");
    setDensity("default");
    setShowAnimations(true);
    setHighContrast(false);
    toast.info("Settings reset to defaults");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Back navigation */}
      <Link href="/dashboard/settings" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Settings
      </Link>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
            <Palette className="h-5 w-5 text-[#374151]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#374151]">
              Appearance
            </h1>
            <p className="text-sm text-[#9CA3AF]">
              Customize how PostAll looks and feels for you
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Accent Color */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#9CA3AF]" />
              Accent Color
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {accentColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setAccentColor(color.value)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                      accentColor === color.value
                        ? "border-current bg-gray-50 shadow-sm"
                        : "border-transparent hover:bg-gray-50"
                    }`}
                    style={{ color: color.value, borderColor: accentColor === color.value ? color.value : undefined }}
                  >
                    <div
                      className="h-8 w-8 rounded-full ring-2 ring-offset-2 transition-all"
                      style={{
                        backgroundColor: color.value,
                        ringColor: accentColor === color.value ? color.value : "transparent",
                      }}
                    />
                    <span className="text-[11px] font-medium text-[#374151] leading-tight text-center">
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border">
                <div
                  className="h-5 w-5 rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
                <span className="text-sm text-[#374151]">Preview:</span>
                <Button
                  size="sm"
                  className="text-xs text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  Sample Button
                </Button>
                <span
                  className="text-sm font-semibold"
                  style={{ color: accentColor }}
                >
                  ₦50,000
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Font Size */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Type className="h-4 w-4 text-[#9CA3AF]" />
              Font Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {fontSizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => setFontSize(size.value)}
                  className={`flex flex-col items-start gap-1 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    fontSize === size.value
                      ? "border-[#0D8A5C] bg-[#F0FDF4]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span
                    className={`font-medium ${size.value === "sm" ? "text-sm" : size.value === "lg" ? "text-lg" : "text-base"} text-[#374151]`}
                  >
                    Aa {size.label}
                  </span>
                  <span className="text-xs text-[#9CA3AF]">{size.desc}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Layout Density */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Monitor className="h-4 w-4 text-[#9CA3AF]" />
              Layout Density
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {densityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDensity(option.value)}
                  className={`flex flex-col items-start gap-1 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    density === option.value
                      ? "border-[#0D8A5C] bg-[#F0FDF4]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="font-medium text-sm text-[#374151]">
                    {option.label}
                  </span>
                  <span className="text-xs text-[#9CA3AF]">{option.desc}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Options */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-4 w-4 text-[#9CA3AF]" />
              Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
                    <Sun className="h-4 w-4 text-[#374151]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#374151]">Animations</p>
                    <p className="text-xs text-[#9CA3AF]">Enable motion and transitions</p>
                  </div>
                </div>
                <Button
                  variant={showAnimations ? "default" : "outline"}
                  size="sm"
                  className={showAnimations ? "bg-[#0D8A5C] text-white" : ""}
                  onClick={() => setShowAnimations(!showAnimations)}
                >
                  {showAnimations ? "On" : "Off"}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
                    <Eye className="h-4 w-4 text-[#374151]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#374151]">High Contrast</p>
                    <p className="text-xs text-[#9CA3AF]">Increase color contrast for readability</p>
                  </div>
                </div>
                <Button
                  variant={highContrast ? "default" : "outline"}
                  size="sm"
                  className={highContrast ? "bg-[#0D8A5C] text-white" : ""}
                  onClick={() => setHighContrast(!highContrast)}
                >
                  {highContrast ? "On" : "Off"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save / Reset */}
        <div className="flex items-center justify-between pt-4">
          <Button variant="outline" onClick={handleReset} className="text-[#9CA3AF]">
            Reset to Defaults
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#0D8A5C] text-white hover:bg-[#086B43]"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
