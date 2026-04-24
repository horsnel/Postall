
import { NextResponse } from "next/server";
import { createClient } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const body = await request.json();
    const { type, description, reporterId, targetType, targetId } = body;

    if (!type || !description) {
      return NextResponse.json(
        { error: "Type and description are required" },
        { status: 400 }
      );
    }

    const validTypes = [
      "dispute",
      "scam",
      "safety_concern",
      "other",
    ];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid report type" },
        { status: 400 }
      );
    }

    const { data: report, error } = await supabase
      .from("reports")
      .insert({
        reporter_id: reporterId || "anonymous",
        target_type: targetType || "other",
        target_id: targetId || "emergency-report",
        reason: type,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Create emergency report error:", error);
      return NextResponse.json({ error: "Failed to submit emergency report" }, { status: 500 });
    }

    return NextResponse.json(
      {
        id: report.id,
        message:
          "Your report has been submitted. Our safety team will review it within 24 hours.",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit emergency report" },
      { status: 500 }
    );
  }
}
