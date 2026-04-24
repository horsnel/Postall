
import { NextResponse } from "next/server";
import { createClient } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");

    let query = supabase
      .from("safe_spots")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (city && city !== "all") {
      query = query.eq("city", city);
    }

    const { data: safeSpots, error } = await query;

    if (error) {
      console.error("Fetch safe spots error:", error);
      return NextResponse.json({ error: "Failed to fetch safe spots" }, { status: 500 });
    }

    // Count total approved safe spots
    const { count: total } = await supabase
      .from("safe_spots")
      .select("*", { count: "exact", head: true })
      .eq("is_approved", true);

    // Get unique cities that have approved safe spots
    const { data: citiesRows } = await supabase
      .from("safe_spots")
      .select("city")
      .eq("is_approved", true);

    const uniqueCities = new Set((citiesRows || []).map((r: Record<string, unknown>) => r.city as string));

    return NextResponse.json({
      safeSpots: safeSpots ?? [],
      total: total ?? 0,
      citiesCovered: uniqueCities.size,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch safe spots" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const body = await request.json();
    const { name, type, address, city, latitude, longitude, submittedById } =
      body;

    if (!name || !type || !address || !city) {
      return NextResponse.json(
        { error: "Name, type, address, and city are required" },
        { status: 400 }
      );
    }

    const validTypes = [
      "police_station",
      "mall",
      "bank",
      "restaurant",
      "library",
    ];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid safe spot type" },
        { status: 400 }
      );
    }

    const { data: safeSpot, error } = await supabase
      .from("safe_spots")
      .insert({
        name,
        type,
        address,
        city,
        latitude: latitude || 0,
        longitude: longitude || 0,
        submitted_by_id: submittedById || null,
        is_approved: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Create safe spot error:", error);
      return NextResponse.json({ error: "Failed to suggest safe spot" }, { status: 500 });
    }

    return NextResponse.json(safeSpot, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to suggest safe spot" },
      { status: 500 }
    );
  }
}
