
import { NextResponse } from "next/server";
import { createClient } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const { data: conversations, error } = await supabase
      .from("conversations")
      .select("*")
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order("last_message_at", { ascending: false });

    if (error) {
      console.error("Fetch conversations error:", error);
      return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
    }

    // Enrich conversations with other user info, last message, and unread count
    const enrichedConversations = await Promise.all(
      (conversations || []).map(async (conv: Record<string, unknown>) => {
        const otherUserId = conv.buyer_id === userId ? conv.seller_id : conv.buyer_id;

        // Fetch other user profile
        const { data: otherUser } = await supabase
          .from("profiles")
          .select("id, username, photo, city, is_verified")
          .eq("id", otherUserId)
          .maybeSingle();

        // Fetch last message for this conversation
        const { data: lastMessages } = await supabase
          .from("messages")
          .select("content, created_at, sender_id")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1);

        // Count unread messages (messages not sent by the reading user)
        const { count: unreadCount } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("conversation_id", conv.id)
          .eq("is_read", false)
          .neq("sender_id", userId);

        return {
          id: conv.id,
          taskId: conv.task_id,
          listingId: conv.listing_id,
          buyerId: conv.buyer_id,
          sellerId: conv.seller_id,
          lastMessage: lastMessages && lastMessages.length > 0
            ? { content: lastMessages[0].content, createdAt: lastMessages[0].created_at, senderId: lastMessages[0].sender_id }
            : null,
          unreadCount: unreadCount ?? 0,
          otherUser: otherUser ? {
            id: otherUser.id,
            username: otherUser.username,
            photo: otherUser.photo,
            city: otherUser.city,
            isVerified: otherUser.is_verified,
          } : null,
          lastMessageAt: conv.last_message_at,
          createdAt: conv.created_at,
        };
      })
    );

    return NextResponse.json({ conversations: enrichedConversations });
  } catch (error) {
    console.error("Fetch conversations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const body = await request.json();
    const { taskId, listingId, buyerId, sellerId } = body;

    if (!buyerId || !sellerId) {
      return NextResponse.json(
        { error: "Buyer ID and Seller ID are required" },
        { status: 400 }
      );
    }

    if (buyerId === sellerId) {
      return NextResponse.json(
        { error: "Cannot create conversation with yourself" },
        { status: 400 }
      );
    }

    // Check for existing conversation between these users for the same reference
    let query = supabase
      .from("conversations")
      .select("*")
      .or(`buyer_id.eq.${buyerId},seller_id.eq.${sellerId}`)
      .or(`and(buyer_id.eq.${buyerId},seller_id.eq.${sellerId}),and(buyer_id.eq.${sellerId},seller_id.eq.${buyerId})`)
      .limit(1)
      .maybeSingle();

    if (taskId) {
      query = supabase
        .from("conversations")
        .select("*")
        .eq("task_id", taskId)
        .or(`and(buyer_id.eq.${buyerId},seller_id.eq.${sellerId}),and(buyer_id.eq.${sellerId},seller_id.eq.${buyerId})`)
        .limit(1)
        .maybeSingle();
    } else if (listingId) {
      query = supabase
        .from("conversations")
        .select("*")
        .eq("listing_id", listingId)
        .or(`and(buyer_id.eq.${buyerId},seller_id.eq.${sellerId}),and(buyer_id.eq.${sellerId},seller_id.eq.${buyerId})`)
        .limit(1)
        .maybeSingle();
    }

    const { data: existingConversation } = await query;

    if (existingConversation) {
      const otherUserId = existingConversation.buyer_id === buyerId
        ? existingConversation.seller_id
        : existingConversation.buyer_id;
      const { data: otherUser } = await supabase
        .from("profiles")
        .select("id, username, photo, city, is_verified")
        .eq("id", otherUserId)
        .maybeSingle();

      // Fetch last message
      const { data: lastMessages } = await supabase
        .from("messages")
        .select("content, created_at, sender_id")
        .eq("conversation_id", existingConversation.id)
        .order("created_at", { ascending: false })
        .limit(1);

      return NextResponse.json({
        success: true,
        conversation: {
          id: existingConversation.id,
          taskId: existingConversation.task_id,
          listingId: existingConversation.listing_id,
          buyerId: existingConversation.buyer_id,
          sellerId: existingConversation.seller_id,
          lastMessage: lastMessages && lastMessages.length > 0
            ? { content: lastMessages[0].content, createdAt: lastMessages[0].created_at, senderId: lastMessages[0].sender_id }
            : null,
          otherUser: otherUser ? {
            id: otherUser.id,
            username: otherUser.username,
            photo: otherUser.photo,
            city: otherUser.city,
            isVerified: otherUser.is_verified,
          } : null,
          lastMessageAt: existingConversation.last_message_at,
          createdAt: existingConversation.created_at,
        },
      });
    }

    // Create new conversation
    const { data: conversation, error: createError } = await supabase
      .from("conversations")
      .insert({
        task_id: taskId || null,
        listing_id: listingId || null,
        buyer_id: buyerId,
        seller_id: sellerId,
      })
      .select()
      .single();

    if (createError) {
      console.error("Create conversation error:", createError);
      return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
    }

    const otherUserId = conversation.buyer_id === buyerId
      ? conversation.seller_id
      : conversation.buyer_id;
    const { data: otherUser } = await supabase
      .from("profiles")
      .select("id, username, photo, city, is_verified")
      .eq("id", otherUserId)
      .maybeSingle();

    // Add a system message to the conversation
    await supabase
      .from("messages")
      .insert({
        conversation_id: conversation.id,
        sender_id: buyerId,
        content: "Conversation started",
        type: "system",
        is_read: true,
      });

    return NextResponse.json(
      {
        success: true,
        conversation: {
          id: conversation.id,
          taskId: conversation.task_id,
          listingId: conversation.listing_id,
          buyerId: conversation.buyer_id,
          sellerId: conversation.seller_id,
          lastMessage: null,
          otherUser: otherUser ? {
            id: otherUser.id,
            username: otherUser.username,
            photo: otherUser.photo,
            city: otherUser.city,
            isVerified: otherUser.is_verified,
          } : null,
          lastMessageAt: null,
          createdAt: conversation.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create conversation error:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
