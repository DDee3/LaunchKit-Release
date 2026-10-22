import Link from "next/link";
import { Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#000000] py-20 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 pointer-events-none select-none text-[14vw] font-black text-white/[0.02] leading-none uppercase tracking-tighter">
        LAUNCHKIT
      </div>

      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 pb-16 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-zinc-950 border border-white/15 flex items-center justify-center text-[#FF5A00]">
                <Terminal className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-base text-white tracking-[-0.03em] uppercase">
                LaunchKit
              </span>
              <span className="font-mono text-[10px] text-[#FF5A00] tracking-widest font-semibold uppercase">
                // SPATIAL.01
              </span>
            </div>
            <p className="mt-3 text-xs font-mono text-zinc-400 max-w-sm">
              Hardened commercial foundation for high-performance Micro-SaaS software.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-8 text-xs font-mono uppercase tracking-widest text-zinc-400">
            <Link href="#features" className="hover:text-[#FF5A00] transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="hover:text-[#FF5A00] transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="hover:text-[#FF5A00] transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="hover:text-[#FF5A00] transition-colors">
              Sign Up
            </Link>
            <Link href="/dashboard" className="hover:text-[#FF5A00] transition-colors">
              Console
            </Link>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-zinc-500">
          <div>
            © {new Date().getFullYear()} LAUNCHKIT ARCHITECTURE. COMMERCIAL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#FF5A00]">■</span>
            <span>SYSTEM READY // 120 FPS SPATIAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
