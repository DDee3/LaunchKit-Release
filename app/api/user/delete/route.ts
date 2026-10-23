import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe/stripe";

// Note: In production, a distributed Redis-based solution (like Upstash) should be used for rate limiting.
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 10_000;

export async function POST() {
  try {
    const stripe = getStripe();
    const supabaseAdmin = getSupabaseAdmin();
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = Date.now();
    const lastRequestTime = rateLimitMap.get(user.id);
    if (lastRequestTime && now - lastRequestTime < RATE_LIMIT_WINDOW_MS) {
      return NextResponse.json(
        { error: "Too Many Requests. Please wait before trying again." },
        { status: 429 }
      );
    }
    rateLimitMap.set(user.id, now);

    // Cancel active Stripe subscription if customer exists
    try {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("stripe_customer_id, stripe_subscription_id")
        .eq("id", user.id)
        .single();

      if (profile?.stripe_subscription_id) {
        await stripe.subscriptions.cancel(profile.stripe_subscription_id);
      }
    } catch (stripeErr: unknown) {
      const errMsg =
        stripeErr instanceof Error ? stripeErr.message : "Unknown Stripe error";
      console.error(
        `Critical error: Failed to cancel Stripe subscription for user ${user.id}:`,
        errMsg
      );
      return NextResponse.json(
        { error: "Failed to cancel active subscription prior to account deletion. Please contact support or cancel via the billing portal first." },
        { status: 500 }
      );
    }

    // Securely delete user from Supabase Auth (cascades to public.profiles via foreign key)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (error) {
      console.error("Failed to delete user account:", error.message);
      return NextResponse.json(
        { error: "Failed to delete account. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error("Delete account error:", message);
    return NextResponse.json(
      { error: "Failed to process account deletion request." },
      { status: 500 }
    );
  }
}

