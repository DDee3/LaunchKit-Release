"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Terminal, LayoutDashboard, CreditCard, LogOut, ExternalLink, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";

interface DashboardNavProps {
  user: {
    email?: string;
    fullName?: string;
    avatarUrl?: string;
  };
}

export function DashboardNav({ user }: DashboardNavProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const initials =
    user.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ||
    user.email?.slice(0, 2).toUpperCase() ||
    "OP";

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#000000]/80 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="h-8 w-8 bg-zinc-950 border border-white/15 flex items-center justify-center text-white group-hover:border-[#FF5A00] group-hover:text-[#FF5A00] transition-colors">
              <Terminal className="h-4 w-4" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-sm sm:text-base text-white tracking-[-0.04em] uppercase">
                LaunchKit
              </span>
              <span className="font-mono text-[10px] text-[#FF5A00] tracking-widest font-semibold uppercase">
                // CONSOLE.01
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-mono uppercase tracking-widest text-zinc-400">
            <Link
              href="/dashboard"
              className="text-white hover:text-[#FF5A00] transition-colors"
            >
              [ Overview ]
            </Link>
            <Link
              href="/#pricing"
              className="hover:text-white hover:text-[#FF5A00] transition-colors"
            >
              [ Plans ]
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/[0.04] h-8 px-3 gap-1.5 rounded-none"
          >
            <Link href="/" target="_blank">
              <span>Landing</span>
              <ExternalLink className="h-3 w-3 text-zinc-500" />
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-none border border-white/15 bg-zinc-950 hover:border-[#FF5A00] transition-colors p-0 focus:outline-none"
              >
                <Avatar className="h-full w-full rounded-none">
                  <AvatarImage src={user.avatarUrl} alt={user.fullName || "Operator"} />
                  <AvatarFallback className="bg-zinc-950 text-white font-mono text-xs rounded-none">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60 bg-black border border-white/15 text-zinc-300 shadow-2xl rounded-none p-1 font-mono"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal px-3 py-2.5">
                <div className="flex flex-col space-y-1">
                  <p className="text-xs font-bold text-white uppercase tracking-wider">
                    {user.fullName || "Account"}
                  </p>
                  <p className="text-[11px] text-zinc-500 truncate">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/[0.08] -mx-1" />
              <DropdownMenuGroup className="p-1">
                <DropdownMenuItem
                  asChild
                  className="text-xs text-zinc-300 focus:bg-zinc-900 focus:text-white rounded-none cursor-pointer"
                >
                  <Link href="/dashboard" className="flex items-center py-2">
                    <LayoutDashboard className="mr-2 h-3.5 w-3.5 text-zinc-400" />
                    <span>DASHBOARD</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="text-xs text-zinc-300 focus:bg-zinc-900 focus:text-white rounded-none cursor-pointer"
                >
                  <Link href="/dashboard/settings" className="flex items-center py-2">
                    <Settings className="mr-2 h-3.5 w-3.5 text-zinc-400" />
                    <span>SETTINGS</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="text-xs text-zinc-300 focus:bg-zinc-900 focus:text-white rounded-none cursor-pointer"
                >
                  <Link href="/#pricing" className="flex items-center py-2">
                    <CreditCard className="mr-2 h-3.5 w-3.5 text-zinc-400" />
                    <span>PLANS & TIERS</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-white/[0.08] -mx-1" />
              <div className="p-1">
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-xs text-rose-400 focus:text-rose-300 focus:bg-rose-500/10 rounded-none cursor-pointer py-2"
                >
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  <span>SIGN OUT</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
