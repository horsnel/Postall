
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error("[Admin Login] ADMIN_EMAIL or ADMIN_PASSWORD not set in environment variables.");
      return NextResponse.json(
        {
          success: false,
          error: "Admin login is not configured. Please set ADMIN_EMAIL and ADMIN_PASSWORD environment variables.",
        },
        { status: 500 }
      );
    }

    if (email === adminEmail && password === adminPassword) {
      // Generate a mock admin token
      const token = `admin_mock_token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

      return NextResponse.json({
        success: true,
        token,
        role: "admin",
        email: adminEmail,
        message: "Admin login successful",
      });
    }

    // Security: don't reveal which field is wrong
    return NextResponse.json(
      { success: false, error: "Invalid admin credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.error("[Admin Login] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
