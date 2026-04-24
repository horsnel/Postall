
import { NextResponse } from "next/server";
import { createClient } from "@/lib/db";

// Helper: Check if today is Saturday (6) or Sunday (0)
function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}

const COMMISSION_RATE = 0.10; // 10% platform commission
const MIN_WITHDRAWAL = 1000; // ₦1,000 minimum withdrawal

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if wallet exists, create one if not
    let { data: wallet } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!wallet) {
      const { data: newWallet, error: createError } = await supabase
        .from("wallets")
        .insert({ user_id: userId })
        .select()
        .single();

      if (createError) {
        console.error("Create wallet error:", createError);
        return NextResponse.json({ error: "Failed to create wallet" }, { status: 500 });
      }
      wallet = newWallet;
    }

    // Fetch transactions for this wallet
    const { data: transactions } = await supabase
      .from("transactions")
      .select("*")
      .eq("wallet_id", wallet.id)
      .order("created_at", { ascending: false })
      .limit(20);

    return NextResponse.json({
      wallet: {
        ...wallet,
        transactions: transactions ?? [],
        payment_methods: [],
      },
    });
  } catch (error) {
    console.error("Fetch wallet error:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const body = await request.json();
    const { userId, type, amount, method, description } = body;

    if (!userId || !type || !amount) {
      return NextResponse.json(
        { error: "User ID, type, and amount are required" },
        { status: 400 }
      );
    }

    if (type !== "deposit" && type !== "withdrawal") {
      return NextResponse.json(
        { error: "Type must be 'deposit' or 'withdrawal'" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than zero" },
        { status: 400 }
      );
    }

    // ─── Withdrawal-specific validations ───
    if (type === "withdrawal") {
      // Minimum ₦1,000
      if (amount < MIN_WITHDRAWAL) {
        return NextResponse.json(
          { error: `Minimum withdrawal amount is ₦${MIN_WITHDRAWAL.toLocaleString()}` },
          { status: 400 }
        );
      }

      // Weekend-only check (Saturday or Sunday)
      if (!isWeekend()) {
        return NextResponse.json(
          { error: "Withdrawals are only processed on weekends (Saturday and Sunday)" },
          { status: 400 }
        );
      }
    }

    // Check if wallet exists, create one if not
    let { data: wallet } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!wallet) {
      const { data: newWallet, error: createError } = await supabase
        .from("wallets")
        .insert({ user_id: userId })
        .select()
        .single();

      if (createError) {
        console.error("Create wallet error:", createError);
        return NextResponse.json({ error: "Failed to create wallet" }, { status: 500 });
      }
      wallet = newWallet;
    }

    // For withdrawals, calculate commission and check sufficient funds
    let commission = 0;
    let payoutAmount = amount;

    if (type === "withdrawal") {
      commission = Math.round(amount * COMMISSION_RATE * 100) / 100;
      payoutAmount = Math.round((amount - commission) * 100) / 100;

      // Check sufficient balance including commission
      if (wallet.balance < amount) {
        return NextResponse.json(
          { error: "Insufficient balance for this withdrawal" },
          { status: 400 }
        );
      }
    }

    // Create the main transaction
    const { data: transaction, error: txnError } = await supabase
      .from("transactions")
      .insert({
        wallet_id: wallet.id,
        type,
        amount,
        currency: wallet.currency,
        method: method || null,
        status: "completed",
        description: description || `${type.charAt(0).toUpperCase() + type.slice(1)} of ₦${amount.toLocaleString()}`,
      })
      .select()
      .single();

    if (txnError) {
      console.error("Create transaction error:", txnError);
      return NextResponse.json({ error: "Failed to process transaction" }, { status: 500 });
    }

    // Create commission transaction record if withdrawal
    let commissionTransaction: Record<string, unknown> | null = null;
    if (type === "withdrawal" && commission > 0) {
      const { data: commTxn } = await supabase
        .from("transactions")
        .insert({
          wallet_id: wallet.id,
          type: "platform_fee",
          amount: commission,
          currency: wallet.currency,
          status: "completed",
          description: `10% platform commission on ₦${amount.toLocaleString()} withdrawal`,
        })
        .select()
        .single();

      commissionTransaction = commTxn;
    }

    // Update wallet balance (read-then-update pattern for atomic arithmetic)
    const newBalance = type === "deposit"
      ? (wallet.balance || 0) + amount
      : (wallet.balance || 0) - amount;

    const newTotalEarnings = type === "deposit"
      ? (wallet.total_earnings || 0) + amount
      : wallet.total_earnings || 0;

    const newTotalSpending = type === "withdrawal"
      ? (wallet.total_spending || 0) + amount
      : wallet.total_spending || 0;

    const { error: walletUpdateError } = await supabase
      .from("wallets")
      .update({
        balance: newBalance,
        total_earnings: newTotalEarnings,
        total_spending: newTotalSpending,
      })
      .eq("id", wallet.id);

    if (walletUpdateError) {
      console.error("Update wallet error:", walletUpdateError);
      return NextResponse.json({ error: "Failed to update wallet" }, { status: 500 });
    }

    // Fetch updated wallet with transactions for response
    const { data: updatedTransactions } = await supabase
      .from("transactions")
      .select("*")
      .eq("wallet_id", wallet.id)
      .order("created_at", { ascending: false })
      .limit(20);

    const updatedWallet = {
      ...wallet,
      balance: newBalance,
      total_earnings: newTotalEarnings,
      total_spending: newTotalSpending,
      transactions: updatedTransactions ?? [],
      payment_methods: [],
    };

    return NextResponse.json(
      {
        success: true,
        transaction,
        commissionTransaction,
        commission,
        payoutAmount: type === "withdrawal" ? payoutAmount : undefined,
        wallet: updatedWallet,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Wallet transaction error:", error);
    return NextResponse.json(
      { error: "Failed to process wallet transaction" },
      { status: 500 }
    );
  }
}
