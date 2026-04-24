
// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { paidListingCategories, formatCurrency } from "@/lib/constants";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const isPremium = searchParams.get("isPremium") === "true";

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category parameter is required" },
        { status: 400 }
      );
    }

    // Find pricing for the category
    const categoryPricing = paidListingCategories.find(
      (cat) => cat.category === category
    );

    if (!categoryPricing) {
      return NextResponse.json(
        { success: false, message: `No pricing found for category: ${category}` },
        { status: 404 }
      );
    }

    // Check if subcategory is valid for this category
    if (subcategory && !categoryPricing.subcategories.includes(subcategory as string)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid subcategory '${subcategory}' for category '${category}'`,
          validSubcategories: categoryPricing.subcategories,
        },
        { status: 400 }
      );
    }

    // Calculate premium fee if applicable
    let premiumFee = 0;
    let premiumThreshold = 0;
    if (isPremium && "premiumThreshold" in categoryPricing && "premiumPrice" in categoryPricing) {
      premiumFee = categoryPricing.premiumPrice;
      premiumThreshold = categoryPricing.premiumThreshold;
    }

    // Simulate free posts remaining (in production, query database)
    const freePostsUsed = Math.floor(Math.random() * Math.max(0, categoryPricing.freeLimit));
    const freeLimit = categoryPricing.freeLimit === -1 ? Infinity : categoryPricing.freeLimit;
    const freePostsRemaining = Math.max(0, freeLimit - freePostsUsed);

    // Determine effective pricing
    const isFree = categoryPricing.freeLimit === -1 || freePostsRemaining > 0;
    const effectivePrices = isFree
      ? { standard: 0, featured: 0, urgent: 0 }
      : categoryPricing.prices;

    return NextResponse.json({
      success: true,
      data: {
        category: categoryPricing.category,
        description: categoryPricing.description,
        currency: categoryPricing.currency,
        prices: {
          standard: {
            amount: effectivePrices.standard,
            display: formatCurrency(effectivePrices.standard, categoryPricing.currency),
            isFree: effectivePrices.standard === 0,
          },
          featured: {
            amount: effectivePrices.featured,
            display: formatCurrency(effectivePrices.featured, categoryPricing.currency),
            isFree: effectivePrices.featured === 0,
          },
          urgent: {
            amount: effectivePrices.urgent,
            display: formatCurrency(effectivePrices.urgent, categoryPricing.currency),
            isFree: effectivePrices.urgent === 0,
          },
        },
        freePosts: {
          limit: categoryPricing.freeLimit === -1 ? "unlimited" : categoryPricing.freeLimit,
          remaining: categoryPricing.freeLimit === -1 ? "unlimited" : freePostsRemaining,
          isUnlimited: categoryPricing.freeLimit === -1,
        },
        premiumFee: premiumFee > 0
          ? {
              amount: premiumFee,
              display: formatCurrency(premiumFee, categoryPricing.currency),
              threshold: premiumThreshold,
              thresholdDisplay: formatCurrency(premiumThreshold, categoryPricing.currency),
            }
          : null,
        subcategories: categoryPricing.subcategories,
        isCurrentlyFree: isFree,
        nextListingPrice: isFree
          ? formatCurrency(0, categoryPricing.currency)
          : formatCurrency(categoryPricing.prices.standard, categoryPricing.currency),
      },
    });
  } catch (error) {
    console.error("[Listing Pricing] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
