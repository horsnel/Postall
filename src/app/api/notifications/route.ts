
import { NextResponse } from "next/server";
import { createClient } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const unread = searchParams.get("unread");
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    // Build main query
    let query = supabase
      .from("notifications")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(start, end);

    if (unread === "true") {
      query = query.eq("is_read", false);
    }
    if (type) {
      query = query.eq("type", type);
    }

    const { data: notifications, count: total, error } = await query;

    if (error) {
      console.error("Fetch notifications error:", error);
      return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }

    // Fetch unread count
    const { count: unreadCount } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    return NextResponse.json({
      notifications: notifications ?? [],
      unreadCount: unreadCount ?? 0,
      pagination: {
        page,
        limit,
        total: total ?? 0,
        totalPages: Math.ceil((total ?? 0) / limit),
      },
    });
  } catch (error) {
    console.error("Fetch notifications error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { userId, type, title, message, link } = body;

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: "User ID, type, title, and message are required" },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "task_assigned",
      "application_received",
      "message_received",
      "review_received",
      "payment_received",
      "escrow_released",
      "listing_sold",
      "safety_alert",
    ];

    if (!allowedTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid notification type. Allowed: ${allowedTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const { data: notification, error } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        type,
        title,
        message,
        link: link || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Create notification error:", error);
      return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
    }

    return NextResponse.json({ success: true, notification }, { status: 201 });
  } catch (error) {
    console.error("Create notification error:", error);
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { userId, notificationId, notificationIds } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (notificationId) {
      // Mark a single notification as read
      const { data: notification } = await supabase
        .from("notifications")
        .select("id")
        .eq("id", notificationId)
        .eq("user_id", userId)
        .maybeSingle();

      if (!notification) {
        return NextResponse.json({ error: "Notification not found" }, { status: 404 });
      }

      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) {
        console.error("Mark notification as read error:", error);
        return NextResponse.json({ error: "Failed to mark notification as read" }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Notification marked as read",
      });
    }

    if (notificationIds && Array.isArray(notificationIds) && notificationIds.length > 0) {
      // Mark specific notifications as read
      const { error, count } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .in("id", notificationIds)
        .eq("user_id", userId);

      if (error) {
        console.error("Mark notifications as read error:", error);
        return NextResponse.json({ error: "Failed to mark notifications as read" }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: `Marked ${count} notification(s) as read`,
        count: count ?? 0,
      });
    }

    // Mark all user's notifications as read
    const { error, count } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (error) {
      console.error("Mark all notifications as read error:", error);
      return NextResponse.json({ error: "Failed to mark notifications as read" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Marked all notifications as read",
      count: count ?? 0,
    });
  } catch (error) {
    console.error("Mark notifications as read error:", error);
    return NextResponse.json({ error: "Failed to mark notifications as read" }, { status: 500 });
  }
}
