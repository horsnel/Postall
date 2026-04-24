// Seller Communication Restrictions
// Sellers cannot communicate directly with customers unless specific conditions are met

export interface RestrictionCheck {
  allowed: boolean;
  reason: string;
  code:
    | "allowed"
    | "seller_blocked"
    | "no_active_task"
    | "customer_must_initiate";
}

/**
 * Check if a seller is allowed to contact a customer
 *
 * Rules:
 * - Sellers CANNOT initiate conversations with customers directly
 * - Exception 1: There is an active/assigned task between them
 * - Exception 2: The customer initiated the conversation first (existing thread)
 * - Exception 3: Service listings are exempt (sellers can discuss services)
 * - Exception 4: The user is not actually a seller (other roles are fine)
 */
export function canSellerContactCustomer(
  userRole: string,
  listingType: string,
  hasActiveTask: boolean,
  isExistingConversation: boolean = false
): RestrictionCheck {
  // Non-seller roles are always allowed
  const sellerRoles = ["seller", "vendor", "merchant"];
  if (!sellerRoles.includes(userRole.toLowerCase())) {
    return {
      allowed: true,
      reason: "Communication allowed — you are not a seller account.",
      code: "allowed",
    };
  }

  // Service listings are exempt — sellers can freely discuss services
  const exemptTypes = ["service", "services", "professional"];
  if (exemptTypes.includes(listingType.toLowerCase())) {
    return {
      allowed: true,
      reason: "Communication allowed — service listings allow direct contact.",
      code: "allowed",
    };
  }

  // If there's an active task between seller and customer, allow
  if (hasActiveTask) {
    return {
      allowed: true,
      reason: "Communication allowed — active task between parties.",
      code: "allowed",
    };
  }

  // If the customer initiated the conversation (existing thread), allow
  if (isExistingConversation) {
    return {
      allowed: true,
      reason: "Communication allowed — customer initiated this conversation.",
      code: "allowed",
    };
  }

  // Seller trying to initiate — BLOCKED
  return {
    allowed: false,
    reason:
      "Sellers cannot initiate direct conversations with buyers. The buyer must contact you first, or an active task must exist between you. This protects both parties and ensures all transactions go through the platform.",
    code: "no_active_task",
  };
}

export const SELLER_RESTRICTION_MESSAGE =
  "Sellers cannot message buyers directly. Buyers must initiate the conversation, or you need an active task between you. This is to protect both parties and ensure platform safety.";

export const SELLER_RESTRICTION_TOOLTIP =
  "For your safety, sellers can only respond to buyer messages or communicate when there's an active task.";
