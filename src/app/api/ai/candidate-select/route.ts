
import { NextRequest, NextResponse } from "next/server";

// Mock worker pool
const workerPool = [
  { id: "w1", name: "Emeka Okafor", initials: "EO", city: "Lagos", state: "Lagos", role: "Freelancer", rating: 4.9, completed: 47, rate: 15000, skills: ["react", "next.js", "node.js", "typescript", "web development", "landing page", "ui/ux", "frontend"], bio: "Full-stack developer with 5 years experience." },
  { id: "w2", name: "Amina Kenyatta", initials: "AK", city: "Accra", state: "Greater Accra", role: "Service Provider", rating: 4.7, completed: 32, rate: 12000, skills: ["design", "branding", "logo", "photoshop", "illustrator", "graphic design", "creative"], bio: "Creative designer and branding expert." },
  { id: "w3", name: "Kwame Mensah", initials: "KM", city: "Lagos", state: "Lagos", role: "Errand Runner", rating: 4.8, completed: 63, rate: 8000, skills: ["delivery", "errands", "logistics", "moving", "transportation", "driving"], bio: "Fast and reliable. Deliveries, errands, and logistics." },
  { id: "w4", name: "Fatima Al-Rashid", initials: "FA", city: "Abuja", state: "Abuja", role: "Freelancer", rating: 5.0, completed: 21, rate: 20000, skills: ["social media", "marketing", "strategy", "content creation", "instagram", "tiktok", "facebook ads"], bio: "Social media strategist. 50+ brands to 100K+ followers." },
  { id: "w5", name: "Chinedu Eze", initials: "CE", city: "Lagos", state: "Lagos", role: "Errand Runner", rating: 4.6, completed: 89, rate: 7500, skills: ["moving", "cleaning", "delivery", "errands", "packing", "furniture assembly"], bio: "Your go-to guy for anything. Moving, cleaning, delivery." },
  { id: "w6", name: "Blessing Okoro", initials: "BO", city: "Port Harcourt", state: "Rivers", role: "Service Provider", rating: 4.9, completed: 54, rate: 10000, skills: ["plumbing", "electrical", "home repair", "maintenance", "ac repair", "generator repair"], bio: "Professional plumber and electrician. 10 years experience." },
  { id: "w7", name: "David Osei", initials: "DO", city: "Accra", state: "Greater Accra", role: "Freelancer", rating: 4.5, completed: 18, rate: 18000, skills: ["mobile development", "flutter", "react native", "kotlin", "ios", "android", "app development"], bio: "Mobile app developer. Flutter, React Native, Kotlin expert." },
  { id: "w8", name: "Zainab Mohammed", initials: "ZM", city: "Abuja", state: "Abuja", role: "Real Estate Agent", rating: 4.8, completed: 29, rate: 25000, skills: ["real estate", "property", "housing", "rentals", "land", "house hunting", "negotiation"], bio: "Premium property agent. Best homes and deals in Abuja." },
  { id: "w9", name: "Tunde Bakare", initials: "TB", city: "Lagos", state: "Lagos", role: "Freelancer", rating: 4.7, completed: 41, rate: 14000, skills: ["python", "data analysis", "machine learning", "excel", "sql", "data science", "automation"], bio: "Data scientist and Python developer. Analytics expert." },
  { id: "w10", name: "Chioma Nwosu", initials: "CN", city: "Enugu", state: "Enugu", role: "Service Provider", rating: 4.6, completed: 36, rate: 9000, skills: ["cleaning", "laundry", "home cleaning", "office cleaning", "deep cleaning", "organization"], bio: "Professional cleaning service. Homes and offices." },
];

interface CandidateRequest {
  taskId: string;
  taskDescription: string;
  taskSkills: string[];
  location: string;
  budget: number;
}

function calculateSkillMatch(workerSkills: string[], taskSkills: string[]): number {
  if (taskSkills.length === 0) return 0.5;
  const workerLower = workerSkills.map((s) => s.toLowerCase());
  const matched = taskSkills.filter((s) =>
    workerLower.some((ws) => ws.includes(s.toLowerCase()) || s.toLowerCase().includes(ws))
  );
  return matched.length / taskSkills.length;
}

function calculateLocationMatch(workerLocation: string, taskLocation: string): number {
  const wLower = workerLocation.toLowerCase();
  const tLower = taskLocation.toLowerCase();
  if (wLower === tLower) return 1.0;
  // Same state bonus
  if (wLower.includes(tLower) || tLower.includes(wLower)) return 0.8;
  return 0.3;
}

function calculateBudgetFit(workerRate: number, budget: number): number {
  if (budget <= 0) return 0.5;
  const ratio = workerRate / budget;
  if (ratio <= 1.0) return 1.0; // Worker rate within budget
  if (ratio <= 1.2) return 0.7; // Slightly over budget
  if (ratio <= 1.5) return 0.4; // Moderately over budget
  return 0.1; // Way over budget
}

export async function POST(request: NextRequest) {
  try {
    const body: CandidateRequest = await request.json();
    const { taskId, taskDescription, taskSkills, location, budget } = body;

    if (!taskId || !taskDescription) {
      return NextResponse.json(
        { error: "taskId and taskDescription are required" },
        { status: 400 }
      );
    }

    // Score each worker
    const scored = workerPool.map((worker) => {
      const skillMatch = calculateSkillMatch(worker.skills, taskSkills);
      const locationMatch = calculateLocationMatch(worker.city, location);
      const budgetFit = calculateBudgetFit(worker.rate, budget);
      const ratingScore = worker.rating / 5.0;
      const experienceScore = Math.min(worker.completed / 50, 1.0);

      // Weighted composite score
      const totalScore =
        skillMatch * 0.35 +
        ratingScore * 0.2 +
        locationMatch * 0.15 +
        budgetFit * 0.15 +
        experienceScore * 0.15;

      return {
        ...worker,
        scores: {
          skillMatch: Math.round(skillMatch * 100),
          locationMatch: Math.round(locationMatch * 100),
          budgetFit: Math.round(budgetFit * 100),
          ratingScore: Math.round(ratingScore * 100),
          experienceScore: Math.round(experienceScore * 100),
        },
        totalScore: Math.round(totalScore * 100),
      };
    });

    // Sort by total score descending, take top 3
    const topCandidates = scored
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 3);

    // Generate reasoning
    const reasoning = `Based on AI analysis of ${workerPool.length} available workers for "${taskDescription}": ` +
      topCandidates.map((c, i) => {
        const reasons: string[] = [];
        if (c.scores.skillMatch >= 70) reasons.push(`strong skill match (${c.scores.skillMatch}%)`);
        if (c.scores.locationMatch >= 80) reasons.push(`located in ${c.city}`);
        if (c.scores.ratingScore >= 90) reasons.push(`excellent ${c.rating}-star rating`);
        if (c.scores.experienceScore >= 60) reasons.push(`${c.completed} completed tasks`);
        return `#${i + 1} ${c.name} (${reasons.join(", ")})`;
      }).join(". ");

    return NextResponse.json({
      taskId,
      candidates: topCandidates.map((c) => ({
        id: c.id,
        name: c.name,
        initials: c.initials,
        city: c.city,
        state: c.state,
        role: c.role,
        rating: c.rating,
        completed: c.completed,
        rate: `₦${c.rate.toLocaleString()}/hr`,
        bio: c.bio,
        confidenceScore: c.totalScore,
        scores: c.scores,
      })),
      reasoning,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[AI Candidate Select] Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze candidates" },
      { status: 500 }
    );
  }
}
