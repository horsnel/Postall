// @ts-nocheck
"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────
export interface AIAgent {
  id: string;
  name: string;
  description: string;
  status: "active" | "idle" | "error";
  lastRun: string;
  runInterval: number; // seconds
  icon: string;
  processesToday: number;
  logs: AgentLogEntry[];
  enabled: boolean;
}

export interface AgentLogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

// ─── Agent Data ───────────────────────────────────────────────
const AGENT_LOGS: Record<string, AgentLogEntry[]> = {
  "auto-complete": [
    { id: "ac1", timestamp: "2s ago", message: "Suggested 4 titles for user typing 'iph'", type: "success" },
    { id: "ac2", timestamp: "15s ago", message: "Suggested 3 titles for user typing 'mac'", type: "success" },
    { id: "ac3", timestamp: "32s ago", message: "Cache refreshed for electronics patterns", type: "info" },
  ],
  "auto-generate": [
    { id: "ag1", timestamp: "5s ago", message: "Generated description for 'Samsung Galaxy S24 Ultra'", type: "success" },
    { id: "ag2", timestamp: "1m ago", message: "Generated description for 'Toyota Camry 2019'", type: "success" },
    { id: "ag3", timestamp: "3m ago", message: "Model latency spike: 1.2s (normal: 0.4s)", type: "warning" },
  ],
  "spam-guard": [
    { id: "sg1", timestamp: "1s ago", message: "Scanned 12 new messages — all clean", type: "success" },
    { id: "sg2", timestamp: "8s ago", message: "Flagged listing #4521 for suspicious pricing", type: "warning" },
    { id: "sg3", timestamp: "45s ago", message: "Blocked phishing link in user message", type: "error" },
  ],
  "price-advisor": [
    { id: "pa1", timestamp: "10s ago", message: "Analyzed market for 'iPhone 15' — 24 similar listings", type: "success" },
    { id: "pa2", timestamp: "2m ago", message: "Price alert: Samsung TV priced 40% below market", type: "warning" },
    { id: "pa3", timestamp: "5m ago", message: "Market data refreshed for electronics category", type: "info" },
  ],
  "match-maker": [
    { id: "mm1", timestamp: "3s ago", message: "Matched 5 buyers to new listing #4530", type: "success" },
    { id: "mm2", timestamp: "20s ago", message: "Sent 12 personalized recommendations", type: "success" },
    { id: "mm3", timestamp: "1m ago", message: "User preference model updated", type: "info" },
  ],
  "response-assist": [
    { id: "ra1", timestamp: "7s ago", message: "Generated 3 quick replies for seller inquiry", type: "success" },
    { id: "ra2", timestamp: "30s ago", message: "Suggested template for shipping quote", type: "success" },
    { id: "ra3", timestamp: "2m ago", message: "New template added: 'Is this still available?'", type: "info" },
  ],
  "content-moderator": [
    { id: "cm1", timestamp: "4s ago", message: "Reviewed 8 new images — all compliant", type: "success" },
    { id: "cm2", timestamp: "18s ago", message: "Flagged listing #4519 for inappropriate text", type: "warning" },
    { id: "cm3", timestamp: "1m ago", message: "Moderation queue: 0 items pending", type: "info" },
  ],
  "translation-agent": [
    { id: "ta1", timestamp: "30s ago", message: "Translated listing to French and Hausa", type: "success" },
    { id: "ta2", timestamp: "5m ago", message: "Translation cache expired — refreshing", type: "info" },
    { id: "ta3", timestamp: "15m ago", message: "Supported languages: 6 (EN, FR, HA, YO, IG, AM)", type: "info" },
  ],
};

