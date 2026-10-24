"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle2, ArrowLeft, Terminal, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const sanitizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(sanitizedEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
        redirectTo: `${appUrl}/api/auth/callback?next=/reset-password`,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      setSuccessMsg("If an account exists for this email, a password reset link has been sent. Please check your inbox.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Password reset request failed.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-[#000000] text-white selection:bg-[#FF5A00] selection:text-black">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none -z-10" />
      <div className="absolute top-6 left-6">
        <Link href="/login" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Login</span>
        </Link>
      </div>
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="h-9 w-9 bg-zinc-950 border border-white/15 flex items-center justify-center text-white group-hover:border-[#FF5A00] group-hover:text-[#FF5A00] transition-colors">
            <Terminal className="h-4 w-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-black text-lg text-white tracking-[-0.04em] uppercase">LaunchKit</span>
            <span className="font-mono text-[10px] text-[#FF5A00] tracking-widest font-semibold uppercase">// RECOVER.01</span>
          </div>
        </Link>
      </div>
      <div className="w-full max-w-md">
        <Card className="border border-white/10 bg-zinc-950/80 backdrop-blur-xl shadow-2xl rounded-none">
          <CardHeader className="space-y-1.5 text-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#FF5A00] mb-1">// CREDENTIAL_RECOVERY</div>
            <CardTitle className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">Recover Access</CardTitle>
            <CardDescription className="text-xs font-mono text-zinc-400">Enter your operator email to receive a password reset link</CardDescription>
          </CardHeader>
          <CardContent>
            {errorMsg && (
              <div className="mb-4 flex items-center gap-2 border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-mono text-rose-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-4 flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-mono text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}
            {!successMsg && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-mono text-xs uppercase tracking-wider text-zinc-300">Operator Email</Label>
                  <Input id="email" type="email" placeholder="operator@acme.corp" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} className="rounded-none border-white/15 bg-black/60 font-mono text-xs focus-visible:ring-[#FF5A00]" />
                </div>
                <Button type="submit" className="w-full h-11 bg-[#FF5A00] text-black hover:bg-white hover:text-black font-mono font-black text-xs uppercase tracking-wider rounded-none transition-colors" disabled={loading}>
                  {loading ? (<span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />SENDING RESET LINK...</span>) : (<span className="flex items-center gap-2"><Mail className="h-4 w-4" />Send Reset Link</span>)}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t border-white/[0.08] pt-4 font-mono text-xs text-zinc-400">
            <p>Remembered it?{" "}<Link href="/login" className="text-white hover:text-[#FF5A00] underline font-bold transition-colors">Sign In</Link></p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

