import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ManageSubscriptionButton } from "@/components/dashboard/manage-subscription-button";
import { SuccessBanner } from "@/components/dashboard/success-banner";
import { TiltCard } from "@/components/landing/tilt-card";
import {
  Activity,
  CreditCard,
  Database,
  ShieldCheck,
  Terminal,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface DashboardPageProps {
  searchParams: {
    success?: string;
    session_id?: string;
  };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const isSubscribed =
    profile?.subscription_status === "active" ||
    profile?.subscription_status === "trialing";

  const subscriptionStatus = profile?.subscription_status || "free";

  return (
    <div className="space-y-10 pb-16">
      {searchParams.success && <SuccessBanner />}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-8 border-b border-white/[0.08]">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-[#FF5A00] mb-2 flex items-center gap-2">
            <span>// TELEMETRY & BILLING CONSOLE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-[-0.04em] uppercase text-white leading-tight">
            OPERATOR: {profile?.full_name || user.email?.split("@")[0] || "UNKNOWN"}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 font-mono">
            Autonomous API execution, Postgres RLS boundaries, and Stripe subscription lifecycle.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ManageSubscriptionButton
            hasStripeCustomer={!!profile?.stripe_customer_id}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TiltCard
          intensity={8}
          className="group border border-white/10 bg-zinc-950/80 p-7 hover:border-[#FF5A00] transition-colors duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                STAT_01 // PLAN STATUS
              </span>
              <div className="h-8 w-8 bg-black border border-white/15 flex items-center justify-center text-[#FF5A00] group-hover:border-[#FF5A00] transition-colors">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-6">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">
                CURRENT TIER
              </div>
              <div className="text-4xl sm:text-5xl font-mono font-black text-white tracking-tight uppercase">
                {isSubscribed ? "PRO" : "FREE"}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs">
            <span className="text-zinc-500 text-[11px]">
              {profile?.subscription_period_end
                ? `RENEWS: ${new Date(profile.subscription_period_end).toLocaleDateString()}`
                : "UPGRADE VIA STRIPE"}
            </span>
            <span
              className={`px-3.5 py-1 border-2 text-xs font-mono font-black uppercase tracking-wider ${
                isSubscribed
                  ? "border-[#FF5A00] bg-[#FF5A00]/15 text-[#FF5A00]"
                  : subscriptionStatus === "canceled"
                  ? "border-rose-500/60 bg-rose-500/15 text-rose-400"
                  : "border-white/30 bg-white/10 text-white"
              }`}
            >
              {isSubscribed ? "ACTIVE" : subscriptionStatus}
            </span>
          </div>
        </TiltCard>

        <TiltCard
          intensity={8}
          className="group border border-white/10 bg-zinc-950/80 p-7 hover:border-[#FF5A00] transition-colors duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                STAT_02 // USAGE QUOTA
              </span>
              <div className="h-8 w-8 bg-black border border-white/15 flex items-center justify-center text-[#FF5A00] group-hover:border-[#FF5A00] transition-colors">
                <Activity className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-6">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">
                MONTHLY REQS
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-mono font-black text-white tracking-tight">
                  {isSubscribed ? "12,480" : "420"}
                </span>
                <span className="font-mono text-xs text-zinc-500 uppercase">
                  / {isSubscribed ? "50,000" : "1,000"}
                </span>
              </div>
            </div>

            <div className="w-full bg-black h-2 mt-4 border border-white/10 overflow-hidden">
              <div
                className="bg-[#FF5A00] h-full transition-all duration-500 shadow-[0_0_12px_rgba(255,90,0,0.5)]"
                style={{ width: isSubscribed ? "25%" : "42%" }}
              />
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/[0.06] font-mono text-[11px] text-zinc-500 flex items-center justify-between">
            <span>INTERVAL: MONTHLY</span>
            <span className="text-white font-bold">RESETS 1ST</span>
          </div>
        </TiltCard>

        <TiltCard
          intensity={8}
          className="group border border-white/10 bg-zinc-950/80 p-7 hover:border-[#FF5A00] transition-colors duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                STAT_03 // RLS SECURITY
              </span>
              <div className="h-8 w-8 bg-black border border-white/15 flex items-center justify-center text-[#FF5A00] group-hover:border-[#FF5A00] transition-colors">
                <Database className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-6">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">
                POSTGRES ROW ISOLATION
              </div>
              <div className="text-4xl sm:text-5xl font-mono font-black text-white tracking-tight">
                SECURED
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs">
            <span className="text-zinc-500 text-[11px]">CASCADE DELETE TRIGGER</span>
            <span className="px-3.5 py-1 border-2 border-white/30 bg-white/10 text-white text-xs font-mono font-black uppercase tracking-wider inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#FF5A00]" />
              ENFORCED
            </span>
          </div>
        </TiltCard>
      </div>

      <div className="border border-white/10 bg-zinc-950/80 overflow-hidden font-mono">
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-black/60">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 bg-zinc-900 border border-white/15 flex items-center justify-center text-[#FF5A00]">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-widest">
                Account & Billing Infrastructure
              </h2>
              <p className="text-[11px] text-zinc-500">
                Synchronized records between Supabase Auth and Stripe Customer APIs
              </p>
            </div>
          </div>
          <span className="font-mono text-xs uppercase tracking-widest px-3.5 py-1.5 border-2 border-[#FF5A00] bg-[#FF5A00]/15 text-[#FF5A00] font-black">
            LIVE SYNC
          </span>
        </div>

        <div className="divide-y divide-white/[0.06] text-xs">
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-white/[0.02] transition-colors">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">User ID</span>
            <span className="text-xs font-mono text-zinc-200 select-all hover:text-[#FF5A00] transition-colors">{user.id}</span>
          </div>

          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-white/[0.02] transition-colors">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Email Address</span>
            <span className="text-xs font-mono text-zinc-200 select-all hover:text-[#FF5A00] transition-colors">{user.email}</span>
          </div>

          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-white/[0.02] transition-colors">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Stripe Customer ID</span>
            <span className="text-xs font-mono text-zinc-200 select-all hover:text-[#FF5A00] transition-colors">
              {profile?.stripe_customer_id || "Unassigned (provisioned on initial checkout)"}
            </span>
          </div>

          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-white/[0.02] transition-colors">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Stripe Subscription ID</span>
            <span className="text-xs font-mono text-zinc-200 select-all hover:text-[#FF5A00] transition-colors">
              {profile?.stripe_subscription_id || "None"}
            </span>
          </div>

          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-white/[0.02] transition-colors">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Active Price ID</span>
            <span className="text-xs font-mono text-zinc-200 select-all hover:text-[#FF5A00] transition-colors">
              {profile?.stripe_price_id || "None"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