export const AI_AGENTS_INITIAL: AIAgent[] = [
  { id: "auto-complete", name: "Smart Auto-Complete", description: "Provides intelligent text suggestions as users type listing titles and descriptions", status: "active", logs: [], enabled: true, lastRun: "2s ago", runInterval: 0.5, icon: "Sparkles", processesToday: 3842 },
  { id: "auto-generate", name: "Listing Auto-Generate", description: "Automatically generates optimized listing descriptions from minimal input", status: "active", logs: [], enabled: true, lastRun: "5s ago", runInterval: 3, icon: "FileText", processesToday: 1256 },
  { id: "spam-guard", name: "Spam Guard", description: "Monitors all incoming messages and listings for spam/phishing content", status: "active", logs: [], enabled: true, lastRun: "1s ago", runInterval: 2, icon: "ShieldCheck", processesToday: 2187 },
  { id: "price-advisor", name: "Price Advisor", description: "Analyzes market data to suggest competitive pricing for listings", status: "active", logs: [], enabled: true, lastRun: "10s ago", runInterval: 10, icon: "TrendingUp", processesToday: 892 },
  { id: "match-maker", name: "Smart Match Maker", description: "Matches buyers with relevant listings based on browsing history", status: "active", logs: [], enabled: true, lastRun: "3s ago", runInterval: 5, icon: "Heart", processesToday: 1847 },
  { id: "response-assist", name: "Response Assistant", description: "Suggests quick replies for common buyer questions", status: "active", logs: [], enabled: true, lastRun: "7s ago", runInterval: 1, icon: "MessageCircle", processesToday: 2567 },
  { id: "content-moderator", name: "Content Moderator", description: "Reviews images and text for policy compliance", status: "active", logs: [], enabled: true, lastRun: "4s ago", runInterval: 3, icon: "Eye", processesToday: 1234 },
  { id: "translation-agent", name: "Translation Agent", description: "Auto-translates listings to multiple languages for wider reach", status: "idle", logs: [], enabled: true, lastRun: "30s ago", runInterval: 30, icon: "Globe", processesToday: 522 },
];

// ─── Title Suggestions for Sell Form ──────────────────────────
export const TITLE_SUGGESTIONS: Record<string, string[]> = {
  iph: ["iPhone 14 Pro Max - 256GB Space Black", "iPhone 15 - 128GB Brand New", "iPhone 13 Mini - Perfect Condition", "iPhone 15 Pro - 512GB Natural Titanium"],
  mac: ["MacBook Air M2 - Space Gray", "MacBook Pro 14\" M3 - Silver", "MacBook Pro 16\" M2 Pro - Space Black", "MacBook Air M3 - Midnight"],
  sam: ["Samsung Galaxy S24 Ultra - 256GB", "Samsung 55\" Smart TV 4K Crystal", "Samsung Galaxy Watch 6 Classic", "Samsung Galaxy Buds FE"],
  toy: ["Toyota Camry 2019 - Low Mileage", "Toyota Corolla 2021 - Excellent", "Toyota RAV4 2022 - AWD", "Toyota Hilux 2020 - Double Cabin"],
  lap: ["Laptop Stand Adjustable Aluminum", "Laptop Dell Inspiron 15 - i7", "Laptop HP Pavilion 14 - Ryzen 5", "Laptop Lenovo ThinkPad X1 Carbon"],
  son: ["Sony PlayStation 5 - Digital Edition", "Sony WH-1000XM5 Headphones", "Sony Xperia 1 V - 256GB", "Sony Alpha A7 III Camera"],
  air: ["AirPods Pro 2nd Gen - USB-C", "Air Jordan 1 Retro High OG", "Air Conditioner Inverter 1.5HP", "Air Fryer Digital 5.8L"],
  jor: ["Jordan 4 Retro Thunder", "Jordan 11 Retro Concord", "Jordan 1 Low Travis Scott", "Jordan 3 Retro White Cement"],
  nik: ["Nike Air Max 90 - Essential", "Nike Dunks Low Panda", "Nike Air Force 1 White", "Nike Pegasus 40 Running Shoes"],
  gen: ["Generator 3.5KVA - Key Start", "Generator 2.2KVA - Manual Start", "Genuine Leather Messenger Bag", "Gaming Chair Ergonomic"],
  inv: ["Inverter 3KVA/24V - Lithium Battery", "Inverter 1.5KVA/12V System", "Inverter Batteries 200AH (2pcs)", "Inverter 5KVA/48V Solar Hybrid"],
  hou: ["House for Rent - 3BR Lekki Phase 1", "House for Sale - 4BR Ikeja GRA", "House for Rent - 2BR Yaba", "House for Sale - 5BR Banana Island"],
  apl: ["Apple Watch Series 9 - GPS", "Apple iPad Air M2 - 256GB", "Apple Watch Ultra 2 - Titanium", "Apple Magic Keyboard"],
  htc: ["HTC Vive Pro 2 VR Headset", "Hotel Booking Management System"],
  fau: ["Faucet Kitchen Mixer - Chrome", "Fashion Designer Dress - Custom"],
  inv2: ["Inverter Installation Service", "Invicta Pro Diver Watch"],
};

