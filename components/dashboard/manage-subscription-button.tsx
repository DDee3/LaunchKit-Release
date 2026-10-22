"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Loader2, ExternalLink } from "lucide-react";

interface ManageSubscriptionButtonProps {
  hasStripeCustomer: boolean;
  className?: string;
}

export function ManageSubscriptionButton({
  hasStripeCustomer,
  className = "",
}: ManageSubscriptionButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleOpenPortal = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Unable to open billing portal.");
        setLoading(false);
      }
    } catch {
      alert("Failed to connect to billing portal. Please try again.");
      setLoading(false);
    }
  };

  if (!hasStripeCustomer) {
    return (
      <Button
        size="lg"
        onClick={() => {
          window.location.href = "/#pricing";
        }}
        className={`bg-[#FF5A00] text-black hover:bg-white hover:text-black font-mono font-black text-xs sm:text-sm uppercase tracking-wider rounded-none h-11 sm:h-12 px-7 shadow-[0_0_25px_rgba(255,90,0,0.3)] transition-all duration-300 active:scale-[0.98] ${className}`}
      >
        <span className="flex items-center gap-2">
          <span>Upgrade Tier</span>
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={handleOpenPortal}
      disabled={loading}
      className={`border-2 border-white/20 bg-black text-white hover:bg-[#FF5A00] hover:text-black hover:border-[#FF5A00] font-mono font-black text-xs sm:text-sm uppercase tracking-wider rounded-none h-11 sm:h-12 px-7 backdrop-blur-md transition-all duration-300 active:scale-[0.98] ${className}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          CONNECTING...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <span>Manage Billing</span>
          <ExternalLink className="h-4 w-4" />
        </span>
      )}
    </Button>
  );
}
