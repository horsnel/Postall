
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const { id } = await params;

    const { data: task, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    // Fetch postedBy profile
    const { data: postedBy } = await supabase
      .from("profiles")
      .select("id, username, full_name, photo, city, rating, total_reviews, is_verified, member_since")
      .eq("id", task.posted_by_id)
      .maybeSingle();

    // Fetch assignedTo profile
    let assignedTo = null;
    if (task.assigned_to_id) {
      const res = await supabase
        .from("profiles")
        .select("id, username, photo, city, rating")
        .eq("id", task.assigned_to_id)
        .maybeSingle();
      assignedTo = res.data;
    }

    // Fetch applications for this task
    const { data: applications } = await supabase
      .from("task_applications")
      .select("*")
      .eq("task_id", id)
      .order("created_at", { ascending: false });

    // Fetch profiles for applicants
    const applicantIds = [...new Set((applications || []).map((a: Record<string, unknown>) => a.user_id as string))];
    let profilesMap: Record<string, Record<string, unknown>> = {};
    if (applicantIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, photo, city, rating, total_reviews, tasks_completed, is_verified")
        .in("id", applicantIds);

      if (profiles) {
        profilesMap = Object.fromEntries(profiles.map((p) => [p.id, {
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
    }

    const enrichedApplications = (applications || []).map((app: Record<string, unknown>) => ({
      ...app,
      user: profilesMap[app.user_id as string] || null,
    }));

    // Fetch active escrows for this task
    const { data: escrows } = await supabase
      .from("escrows")
      .select("*")
      .eq("reference_id", id)
      .eq("reference_type", "task")
      .in("status", ["pending", "funded"]);

    // Increment view count
    await supabase
      .from("tasks")
      .update({ view_count: (task.view_count || 0) + 1 })
      .eq("id", id);

    return NextResponse.json({
      ...task,
      postedBy: postedBy ? {
        id: postedBy.id,
        username: postedBy.username,
        fullName: postedBy.full_name,
        photo: postedBy.photo,
        city: postedBy.city,
        rating: postedBy.rating,
        totalReviews: postedBy.total_reviews,
        isVerified: postedBy.is_verified,
        memberSince: postedBy.member_since,
      } : null,
      assignedTo: assignedTo ? {
        id: assignedTo.id,
        username: assignedTo.username,
        photo: assignedTo.photo,
        city: assignedTo.city,
        rating: assignedTo.rating,
      } : null,
      applications: enrichedApplications,
      escrows: escrows ?? [],
      _count: {
        applications: (applications || []).length,
      },
    });
  } catch (error) {
    console.error("[Tasks API Error]", error);
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const { id } = await params;
    const body = await request.json();
    const { action, status, hours } = body;

    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    // Find existing task
    const { data: task } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Direct status update
    if (status) {
      const validStatuses = ["draft", "open", "assigned", "in_progress", "pending_completion", "completed", "cancelled"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
          { status: 400 }
        );
      }

      const { data: updatedTask } = await supabase
        .from("tasks")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      // Fetch profiles for the response
      const [postedByRes, assignedToRes] = await Promise.all([
        supabase.from("profiles").select("id, username").eq("id", task.posted_by_id).maybeSingle(),
        task.assigned_to_id
          ? supabase.from("profiles").select("id, username").eq("id", task.assigned_to_id).maybeSingle()
          : Promise.resolve({ data: null }),
      ]);

      // Notify assignee if task is completed
      if (status === "completed" && task.assigned_to_id) {
        await supabase
          .from("notifications")
          .insert({
            user_id: task.assigned_to_id,
            type: "task_assigned",
            title: "Task Completed!",
            message: `"${task.title}" has been marked as completed.`,
            link: `/dashboard/tasks/${task.id}`,
          });

        // Notify poster
        await supabase
          .from("notifications")
          .insert({
            user_id: task.posted_by_id,
            type: "task_assigned",
            title: "Task Completed",
            message: `"${task.title}" is now completed. Payment will be released to the worker.`,
            link: `/dashboard/tasks/${task.id}`,
          });
      }

      return NextResponse.json({
        success: true,
        task: {
          ...updatedTask,
          postedBy: postedByRes.data ? { id: postedByRes.data.id, username: postedByRes.data.username } : null,
          assignedTo: assignedToRes.data ? { id: assignedToRes.data.id, username: assignedToRes.data.username } : null,
        },
      });
    }

    // Action-based updates
    if (!action || !["complete", "extend", "expire"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Use: complete, extend, or expire" },
        { status: 400 }
      );
    }

    let updatedTask: Record<string, unknown> | null = null;

    switch (action) {
      case "complete": {
        const { data } = await supabase
          .from("tasks")
          .update({ status: "completed" })
          .eq("id", id)
          .select()
          .single();
        updatedTask = data;

        // Notify poster about completion
        await supabase
          .from("notifications")
          .insert({
            user_id: task.posted_by_id,
            type: "task_assigned",
            title: "Task Completed",
            message: `"${task.title}" has been marked as complete. Payment release triggered.`,
            link: `/dashboard/tasks/${task.id}`,
          });
        break;
      }

      case "extend": {
        const extensionHours = hours || 12;
        const currentDeadline = task.deadline ? new Date(task.deadline as string) : new Date();
        const newDeadline = new Date(currentDeadline.getTime() + extensionHours * 60 * 60 * 1000);

        const { data } = await supabase
          .from("tasks")
          .update({ deadline: newDeadline.toISOString() })
          .eq("id", id)
          .select()
          .single();
        updatedTask = data;

        // Notify assignee about extension
        if (task.assigned_to_id) {
          await supabase
            .from("notifications")
            .insert({
              user_id: task.assigned_to_id,
              type: "task_assigned",
              title: "Deadline Extended",
              message: `The deadline for "${task.title}" has been extended by ${extensionHours} hours.`,
              link: `/dashboard/tasks/${task.id}`,
            });
        }
        break;
      }

      case "expire": {
        const { data } = await supabase
          .from("tasks")
          .update({ status: "cancelled" })
          .eq("id", id)
          .select()
          .single();
        updatedTask = data;

        // Refund escrow if exists
        const { data: activeEscrow } = await supabase
          .from("escrows")
          .select("*")
          .eq("reference_id", task.id)
          .eq("reference_type", "task")
          .eq("status", "funded")
          .limit(1)
          .maybeSingle();

        if (activeEscrow) {
          // Refund to poster's wallet
          let { data: posterWallet } = await supabase
            .from("wallets")
            .select("*")
            .eq("user_id", task.posted_by_id)
            .maybeSingle();

          if (!posterWallet) {
            const { data: newWallet } = await supabase
              .from("wallets")
              .insert({ user_id: task.posted_by_id })
              .select()
              .single();
            posterWallet = newWallet;
          }

          await supabase
            .from("wallets")
            .update({
              balance: (posterWallet!.balance || 0) + (activeEscrow.amount || 0),
            })
            .eq("id", posterWallet!.id);

          // Transaction record
          await supabase
            .from("transactions")
            .insert({
              wallet_id: posterWallet!.id,
              type: "escrow_release",
              amount: activeEscrow.amount,
              currency: activeEscrow.currency,
              status: "completed",
              description: `Refund for expired task "${task.title}"`,
            });

          // Update escrow status
          await supabase
            .from("escrows")
            .update({ status: "refunded" })
            .eq("id", activeEscrow.id);
        }

        // Notify poster about expiry
        await supabase
          .from("notifications")
          .insert({
            user_id: task.posted_by_id,
            type: "escrow_released",
            title: "Task Expired",
            message: `"${task.title}" has expired and escrow funds have been returned to your wallet.`,
            link: "/dashboard/wallet",
          });
        break;
      }
    }

    return NextResponse.json({
      success: true,
      task: updatedTask,
      message: `Task ${action} successful`,
    });
  } catch (error) {
    console.error("[Tasks API Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const { id } = await params;

    const { data: task } = await supabase
      .from("tasks")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Soft delete
    const { data: updatedTask } = await supabase
      .from("tasks")
      .update({ status: "cancelled" })
      .eq("id", id)
      .select()
      .single();

    return NextResponse.json({
      success: true,
      task: updatedTask,
      message: "Task has been cancelled",
    });
  } catch (error) {
    console.error("[Tasks API Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
