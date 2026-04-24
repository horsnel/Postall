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
    const { email, password, fullName, phone, role } = body;

    // Validate required fields
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    // Generate unique username from email
    const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "_");
    const uniqueSuffix = crypto.randomBytes(3).toString("hex");

    // Create user with password
    const hashedPassword = hashPassword(password);

    const { data: newUser, error: createError } = await supabase
      .from("profiles")
      .insert({
        username: `${baseUsername}_${uniqueSuffix}`,
        email: email.toLowerCase().trim(),
        password_hash: hashedPassword,
        full_name: fullName?.trim() || null,
        phone: phone?.trim() || null,
        role: role || "buyer",
        is_verified: true, // Auto-verify for testing
        profile_strength: fullName ? 20 : 0,
      })
      .select()
      .single();

    if (createError) {
      console.error("Create user error:", createError);
      
      // Handle unique constraint on username
      if (createError.code === "23505") {
        const fallbackSuffix = crypto.randomBytes(4).toString("hex");
        const { data: fallbackUser, error: fallbackError } = await supabase
          .from("profiles")
          .insert({
            username: `${baseUsername}_${fallbackSuffix}`,
            email: email.toLowerCase().trim(),
            password_hash: hashedPassword,
            full_name: fullName?.trim() || null,
            phone: phone?.trim() || null,
            role: role || "buyer",
            is_verified: true,
            profile_strength: fullName ? 20 : 0,
          })
          .select()
          .single();

        if (fallbackError) {
          return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
        }
        
        return NextResponse.json({
          success: true,
          user: {
            id: fallbackUser.id,
            username: fallbackUser.username,
            email: fallbackUser.email,
            fullName: fallbackUser.full_name,
            phone: fallbackUser.phone,
            role: fallbackUser.role,
            isVerified: fallbackUser.is_verified,
          },
        });
      }
      
      return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.full_name,
        phone: newUser.phone,
        role: newUser.role,
        isVerified: newUser.is_verified,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Failed to create account. Please try again." }, { status: 500 });
  }
}
