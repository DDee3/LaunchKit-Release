"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import { GeometricSpatialMesh } from "./geometric-spatial-mesh";

export function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-20 overflow-hidden bg-[#000000]">
      <GeometricSpatialMesh />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_30%,transparent_100%)] -z-10" />

      <div className="container max-w-6xl mx-auto px-6 relative z-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto"
        >
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#FF5A00] mb-6 flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-[#FF5A00]" />
            <span>Autonomous Revenue Engine</span>
            <span className="w-8 h-px bg-[#FF5A00]" />
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[-0.05em] uppercase text-white leading-[0.88] select-none">
            ENGINEERED <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600">
              TO MONETIZE.
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          A ruthless, spatial Micro-SaaS architecture. Hardened Supabase SSR token lifecycle,
          idempotent Stripe webhook synchronization, and zero-compromise strict TypeScript.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5 max-w-xl mx-auto"
        >
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto h-14 sm:h-15 px-10 bg-[#FF5A00] text-black hover:bg-white hover:text-black font-mono font-black text-sm sm:text-base uppercase tracking-wider rounded-none shadow-[0_0_35px_rgba(255,90,0,0.35)] transition-all duration-300 group"
          >
            <Link href="#pricing" className="gap-3">
              <span>Acquire License</span>
              <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full sm:w-auto h-14 sm:h-15 px-10 border-2 border-white/30 bg-black text-white hover:bg-white hover:text-black hover:border-white font-mono font-black text-sm sm:text-base uppercase tracking-wider rounded-none backdrop-blur-md transition-all duration-300"
          >
            <Link href="/login" className="gap-3">
              <Cpu className="h-5 w-5 text-[#FF5A00] group-hover:text-black" />
              <span>Launch Console</span>
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 max-w-4xl mx-auto border border-white/10 bg-zinc-950/80 backdrop-blur-xl p-5 text-left font-mono"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08] text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white uppercase tracking-wider">SYSTEM TELEMETRY</span>
              <span className="text-zinc-600">//</span>
              <span className="text-[#FF5A00] text-[11px]">KERNEL: SECURE</span>
            </div>
            <div className="text-[11px] text-zinc-400">
              ST_LATENCY: <span className="text-white">14ms</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
            <div>
              <div className="text-zinc-500 text-[10px] uppercase">Postgres RLS</div>
              <div className="text-white font-bold mt-0.5">ENFORCED</div>
            </div>
            <div>
              <div className="text-zinc-500 text-[10px] uppercase">Webhook Pipe</div>
              <div className="text-white font-bold mt-0.5">IDEMPOTENT</div>
            </div>
            <div>
              <div className="text-zinc-500 text-[10px] uppercase">Session Guard</div>
              <div className="text-white font-bold mt-0.5">EDGE SSR</div>
            </div>
            <div>
              <div className="text-zinc-500 text-[10px] uppercase">Type Rigor</div>
              <div className="text-white font-bold mt-0.5">STRICT TS</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
