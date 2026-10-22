"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, X } from "lucide-react";

interface SuccessBannerProps {
  show?: boolean;
}

export function SuccessBanner({ show = true }: SuccessBannerProps) {
  const [isVisible, setIsVisible] = useState(show);
  const router = useRouter();

  if (!isVisible) {
    return null;
  }

  const handleDismiss = () => {
    setIsVisible(false);
    router.replace("/dashboard", { scroll: false });
  };

  return (
    <div className="flex items-center justify-between gap-3 border-2 border-[#FF5A00] bg-[#FF5A00]/15 p-5 text-white font-mono text-xs sm:text-sm">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-[#FF5A00] shrink-0" />
        <div className="tracking-wide">
          <span className="font-black text-[#FF5A00]">[TRANSACTION VERIFIED]</span> Stripe checkout session confirmed. Production account limits unlocked.
        </div>
      </div>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss banner"
        className="p-1 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 focus:outline-none"
      >
        <X className="h-4 w-4 text-[#FF5A00]" />
      </button>
    </div>
  );
}

