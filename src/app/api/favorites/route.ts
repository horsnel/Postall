
import { NextResponse } from "next/server";
import { createClient } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const favorites = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (favorites.error) {
      console.error("Fetch favorites error:", favorites.error);
      return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
    }

    // Enrich favorites with target details
    const enrichedFavorites = await Promise.all(
      (favorites.data || []).map(async (fav: Record<string, unknown>) => {
        let target: Record<string, unknown> | null = null;

        if (fav.target_type === "task") {
          const { data: task } = await supabase
            .from("tasks")
            .select("id, title, description, budget, currency, city, category, urgency, status, photos, created_at, posted_by_id")
            .eq("id", fav.target_id)
            .maybeSingle();

          if (task) {
            // Fetch poster profile
            const { data: poster } = await supabase
              .from("profiles")
              .select("id, username, photo, is_verified, rating")
              .eq("id", task.posted_by_id)
              .maybeSingle();

            target = {
              id: task.id,
              title: task.title,
              description: task.description,
              budget: task.budget,
              currency: task.currency,
              city: task.city,
              category: task.category,
              urgency: task.urgency,
              status: task.status,
              photos: task.photos,
              createdAt: task.created_at,
              postedBy: poster ? {
                id: poster.id,
                username: poster.username,
                photo: poster.photo,
                isVerified: poster.is_verified,
                rating: poster.rating,
              } : null,
              type: "task",
            };
          }
        } else if (fav.target_type === "listing") {
          const { data: listing } = await supabase
            .from("listings")
            .select("id, title, description, price, currency, city, category, condition, status, photos, created_at, posted_by_id")
            .eq("id", fav.target_id)
            .maybeSingle();

          if (listing) {
            const { data: poster } = await supabase
              .from("profiles")
              .select("id, username, photo, is_verified, rating")
              .eq("id", listing.posted_by_id)
              .maybeSingle();

            target = {
              id: listing.id,
              title: listing.title,
              description: listing.description,
              price: listing.price,
              currency: listing.currency,
              city: listing.city,
              category: listing.category,
              condition: listing.condition,
              status: listing.status,
              photos: listing.photos,
              createdAt: listing.created_at,
              postedBy: poster ? {
                id: poster.id,
                username: poster.username,
                photo: poster.photo,
                isVerified: poster.is_verified,
                rating: poster.rating,
              } : null,
              type: "listing",
            };
          }
        }

        return {
          ...fav,
          target,
        };
      })
    );

    return NextResponse.json({ favorites: enrichedFavorites });
  } catch (error) {
    console.error("Fetch favorites error:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const body = await request.json();
    const { userId, targetType, targetId } = body;

    if (!userId || !targetType || !targetId) {
      return NextResponse.json(
        { error: "User ID, target type, and target ID are required" },
        { status: 400 }
      );
    }

    if (targetType !== "task" && targetType !== "listing") {
      return NextResponse.json(
        { error: "Target type must be 'task' or 'listing'" },
        { status: 400 }
      );
    }

    // Check if favorite already exists
    const { data: existing } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("target_type", targetType)
      .eq("target_id", targetId)
      .maybeSingle();

    if (existing) {
      // Unfavorite
      const { error: deleteError } = await supabase
        .from("favorites")
        .delete()
        .eq("id", existing.id);

      if (deleteError) {
        console.error("Delete favorite error:", deleteError);
        return NextResponse.json({ error: "Failed to unfavorite" }, { status: 500 });
      }

      return NextResponse.json({ favorited: false });
    }

    // Create favorite
    const { data: favorite, error } = await supabase
      .from("favorites")
      .insert({
        user_id: userId,
        target_type: targetType,
        target_id: targetId,
      })
      .select()
      .single();

    if (error) {
      console.error("Create favorite error:", error);
      return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 });
    }

    return NextResponse.json({ favorited: true, favorite }, { status: 201 });
  } catch (error) {
    console.error("Toggle favorite error:", error);
    return NextResponse.json(
      { error: "Failed to toggle favorite" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const body = await request.json();
    const { userId, targetType, targetId } = body;

    if (!userId || !targetType || !targetId) {
      return NextResponse.json(
        { error: "User ID, target type, and target ID are required" },
        { status: 400 }
      );
    }

    // Check if favorite exists
    const { data: existing } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("target_type", targetType)
      .eq("target_id", targetId)
      .maybeSingle();

    if (!existing) {
      return NextResponse.json(
        { error: "Favorite not found" },
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", existing.id);

    if (error) {
      console.error("Delete favorite error:", error);
      return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Favorite removed" });
  } catch (error) {
    console.error("Remove favorite error:", error);
    return NextResponse.json(
      { error: "Failed to remove favorite" },
      { status: 500 }
    );
  }
}
