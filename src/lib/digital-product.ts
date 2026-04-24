// Digital Product Payment System
// Handles commission calculation and purchase records for digital products

// Platform commission rate: 10%
export const PLATFORM_COMMISSION_RATE = 0.10;

export interface DigitalProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  sellerId: string;
  sellerName: string;
  fileUrl: string;
  fileType: string; // pdf, zip, image, etc.
  fileSize: string;
  downloads: number;
  rating: number;
  preview: string;
  createdAt: string;
}

export interface PurchaseRecord {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  currency: string;
  platformFee: number;
  sellerEarning: number;
  status: "pending" | "completed" | "refunded";
  createdAt: string;
  downloadToken: string;
}

/**
 * Calculate commission breakdown for a given amount
 * Platform takes 10%, seller receives 90%
 */
export function calculateCommission(
  amount: number,
  rate: number = PLATFORM_COMMISSION_RATE
): { platformFee: number; sellerEarning: number; rate: number } {
  const platformFee = Math.round(amount * rate * 100) / 100;
  const sellerEarning = Math.round((amount - platformFee) * 100) / 100;
  return { platformFee, sellerEarning, rate };
}

/**
 * Format commission breakdown for display
 */
export function formatCommissionBreakdown(
  amount: number,
  currency: string = "NGN"
): string {
  const { platformFee, sellerEarning, rate } = calculateCommission(amount);
  const symbol = currency === "NGN" ? "₦" : currency;
  return `Price: ${symbol}${amount.toLocaleString()} | Platform fee (${(rate * 100).toFixed(0)}%): ${symbol}${platformFee.toLocaleString()} | Seller earns: ${symbol}${sellerEarning.toLocaleString()}`;
}

/**
 * Generate a secure download token
 */
export function generateDownloadToken(): string {
  return `dl_${Date.now()}_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Create a purchase record for a digital product
 */
export function createPurchaseRecord(
  productId: string,
  buyerId: string,
  sellerId: string,
  amount: number,
  currency: string = "NGN"
): PurchaseRecord {
  const { platformFee, sellerEarning } = calculateCommission(amount);
  return {
    id: `purchase_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    productId,
    buyerId,
    sellerId,
    amount,
    currency,
    platformFee,
    sellerEarning,
    status: "completed",
    createdAt: new Date().toISOString(),
    downloadToken: generateDownloadToken(),
  };
}
