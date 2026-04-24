
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/products/[id]/purchase
 * Purchase a digital or physical product with Paystack integration.
 * Calculates 10% platform commission.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { buyerId, quantity = 1, paymentReference } = body;

    if (!buyerId) {
      return NextResponse.json(
        { success: false, error: "buyerId is required" },
        { status: 400 }
      );
    }

    // Mock product lookup (would use Prisma/Supabase in production)
    const mockProducts: Record<string, {
      sellerId: string;
      price: number;
      currency: string;
      title: string;
      type: "digital" | "physical";
      downloadUrl?: string;
    }> = {
      p1: { sellerId: "seller1", price: 5000, currency: "NGN", title: "React Starter Kit", type: "digital", downloadUrl: "/downloads/react-starter.zip" },
      p2: { sellerId: "seller2", price: 2500, currency: "NGN", title: "Logo Design Pack", type: "digital", downloadUrl: "/downloads/logo-pack.zip" },
      p3: { sellerId: "seller3", price: 3500, currency: "NGN", title: "Business Plan Template", type: "digital", downloadUrl: "/downloads/business-plan.docx" },
      p4: { sellerId: "seller4", price: 15000, currency: "NGN", title: "Wireless Earbuds", type: "physical" },
      p5: { sellerId: "seller5", price: 7500, currency: "NGN", title: "Phone Case Bundle", type: "physical" },
    };

    const product = mockProducts[id];
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const totalPrice = product.price * quantity;
    const commissionRate = 0.10; // 10% platform commission
    const platformFee = Math.round(totalPrice * commissionRate);
    const sellerEarning = totalPrice - platformFee;

    const purchase = {
      id: `purchase-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      productId: id,
      productTitle: product.title,
      buyerId,
      sellerId: product.sellerId,
      quantity,
      totalPrice,
      currency: product.currency,
      platformFee,
      sellerEarning,
      paymentReference: paymentReference || `mock-ref-${Date.now()}`,
      status: paymentReference ? "completed" : "pending_payment",
      type: product.type,
      downloadUrl: product.type === "digital" ? product.downloadUrl : null,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      purchase,
      commission: {
        rate: commissionRate * 100,
        platformFee,
        sellerEarning,
      },
      paymentUrl: paymentReference
        ? null
        : `/api/paystack/initialize?productId=${id}&amount=${totalPrice}&buyerId=${buyerId}`,
      message: paymentReference
        ? "Purchase successful!"
        : "Payment initialization required. Complete payment via Paystack.",
    });
  } catch (error) {
    console.error("[Product Purchase] Error:", error);
    return NextResponse.json(
      { success: false, error: "Purchase failed" },
      { status: 500 }
    );
  }
}
