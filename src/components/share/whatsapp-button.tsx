"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface WhatsAppButtonProps {
  title: string;
  price?: string;
  url?: string;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "icon";
}

export function WhatsAppButton({
  title,
  price,
  url,
  className,
  variant = "outline",
  size = "sm",
}: WhatsAppButtonProps) {
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const shareText = price
    ? `Check out "${title}" for ${price} on PostAll! ${shareUrl}`
    : `Check out "${title}" on PostAll! ${shareUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  const handleClick = () => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    toast.success("Opening WhatsApp...");
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
    >
      <MessageCircle className="h-4 w-4 text-green-600" />
      {size !== "icon" && <span className="ml-1.5">WhatsApp</span>}
    </Button>
  );
}
