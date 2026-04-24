
import { NextResponse } from "next/server";
import { createClient } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const reason = searchParams.get("reason");
    const targetType = searchParams.get("targetType");
    const reporterId = searchParams.get("reporterId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    // Build base query
    let query = supabase
      .from("reports")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(start, end);

    if (status) query = query.eq("status", status);
    if (reason) query = query.eq("reason", reason);
    if (targetType) query = query.eq("target_type", targetType);
    if (reporterId) query = query.eq("reporter_id", reporterId);

    const { data: reports, count: total, error: reportsError } = await query;

    if (reportsError) {
      console.error("Fetch reports error:", reportsError);
      return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
    }

    // Fetch stats in parallel
    let statsPendingQuery = supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");
    let statsReviewedQuery = supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("status", "reviewed");
    let statsDismissedQuery = supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("status", "dismissed");

    // Apply the same filters to stats queries for pending/reviewed/dismissed
    // Actually the original counts only filter by status, not by other filters
    const [{ count: statsPending }, { count: statsReviewed }, { count: statsDismissed }] =
      await Promise.all([statsPendingQuery, statsReviewedQuery, statsDismissedQuery]);

    // Fetch related task data for reports that have target_type = 'task'
    const taskTargetIds = reports
      ?.filter((r: Record<string, unknown>) => r.target_type === "task")
      .map((r: Record<string, unknown>) => r.target_id) as string[] | undefined;

    let tasksMap: Record<string, Record<string, unknown>> = {};
    if (taskTargetIds && taskTargetIds.length > 0) {
      const { data: tasks } = await supabase
        .from("tasks")
        .select("id, title, status")
        .in("id", taskTargetIds);

      if (tasks) {
        tasksMap = Object.fromEntries(tasks.map((t: Record<string, unknown>) => [t.id, t]));
      }
    }

    // Merge task data into reports
    const enrichedReports = reports?.map((report: Record<string, unknown>) => ({
      ...report,
      task: report.target_type === "task" ? tasksMap[report.target_id as string] || null : null,
    }));

    return NextResponse.json({
      reports: enrichedReports ?? [],
      stats: {
        total: total ?? 0,
        pending: statsPending ?? 0,
        reviewed: statsReviewed ?? 0,
        dismissed: statsDismissed ?? 0,
      },
      pagination: {
        page,
        limit,
        total: total ?? 0,
        totalPages: Math.ceil((total ?? 0) / limit),
      },
    });
  } catch (error) {
    console.error("Fetch reports error:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { reporterId, targetType, targetId, reason, description } = body;

    if (!reporterId || !targetType || !targetId || !reason) {
      return NextResponse.json(
        { error: "reporterId, targetType, targetId, and reason are required" },
        { status: 400 }
      );
    }

    const validTypes = ["task", "listing", "user", "message"];
    const validReasons = ["spam", "inappropriate", "scam", "duplicate", "offensive", "other"];

    if (!validTypes.includes(targetType)) {
      return NextResponse.json(
        { error: `Invalid targetType. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    if (!validReasons.includes(reason)) {
      return NextResponse.json(
        { error: `Invalid reason. Must be one of: ${validReasons.join(", ")}` },
        { status: 400 }
      );
    }

    // Verify target exists (for task/listing)
    if (targetType === "task") {
      const { data: task } = await supabase
        .from("tasks")
        .select("id")
        .eq("id", targetId)
        .maybeSingle();
      if (!task) {
        return NextResponse.json({ error: "Target task not found" }, { status: 404 });
      }
    } else if (targetType === "listing") {
      const { data: listing } = await supabase
        .from("listings")
        .select("id")
        .eq("id", targetId)
        .maybeSingle();
      if (!listing) {
        return NextResponse.json({ error: "Target listing not found" }, { status: 404 });
      }
    }

    // Check for duplicate report
    const { data: existingReport } = await supabase
      .from("reports")
      .select("id")
      .eq("reporter_id", reporterId)
      .eq("target_type", targetType)
      .eq("target_id", targetId)
      .eq("status", "pending")
      .maybeSingle();

    if (existingReport) {
      return NextResponse.json(
        { error: "You have already reported this item. It is being reviewed." },
        { status: 409 }
      );
    }

    const { data: report, error } = await supabase
      .from("reports")
      .insert({
        reporter_id: reporterId,
        target_type: targetType,
        target_id: targetId,
        reason,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Create report error:", error);
      return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
    }

    return NextResponse.json(
      { report, message: "Report submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Submit report error:", error);
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Report ID and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "reviewed", "dismissed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const { data: existingReport, error: findError } = await supabase
      .from("reports")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (findError || !existingReport) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const { data: report, error } = await supabase
      .from("reports")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update report error:", error);
      return NextResponse.json({ error: "Failed to update report" }, { status: 500 });
    }

    return NextResponse.json({
      report,
      message: `Report status updated to ${status}`,
    });
  } catch (error) {
    console.error("Update report error:", error);
    return NextResponse.json({ error: "Failed to update report" }, { status: 500 });
  }
}
