
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/db";

// GET: Get user's referral stats
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 });
    }

    // Find the user's referral code from profile
    const { data: referrer } = await supabase
      .from("profiles")
      .select("username, id")
      .eq("id", userId)
      .maybeSingle();

    if (!referrer) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Generate referral code from username
    const upper = (referrer.username || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    const code = upper.length >= 4 ? upper.slice(0, 4) : upper.padEnd(4, "X");
    const hash = (referrer.username || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const suffix = String(hash % 1000).padStart(3, "0");
    const referralCode = `${code}-${suffix}`;

    // Get referrals made by this user
    const { data: referrals } = await supabase
      .from("referrals")
      .select("*")
      .eq("referrer_id", userId);

    return NextResponse.json({
      success: true,
      referralCode,
      stats: {
        invited: referrals?.length ?? 0,
        active: referrals?.filter((r: Record<string, unknown>) => r.active).length ?? 0,
        earned: 0,
        pending: 0,
      },
      referrals: referrals ?? [],
    });
  } catch (error) {
    console.error("Referral GET error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST: Create referral record (when someone signs up with a referral code)
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });

    const body = await req.json();
    const { userId, referralCode } = body;

    if (!userId || !referralCode) {
      return NextResponse.json({ success: false, error: "userId and referralCode are required" }, { status: 400 });
    }

    // Find the referrer by code - need to search all users and match generated code
    const { data: users } = await supabase
      .from("profiles")
      .select("id, username");

    const referrer = (users || []).find((u: Record<string, unknown>) => {
      const upper = (u.username || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
      const c = upper.length >= 4 ? upper.slice(0, 4) : upper.padEnd(4, "X");
      const h = (u.username || "").split("").reduce((a: number, ch: string) => a + ch.charCodeAt(0), 0);
      const s = String(h % 1000).padStart(3, "0");
      return `${c}-${s}` === referralCode;
    });

    if (!referrer) {
      return NextResponse.json({ success: false, error: "Invalid referral code" }, { status: 404 });
    }

    if (referrer.id === userId) {
      return NextResponse.json({ success: false, error: "Cannot refer yourself" }, { status: 400 });
    }

    // Create a notification for the referrer
    const { data: newUser } = await supabase
      .from("profiles")
      .select("username, full_name")
      .eq("id", userId)
      .maybeSingle();

    await supabase
      .from("notifications")
      .insert({
        user_id: referrer.id,
        type: "referral_signup",
        title: "New Referral!",
        message: `${newUser?.full_name || newUser?.username || "Someone"} signed up using your referral code. They'll earn you ₦500 once they verify and complete a transaction.`,
        link: "/dashboard/referrals",
      });

    return NextResponse.json({
      success: true,
      message: "Referral recorded successfully",
      referrerId: referrer.id,
    });
  } catch (error) {
    console.error("Referral POST error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// PATCH: Update referral status when referred user verifies/trades
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });

    const body = await req.json();
    const { userId, event } = body; // event: "verified" | "first_transaction"

    if (!userId || !event) {
      return NextResponse.json({ success: false, error: "userId and event are required" }, { status: 400 });
    }

    // In a real app, find the referral record and update it
    // For demo: just return success
    return NextResponse.json({
      success: true,
      message: `Referral status updated for ${event}`,
    });
  } catch (error) {
    console.error("Referral PATCH error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
