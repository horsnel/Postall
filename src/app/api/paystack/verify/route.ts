
import { NextRequest, NextResponse } from "next/server";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";
const PAYSTACK_BASE_URL = "https://api.paystack.co";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { success: false, message: "Transaction reference is required" },
        { status: 400 }
      );
    }

    // Mock fallback when env vars are not set
    if (!PAYSTACK_SECRET_KEY) {
      console.warn("[Paystack Verify] PAYSTACK_SECRET_KEY not set — using mock mode");

      // Check if it's a mock reference
      if (reference.startsWith("mock_")) {
        return NextResponse.json({
          success: true,
          data: {
            status: "success",
            reference,
            amount: 1500000, // ₦15,000 in kobo
            currency: "NGN",
            gateway_response: "Successful (Mock)",
            paid_at: new Date().toISOString(),
            channel: "card",
            card_type: "visa",
            customer: {
              email: "user@example.com",
            },
            metadata: {},
          },
          mock: true,
        });
      }

      return NextResponse.json({
        success: false,
        message: "Invalid reference in mock mode",
      }, { status: 404 });
    }

    // Real Paystack API call
    const response = await fetch(
      `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("[Paystack Verify] Error:", data);
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to verify transaction",
        },
        { status: response.status }
      );
    }

    if (data.data.status !== "success") {
      return NextResponse.json({
        success: false,
        data: {
          status: data.data.status,
          reference: data.data.reference,
          amount: data.data.amount,
          currency: data.data.currency,
          gateway_response: data.data.gateway_response,
        },
        message: `Transaction ${data.data.status}`,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        status: data.data.status,
        reference: data.data.reference,
        amount: data.data.amount,
        currency: data.data.currency,
        gateway_response: data.data.gateway_response,
        paid_at: data.data.paid_at,
        channel: data.data.channel,
        customer: {
          email: data.data.customer?.email,
        },
        metadata: data.data.metadata || {},
      },
    });
  } catch (error) {
    console.error("[Paystack Verify] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
