"use client";

import { TiltCard } from "./tilt-card";
import { Webhook, Database, Lock, Layers } from "lucide-react";

export function Features() {
  return (
    <section id="features" className="py-32 relative bg-[#000000] border-t border-white/[0.08]">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mb-20 text-left">
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-[#FF5A00] mb-3 flex items-center gap-2">
            <span>// ARCHITECTURAL MATRIX</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black tracking-[-0.04em] uppercase text-white leading-tight">
            NO SLOP. ZERO COMPROMISE. <br />
            PURE INFRASTRUCTURE.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
            Every file in this starter is structured for high-load commercial viability.
            Asymmetrical architecture engineered for builders who despise bloated abstractions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <TiltCard
            intensity={10}
            className="md:col-span-8 group border border-white/10 bg-zinc-950/70 p-8 hover:border-[#FF5A00]/50 transition-colors duration-500 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-6 font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
              MOD_01 // WEBHOOK_ENGINE
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-black border border-white/15 flex items-center justify-center text-[#FF5A00]">
                <Webhook className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
                  Idempotent Stripe Webhook Pipeline
                </h3>
                <p className="text-xs font-mono text-zinc-400">
                  Signature verified • Safe period_end mapping • Next.js cache revalidation
                </p>
              </div>
            </div>

            <p className="text-sm text-zinc-400 max-w-xl leading-relaxed mb-6">
              Eliminates Stripe webhook synchronization errors. Handles updated Stripe API period extraction,
              instantaneous <code className="text-zinc-200 bg-white/5 px-1 py-0.5 font-mono">revalidatePath(&apos;/dashboard&apos;)</code>,
              and syncs profile subscription metadata directly with Supabase Admin client.
            </p>

            <div className="rounded border border-white/10 bg-black/90 p-4 font-mono text-xs text-zinc-400 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-zinc-500 border-b border-white/[0.06] pb-2 mb-2">
                <span>EVENT STREAM // ACTIVE</span>
                <span className="text-[#FF5A00]">STATUS 200 OK</span>
              </div>
              <p className="text-zinc-300">
                <span className="text-[#FF5A00]">&gt;</span> stripe.webhooks.constructEvent(payload, sig, secret)
              </p>
              <p className="text-zinc-500">
                <span className="text-white">✓</span> [Verified] customer.subscription.updated (sub_1Op2...92)
              </p>
              <p className="text-zinc-500">
                <span className="text-white">✓</span> [Profiles] subscription_status =&gt; &apos;active&apos;
              </p>
              <p className="text-zinc-400">
                <span className="text-[#FF5A00]">✓</span> [Revalidate] /dashboard cleared in 8ms
              </p>
            </div>
          </TiltCard>

          <TiltCard
            intensity={12}
            className="md:col-span-4 group border border-white/10 bg-zinc-950/70 p-8 hover:border-[#FF5A00]/50 transition-colors duration-500 flex flex-col justify-between"
          >
            <div>
              <div className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest mb-6">
                MOD_02 // AUTH_SSR
              </div>

              <div className="h-10 w-10 bg-black border border-white/15 flex items-center justify-center text-[#FF5A00] mb-6">
                <Lock className="h-5 w-5" />
              </div>

              <h3 className="text-xl font-bold tracking-tight text-white uppercase mb-2">
                Supabase SSR Token Engine
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Modern <code className="text-zinc-200 font-mono">@supabase/ssr</code> cookie handler.
                Protects Edge routes without hydration flashes and refreshes expired sessions automatically.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.08] font-mono text-xs text-zinc-500 flex items-center justify-between">
              <span>GOOGLE OAUTH + EMAIL</span>
              <span className="text-white font-bold">100% READY</span>
            </div>
          </TiltCard>

          <TiltCard
            intensity={12}
            className="md:col-span-4 group border border-white/10 bg-zinc-950/70 p-8 hover:border-[#FF5A00]/50 transition-colors duration-500 flex flex-col justify-between"
          >
            <div>
              <div className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest mb-6">
                MOD_03 // POSTGRES_RLS
              </div>

              <div className="h-10 w-10 bg-black border border-white/15 flex items-center justify-center text-[#FF5A00] mb-6">
                <Database className="h-5 w-5" />
              </div>

              <h3 className="text-xl font-bold tracking-tight text-white uppercase mb-2">
                Hardened Database & RLS
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Zero chance of cross-tenant leaks. Automated signup triggers generate
                isolated profile rows linked to Postgres <code className="text-zinc-200 font-mono">auth.users</code>.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.08] font-mono text-xs text-zinc-500 flex items-center justify-between">
              <span>CASCADE DELETE TRIGGER</span>
              <span className="text-white font-bold">ISOLATED</span>
            </div>
          </TiltCard>

          <TiltCard
            intensity={10}
            className="md:col-span-8 group border border-white/10 bg-zinc-950/70 p-8 hover:border-[#FF5A00]/50 transition-colors duration-500 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-6 font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
              MOD_04 // BILLING_PORTAL
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-black border border-white/15 flex items-center justify-center text-[#FF5A00]">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
                  Self-Service Customer Portal
                </h3>
                <p className="text-xs font-mono text-zinc-400">
                  Direct billing self-management without support ticket overhead
                </p>
              </div>
            </div>

            <p className="text-sm text-zinc-400 max-w-xl leading-relaxed mb-6">
              Customers can instantly switch plans, download tax receipts, and update payment methods via
              one-click encrypted Stripe Customer Portal sessions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 bg-black border border-white/[0.08]">
                <div className="text-zinc-500 text-[10px]">MONTHLY / ANNUAL</div>
                <div className="text-white font-bold mt-1">PRICE ID MAPPING</div>
              </div>
              <div className="p-3 bg-black border border-white/[0.08]">
                <div className="text-zinc-500 text-[10px]">PORTAL SESSION</div>
                <div className="text-white font-bold mt-1">SINGLE USE URL</div>
              </div>
              <div className="p-3 bg-black border border-white/[0.08]">
                <div className="text-zinc-500 text-[10px]">CANCELLATION FLOW</div>
                <div className="text-[#FF5A00] font-bold mt-1">INSTANT SYNC</div>
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
