"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function CheckoutTrigger() {
  const router = useRouter();

  useEffect(() => {
    const priceId = sessionStorage.getItem("pending_checkout_price_id");
    const redirectTo = sessionStorage.getItem("pending_redirect");

    if (priceId) {
      sessionStorage.removeItem("pending_checkout_price_id");
      sessionStorage.removeItem("pending_redirect");

      fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.url) {
            window.location.href = data.url;
          } else {
            alert(data.error || "Failed to create checkout session");
            if (redirectTo && redirectTo !== "/dashboard") router.push(redirectTo);
          }
        })
        .catch(() => {
          alert("An unexpected error occurred. Please try again.");
        });
    } else if (redirectTo && redirectTo !== "/dashboard") {
      sessionStorage.removeItem("pending_redirect");
      router.push(redirectTo);
    }
  }, [router]);

  return null;
}

