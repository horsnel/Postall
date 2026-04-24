
import { NextRequest, NextResponse } from "next/server";
import {
  calculateCommission,
  createPurchaseRecord,
} from "@/lib/digital-product";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { buyerId } = body;

    if (!buyerId) {
      return NextResponse.json(
        { success: false, error: "buyerId is required" },
        { status: 400 }
      );
    }

    // Mock product lookup
    const mockProducts: Record<string, { sellerId: string; price: number; currency: string }> = {
      dp1: { sellerId: "seller1", price: 5000, currency: "NGN" },
      dp2: { sellerId: "seller2", price: 2500, currency: "NGN" },
      dp3: { sellerId: "seller3", price: 3500, currency: "NGN" },
      dp4: { sellerId: "seller4", price: 7500, currency: "NGN" },
      dp5: { sellerId: "seller5", price: 4000, currency: "NGN" },
      dp6: { sellerId: "seller6", price: 1500, currency: "NGN" },
    };

    const product = mockProducts[id];
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Create purchase record with commission calculation
    const purchase = createPurchaseRecord(
      id,
      buyerId,
      product.sellerId,
      product.price,
      product.currency
    );

    const commission = calculateCommission(product.price);

    return NextResponse.json({
      success: true,
      purchase,
      commission: {
        rate: commission.rate,
        platformFee: commission.platformFee,
        sellerEarning: commission.sellerEarning,
      },
      downloadUrl: `/api/digital-products/${id}/download?token=${purchase.downloadToken}`,
      message: "Purchase successful! Download link generated.",
    });
  } catch (error) {
    console.error("[Digital Product Purchase] Error:", error);
    return NextResponse.json(
      { success: false, error: "Purchase failed" },
      { status: 500 }
    );
  }
}
