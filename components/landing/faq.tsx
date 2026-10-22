"use client";

import { TiltCard } from "./tilt-card";

const faqs = [
  {
    index: "01",
    question: "How are Stripe Webhooks verified and protected?",
    answer:
      "Every incoming POST to `/api/stripe/webhook` is cryptographically validated using `stripe.webhooks.constructEvent()` with `STRIPE_WEBHOOK_SECRET`. This prevents spoofing attacks and ensures only legitimate Stripe billing events trigger state changes in your Supabase database.",
  },
  {
    index: "02",
    question: "How does the Stripe Customer Portal operate?",
    answer:
      "When a user triggers the billing button, `/api/stripe/portal` generates an authenticated single-use Stripe billing session. Customers directly upgrade, downgrade, change payment cards, or cancel subscriptions without requiring custom developer intervention.",
  },
  {
    index: "03",
    question: "What guarantees exist against cross-tenant data leaks?",
    answer:
      "PostgreSQL Row Level Security (RLS) is strictly enforced on `public.profiles`. Auth sessions verified by `@supabase/ssr` inject `auth.uid()`, preventing any user from accessing, modifying, or querying another customer's subscription or metadata.",
  },
  {
    index: "04",
    question: "How does Edge Middleware prevent unauthenticated flash?",
    answer:
      "The Next.js Edge Middleware (`middleware.ts`) refreshes the Supabase token on every incoming request. If an unauthorized client attempts to access `/dashboard`, they are redirected to `/login` before any Server Component or client bundle begins execution.",
  },
  {
    index: "05",
    question: "Is this starter commercial license royalty-free?",
    answer:
      "Yes. You receive a perpetual, commercial license to build, launch, and monetize unlimited client projects or independent Micro-SaaS products with zero royalties or revenue shares.",
  },
  {
    index: "06",
    question: "How do I test webhook events during local development?",
    answer:
      "Run `npm run stripe:listen` with the official Stripe CLI. All live webhook triggers (checkout completions, subscription updates, cancellations) are forwarded instantly to `localhost:3000/api/stripe/webhook` with signature logging.",
  },
];

export function FAQ() {
  return (
    <section id="architecture" className="py-32 relative bg-[#000000] border-t border-white/[0.08]">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mb-16 text-left">
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-[#FF5A00] mb-3 flex items-center gap-2">
            <span>// DEEP ARCHITECTURE</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black tracking-[-0.04em] uppercase text-white leading-tight">
            FREQUENTLY QUERIED <br />
            SYSTEM SPECIFICATIONS.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
            Technical clarity on security boundaries, webhook lifecycles, and deployment guarantees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <TiltCard
              key={index}
              intensity={6}
              className="group p-8 border border-white/10 bg-zinc-950/70 hover:border-[#FF5A00]/40 transition-colors duration-300"
            >
              <div className="font-mono text-xs text-[#FF5A00] mb-4 flex items-center gap-2">
                <span>// SPEC_{faq.index}</span>
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight group-hover:text-white transition-colors">
                {faq.question}
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                {faq.answer}
              </p>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
