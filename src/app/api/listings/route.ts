
import { NextResponse } from "next/server";
import { createClient } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const condition = searchParams.get("condition");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const postedById = searchParams.get("postedById");

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    // Determine order column and direction
    let orderColumn = "created_at";
    let ascending = false;
    if (sort === "price_high") { orderColumn = "price"; ascending = false; }
    else if (sort === "price_low") { orderColumn = "price"; ascending = true; }
    else if (sort === "oldest") { orderColumn = "created_at"; ascending = true; }
    else if (sort === "popular") { orderColumn = "view_count"; ascending = false; }

    // Build base query
    let query = supabase
      .from("listings")
      .select("*", { count: "exact" })
      .order(orderColumn, { ascending })
      .range(start, end);

    // Apply filters
    const isOwnerView = !!postedById;
    if (!isOwnerView) {
      query = query.eq("status", "active");
    }

    if (category && category !== "all") {
      query = query.eq("category", category);
    }
    if (city && city !== "all") {
      query = query.eq("city", city);
    }
    if (condition && condition !== "all") {
      query = query.eq("condition", condition);
    }
    if (postedById) {
      query = query.eq("posted_by_id", postedById);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: listings, count: total, error } = await query;

    if (error) {
      console.error("Fetch listings error:", error);
      return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
    }

    // Fetch postedBy profile data
    const posterIds = [...new Set((listings ?? []).map((l: Record<string, unknown>) => l.posted_by_id) as string[])];
    let profilesMap: Record<string, Record<string, unknown>> = {};
    if (posterIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, photo, city, rating, is_verified")
        .in("id", posterIds);

      if (profiles) {
        profilesMap = Object.fromEntries(profiles.map((p: Record<string, unknown>) => [p.id, p]));
      }
    }

    // Merge profile data into listings
    const enrichedListings = listings?.map((listing: Record<string, unknown>) => ({
      ...listing,
      postedBy: profilesMap[listing.posted_by_id as string]
        ? {
            id: profilesMap[listing.posted_by_id as string].id,
            username: profilesMap[listing.posted_by_id as string].username,
            photo: profilesMap[listing.posted_by_id as string].photo,
            city: profilesMap[listing.posted_by_id as string].city,
            rating: profilesMap[listing.posted_by_id as string].rating,
            isVerified: profilesMap[listing.posted_by_id as string].is_verified,
          }
        : null,
    }));

    return NextResponse.json({
      listings: enrichedListings ?? [],
      pagination: {
        page,
        limit,
        total: total ?? 0,
        totalPages: Math.ceil((total ?? 0) / limit),
      },
    });
  } catch (error) {
    console.error("Fetch listings error:", error);
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const body = await request.json();
    const {
      title,
      description,
      category,
      subcategory,
      price,
      currency,
      condition,
      city,
      location,
      latitude,
      longitude,
      status,
      photos,
      deliveryOptions,
      postedById,
    } = body;

    if (!title || !description || !category || !price || !city || !postedById) {
      return NextResponse.json(
        { error: "title, description, category, price, city, and postedById are required" },
        { status: 400 }
      );
    }

    // Verify user (profile) exists
    const { data: user } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", postedById)
      .maybeSingle();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { data: listing, error } = await supabase
      .from("listings")
      .insert({
        title,
        description,
        category,
        subcategory: subcategory || null,
        price: parseFloat(price),
        currency: currency || "USD",
        condition: condition || null,
        city,
        location: location || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        status: status || "active",
        photos: photos || "[]",
        delivery_options: deliveryOptions || "{}",
        posted_by_id: postedById,
      })
      .select()
      .single();

    if (error) {
      console.error("Create listing error:", error);
      return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
    }

    // Fetch the poster's profile for the response
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, username, photo, city, rating, is_verified")
      .eq("id", postedById)
      .maybeSingle();

    const enrichedListing = {
      ...listing,
      postedBy: profile
        ? {
            id: profile.id,
            username: profile.username,
            photo: profile.photo,
            city: profile.city,
            rating: profile.rating,
            isVerified: profile.is_verified,
          }
        : null,
    };

    return NextResponse.json(enrichedListing, { status: 201 });
  } catch (error) {
    console.error("Create listing error:", error);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}
