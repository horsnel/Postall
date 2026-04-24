"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  Tag,
  DollarSign,
  MapPin,
  ArrowRight,
  Sparkles,
  Loader2,
  CheckCircle2,
  Brain,
  Zap,
  ChevronLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const features = [
  {
    icon: Search,
    title: "Keyword Alerts",
    description:
      "Set alerts for specific keywords and get notified instantly when new tasks or listings matching your criteria are posted. Never miss an opportunity that fits your expertise.",
  },
  {
    icon: Tag,
    title: "Category Alerts",
    description:
      "Subscribe to alerts for entire categories like gigs, services, or housing. Get a daily or instant digest of all new postings in your areas of interest.",
  },
  {
    icon: DollarSign,
    title: "Price Drop Alerts",
    description:
      "Track items for sale and receive alerts when prices drop below your target. Perfect for bargain hunters looking for the best deals on electronics, furniture, and more.",
  },
  {
    icon: MapPin,
    title: "Location Alerts",
    description:
      "Set location-based alerts for your city or neighborhood. Get notified about new tasks, services, and listings posted near you for convenient local transactions.",
  },
];

const steps = [
  {
    step: 1,
    title: "Create Your Alerts",
    description:
      "Define what you want to be notified about — choose keywords, categories, price ranges, and locations. Mix and match criteria to create highly specific or broad alerts.",
  },
  {
    step: 2,
    title: "Choose Notification Preferences",
    description:
      "Select how you want to receive alerts — push notifications, email digests, or both. Set frequency preferences from instant to daily summaries based on your needs.",
  },
  {
    step: 3,
    title: "Act on Opportunities",
    description:
      "When a matching listing appears, you'll be the first to know. Apply for tasks, contact sellers, or browse listings immediately before others see them.",
  },
];

interface AISuggestion {
  id: string;
  query: string;
  description: string;
  searchTerms: string[];
  priceRange: string;
  category: string;
  city: string;
}

const sampleAISuggestions: AISuggestion[] = [
  {
    id: "1",
    query: "Looking for affordable laptops in Lagos under ₦150K",
    description: "AI found 3 search criteria based on your description",
    searchTerms: ["laptop", "affordable laptop", "cheap laptop", "notebook"],
    priceRange: "₦50,000 - ₦150,000",
    category: "For Sale > Electronics",
    city: "Lagos",
  },
  {
    id: "2",
    query: "Need a freelance web developer for an e-commerce site",
    description: "AI identified your service and budget needs",
    searchTerms: ["web developer", "ecommerce", "react developer", "full stack"],
    priceRange: "₦100,000 - ₦500,000",
    category: "Gigs > Computer",
    city: "Remote",
  },
  {
    id: "3",
    query: "2 bedroom apartment in Gbagada or Yaba area",
    description: "AI extracted location and property preferences",
    searchTerms: ["2 bedroom", "apartment", "flat", "self contain"],
    priceRange: "₦800,000 - ₦2,500,000/year",
    category: "Housing > Apartments",
    city: "Lagos (Gbagada, Yaba)",
  },
];