export function getTitleSuggestions(input: string): string[] {
  if (!input || input.length < 3) return [];
  const lower = input.toLowerCase().trim();

  // Check exact prefix matches first
  for (const [prefix, suggestions] of Object.entries(TITLE_SUGGESTIONS)) {
    if (lower.startsWith(prefix) || lower.includes(prefix)) {
      return suggestions.filter((s) =>
        s.toLowerCase().includes(lower) || lower.length <= 5
      );
    }
  }

  // Fuzzy: check if any words in the input match
  const words = lower.split(/\s+/);
  for (const word of words) {
    if (word.length < 2) continue;
    for (const [prefix, suggestions] of Object.entries(TITLE_SUGGESTIONS)) {
      if (word.startsWith(prefix) || prefix.startsWith(word)) {
        return suggestions.slice(0, 3);
      }
    }
  }

  return [];
}

// ─── Description Generation ───────────────────────────────────
export function generateDescription(title: string): string {
  if (!title.trim()) return "";

  const lower = title.toLowerCase();
  const parts: string[] = [];

  parts.push(`Premium ${title.trim()} — available for immediate purchase.`);

  // Detect category from title
  if (/iphone|samsung|pixel|oneplus|xiaomi|tecno|infinix|nokia/i.test(lower)) {
    parts.push("This smartphone is in excellent working condition with no scratches or dents. Comes with original box, charger, and all accessories.");
    parts.push("Battery health is above 90%. Factory reset done and ready for new owner. All features tested and working perfectly.");
    parts.push("Perfect for anyone looking for a reliable device at a great price. Why pay more at the store?");
  } else if (/macbook|laptop|dell|hp|lenovo|thinkpad|asus/i.test(lower)) {
    parts.push("This laptop runs smoothly with no lag or overheating issues. Screen is bright and clear with no dead pixels.");
    parts.push("Comes with original charger. Battery life is excellent — lasts 6+ hours on a single charge.");
    parts.push("Ideal for students, professionals, or anyone needing a powerful computing machine.");
  } else if (/toyota|honda|nissan|mercedes|bmw|hyundai|kia|volkswagen/i.test(lower)) {
    parts.push("Well-maintained vehicle with full service history available. Engine runs perfectly and AC blows cold.");
    parts.push("All paperwork is up to date — customs papers, insurance, and vehicle license. No accident history.");
    parts.push("Test drive available at your convenience. Serious buyers only please. Price is slightly negotiable.");
  } else if (/house|apartment|flat|duplex|terrace|detached/i.test(lower)) {
    parts.push("Located in a serene and secure neighborhood with good road network. Close to major landmarks, schools, and shopping centers.");
    parts.push("Features include spacious rooms, modern finishes, adequate parking space, and 24/7 security.");
    parts.push("Agency fee applies. Inspection available Monday to Saturday. Contact for more details and to schedule a viewing.");
  } else if (/tv|television|smart tv|samsung.*tv|lg.*tv/i.test(lower)) {
    parts.push("Crystal clear picture quality with vibrant colors. Smart TV features give you access to Netflix, YouTube, and more.");
    parts.push("Comes with remote control, stand, and power cable. Wall mount bracket available separately.");
    parts.push("No dead pixels or screen defects. Excellent condition — barely used.");
  } else if (/airpod|headphone|speaker|sound/i.test(lower)) {
    parts.push("Amazing sound quality with deep bass and clear highs. Noise cancellation works perfectly.");
    parts.push("Battery life is excellent. Comes with charging case and original cable.");
    parts.push("Barely used — selling because I upgraded to a newer model.");
  } else if (/watch|smartwatch|fitbit|apple watch|galaxy watch/i.test(lower)) {
    parts.push("Fully functional with all health and fitness tracking features working. Screen has no cracks or scratches.");
    parts.push("Comes with original strap and charging cable. Battery lasts all day on a single charge.");
    parts.push("Barely worn — selling to upgrade. Great gift idea.");
  } else if (/generator|inverter|power|solar/i.test(lower)) {
    parts.push("Reliable and fuel-efficient. Starts on first try with no issues. Recently serviced.");
    parts.push("Perfect for home or office use. Can power all essential appliances including fridge, TV, and lights.");
    parts.push("Selling because I'm relocating. Very durable and built to last.");
  } else if (/shoe|sneaker|jordan|nike|adidas|boot/i.test(lower)) {
    parts.push("100% authentic — purchased from authorized retailer. Worn only a few times, still in great condition.");
    parts.push("Comes with original box and all accessories. No flaws or defects.");
    parts.push("Selling at a fair price. Size as stated — please confirm before ordering.");
  } else if (/camera|lens|canon|sony.*alpha|nikon|drone/i.test(lower)) {
    parts.push("Takes stunning photos and videos. Shutter count is low for the age. Sensor is clean with no dust spots.");
    parts.push("Comes with original battery, charger, strap, and lens cap. Additional accessories included.");
    parts.push("Perfect for both beginners and professionals. A reliable workhorse camera.");
  } else {
    parts.push("Item is in excellent condition and has been well maintained. Selling because I no longer need it.");
    parts.push("Feel free to ask any questions or request more photos. I'm happy to provide additional details.");
    parts.push("Price is fair and slightly negotiable for serious buyers. Available for inspection.");
  }

  parts.push("Fast transaction guaranteed. Meet up in a safe public place or delivery available at buyer's expense. Chat me now for quick response!");

  return parts.join("\n\n");
}

