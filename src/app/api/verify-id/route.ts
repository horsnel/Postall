
import { NextResponse } from "next/server";
import { createClient } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const body = await request.json();
    const { userId, documentType, documentUrl, selfieUrl } = body;

    if (!userId || !documentType) {
      return NextResponse.json(
        { error: "User ID and document type are required" },
        { status: 400 }
      );
    }

    if (!documentUrl) {
      return NextResponse.json(
        { error: "Document image is required" },
        { status: 400 }
      );
    }

    // Valid document types
    const validTypes = ['nin', 'voters_card', 'passport', 'drivers_license', 'cac']
    if (!validTypes.includes(documentType)) {
      return NextResponse.json(
        { error: `Invalid document type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: user } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check for existing pending verification of same type
    const { data: existingVerification } = await supabase
      .from("verifications")
      .select("id")
      .eq("user_id", userId)
      .eq("type", documentType)
      .eq("status", "pending")
      .limit(1)
      .maybeSingle();

    if (existingVerification) {
      return NextResponse.json(
        { error: "You already have a pending verification for this document type" },
        { status: 409 }
      );
    }

    // Create verification record
    const { data: verification, error } = await supabase
      .from("verifications")
      .insert({
        user_id: userId,
        type: documentType,
        document_url: documentUrl,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Create verification error:", error);
      return NextResponse.json({ error: "Failed to submit verification" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Verification submitted successfully",
      verification: {
        id: verification.id,
        userId: verification.user_id,
        type: verification.type,
        status: verification.status,
        createdAt: verification.created_at,
      },
    });
  } catch (error) {
    console.error("Submit verification error:", error);
    return NextResponse.json(
      { error: "Failed to submit verification" },
      { status: 500 }
    );
  }
}

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

    const { data: verifications, error } = await supabase
      .from("verifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get verifications error:", error);
      return NextResponse.json({ error: "Failed to fetch verifications" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      verifications: verifications ?? [],
    });
  } catch (error) {
    console.error("Get verifications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch verifications" },
      { status: 500 }
    );
  }
}
