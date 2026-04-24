
import { NextResponse } from "next/server";
import { createClient } from "@/lib/db";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // Find session by token
    const { data: session } = await supabase
      .from("auth_sessions")
      .select("*")
      .eq("token", token)
      .maybeSingle();

    if (!session) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Check if token already used
    if (session.used_at) {
      return NextResponse.json(
        { error: "Token already used" },
        { status: 401 }
      );
    }

    // Check if token expired
    if (new Date() > new Date(session.expires_at)) {
      return NextResponse.json(
        { error: "Token expired" },
        { status: 401 }
      );
    }

    // Mark session as used
    await supabase
      .from("auth_sessions")
      .update({ used_at: new Date().toISOString() })
      .eq("id", session.id);

    // Fetch user data
    const { data: user } = await supabase
      .from("profiles")
      .select("id, username, full_name, email, phone, city, role, account_type, is_verified, is_admin, profile_strength")
      .eq("id", session.user_id)
      .maybeSingle();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Mark user as verified on first login
    let wasFirstTime = false;
    if (!user.is_verified) {
      await supabase
        .from("profiles")
        .update({
          is_verified: true,
          profile_strength: Math.max(user.profile_strength ?? 0, 25),
        })
        .eq("id", user.id);
      wasFirstTime = true;
    }

    // Create a simple session token (JWT-like) using NEXTAUTH_SECRET
    const secret = process.env.NEXTAUTH_SECRET || "fallback-secret-key";
    const sessionToken = crypto
      .createHmac("sha256", secret)
      .update(`${user.id}:${Date.now()}`)
      .digest("hex");

    return NextResponse.json({
      success: true,
      isFirstTime: wasFirstTime,
      sessionToken,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        role: user.role,
        accountType: user.account_type,
        isVerified: true,
        isAdmin: user.is_admin,
        profileStrength: wasFirstTime ? 25 : user.profile_strength,
        verificationLevel: "basic" as const,
      },
    });
  } catch (error) {
    console.error("Verify token error:", error);
    return NextResponse.json(
      { error: "Failed to verify token" },
      { status: 500 }
    );
  }
}
