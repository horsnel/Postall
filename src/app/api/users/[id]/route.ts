
import { NextResponse } from "next/server";
import { createClient } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "User ID or username is required" },
        { status: 400 }
      );
    }

    // Try to find by ID first, then by username
    let user = await supabase
      .from("profiles")
      .select("id, username, photo, bio, city, skills, rating, total_reviews, tasks_completed, response_time, member_since, is_verified")
      .eq("id", id)
      .maybeSingle();

    if (!user.data) {
      user = await supabase
        .from("profiles")
        .select("id, username, photo, bio, city, skills, rating, total_reviews, tasks_completed, response_time, member_since, is_verified")
        .eq("username", id)
        .maybeSingle();
    }

    if (!user.data) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const profile = user.data;

    // Count active tasks, active listings, and reviews received in parallel
    const [activeTasksRes, activeListingsRes, reviewsReceivedRes] =
      await Promise.all([
        supabase
          .from("tasks")
          .select("*", { count: "exact", head: true })
          .eq("posted_by_id", profile.id)
          .in("status", ["open", "assigned", "in_progress"]),
        supabase
          .from("listings")
          .select("*", { count: "exact", head: true })
          .eq("posted_by_id", profile.id)
          .eq("status", "active"),
        supabase
          .from("reviews")
          .select("*", { count: "exact", head: true })
          .eq("reviewee_id", profile.id),
      ]);

    // Parse skills from JSON string
    let parsedSkills: string[] = [];
    try {
      parsedSkills = JSON.parse(profile.skills || "[]");
    } catch {
      parsedSkills = [];
    }

    return NextResponse.json({
      id: profile.id,
      username: profile.username,
      photo: profile.photo,
      bio: profile.bio,
      city: profile.city,
      skills: parsedSkills,
      rating: profile.rating,
      totalReviews: profile.total_reviews,
      tasksCompleted: profile.tasks_completed,
      responseTime: profile.response_time,
      memberSince: profile.member_since,
      isVerified: profile.is_verified,
      activeTasksCount: activeTasksRes.count ?? 0,
      activeListingsCount: activeListingsRes.count ?? 0,
      reviewsReceivedCount: reviewsReceivedRes.count ?? 0,
    });
  } catch (error) {
    console.error("Fetch user profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
