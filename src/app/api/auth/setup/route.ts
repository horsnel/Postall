
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, username, bio, city, photo, notifications } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check user exists
    const { data: existingUser, error: findError } = await supabase
      .from("profiles")
      .select("id, username, email, phone, profile_strength")
      .eq("id", userId)
      .single();

    if (findError || !existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check username uniqueness if provided
    if (username && username !== existingUser.username) {
      const { data: usernameTaken } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .single();

      if (usernameTaken) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 409 }
        );
      }
    }

    // Calculate profile strength based on completed fields
    let strength = 25; // Base from being verified
    if (username) strength += 15;
    if (bio) strength += 15;
    if (city) strength += 10;
    if (photo) strength += 15;
    if (notifications) strength += 10;
    if (existingUser.email) strength += 5;
    if (existingUser.phone) strength += 5;

    // Build update data
    const updateData: Record<string, unknown> = {
      profile_strength: Math.min(strength, 100),
    };

    if (username !== undefined) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;
    if (city !== undefined) updateData.city = city;
    if (photo !== undefined) updateData.photo = photo;
    if (notifications !== undefined) updateData.notifications = JSON.stringify(notifications);

    const { data: user, error: updateError } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", userId)
      .select("id, username, email, phone, photo, bio, city, is_verified, profile_strength, is_admin")
      .single();

    if (updateError || !user) {
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        photo: user.photo,
        bio: user.bio,
        city: user.city,
        isVerified: user.is_verified,
        profileStrength: user.profile_strength,
        isAdmin: user.is_admin,
      },
    });
  } catch (error) {
    console.error("Setup profile error:", error);
    return NextResponse.json(
      { error: "Failed to complete profile setup" },
      { status: 500 }
    );
  }
}
