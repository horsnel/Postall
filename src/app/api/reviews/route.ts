
import { NextResponse } from "next/server";
import { createClient } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const taskId = searchParams.get("taskId");
    const listingId = searchParams.get("listingId");

    if (!userId && !taskId && !listingId) {
      return NextResponse.json(
        { error: "At least one filter is required (userId, taskId, or listingId)" },
        { status: 400 }
      );
    }

    // Build query
    let query = supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("reviewee_id", userId);
    }
    if (taskId) {
      query = query.eq("task_id", taskId);
    }
    if (listingId) {
      query = query.eq("listing_id", listingId);
    }

    const { data: reviews, error } = await query;

    if (error) {
      console.error("Fetch reviews error:", error);
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }

    // Fetch reviewer profiles
    const reviewerIds = [...new Set((reviews ?? []).map((r: Record<string, unknown>) => r.reviewer_id) as string[])];
    let profilesMap: Record<string, Record<string, unknown>> = {};
    if (reviewerIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, photo, is_verified")
        .in("id", reviewerIds);

      if (profiles) {
        profilesMap = Object.fromEntries(profiles.map((p: Record<string, unknown>) => [p.id, p]));
      }
    }

    // Merge reviewer data
    const enrichedReviews = reviews?.map((review: Record<string, unknown>) => ({
      ...review,
      reviewer: profilesMap[review.reviewer_id as string]
        ? {
            id: profilesMap[review.reviewer_id as string].id,
            username: profilesMap[review.reviewer_id as string].username,
            photo: profilesMap[review.reviewer_id as string].photo,
            isVerified: profilesMap[review.reviewer_id as string].is_verified,
          }
        : null,
    }));

    // If filtering by userId (reviewee), return aggregate stats
    let stats: { averageRating: number; totalReviews: number; distribution: Record<number, number> } | null = null;
    if (userId) {
      const { data: allReviews } = await supabase
        .from("reviews")
        .select("rating")
        .eq("reviewee_id", userId);

      const total = allReviews?.length ?? 0;
      const average = total > 0
        ? allReviews!.reduce((sum, r) => sum + (r.rating as number), 0) / total
        : 0;

      // Distribution by stars (1-5)
      const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      allReviews?.forEach((r) => {
        distribution[r.rating as number] = (distribution[r.rating as number] || 0) + 1;
      });

      stats = {
        averageRating: Math.round(average * 10) / 10,
        totalReviews: total,
        distribution,
      };
    }

    return NextResponse.json({ reviews: enrichedReviews ?? [], stats });
  } catch (error) {
    console.error("Fetch reviews error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { reviewerId, revieweeId, taskId, listingId, rating, comment } = body;

    if (!reviewerId || !revieweeId || !rating) {
      return NextResponse.json(
        { error: "Reviewer ID, reviewee ID, and rating are required" },
        { status: 400 }
      );
    }

    // Validate rating is 1-5
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be an integer between 1 and 5" },
        { status: 400 }
      );
    }

    // Validate reviewer != reviewee
    if (reviewerId === revieweeId) {
      return NextResponse.json(
        { error: "You cannot review yourself" },
        { status: 400 }
      );
    }

    // Verify reviewee exists
    const { data: reviewee } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", revieweeId)
      .maybeSingle();

    if (!reviewee) {
      return NextResponse.json({ error: "Reviewee not found" }, { status: 404 });
    }

    // Prevent duplicate reviews (same reviewer + reviewee + task/listing)
    let duplicateQuery = supabase
      .from("reviews")
      .select("id")
      .eq("reviewer_id", reviewerId)
      .eq("reviewee_id", revieweeId);

    if (taskId) {
      duplicateQuery = duplicateQuery.eq("task_id", taskId);
    } else if (listingId) {
      duplicateQuery = duplicateQuery.eq("listing_id", listingId);
    }

    const { data: existingReview } = await duplicateQuery.maybeSingle();

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this user for this item" },
        { status: 409 }
      );
    }

    // Create the review
    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        reviewer_id: reviewerId,
        reviewee_id: revieweeId,
        task_id: taskId || null,
        listing_id: listingId || null,
        rating,
        comment: comment || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Create review error:", error);
      return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
    }

    // Fetch reviewer profile for the response
    const { data: reviewerProfile } = await supabase
      .from("profiles")
      .select("id, username, photo, is_verified")
      .eq("id", reviewerId)
      .maybeSingle();

    const enrichedReview = {
      ...review,
      reviewer: reviewerProfile
        ? {
            id: reviewerProfile.id,
            username: reviewerProfile.username,
            photo: reviewerProfile.photo,
            isVerified: reviewerProfile.is_verified,
          }
        : null,
    };

    // Recalculate reviewee's average rating and totalReviews
    const { data: allReviewsForUser } = await supabase
      .from("reviews")
      .select("rating")
      .eq("reviewee_id", revieweeId);

    const total = allReviewsForUser?.length ?? 0;
    const average = total > 0
      ? allReviewsForUser!.reduce((sum, r) => sum + r.rating, 0) / total
      : 0;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        rating: Math.round(average * 10) / 10,
        total_reviews: total,
      })
      .eq("id", revieweeId);

    if (updateError) {
      console.error("Update profile rating error:", updateError);
    }

    return NextResponse.json({ success: true, review: enrichedReview }, { status: 201 });
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
