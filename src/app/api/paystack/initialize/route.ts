
import { NextRequest, NextResponse } from "next/server";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";
const PAYSTACK_BASE_URL = "https://api.paystack.co";

interface InitializeBody {
  email: string;
  amount: number; // in kobo (smallest currency unit)
  currency?: "NGN" | "GHS" | "KES" | "USD" | "ZAR";
  metadata?: {
    taskId?: string;
    workerId?: string;
    type?: "escrow" | "listing_fee" | "wallet_deposit";
    custom_fields?: Array<{ display_name: string; variable_name: string; value: string }>;
  };
  callback_url?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: InitializeBody = await request.json();
    const { email, amount, currency = "NGN", metadata, callback_url } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid amount is required (in kobo)" },
        { status: 400 }
      );
    }

    // Mock fallback when env vars are not set
    if (!PAYSTACK_SECRET_KEY) {
      console.warn("[Paystack] PAYSTACK_SECRET_KEY not set — using mock mode");
      const mockReference = `mock_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      return NextResponse.json({
        success: true,
        data: {
          authorization_url: `https://checkout.paystack.com/mock?ref=${mockReference}`,
          access_code: `mock_access_${mockReference}`,
          reference: mockReference,
        },
        mock: true,
      });
    }

    // Real Paystack API call
    const paystackBody: Record<string, unknown> = {
      email,
      amount,
      currency,
      metadata: metadata || {},
    };

    if (callback_url) {
      paystackBody.callback_url = callback_url;
    }

    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paystackBody),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[Paystack] Initialize error:", data);
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to initialize transaction",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        authorization_url: data.data.authorization_url,
        access_code: data.data.access_code,
        reference: data.data.reference,
      },
    });
  } catch (error) {
    console.error("[Paystack] Initialize error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
