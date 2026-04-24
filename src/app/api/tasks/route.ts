
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
    const urgency = searchParams.get("urgency");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const postedById = searchParams.get("postedById");
    const status = searchParams.get("status");

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    // Determine order column and direction
    let orderColumn = "created_at";
    let ascending = false;
    if (sort === "budget_high") { orderColumn = "budget"; ascending = false; }
    else if (sort === "budget_low") { orderColumn = "budget"; ascending = true; }
    else if (sort === "oldest") { orderColumn = "created_at"; ascending = true; }
    else if (sort === "deadline") { orderColumn = "deadline"; ascending = true; }
    else if (sort === "popular") { orderColumn = "view_count"; ascending = false; }

    // Build base query
    let query = supabase
      .from("tasks")
      .select("*", { count: "exact" })
      .order(orderColumn, { ascending })
      .range(start, end);

    // Default to open tasks only unless status filter is provided
    if (status) {
      query = query.eq("status", status);
    } else if (!postedById) {
      query = query.eq("status", "open");
    }

    if (category && category !== "all") {
      query = query.eq("category", category);
    }
    if (city && city !== "all") {
      query = query.eq("city", city);
    }
    if (urgency && urgency !== "all") {
      query = query.eq("urgency", urgency);
    }
    if (postedById) {
      query = query.eq("posted_by_id", postedById);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: tasks, count: total, error } = await query;

    if (error) {
      console.error("Fetch tasks error:", error);
      return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }

    // Fetch related profile data
    const posterIds = [...new Set((tasks ?? []).map((t: Record<string, unknown>) => t.posted_by_id) as string[])];
    const assigneeIds = [...new Set(
      (tasks ?? [])
        .filter((t: Record<string, unknown>) => t.assigned_to_id)
        .map((t: Record<string, unknown>) => t.assigned_to_id) as string[]
    )];

    const allProfileIds = [...new Set([...posterIds, ...assigneeIds])];

    let profilesMap: Record<string, Record<string, unknown>> = {};
    if (allProfileIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, photo, city, rating, is_verified")
        .in("id", allProfileIds);

      if (profiles) {
        profilesMap = Object.fromEntries(profiles.map((p: Record<string, unknown>) => [p.id, p]));
      }
    }

    // Fetch application counts for tasks
    const taskIds = (tasks ?? []).map((t: Record<string, unknown>) => t.id) as string[];
    let appCountsMap: Record<string, number> = {};
    if (taskIds.length > 0) {
      const { data: appCounts } = await supabase
        .from("task_applications")
        .select("task_id")
        .in("task_id", taskIds);

      if (appCounts) {
        appCountsMap = appCounts.reduce<Record<string, number>>((acc, row) => {
          const tid = (row as Record<string, unknown>).task_id as string;
          acc[tid] = (acc[tid] || 0) + 1;
          return acc;
        }, {});
      }
    }

    // Merge profile data and app counts into tasks
    const enrichedTasks = tasks?.map((task: Record<string, unknown>) => ({
      ...task,
      postedBy: profilesMap[task.posted_by_id as string]
        ? {
            id: profilesMap[task.posted_by_id as string].id,
            username: profilesMap[task.posted_by_id as string].username,
            photo: profilesMap[task.posted_by_id as string].photo,
            city: profilesMap[task.posted_by_id as string].city,
            rating: profilesMap[task.posted_by_id as string].rating,
            isVerified: profilesMap[task.posted_by_id as string].is_verified,
          }
        : null,
      assignedTo: task.assigned_to_id && profilesMap[task.assigned_to_id as string]
        ? {
            id: profilesMap[task.assigned_to_id as string].id,
            username: profilesMap[task.assigned_to_id as string].username,
            photo: profilesMap[task.assigned_to_id as string].photo,
          }
        : null,
      _count: {
        applications: appCountsMap[task.id as string] ?? 0,
      },
    }));

    return NextResponse.json({
      tasks: enrichedTasks ?? [],
      pagination: {
        page,
        limit,
        total: total ?? 0,
        totalPages: Math.ceil((total ?? 0) / limit),
      },
    });
  } catch (error) {
    console.error("Fetch tasks error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
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
      budget,
      currency,
      city,
      location,
      latitude,
      longitude,
      deadline,
      urgency,
      status,
      photos,
      logistics,
      aiEnhanced,
      postedById,
    } = body;

    if (!title || !description || !category || budget === undefined || !city || !postedById) {
      return NextResponse.json(
        { error: "title, description, category, budget, city, and postedById are required" },
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

    const { data: task, error } = await supabase
      .from("tasks")
      .insert({
        title,
        description,
        category,
        subcategory: subcategory || null,
        budget: parseFloat(budget),
        currency: currency || "USD",
        city,
        location: location || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        deadline: deadline ? new Date(deadline).toISOString() : null,
        urgency: urgency || "normal",
        status: status || "open",
        photos: photos || "[]",
        logistics: logistics || "{}",
        ai_enhanced: aiEnhanced || false,
        posted_by_id: postedById,
      })
      .select()
      .single();

    if (error) {
      console.error("Create task error:", error);
      return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
    }

    // Fetch the poster's profile for the response
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, username, photo, city, rating, is_verified")
      .eq("id", postedById)
      .maybeSingle();

    const enrichedTask = {
      ...task,
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

    return NextResponse.json(enrichedTask, { status: 201 });
  } catch (error) {
    console.error("Create task error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
