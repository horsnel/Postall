
import { NextResponse } from "next/server";
import { createClient } from "@/lib/db";

// GET: Fetch all verifications (for admin)
export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const { data: verifications, error } = await supabase
      .from("verifications")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch verifications error:", error);
      return NextResponse.json({ error: "Failed to fetch verifications" }, { status: 500 });
    }

    // Fetch related user data for each verification
    const userIds = [...new Set((verifications || []).map((v: Record<string, unknown>) => v.user_id as string))];
    let profilesMap: Record<string, Record<string, unknown>> = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, full_name, email, phone, role")
        .in("id", userIds);

      if (profiles) {
        profilesMap = Object.fromEntries(profiles.map((p: Record<string, unknown>) => [p.id, p]));
      }
    }

    // Merge user data into verifications
    const enrichedVerifications = (verifications || []).map((v: Record<string, unknown>) => ({
      ...v,
      user: profilesMap[v.user_id as string]
        ? {
            id: profilesMap[v.user_id as string].id,
            username: profilesMap[v.user_id as string].username,
            fullName: profilesMap[v.user_id as string].full_name,
            email: profilesMap[v.user_id as string].email,
            phone: profilesMap[v.user_id as string].phone,
            role: profilesMap[v.user_id as string].role,
          }
        : null,
    }));

    return NextResponse.json({
      success: true,
      verifications: enrichedVerifications,
    });
  } catch (error) {
    console.error("Fetch verifications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch verifications" },
      { status: 500 }
    );
  }
}

// PATCH: Approve or reject a verification
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const body = await request.json();
    const { verificationId, action, adminId, rejectionReason } = body;

    if (!verificationId || !action || !adminId) {
      return NextResponse.json(
        { error: "Verification ID, action, and admin ID are required" },
        { status: 400 }
      );
    }

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: 'Action must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    // Find verification with user data
    const { data: verification } = await supabase
      .from("verifications")
      .select("*")
      .eq("id", verificationId)
      .maybeSingle();

    if (!verification) {
      return NextResponse.json(
        { error: "Verification not found" },
        { status: 404 }
      );
    }

    if (verification.status !== "pending") {
      return NextResponse.json(
        { error: `Verification already ${verification.status}` },
        { status: 409 }
      );
    }

    const newStatus = action === "approve" ? "verified" : "rejected";

    // Update verification record
    const { data: updated, error: updateError } = await supabase
      .from("verifications")
      .update({
        status: newStatus,
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminId,
      })
      .eq("id", verificationId)
      .select()
      .single();

    if (updateError) {
      console.error("Update verification error:", updateError);
      return NextResponse.json({ error: "Failed to update verification" }, { status: 500 });
    }

    // Fetch user profile for email notification
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("id, full_name, email, profile_strength")
      .eq("id", verification.user_id)
      .maybeSingle();

    if (action === "approve") {
      // Mark user as verified and update their profile
      const newProfileStrength = Math.max(userProfile?.profile_strength ?? 0, 60);
      await supabase
        .from("profiles")
        .update({
          is_verified: true,
          profile_strength: newProfileStrength,
        })
        .eq("id", verification.user_id);
    }

    // Send email notification (non-blocking)
    const { sendVerificationEmail } = await import("@/lib/email");
    const docTypeLabels: Record<string, string> = {
      nin: "National ID (NIN)",
      voters_card: "Voter's Card",
      passport: "International Passport",
      drivers_license: "Driver's License",
      cac: "CAC Certificate",
    };

    if (userProfile?.email) {
      sendVerificationEmail(
        userProfile.email,
        docTypeLabels[verification.type] || verification.type,
        newStatus,
        userProfile.full_name || undefined
      ).catch(() => {
        /* ignore email errors */
      });
    }

    return NextResponse.json({
      success: true,
      message: action === "approve" ? "Verification approved" : "Verification rejected",
      verification: updated,
    });
  } catch (error) {
    console.error("Review verification error:", error);
    return NextResponse.json(
      { error: "Failed to review verification" },
      { status: 500 }
    );
  }
}
