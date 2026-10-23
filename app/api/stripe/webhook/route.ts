import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe/stripe";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

interface SubscriptionPeriodItem {
  current_period_end?: number;
}

function getPeriodEndTimestamp(subscription: Stripe.Subscription): string | null {
  const item = subscription.items?.data[0] as unknown as SubscriptionPeriodItem | undefined;
  const legacyPeriodEnd = (subscription as unknown as { current_period_end?: number }).current_period_end;
  const periodEnd = item?.current_period_end ?? legacyPeriodEnd;

  return periodEnd ? new Date(periodEnd * 1000).toISOString() : null;
}

export async function POST(req: Request) {
  const stripe = getStripe();
  const supabaseAdmin = getSupabaseAdmin();

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET environment variable is not configured.");
    return NextResponse.json(
      { error: "Server webhook configuration error" },
      { status: 500 }
    );
  }

  const signature = headers().get("Stripe-Signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe-Signature header" },
      { status: 400 }
    );
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid webhook signature";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        const userId = session.metadata?.userId || session.client_reference_id;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = subscription.items.data[0]?.price.id;

          const updateData = {
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            stripe_price_id: priceId,
            subscription_status: subscription.status,
            subscription_period_end: getPeriodEndTimestamp(subscription),
          };

          if (userId) {
            const { data, error } = await supabaseAdmin
              .from("profiles")
              .upsert({
                id: userId,
                ...updateData,
              })
              .select();

            if (error) console.error("Upsert Error:", error);

            if (error) {
              return NextResponse.json(
                { error: "Failed to persist subscription state" },
                { status: 500 }
              );
            }

            if (!data || data.length === 0) {
              console.error("⚠️ Webhook failed to update user. No rows matched.");
              return NextResponse.json(
                { error: "Failed to persist subscription state: no rows matched" },
                { status: 500 }
              );
            }
          } else if (customerId) {
            const { data, error } = await supabaseAdmin
              .from("profiles")
              .update(updateData)
              .eq("stripe_customer_id", customerId)
              .select();

            if (error) console.error("Update Error (by customerId):", error);

            if (error) {
              return NextResponse.json(
                { error: "Failed to persist subscription state" },
                { status: 500 }
              );
            }

            if (!data || data.length === 0) {
              console.error("⚠️ Webhook failed to update user. No rows matched.");
              return NextResponse.json(
                { error: "Failed to persist subscription state: no rows matched" },
                { status: 500 }
              );
            }
          } else {
            console.error("❌ Webhook Error: Missing userId and customerId in session metadata");
            return NextResponse.json(
              { error: "Missing userId and customerId in session metadata" },
              { status: 500 }
            );
          }

          revalidatePath("/dashboard");
          revalidatePath("/");
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const priceId = subscription.items.data[0]?.price.id;
        const userId = subscription.metadata?.userId;

        const subUpdateData = {
          stripe_customer_id: customerId,
          stripe_subscription_id: subscription.id,
          stripe_price_id: priceId,
          subscription_status: subscription.status,
          subscription_period_end: getPeriodEndTimestamp(subscription),
        };

        if (userId) {
          const { data, error } = await supabaseAdmin
            .from("profiles")
            .update(subUpdateData)
            .eq("id", userId)
            .select();

          if (error) {
            console.error(`Failed to update subscription for user ${userId}:`, error.message);
            return NextResponse.json(
              { error: "Failed to persist subscription state" },
              { status: 500 }
            );
          }

          if (!data || data.length === 0) {
            console.error("⚠️ Webhook failed to update user. No rows matched.");
            return NextResponse.json(
              { error: "Failed to persist subscription state: no rows matched" },
              { status: 500 }
            );
          }
        } else if (customerId) {
          const { data, error } = await supabaseAdmin
            .from("profiles")
            .update(subUpdateData)
            .eq("stripe_customer_id", customerId)
            .select();

          if (error) {
            console.error(`Failed to update subscription for customer ${customerId}:`, error.message);
            return NextResponse.json(
              { error: "Failed to persist subscription state" },
              { status: 500 }
            );
          }

          if (!data || data.length === 0) {
            console.error("⚠️ Webhook failed to update user. No rows matched.");
            return NextResponse.json(
              { error: "Failed to persist subscription state: no rows matched" },
              { status: 500 }
            );
          }
        } else {
          console.error("❌ Webhook Error: Missing userId and customerId in subscription event");
          return NextResponse.json(
            { error: "Missing userId and customerId in subscription event" },
            { status: 500 }
          );
        }

        revalidatePath("/dashboard");
        revalidatePath("/");
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const userId = subscription.metadata?.userId;

        const cancelUpdateData = {
          subscription_status: "canceled",
          stripe_subscription_id: null,
          stripe_price_id: null,
        };

        const query = userId
          ? supabaseAdmin.from("profiles").update(cancelUpdateData).eq("id", userId).select()
          : supabaseAdmin
              .from("profiles")
              .update(cancelUpdateData)
              .eq("stripe_customer_id", customerId)
              .select();

        const { data, error } = await query;

        if (error) {
          console.error("Failed to cancel subscription in database:", error.message);
          return NextResponse.json(
            { error: "Failed to cancel subscription state" },
            { status: 500 }
          );
        }

        if (!data || data.length === 0) {
          console.error("⚠️ Webhook failed to cancel user subscription. No rows matched.");
          return NextResponse.json(
            { error: "Failed to cancel subscription state: no rows matched" },
            { status: 500 }
          );
        }

        revalidatePath("/dashboard");
        revalidatePath("/");
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        const customerId = invoice.customer as string;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const userId = subscription.metadata?.userId;
          const priceId = subscription.items.data[0]?.price.id;

          const invoiceUpdateData = {
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
            stripe_price_id: priceId,
            subscription_status: subscription.status,
            subscription_period_end: getPeriodEndTimestamp(subscription),
          };

          if (userId) {
            const { data, error } = await supabaseAdmin
              .from("profiles")
              .update(invoiceUpdateData)
              .eq("id", userId)
              .select();

            if (error) {
              console.error("Failed to sync invoice payment success by userId:", error.message);
              return NextResponse.json(
                { error: "Failed to sync invoice payment state" },
                { status: 500 }
              );
            }

            if (!data || data.length === 0) {
              console.error("⚠️ Webhook failed to update user by userId. No rows matched.");
              return NextResponse.json(
                { error: "Profile not found for userId. Retry later." },
                { status: 500 }
              );
            }
          } else if (customerId) {
            const { data, error } = await supabaseAdmin
              .from("profiles")
              .update(invoiceUpdateData)
              .eq("stripe_customer_id", customerId)
              .select();

            if (error) {
              console.error("Failed to sync invoice payment success by customerId:", error.message);
              return NextResponse.json(
                { error: "Failed to sync invoice payment state" },
                { status: 500 }
              );
            }

            if (!data || data.length === 0) {
              console.error("⚠️ Webhook failed to update user by customerId. No rows matched.");
              return NextResponse.json(
                { error: "Profile not found for customerId. Retry later." },
                { status: 500 }
              );
            }
          } else {
            console.error("❌ Webhook Error: Missing userId and customerId in invoice event");
            return NextResponse.json(
              { error: "Missing userId and customerId in invoice event" },
              { status: 500 }
            );
          }

          revalidatePath("/dashboard");
          revalidatePath("/");
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const { data, error } = await supabaseAdmin
          .from("profiles")
          .update({
            subscription_status: "past_due",
          })
          .eq("stripe_customer_id", customerId)
          .select();

        if (error) {
          console.error("Failed to record past_due invoice status:", error.message);
          return NextResponse.json(
            { error: "Failed to record past_due state" },
            { status: 500 }
          );
        }

        if (!data || data.length === 0) {
          console.error("⚠️ Webhook failed to update past_due user. No rows matched.");
          return NextResponse.json(
            { error: "Failed to record past_due state: no rows matched" },
            { status: 500 }
          );
        }

        revalidatePath("/dashboard");
        revalidatePath("/");
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Webhook handler failed";
    console.error("Error processing Stripe webhook:", message);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
