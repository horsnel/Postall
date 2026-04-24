"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Shield, Wallet, ArrowRight } from "lucide-react";

interface ChatLockProps {
  listingType: string;
  listingTitle: string;
  onUnlock: () => void;
}

export default function ChatLock({ listingType, listingTitle, onUnlock }: ChatLockProps) {
  // Only show lock for task and gig listings
  const isTaskOrGig = listingType === "task" || listingType === "gig";

  if (!isTaskOrGig) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Card className="w-full max-w-sm border-dashed">
        <CardContent className="p-8 text-center space-y-5">
          {/* Lock icon */}
          <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
            <Lock className="h-8 w-8 text-amber-600" />
          </div>

          {/* Title */}
          <div>
            <h3 className="text-lg font-bold">Chat Locked</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Complete the payment into escrow to unlock chat with the selected worker
            </p>
          </div>

          {/* Listing info */}
          <div className="bg-muted/50 rounded-lg p-3 text-left">
            <p className="text-xs text-muted-foreground">Listing</p>
            <p className="text-sm font-medium truncate">{listingTitle}</p>
          </div>

          {/* Unlock button */}
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-11"
            onClick={onUnlock}
          >
            <Lock className="h-4 w-4" />
            Pay to Unlock Chat
          </Button>

          {/* Info text */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-emerald-500" />
              Escrow Protected
            </div>
            <div className="flex items-center gap-1">
              <Wallet className="h-3.5 w-3.5 text-emerald-500" />
              Refundable
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Payment will be held safely in escrow until the task is completed
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