// ─── useAIAgents Hook ────────────────────────────────────────
export function useAIAgents() {
  const [agents, setAgents] = useState<AIAgent[]>(AI_AGENTS_INITIAL.map((a) => ({
    ...a,
    logs: AGENT_LOGS[a.id] || [],
    enabled: true,
  })));
  const [totalProcesses, setTotalProcesses] = useState(12847);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((agent) => {
          if (!agent.enabled) return agent;

          // Randomly update lastRun and increment processes
          const shouldUpdate = Math.random() > 0.6;
          if (shouldUpdate) {
            const newProcesses = agent.processesToday + Math.floor(Math.random() * 3) + 1;
            return {
              ...agent,
              lastRun: "just now",
              status: Math.random() > 0.05 ? "active" as const : ("error" as const),
              processesToday: newProcesses,
            };
          }

          // Update lastRun text
          const currentSeconds = parseInt(agent.lastRun.replace(/\D/g, "")) || agent.runInterval;
          const newSeconds = Math.min(currentSeconds + agent.runInterval, 60);
          const timeText = newSeconds < 60 ? `${newSeconds}s ago` : "1m ago";
          return {
            ...agent,
            lastRun: timeText,
            status: timeText.includes("m") ? "idle" as const : agent.status,
          };
        })
      );
      setTotalProcesses((prev) => prev + Math.floor(Math.random() * 5) + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const toggleAgent = useCallback((agentId: string) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === agentId
          ? {
              ...agent,
              enabled: !agent.enabled,
              status: agent.enabled ? "idle" as const : "active" as const,
            }
          : agent
      )
    );
  }, []);

  const activeCount = agents.filter((a) => a.status === "active" && a.enabled).length;
  const idleCount = agents.filter((a) => a.status === "idle" || !a.enabled).length;
  const errorCount = agents.filter((a) => a.status === "error").length;

  return {
    agents,
    totalProcesses,
    activeCount,
    idleCount,
    errorCount,
    toggleAgent,
  };
}
