import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe/stripe";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Optional: Cancel active Stripe subscription if customer exists
    try {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("stripe_customer_id, stripe_subscription_id")
        .eq("id", user.id)
        .single();

      if (profile?.stripe_subscription_id) {
        await stripe.subscriptions.cancel(profile.stripe_subscription_id);
      }
    } catch {
      // Continue deletion if subscription was already canceled or unassigned
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

