"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Terminal, User } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { motion } from "framer-motion";

export function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50 bg-[#000000]/80 backdrop-blur-xl border-b border-white/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-8 w-8 bg-zinc-950 border border-white/15 flex items-center justify-center text-white group-hover:border-[#FF5A00] group-hover:text-[#FF5A00] transition-colors">
            <Terminal className="h-4 w-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-sm sm:text-base text-white tracking-[-0.04em] uppercase">
              LaunchKit
            </span>
            <span className="font-mono text-[10px] text-[#FF5A00] tracking-widest font-semibold uppercase">
              // SPATIAL.01
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-zinc-400">
          <Link
            href="#features"
            className="hover:text-white hover:text-[#FF5A00] transition-colors"
          >
            [ Features ]
          </Link>
          <Link
            href="#pricing"
            className="hover:text-white hover:text-[#FF5A00] transition-colors"
          >
            [ Pricing ]
          </Link>
          <Link
            href="#architecture"
            className="hover:text-white hover:text-[#FF5A00] transition-colors"
          >
            [ Architecture ]
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <Button
              asChild
              size="sm"
              className="h-9 px-4 text-xs font-mono font-bold uppercase tracking-wider bg-white text-black hover:bg-[#FF5A00] hover:text-black transition-all rounded-none"
            >
              <Link href="/dashboard" className="gap-2">
                <User className="h-3.5 w-3.5" />
                <span>Console</span>
              </Link>
            </Button>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors px-2 py-1"
              >
                Sign In
              </Link>
              <Button
                asChild
                size="sm"
                className="h-9 px-4 text-xs font-mono font-bold uppercase tracking-wider bg-[#FF5A00] text-black hover:bg-white hover:text-black transition-all rounded-none shadow-[0_0_20px_rgba(255,90,0,0.35)] group"
              >
                <Link href="/signup" className="gap-1.5">
                  <span>Deploy</span>
                  <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
