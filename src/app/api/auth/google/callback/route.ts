
import { NextResponse } from "next/server";
import { createClient } from "@/lib/db";
import crypto from "crypto";

interface GoogleTokenResponse {
  access_token: string;
  id_token?: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login?google_error=db_error`
    );

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      console.error("[Google OAuth Callback] Error:", error);
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login?google_error=${error}`
      );
    }

    if (!code) {
      console.error("[Google OAuth Callback] No authorization code received");
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login?google_error=no_code`
      );
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/google/callback`;

    if (!clientId || !clientSecret) {
      console.warn(
        "[Google OAuth] GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set. Cannot exchange code for tokens."
      );
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login?google_error=no_credentials`
      );
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.text();
      console.error("[Google OAuth] Token exchange failed:", tokenError);
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login?google_error=token_exchange_failed`
      );
    }

    const tokenData: GoogleTokenResponse = await tokenResponse.json();

    // Get user profile info from Google
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    if (!userInfoResponse.ok) {
      console.error("[Google OAuth] Failed to fetch user info");
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login?google_error=user_info_failed`
      );
    }

    const googleUser: GoogleUserInfo = await userInfoResponse.json();

    // Parse state to get role (passed from the redirect)
    let selectedRole: string | null = null;
    if (state) {
      try {
        const stateData = JSON.parse(atob(state));
        selectedRole = stateData.role || null;
      } catch {
        // State might just be a simple role string
        selectedRole = state;
      }
    }

    // Find or create user in DB
    const email = googleUser.email.toLowerCase().trim();
    const baseUsername = googleUser.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "_");
    const uniqueSuffix = crypto.randomBytes(3).toString("hex");

    let { data: user } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    let isFirstTime = false;

    if (!user) {
      // Create new user
      try {
        const { data: newUser, error: createError } = await supabase
          .from("profiles")
          .insert({
            username: `${baseUsername}_${uniqueSuffix}`,
            email,
            full_name: googleUser.name || null,
            photo: googleUser.picture || null,
            role: selectedRole || "buyer",
            account_type: "individual",
            is_verified: googleUser.verified_email || false,
            profile_strength: 15,
          })
          .select()
          .single();

        if (createError) {
          if (createError.code === "23505") {
            const fallbackSuffix = crypto.randomBytes(4).toString("hex");
            const { data: fallbackUser, error: fallbackError } = await supabase
              .from("profiles")
              .insert({
                username: `${baseUsername}_${fallbackSuffix}`,
                email,
                full_name: googleUser.name || null,
                photo: googleUser.picture || null,
                role: selectedRole || "buyer",
                account_type: "individual",
                is_verified: googleUser.verified_email || false,
                profile_strength: 15,
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
        isFirstTime = true;
      } catch (createError: unknown) {
        console.error("[Google OAuth] Create user error:", createError);
        return NextResponse.redirect(
          `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login?google_error=create_user_failed`
        );
      }
    } else {
      // Update existing user's photo and name from Google
      if (googleUser.picture && !user.photo) {
        await supabase
          .from("profiles")
          .update({ photo: googleUser.picture })
          .eq("id", user.id);
      }
      if (!user.is_verified && googleUser.verified_email) {
        await supabase
          .from("profiles")
          .update({ is_verified: true })
          .eq("id", user.id);
      }
    }

    // Create an auth session token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    await supabase
      .from("auth_sessions")
      .insert({
        user_id: user.id,
        token,
        method: "google",
        expires_at: expiresAt.toISOString(),
      });

    // Determine redirect based on role
    let redirectPath = "/auth/verify";
    if (user.role === "service_provider") {
      redirectPath = "/auth/verify";
    }

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}${redirectPath}?token=${token}&method=google`
    );
  } catch (error) {
    console.error("[Google OAuth Callback] Unexpected error:", error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login?google_error=server_error`
    );
  }
}
