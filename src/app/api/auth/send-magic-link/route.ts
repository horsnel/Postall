
import { NextResponse } from "next/server";
import { createClient } from "@/lib/db";
import { sendMagicLinkEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const body = await request.json();
    const { method, email, fullName, phone, role } = body;

    // Method is always "email" for magic links
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    // Generate unique username from email
    const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "_");
    const uniqueSuffix = crypto.randomBytes(3).toString("hex");

    // Find existing user by email
    let { data: user } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if (!user) {
      // Create a new user
      try {
        const { data: newUser, error: createError } = await supabase
          .from("profiles")
          .insert({
            username: `${baseUsername}_${uniqueSuffix}`,
            email: email.toLowerCase().trim(),
            full_name: fullName?.trim() || null,
            phone: phone?.trim() || null,
            role: role || "buyer",
            is_verified: false,
            profile_strength: 0,
          })
          .select()
          .single();

        if (createError) {
          // Handle unique constraint on username (race condition)
          if (createError.code === "23505") {
            // Try again with different suffix
            const fallbackSuffix = crypto.randomBytes(4).toString("hex");
            const { data: fallbackUser, error: fallbackError } = await supabase
              .from("profiles")
              .insert({
                username: `${baseUsername}_${fallbackSuffix}`,
                email: email.toLowerCase().trim(),
                full_name: fullName?.trim() || null,
                phone: phone?.trim() || null,
                role: role || "buyer",
                is_verified: false,
                profile_strength: 0,
              })
              .select()
              .single();

            if (fallbackError) throw fallbackError;
            user = fallbackUser;
          } else {
            throw createError;
          }
        } else {
          user = newUser;
        }
      } catch (createError: unknown) {
        console.error("Create user error:", createError);
        return NextResponse.json(
          { error: "Failed to create user" },
          { status: 500 }
        );
      }
    } else {
      // Update existing user info if provided
      if (fullName || phone || role) {
        const updateData: Record<string, unknown> = {};
        if (fullName) updateData.full_name = fullName.trim();
        if (phone) updateData.phone = phone.trim();
        if (role) updateData.role = role;

        const { data: updatedUser, error: updateError } = await supabase
          .from("profiles")
          .update(updateData)
          .eq("id", user.id)
          .select()
          .single();

        if (!updateError) user = updatedUser;
      }
    }

    // Generate magic link token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Store auth session in DB
    const { data: session, error: sessionError } = await supabase
      .from("auth_sessions")
      .insert({
        user_id: user.id,
        token,
        method: "magic_link",
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (sessionError) {
      console.error("Create session error:", sessionError);
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
    }

    // Send magic link email via Resend
    const emailResult = await sendMagicLinkEmail(
      user.email!,
      session.token,
      user.full_name || undefined
    );

    return NextResponse.json({
      success: true,
      message: "Magic link sent to your email",
      userId: user.id,
      // In dev/demo mode, return the token so the frontend can auto-verify
      token: (emailResult as Record<string, unknown>).token || session.token,
    });
  } catch (error) {
    console.error("Send magic link error:", error);
    return NextResponse.json(
      { error: "Failed to send magic link. Please try again." },
      { status: 500 }
    );
  }
}
