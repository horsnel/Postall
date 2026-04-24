
import { NextResponse } from "next/server";
import { createClient } from "@/lib/db";

export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const { data: cities, error } = await supabase
      .from("cities")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) {
      console.error("Fetch cities error:", error);
      return NextResponse.json({ error: "Failed to fetch cities" }, { status: 500 });
    }

    return NextResponse.json(cities ?? []);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cities" }, { status: 500 });
  }
}
