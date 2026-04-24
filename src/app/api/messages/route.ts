
import { NextResponse } from "next/server";
import { createClient } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Fetch messages error:", error);
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }

    // Fetch sender profiles for all messages
    const senderIds = [...new Set((messages || []).map((m: Record<string, unknown>) => m.sender_id as string))];
    let profilesMap: Record<string, Record<string, unknown>> = {};
    if (senderIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, photo")
        .in("id", senderIds);

      if (profiles) {
        profilesMap = Object.fromEntries(profiles.map((p: Record<string, unknown>) => [p.id, p]));
      }
    }

    // Enrich messages with sender data
    const enrichedMessages = (messages || []).map((msg: Record<string, unknown>) => ({
      ...msg,
      sender: profilesMap[msg.sender_id as string]
        ? {
            id: profilesMap[msg.sender_id as string].id,
            username: profilesMap[msg.sender_id as string].username,
            photo: profilesMap[msg.sender_id as string].photo,
          }
        : null,
    }));

    // Mark messages as read (messages not sent by the reading user)
    const userId = searchParams.get("userId");
    if (userId) {
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("conversation_id", conversationId)
        .eq("is_read", false)
        .neq("sender_id", userId);
    }

    // Update conversation's lastMessageAt
    if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      await supabase
        .from("conversations")
        .update({ last_message_at: lastMessage.created_at })
        .eq("id", conversationId);
    }

    return NextResponse.json({ messages: enrichedMessages });
  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const body = await request.json();
    const { conversationId, senderId, content, type } = body;

    if (!conversationId || !senderId || !content) {
      return NextResponse.json(
        { error: "Conversation ID, sender ID, and content are required" },
        { status: 400 }
      );
    }

    // Verify conversation exists
    const { data: conversation } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .maybeSingle();

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Verify sender is part of the conversation
    if (conversation.buyer_id !== senderId && conversation.seller_id !== senderId) {
      return NextResponse.json(
        { error: "Not authorized to send messages in this conversation" },
        { status: 403 }
      );
    }

    // Create message
    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        type: type || "text",
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Create message error:", error);
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }

    // Fetch sender profile
    const { data: senderProfile } = await supabase
      .from("profiles")
      .select("id, username, photo")
      .eq("id", senderId)
      .maybeSingle();

    // Update conversation's lastMessageAt
    await supabase
      .from("conversations")
      .update({ last_message_at: message.created_at })
      .eq("id", conversationId);

    return NextResponse.json({
      success: true,
      message: {
        ...message,
        sender: senderProfile ? {
          id: senderProfile.id,
          username: senderProfile.username,
          photo: senderProfile.photo,
        } : null,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const body = await request.json();
    const { conversationId, messageIds, userId } = body;

    if (!conversationId && !messageIds) {
      return NextResponse.json(
        { error: "Conversation ID or message IDs are required" },
        { status: 400 }
      );
    }

    if (messageIds && Array.isArray(messageIds) && messageIds.length > 0) {
      // Mark specific messages as read
      let query = supabase
        .from("messages")
        .update({ is_read: true })
        .in("id", messageIds);

      if (conversationId) {
        query = query.eq("conversation_id", conversationId);
      }

      const { error, count } = await query;

      if (error) {
        console.error("Mark messages as read error:", error);
        return NextResponse.json({ error: "Failed to mark messages as read" }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: `Marked ${count} message(s) as read`,
        count: count ?? 0,
      });
    }

    // Mark all messages in a conversation as read (excluding the reader's own messages)
    if (conversationId && userId) {
      const { error, count } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("conversation_id", conversationId)
        .eq("is_read", false)
        .neq("sender_id", userId);

      if (error) {
        console.error("Mark messages as read error:", error);
        return NextResponse.json({ error: "Failed to mark messages as read" }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: `Marked ${count} message(s) as read`,
        count: count ?? 0,
      });
    }

    // Fallback: mark all messages in a conversation as read
    if (conversationId) {
      const { error, count } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("conversation_id", conversationId)
        .eq("is_read", false);

      if (error) {
        console.error("Mark messages as read error:", error);
        return NextResponse.json({ error: "Failed to mark messages as read" }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: `Marked ${count} message(s) as read`,
        count: count ?? 0,
      });
    }

    return NextResponse.json(
      { error: "No valid parameters provided" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Mark messages as read error:", error);
    return NextResponse.json(
      { error: "Failed to mark messages as read" },
      { status: 500 }
    );
  }
}