export default function SmartAlertsPage() {
  const [aiQuery, setAiQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAlert, setGeneratedAlert] = useState<AISuggestion | null>(null);

  const handleGenerateAlert = async () => {
    if (!aiQuery.trim()) return;
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      const mock: AISuggestion = {
        id: Date.now().toString(),
        query: aiQuery,
        description: "AI analyzed your request and extracted key criteria",
        searchTerms: aiQuery.split(" ").filter((w) => w.length > 3).slice(0, 5),
        priceRange: "Based on market data",
        category: "Auto-detected category",
        city: "Your current city",
      };
      setGeneratedAlert(mock);
      setIsGenerating(false);
      toast.success("AI generated alert criteria!");
    }, 1500);
  };

  const handleCreateAlert = (suggestion: AISuggestion) => {
    toast.success(`Alert created: "${suggestion.query}"`);
  };

  return (
    <div className="min-h-[60vh]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="bg-white/20 text-white mb-4 hover:bg-white/20">Notification Tool</Badge>
          <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
            <Bell className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Smart Alerts</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Set up custom alerts and never miss the perfect opportunity. Get notified instantly.
          </p>
        </div>
      </div>

      {/* AI-Powered Smart Alert Section */}
      <div className="container mx-auto max-w-4xl -mt-6 relative z-10 px-4">
        <Card className="shadow-xl border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-emerald-600" />
              AI-Powered Smart Alert
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Describe what you&apos;re looking for in natural language. Our AI will generate optimal search terms, price range, and category suggestions.
            </p>

            <Textarea
              placeholder='e.g. "Looking for affordable laptops in Lagos under ₦150K" or "Need a freelance web developer for an e-commerce site"'
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              className="min-h-[80px] resize-y"
              maxLength={500}
            />

            <div className="flex items-center gap-3">
              <Button
                onClick={handleGenerateAlert}
                disabled={!aiQuery.trim() || isGenerating}
                className="gap-2"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Generate AI Alert
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setAiQuery("");
                  setGeneratedAlert(null);
                }}
              >
                Clear
              </Button>
            </div>

            {/* Generated Alert Result */}
            {generatedAlert && (
              <div className="mt-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <p className="font-medium text-sm text-emerald-800">
                    AI Suggestion Generated
                  </p>
                </div>
                <p className="text-xs text-emerald-700">{generatedAlert.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Search Terms
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {generatedAlert.searchTerms.map((term) => (
                        <Badge key={term} variant="outline" className="text-xs bg-white border-emerald-200 text-emerald-700">
                          {term}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Price Range
                    </p>
                    <p className="text-sm font-medium text-emerald-800">{generatedAlert.priceRange}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Category
                    </p>
                    <p className="text-sm font-medium">{generatedAlert.category}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Location
                    </p>
                    <p className="text-sm font-medium flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {generatedAlert.city}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => handleCreateAlert(generatedAlert)}
                  className="w-full gap-2 mt-3"
                  size="sm"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Create Alert from AI Suggestion
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sample AI-Generated Alerts */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-semibold">Sample AI Alerts</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sampleAISuggestions.map((suggestion) => (
            <Card key={suggestion.id} className="border-emerald-100 hover:border-emerald-300 transition-colors">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">AI Generated</Badge>
                </div>
                <p className="text-sm font-medium leading-snug">{suggestion.query}</p>
                <p className="text-[10px] text-muted-foreground">{suggestion.description}</p>

                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase">Search Terms</p>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {suggestion.searchTerms.slice(0, 3).map((term) => (
                        <Badge key={term} variant="secondary" className="text-[10px]">{term}</Badge>
                      ))}
                      {suggestion.searchTerms.length > 3 && (
                        <Badge variant="secondary" className="text-[10px]">+{suggestion.searchTerms.length - 3}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground">Price: <span className="font-medium text-foreground">{suggestion.priceRange}</span></span>
                    <span className="text-muted-foreground flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5" /> {suggestion.city}</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleCreateAlert(suggestion)}
                  variant="outline"
                  size="sm"
                  className="w-full gap-1.5 text-emerald-600 border-emerald-200 hover:bg-emerald-50 text-xs"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  Create Alert
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="max-w-4xl mx-auto" />

      {/* Features */}
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">What to Expect</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <Card key={feature.title} className="border-emerald-100 hover:border-emerald-300 transition-colors">
              <CardContent className="p-5">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center mb-3">
                  <feature.icon className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-muted/30 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-8">How It Will Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {steps.map((item) => (
              <Card key={item.step} className="text-center relative">
                <CardContent className="p-5">
                  <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  {item.step < 3 && (
                    <ArrowRight className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-5 w-5 text-emerald-300" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Related Tools */}
      <div className="container mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-muted-foreground mb-4">In the meantime, explore related tools:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Link href="/browse">
            <Button variant="outline">Browse Marketplace</Button>
          </Link>
          <Link href="/tools/market-insights">
            <Button variant="outline">Market Insights</Button>
          </Link>
          <Link href="/tools/ai-assistant">
            <Button variant="outline" className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              AI Assistant
            </Button>
          </Link>
        </div>
        <Link href="/#tools" className="block mt-6 text-sm text-primary hover:underline">
          <ChevronLeft className="h-4 w-4" />Back to All Tools
        </Link>
      </div>
    </div>
  );
}
