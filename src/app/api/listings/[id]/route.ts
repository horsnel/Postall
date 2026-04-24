
import { NextResponse } from "next/server";
import { createClient } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const { id } = await params;

    const { data: listing, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Fetch postedBy profile data
    const { data: poster } = await supabase
      .from("profiles")
      .select("id, username, full_name, photo, city, rating, total_reviews, is_verified, member_since")
      .eq("id", listing.posted_by_id)
      .maybeSingle();

    // Fetch active escrows for this listing
    const { data: escrows } = await supabase
      .from("escrows")
      .select("*")
      .eq("reference_id", id)
      .eq("reference_type", "listing")
      .in("status", ["pending", "funded"]);

    // Increment view count
    await supabase
      .from("listings")
      .update({ view_count: (listing.view_count || 0) + 1 })
      .eq("id", id);

    return NextResponse.json({
      ...listing,
      postedBy: poster ? {
        id: poster.id,
        username: poster.username,
        fullName: poster.full_name,
        photo: poster.photo,
        city: poster.city,
        rating: poster.rating,
        totalReviews: poster.total_reviews,
        isVerified: poster.is_verified,
        memberSince: poster.member_since,
      } : null,
      escrows: escrows ?? [],
    });
  } catch (error) {
    console.error("Fetch listing error:", error);
    return NextResponse.json(
      { error: "Failed to fetch listing" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const { id } = await params;
    const body = await request.json();

    // Check listing exists
    const { data: existing } = await supabase
      .from("listings")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (!existing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Build update data from allowed fields (convert camelCase to snake_case)
    const updateData: Record<string, unknown> = {};
    const fieldMapping: Record<string, string> = {
      title: "title",
      description: "description",
      category: "category",
      subcategory: "subcategory",
      price: "price",
      currency: "currency",
      condition: "condition",
      city: "city",
      location: "location",
      latitude: "latitude",
      longitude: "longitude",
      photos: "photos",
      deliveryOptions: "delivery_options",
      status: "status",
    };

    for (const [field, dbField] of Object.entries(fieldMapping)) {
      if (body[field] !== undefined) {
        if (field === "price") {
          updateData[dbField] = parseFloat(body[field]);
        } else if (field === "latitude" || field === "longitude") {
          updateData[dbField] = body[field] ? parseFloat(body[field]) : null;
        } else {
          updateData[dbField] = body[field];
        }
      }
    }

    const { data: listing, error } = await supabase
      .from("listings")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update listing error:", error);
      return NextResponse.json({ error: "Failed to update listing" }, { status: 500 });
    }

    // Fetch poster profile for the response
    const { data: poster } = await supabase
      .from("profiles")
      .select("id, username, photo, city, rating, is_verified")
      .eq("id", listing.posted_by_id)
      .maybeSingle();

    return NextResponse.json({
      ...listing,
      postedBy: poster ? {
        id: poster.id,
        username: poster.username,
        photo: poster.photo,
        city: poster.city,
        rating: poster.rating,
        isVerified: poster.is_verified,
      } : null,
    });
  } catch (error) {
    console.error("Update listing error:", error);
    return NextResponse.json(
      { error: "Failed to update listing" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const { id } = await params;

    // Check listing exists
    const { data: existing } = await supabase
      .from("listings")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (!existing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Soft delete: set status to expired
    const { data: listing, error } = await supabase
      .from("listings")
      .update({ status: "expired" })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Delete listing error:", error);
      return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      listing,
      message: "Listing has been removed (soft deleted)",
    });
  } catch (error) {
    console.error("Delete listing error:", error);
    return NextResponse.json(
      { error: "Failed to delete listing" },
      { status: 500 }
    );
  }
}
