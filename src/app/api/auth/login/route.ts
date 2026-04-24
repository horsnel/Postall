import { NextResponse } from "next/server";
import { createClient } from "@/lib/db";
import crypto from "crypto";

// Simple password hashing for testing (use bcrypt in production)
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "postall_salt_2024").digest("hex");
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    // Find user by email
    const { data: user, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to sign in" }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ error: "No account found with this email" }, { status: 400 });
    }

    // Check if user has a password set
    if (!user.password_hash) {
      return NextResponse.json({ 
        error: "This account was created with social login. Please use Google to sign in, or create a new account with a password." 
      }, { status: 400 });
    }

    // Verify password
    const hashedPassword = hashPassword(password);
    if (user.password_hash !== hashedPassword) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 400 });
    }

    // Return user data (client will store in auth store)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        phone: user.phone,
        photo: user.photo,
        city: user.city,
        role: user.role,
        accountType: user.account_type || "individual",
        isVerified: user.is_verified,
        isAdmin: user.is_admin || false,
        profileStrength: user.profile_strength || 0,
        verificationLevel: user.verification_level || "basic",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Failed to sign in. Please try again." }, { status: 500 });
  }
}
