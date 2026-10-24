import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ResetPasswordForm } from "./reset-password-form";
import { Terminal, ArrowLeft, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-[#000000] text-white selection:bg-[#FF5A00] selection:text-black">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none -z-10" />
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="h-9 w-9 bg-zinc-950 border border-white/15 flex items-center justify-center text-white group-hover:border-[#FF5A00] group-hover:text-[#FF5A00] transition-colors"><Terminal className="h-4 w-4" /></div>
            <div className="flex items-baseline gap-2">
              <span className="font-black text-lg text-white tracking-[-0.04em] uppercase">LaunchKit</span>
              <span className="font-mono text-[10px] text-[#FF5A00] tracking-widest font-semibold uppercase">// RECOVER.02</span>
            </div>
          </Link>
        </div>
        <div className="w-full max-w-md">
          <Card className="border border-white/10 bg-zinc-950/80 backdrop-blur-xl shadow-2xl rounded-none">
            <CardHeader className="space-y-1.5 text-center">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-rose-500 mb-1">// INVALID_SESSION</div>
              <CardTitle className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">Reset Link Invalid</CardTitle>
              <CardDescription className="text-xs font-mono text-zinc-400">Your password reset link is invalid or has expired.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-mono text-rose-400"><AlertCircle className="h-4 w-4 shrink-0" /><span>Please request a new reset link.</span></div>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-white/[0.08] pt-4 font-mono text-xs text-zinc-400">
              <Link href="/forgot-password" className="text-white hover:text-[#FF5A00] underline font-bold transition-colors">Request New Reset Link</Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-[#000000] text-white selection:bg-[#FF5A00] selection:text-black">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none -z-10" />
      <div className="absolute top-6 left-6">
        <Link href="/login" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"><ArrowLeft className="h-3.5 w-3.5" /><span>Back to Login</span></Link>
      </div>
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="h-9 w-9 bg-zinc-950 border border-white/15 flex items-center justify-center text-white group-hover:border-[#FF5A00] group-hover:text-[#FF5A00] transition-colors"><Terminal className="h-4 w-4" /></div>
          <div className="flex items-baseline gap-2">
            <span className="font-black text-lg text-white tracking-[-0.04em] uppercase">LaunchKit</span>
            <span className="font-mono text-[10px] text-[#FF5A00] tracking-widest font-semibold uppercase">// RECOVER.02</span>
          </div>
        </Link>
      </div>
      <div className="w-full max-w-md"><ResetPasswordForm /></div>
    </div>
  );
}

