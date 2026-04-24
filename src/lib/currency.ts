// Currency conversion helper for PostAll marketplace
// All rates are relative to NGN (Nigerian Naira)

// Conversion rates relative to NGN (approximate)
const RATES: Record<string, number> = {
  NGN: 1,
  GHS: 0.0078,       // 1 NGN ≈ 0.0078 GHS
  KES: 0.086,        // 1 NGN ≈ 0.086 KES
  USDT: 0.00066,     // 1 NGN ≈ 0.00066 USDT
  USDC: 0.00066,     // same as USDT
  BTC: 0.0000000063, // 1 NGN ≈ 6.3e-9 BTC
  ETH: 0.00000013,   // 1 NGN ≈ 1.3e-7 ETH
};

export function convertCurrency(amount: number, from: string, to: string): number {
  if (from === to) return amount;
  const fromRate = RATES[from] || 1;
  const toRate = RATES[to] || 1;
  const ngnAmount = amount / fromRate;
  return ngnAmount * toRate;
}

export function formatConverted(amount: number, currency: string): string {
  const symbols: Record<string, string> = {
    NGN: "₦",
    GHS: "₵",
    KES: "KSh",
    USDT: "$",
    USDC: "$",
    BTC: "₿",
    ETH: "Ξ",
  };
  const symbol = symbols[currency] || "";

  if (currency === "BTC" || currency === "ETH") {
    return `${symbol}${amount.toFixed(8)}`;
  }
  return `${symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function convertAndFormat(
  amount: number,
  from: string,
  to: string
): string {
  const converted = convertCurrency(amount, from, to);
  return formatConverted(converted, to);
}
