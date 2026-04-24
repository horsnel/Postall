
import { NextResponse } from "next/server";
import { createClient } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");
    const userId = searchParams.get("userId");

    if (taskId) {
      // Fetch applications by task
      const { data: applications, error } = await supabase
        .from("task_applications")
        .select("*")
        .eq("task_id", taskId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch applications error:", error);
        return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
      }

      const enrichedApplications = await enrichApplications(supabase, applications || []);
      return NextResponse.json({ applications: enrichedApplications });
    } else if (userId) {
      // Fetch applications by user
      const { data: applications, error } = await supabase
        .from("task_applications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch applications error:", error);
        return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
      }

      const enrichedApplications = await enrichApplications(supabase, applications || []);
      return NextResponse.json({ applications: enrichedApplications });
    } else {
      return NextResponse.json(
        { error: "Task ID or User ID is required" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Fetch applications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

// Helper to enrich applications with user and task data
async function enrichApplications(
  supabase: Awaited<ReturnType<typeof createClient>>,
  applications: Record<string, unknown>[]
): Promise<Record<string, unknown>[]> {
  const userIds = [...new Set(applications.map((a) => a.user_id as string))];
  const taskIds = [...new Set(applications.map((a) => a.task_id as string))];

  const [profilesMap, tasksMap] = await Promise.all([
    fetchProfilesMap(supabase, userIds),
    fetchTasksMap(supabase, taskIds),
  ]);

  return applications.map((app) => ({
    id: app.id,
    taskId: app.task_id,
    userId: app.user_id,
    coverLetter: app.cover_letter,
    proposedPrice: app.proposed_price,
    status: app.status,
    createdAt: app.created_at,
    user: profilesMap[app.user_id as string] || null,
    task: tasksMap[app.task_id as string] || null,
  }));
}

async function fetchProfilesMap(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userIds: string[]
): Promise<Record<string, Record<string, unknown>>> {
  if (userIds.length === 0) return {};
  if (!supabase) return {};
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, photo, city, rating, total_reviews, tasks_completed, is_verified")
    .in("id", userIds);

  if (!profiles) return {};
  return Object.fromEntries(profiles.map((p) => [p.id, {
    id: p.id,
    username: p.username,
    photo: p.photo,
    city: p.city,
    rating: p.rating,
    totalReviews: p.total_reviews,
    tasksCompleted: p.tasks_completed,
    isVerified: p.is_verified,
  }]));
}

async function fetchTasksMap(
  supabase: Awaited<ReturnType<typeof createClient>>,
  taskIds: string[]
): Promise<Record<string, Record<string, unknown>>> {
  if (taskIds.length === 0) return {};
  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, title, budget, category, city, status")
    .in("id", taskIds);

  if (!tasks) return {};
  return Object.fromEntries(tasks.map((t) => [t.id, {
    id: t.id,
    title: t.title,
    budget: t.budget,
    category: t.category,
    city: t.city,
    status: t.status,
  }]));
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const body = await request.json();
    const { taskId, userId, coverLetter, proposedPrice } = body;

    if (!taskId || !userId) {
      return NextResponse.json(
        { error: "Task ID and User ID are required" },
        { status: 400 }
      );
    }

    // Verify task exists and is open
    const { data: task } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .maybeSingle();

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    if (task.status !== "open") {
      return NextResponse.json(
        { error: "Task is not open for applications" },
        { status: 400 }
      );
    }

    // Check if user already applied
    const { data: existingApplication } = await supabase
      .from("task_applications")
      .select("id")
      .eq("task_id", taskId)
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied to this task" },
        { status: 409 }
      );
    }

    // Check user is not the task poster
    if (task.posted_by_id === userId) {
      return NextResponse.json(
        { error: "Cannot apply to your own task" },
        { status: 400 }
      );
    }

    // Create application
    const { data: application, error } = await supabase
      .from("task_applications")
      .insert({
        task_id: taskId,
        user_id: userId,
        cover_letter: coverLetter || null,
        proposed_price: proposedPrice !== undefined ? parseFloat(proposedPrice) : null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Create application error:", error);
      return NextResponse.json({ error: "Failed to create application" }, { status: 500 });
    }

    // Enrich with user and task data
    const enriched = await enrichApplications(supabase, [application]);

    return NextResponse.json(
      { success: true, application: enriched[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create application error:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Application ID and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "accepted", "declined", "withdrawn"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Status must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // Find existing application
    const { data: existingApplication } = await supabase
      .from("task_applications")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!existingApplication) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (existingApplication.status !== "pending" && status !== "withdrawn") {
      return NextResponse.json(
        { error: "Application has already been processed" },
        { status: 400 }
      );
    }

    // Update application status
    const { data: application, error } = await supabase
      .from("task_applications")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update application error:", error);
      return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
    }

    // If accepted, update task status and assign worker
    if (status === "accepted") {
      await supabase
        .from("tasks")
        .update({
          status: "assigned",
          assigned_to_id: existingApplication.user_id,
        })
        .eq("id", existingApplication.task_id);

      // Decline all other pending applications for this task
      await supabase
        .from("task_applications")
        .update({ status: "declined" })
        .eq("task_id", existingApplication.task_id)
        .eq("status", "pending")
        .neq("id", id);

      // Fetch task title for notification
      const { data: taskData } = await supabase
        .from("tasks")
        .select("title")
        .eq("id", existingApplication.task_id)
        .maybeSingle();

      // Create notification for the accepted worker
      await supabase
        .from("notifications")
        .insert({
          user_id: existingApplication.user_id,
          type: "task_assigned",
          title: "Application Accepted!",
          message: `Your application for "${taskData?.title || "a task"}" has been accepted!`,
          link: `/dashboard/tasks/${existingApplication.task_id}`,
        });
    }

    // If declined, create notification for the applicant
    if (status === "declined") {
      const { data: taskData } = await supabase
        .from("tasks")
        .select("title")
        .eq("id", existingApplication.task_id)
        .maybeSingle();

      await supabase
        .from("notifications")
        .insert({
          user_id: existingApplication.user_id,
          type: "application_received",
          title: "Application Update",
          message: `Your application for "${taskData?.title || "a task"}" was not selected this time.`,
          link: "/find-work",
        });
    }

    // Enrich with user and task data
    const enriched = await enrichApplications(supabase, [application]);

    return NextResponse.json({ success: true, application: enriched[0] });
  } catch (error) {
    console.error("Update application error:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}
