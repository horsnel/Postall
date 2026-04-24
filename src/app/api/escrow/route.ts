
import { NextResponse } from "next/server";
import { createClient } from "@/lib/db";

const COMMISSION_RATE = 0.10; // 10% platform commission

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const { searchParams } = new URL(request.url);
    const referenceId = searchParams.get("referenceId");
    const referenceType = searchParams.get("referenceType");
    const fundedById = searchParams.get("fundedById");

    if (referenceId && referenceType) {
      const { data: escrows, error } = await supabase
        .from("escrows")
        .select("*")
        .eq("reference_id", referenceId)
        .eq("reference_type", referenceType)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch escrows error:", error);
        return NextResponse.json({ error: "Failed to fetch escrows" }, { status: 500 });
      }

      // Enrich with task/listing data
      const enrichedEscrows = await Promise.all(
        (escrows || []).map(async (escrow: Record<string, unknown>) => enrichEscrow(supabase, escrow))
      );

      return NextResponse.json({ escrows: enrichedEscrows });
    } else if (fundedById) {
      const { data: escrows, error } = await supabase
        .from("escrows")
        .select("*")
        .eq("funded_by_id", fundedById)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch escrows error:", error);
        return NextResponse.json({ error: "Failed to fetch escrows" }, { status: 500 });
      }

      const enrichedEscrows = await Promise.all(
        (escrows || []).map(async (escrow: Record<string, unknown>) => enrichEscrow(supabase, escrow))
      );

      return NextResponse.json({ escrows: enrichedEscrows });
    } else {
      return NextResponse.json(
        { error: "referenceId+referenceType or fundedById is required" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Fetch escrows error:", error);
    return NextResponse.json(
      { error: "Failed to fetch escrows" },
      { status: 500 }
    );
  }
}

// Helper to enrich escrow with task/listing data
async function enrichEscrow(
  supabase: Awaited<ReturnType<typeof createClient>>,
  escrow: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const result: Record<string, unknown> = { ...escrow, task: null, listing: null };

  if (escrow.reference_type === "task") {
    const { data: task } = await supabase
      .from("tasks")
      .select("id, title, status, posted_by_id, assigned_to_id")
      .eq("id", escrow.reference_id)
      .maybeSingle();

    if (task) {
      const [posterRes, assigneeRes] = await Promise.all([
        supabase.from("profiles").select("id, username, photo").eq("id", task.posted_by_id).maybeSingle(),
        task.assigned_to_id
          ? supabase.from("profiles").select("id, username, photo").eq("id", task.assigned_to_id).maybeSingle()
          : Promise.resolve({ data: null }),
      ]);

      result.task = {
        id: task.id,
        title: task.title,
        status: task.status,
        postedBy: posterRes.data,
        assignedTo: assigneeRes.data,
      };
    }
  } else if (escrow.reference_type === "listing") {
    const { data: listing } = await supabase
      .from("listings")
      .select("id, title, status, posted_by_id")
      .eq("id", escrow.reference_id)
      .maybeSingle();

    if (listing) {
      const { data: poster } = await supabase
        .from("profiles")
        .select("id, username, photo")
        .eq("id", listing.posted_by_id)
        .maybeSingle();

      result.listing = {
        id: listing.id,
        title: listing.title,
        status: listing.status,
        postedBy: poster,
      };
    }
  }

  return result;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const body = await request.json();
    const { referenceId, referenceType, amount, fundedById, fundedForId } = body;

    if (!referenceId || !referenceType || !amount || !fundedById) {
      return NextResponse.json(
        { error: "referenceId, referenceType, amount, and fundedById are required" },
        { status: 400 }
      );
    }

    if (referenceType !== "task" && referenceType !== "listing") {
      return NextResponse.json(
        { error: "referenceType must be 'task' or 'listing'" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be positive" },
        { status: 400 }
      );
    }

    // Check for existing pending escrow for this reference
    const { data: existingEscrow } = await supabase
      .from("escrows")
      .select("id")
      .eq("reference_id", referenceId)
      .eq("reference_type", referenceType)
      .in("status", ["pending", "funded"])
      .limit(1)
      .maybeSingle();

    if (existingEscrow) {
      return NextResponse.json(
        { error: "An active escrow already exists for this reference" },
        { status: 409 }
      );
    }

    // ─── Fund from wallet: check balance and deduct ───
    let { data: wallet } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", fundedById)
      .maybeSingle();

    if (!wallet) {
      const { data: newWallet, error: createError } = await supabase
        .from("wallets")
        .insert({ user_id: fundedById })
        .select()
        .single();

      if (createError) {
        console.error("Create wallet error:", createError);
        return NextResponse.json({ error: "Failed to create wallet" }, { status: 500 });
      }
      wallet = newWallet;
    }

    if ((wallet.balance || 0) < amount) {
      return NextResponse.json(
        { error: "Insufficient wallet balance to fund escrow" },
        { status: 400 }
      );
    }

    // Deduct from wallet
    const { error: walletUpdateError } = await supabase
      .from("wallets")
      .update({
        balance: (wallet.balance || 0) - amount,
        total_spending: (wallet.total_spending || 0) + amount,
      })
      .eq("id", wallet.id);

    if (walletUpdateError) {
      console.error("Deduct wallet error:", walletUpdateError);
      return NextResponse.json({ error: "Failed to deduct from wallet" }, { status: 500 });
    }

    // Create escrow transaction record
    await supabase
      .from("transactions")
      .insert({
        wallet_id: wallet.id,
        type: "escrow_fund",
        amount,
        currency: wallet.currency,
        status: "completed",
        description: `Escrow funded for ${referenceType} ${referenceId}`,
      });

    // Create escrow (now funded, not just pending)
    const { data: escrow, error: escrowError } = await supabase
      .from("escrows")
      .insert({
        reference_id: referenceId,
        reference_type: referenceType,
        amount: parseFloat(amount),
        funded_by_id: fundedById,
        funded_for_id: fundedForId || null,
        status: "funded",
        funded_at: new Date().toISOString(),
        auto_release_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        currency: wallet.currency,
      })
      .select()
      .single();

    if (escrowError) {
      console.error("Create escrow error:", escrowError);
      return NextResponse.json({ error: "Failed to create escrow" }, { status: 500 });
    }

    // Update task/listing status if applicable
    if (referenceType === "task") {
      await supabase
        .from("tasks")
        .update({ status: "in_progress" })
        .eq("id", referenceId);
    } else if (referenceType === "listing") {
      await supabase
        .from("listings")
        .update({ status: "pending_sale" })
        .eq("id", referenceId);
    }

    // Enrich with task/listing data
    const enrichedEscrow = await enrichEscrow(supabase, escrow);

    return NextResponse.json({ success: true, escrow: enrichedEscrow }, { status: 201 });
  } catch (error) {
    console.error("Create escrow error:", error);
    return NextResponse.json(
      { error: "Failed to create escrow" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Escrow ID and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "funded", "released", "refunded", "disputed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Status must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // Find existing escrow
    const { data: existingEscrow } = await supabase
      .from("escrows")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!existingEscrow) {
      return NextResponse.json(
        { error: "Escrow not found" },
        { status: 404 }
      );
    }

    // Only allow transitions from funded status
    if (existingEscrow.status !== "funded" && status !== "funded") {
      return NextResponse.json(
        { error: "Escrow must be in funded state to release or refund" },
        { status: 400 }
      );
    }

    // Build update data based on status transition
    const updateData: Record<string, unknown> = { status };

    if (status === "funded") {
      updateData.funded_at = new Date().toISOString();
      updateData.auto_release_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    } else if (status === "released") {
      updateData.released_at = new Date().toISOString();
    }

    const { data: escrow, error: escrowError } = await supabase
      .from("escrows")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (escrowError) {
      console.error("Update escrow error:", escrowError);
      return NextResponse.json({ error: "Failed to update escrow" }, { status: 500 });
    }

    // ─── Release: Pay worker (minus 10% commission) ───
    if (status === "released") {
      const commission = Math.round((escrow.amount || 0) * COMMISSION_RATE * 100) / 100;
      const payoutAmount = Math.round(((escrow.amount || 0) - commission) * 100) / 100;
      const recipientId = escrow.funded_for_id || escrow.funded_by_id;

      // Credit recipient's wallet (minus commission)
      let { data: recipientWallet } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", recipientId)
        .maybeSingle();

      if (!recipientWallet) {
        const { data: newWallet, error: createError } = await supabase
          .from("wallets")
          .insert({ user_id: recipientId })
          .select()
          .single();

        if (createError) {
          console.error("Create recipient wallet error:", createError);
          return NextResponse.json({ error: "Failed to create recipient wallet" }, { status: 500 });
        }
        recipientWallet = newWallet;
      }

      await supabase
        .from("wallets")
        .update({
          balance: (recipientWallet.balance || 0) + payoutAmount,
          total_earnings: (recipientWallet.total_earnings || 0) + payoutAmount,
        })
        .eq("id", recipientWallet.id);

      // Transaction record for payout
      await supabase
        .from("transactions")
        .insert({
          wallet_id: recipientWallet.id,
          type: "payment_received",
          amount: payoutAmount,
          currency: escrow.currency,
          status: "completed",
          description: `Escrow release for ${escrow.reference_type} ${escrow.reference_id}`,
        });

      // Transaction record for commission
      if (commission > 0) {
        await supabase
          .from("transactions")
          .insert({
            wallet_id: recipientWallet.id,
            type: "platform_fee",
            amount: commission,
            currency: escrow.currency,
            status: "completed",
            description: `10% platform commission on escrow release (${escrow.reference_type} ${escrow.reference_id})`,
          });
      }

      // Update task/listing status
      if (escrow.reference_type === "task") {
        await supabase
          .from("tasks")
          .update({ status: "completed" })
          .eq("id", escrow.reference_id);
      } else if (escrow.reference_type === "listing") {
        await supabase
          .from("listings")
          .update({ status: "sold" })
          .eq("id", escrow.reference_id);
      }

      // Update worker's task count if fundedForId exists
      if (escrow.funded_for_id) {
        const { data: workerProfile } = await supabase
          .from("profiles")
          .select("tasks_completed")
          .eq("id", escrow.funded_for_id)
          .maybeSingle();

        await supabase
          .from("profiles")
          .update({
            tasks_completed: (workerProfile?.tasks_completed || 0) + 1,
          })
          .eq("id", escrow.funded_for_id);
      }
    }

    // ─── Refund: Return full amount to buyer's wallet ───
    if (status === "refunded") {
      let { data: buyerWallet } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", escrow.funded_by_id)
        .maybeSingle();

      if (!buyerWallet) {
        const { data: newWallet, error: createError } = await supabase
          .from("wallets")
          .insert({ user_id: escrow.funded_by_id })
          .select()
          .single();

        if (createError) {
          console.error("Create buyer wallet error:", createError);
          return NextResponse.json({ error: "Failed to create buyer wallet" }, { status: 500 });
        }
        buyerWallet = newWallet;
      }

      await supabase
        .from("wallets")
        .update({
          balance: (buyerWallet.balance || 0) + (escrow.amount || 0),
        })
        .eq("id", buyerWallet.id);

      // Transaction record for refund
      await supabase
        .from("transactions")
        .insert({
          wallet_id: buyerWallet.id,
          type: "escrow_release",
          amount: escrow.amount,
          currency: escrow.currency,
          status: "completed",
          description: `Refund for ${escrow.reference_type} ${escrow.reference_id}`,
        });

      // Update task/listing status back to open/active
      if (escrow.reference_type === "task") {
        await supabase
          .from("tasks")
          .update({ status: "open" })
          .eq("id", escrow.reference_id);
      } else if (escrow.reference_type === "listing") {
        await supabase
          .from("listings")
          .update({ status: "active" })
          .eq("id", escrow.reference_id);
      }
    }

    // Enrich with task/listing data
    const enrichedEscrow = await enrichEscrow(supabase, escrow);

    return NextResponse.json({ success: true, escrow: enrichedEscrow });
  } catch (error) {
    console.error("Update escrow error:", error);
    return NextResponse.json(
      { error: "Failed to update escrow" },
      { status: 500 }
    );
  }
}
