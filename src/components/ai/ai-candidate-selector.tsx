"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Loader2,
  Star,
  MapPin,
  CheckCircle2,
  Zap,
  TrendingUp,
  Target,
  Award,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

interface CandidateScores {
  skillMatch: number;
  locationMatch: number;
  ratingScore: number;
  budgetFit: number;
  experienceScore: number;
}

interface Candidate {
  id: string;
  name: string;
  initials: string;
  city: string;
  state: string;
  role: string;
  rating: number;
  completed: number;
  rate: string;
  bio: string;
  confidenceScore: number;
  scores: CandidateScores;
}

interface AISelectionResult {
  candidates: Candidate[];
  reasoning: string;
  analyzedAt: string;
}

const avatarColors = [
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-500",
];

function ScoreBar({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-muted-foreground flex items-center gap-1">
          <Icon className="h-3 w-3" />
          {label}
        </span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            value >= 80 ? "bg-emerald-500" : value >= 50 ? "bg-amber-500" : "bg-rose-400"
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function AICandidateSelector({
  taskId = "demo-task",
  taskDescription = "Build a responsive landing page for a restaurant",
  taskSkills = ["web development", "react", "design"],
  location = "Lagos",
  budget = 75000,
  onPickCandidate,
}: {
  taskId?: string;
  taskDescription?: string;
  taskSkills?: string[];
  location?: string;
  budget?: number;
  onPickCandidate?: (candidate: Candidate) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AISelectionResult | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/candidate-select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          taskDescription,
          taskSkills,
          location,
          budget,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        toast.success(`AI analyzed ${data.candidates.length} top candidates`);
      } else {
        toast.error("Failed to analyze candidates");
      }
    } catch {
      toast.error("AI analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Trigger Button */}
      {!result && (
        <Button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          size="lg"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="h-5 w-5" />
          )}
          {isLoading ? "Analyzing Workers..." : "AI Recommend Top 3 Candidates"}
        </Button>
      )}

      {/* Results */}
      {result && (
        <>
          {/* Reasoning */}
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <p className="text-xs font-semibold text-emerald-800">AI Analysis</p>
            </div>
            <p className="text-xs text-emerald-700 leading-relaxed">{result.reasoning}</p>
          </div>

          {/* Top 3 Candidates */}
          <div className="space-y-3">
            {result.candidates.map((candidate, index) => (
              <Card
                key={candidate.id}
                className={`border-2 transition-colors ${
                  index === 0
                    ? "border-emerald-300 bg-emerald-50/30"
                    : index === 1
                    ? "border-teal-200"
                    : "border-dashed"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Rank + Avatar */}
                    <div className="shrink-0">
                      <div className="relative">
                        <div
                          className={`h-12 w-12 rounded-full ${
                            avatarColors[index] || "bg-muted-foreground"
                          } flex items-center justify-center`}
                        >
                          <span className="text-white font-bold text-lg">
                            {candidate.initials}
                          </span>
                        </div>
                        <div
                          className={`absolute -top-2 -left-2 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                            index === 0
                              ? "bg-amber-500"
                              : index === 1
                              ? "bg-muted-foreground"
                              : "bg-orange-400"
                          }`}
                        >
                          {index + 1}
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-sm">{candidate.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-0.5">
                              <MapPin className="h-3 w-3" />
                              {candidate.city}, {candidate.state}
                            </span>
                            <span>·</span>
                            <Badge variant="secondary" className="text-[9px] py-0 px-1.5">
                              {candidate.role}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="flex items-center gap-1">
                            <Badge
                              className={`text-[10px] px-1.5 ${
                                index === 0
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              <Zap className="h-2.5 w-2.5 mr-0.5" />
                              {candidate.confidenceScore}% match
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Stats Row */}
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-amber-600">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {candidate.rating}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-600">
                          <CheckCircle2 className="h-3 w-3" />
                          {candidate.completed} done
                        </span>
                        <span className="flex items-center gap-1 text-teal-600">
                          <Wallet className="h-3 w-3" />
                          {candidate.rate}
                        </span>
                      </div>

                      {/* Score Bars */}
                      <div className="grid grid-cols-1 gap-1.5 pt-1">
                        <ScoreBar label="Skills" value={candidate.scores.skillMatch} icon={Target} />
                        <ScoreBar label="Rating" value={candidate.scores.ratingScore} icon={Star} />
                        <ScoreBar label="Location" value={candidate.scores.locationMatch} icon={MapPin} />
                        <ScoreBar label="Budget Fit" value={candidate.scores.budgetFit} icon={TrendingUp} />
                        <ScoreBar label="Experience" value={candidate.scores.experienceScore} icon={Award} />
                      </div>

                      {/* Pick Button */}
                      <Button
                        onClick={() => {
                          if (onPickCandidate) onPickCandidate(candidate);
                          toast.success(`Selected ${candidate.name}!`);
                        }}
                        className="w-full gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-sm"
                        size="sm"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Pick {candidate.name.split(" ")[0]}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Re-analyze Button */}
          <Button
            variant="outline"
            onClick={() => {
              setResult(null);
            }}
            className="w-full gap-2"
            size="sm"
          >
            <Sparkles className="h-4 w-4" />
            Re-analyze Candidates
          </Button>
        </>
      )}
    </div>
  );
}
