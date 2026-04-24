
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    // Verify Paystack signature
    const paystackSignature = request.headers.get("x-paystack-signature") || "";

    if (PAYSTACK_SECRET_KEY && paystackSignature) {
      const expectedSignature = crypto
        .createHmac("sha512", PAYSTACK_SECRET_KEY)
        .update(body)
        .digest("hex");

      if (expectedSignature !== paystackSignature) {
        console.error("[Paystack Webhook] Invalid signature");
        return NextResponse.json(
          { message: "Invalid signature" },
          { status: 401 }
        );
      }
    } else if (!PAYSTACK_SECRET_KEY) {
      console.warn("[Paystack Webhook] No secret key set — skipping signature verification");
    }

    const event = JSON.parse(body);
    const eventType = event.event;

    console.log(`[Paystack Webhook] Received event: ${eventType}`, event.data?.reference);

    // Handle different event types
    switch (eventType) {
      case "charge.success": {
        await handleChargeSuccess(event.data);
        break;
      }

      case "transfer.success": {
        await handleTransferSuccess(event.data);
        break;
      }

      case "transfer.failed": {
        await handleTransferFailed(event.data);
        break;
      }

      case "charge.failed": {
        await handleChargeFailed(event.data);
        break;
      }

      case "transfer.rejected": {
        await handleTransferRejected(event.data);
        break;
      }

      default:
        console.log(`[Paystack Webhook] Unhandled event type: ${eventType}`);
    }

    // Always return 200 OK to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Paystack Webhook] Error processing webhook:", error);
    // Still return 200 to prevent retry storms
    return NextResponse.json({ received: true });
  }
}

// ─── Event Handlers ────────────────────────────────────────────

async function handleChargeSuccess(data: Record<string, unknown>) {
  const reference = data.reference as string;
  const metadata = data.metadata as Record<string, unknown> | undefined;
  const amount = data.amount as number;
  const customerEmail = (data.customer as Record<string, unknown>)?.email as string;

  console.log(`[Paystack] Charge success: ${reference}, amount: ${amount}, email: ${customerEmail}`);

  if (!metadata?.type) {
    console.log("[Paystack] No metadata type — skipping processing");
    return;
  }

  const type = metadata.type as string;

  switch (type) {
    case "escrow": {
      // Update escrow status to 'funded'
      const taskId = metadata.taskId as string;
      const workerId = metadata.workerId as string;
      console.log(`[Paystack] Funding escrow for task ${taskId}, worker ${workerId}`);

      // In production: update database
      // await db.escrow.update({
      //   where: { reference },
      //   data: { status: "funded", fundedAt: new Date() }
      // });
      // Also unlock chat between parties
      break;
    }

    case "listing_fee": {
      const taskId = metadata.taskId as string;
      console.log(`[Paystack] Listing fee paid for task ${taskId}`);
      // In production: update listing status to active
      break;
    }

    case "wallet_deposit": {
      console.log(`[Paystack] Wallet deposit for ${customerEmail}: ₦${amount / 100}`);
      // In production: credit user wallet
      // await db.wallet.update({
      //   where: { userId },
      //   data: { balance: { increment: amount / 100 } }
      // });
      // Create transaction record
      break;
    }

    default:
      console.log(`[Paystack] Unknown metadata type: ${type}`);
  }
}

async function handleTransferSuccess(data: Record<string, unknown>) {
  const reference = data.reference as string;
  const amount = data.amount as number;
  console.log(`[Paystack] Transfer success: ${reference}, amount: ${amount}`);

  // In production: update withdrawal status
  // await db.withdrawal.update({
  //   where: { reference },
  //   data: { status: "completed", completedAt: new Date() }
  // });
}

async function handleTransferFailed(data: Record<string, unknown>) {
  const reference = data.reference as string;
  const amount = data.amount as number;
  const userId = (data.metadata as Record<string, unknown>)?.userId as string;
  console.log(`[Paystack] Transfer failed: ${reference}, amount: ${amount}`);

  // Revert wallet balance
  if (userId) {
    console.log(`[Paystack] Reverting wallet balance for user ${userId}: ₦${amount / 100}`);
    // In production: revert wallet balance
    // await db.wallet.update({
    //   where: { userId },
    //   data: { balance: { increment: amount / 100 } }
    // });
    // Update withdrawal status
    // await db.withdrawal.update({
    //   where: { reference },
    //   data: { status: "failed" }
    // });
  }
}

async function handleChargeFailed(data: Record<string, unknown>) {
  const reference = data.reference as string;
  console.log(`[Paystack] Charge failed: ${reference}`);
  // In production: mark escrow/payment as failed
}

async function handleTransferRejected(data: Record<string, unknown>) {
  const reference = data.reference as string;
  const amount = data.amount as number;
  const userId = (data.metadata as Record<string, unknown>)?.userId as string;
  console.log(`[Paystack] Transfer rejected: ${reference}`);

  // Revert wallet balance if transfer was rejected
  if (userId && amount) {
    console.log(`[Paystack] Reverting wallet balance for rejected transfer, user ${userId}: ₦${amount / 100}`);
    // In production: revert wallet balance
  }
}
