"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, KeyRound } from "lucide-react";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (password.length < 6) { setErrorMsg("Master security key must be at least 6 characters."); return; }
    if (password !== confirmPassword) { setErrorMsg("Passwords do not match."); return; }
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) { setErrorMsg(error.message); setLoading(false); return; }
      await supabase.auth.signOut();
      router.push("/login?reset=success");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Password update failed.";
      setErrorMsg(message);
      setLoading(false);
    }
  };

  return (
    <Card className="border border-white/10 bg-zinc-950/80 backdrop-blur-xl shadow-2xl rounded-none">
      <CardHeader className="space-y-1.5 text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#FF5A00] mb-1">// SET_NEW_CREDENTIAL</div>
        <CardTitle className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">Set New Password</CardTitle>
        <CardDescription className="text-xs font-mono text-zinc-400">Enter a new master security key for your operator account</CardDescription>
      </CardHeader>
      <CardContent>
        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-mono text-rose-400"><AlertCircle className="h-4 w-4 shrink-0" /><span>{errorMsg}</span></div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="font-mono text-xs uppercase tracking-wider text-zinc-300">New Security Key</Label>
            <Input id="password" type="password" placeholder="•••••••••••• (min 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} disabled={loading} className="rounded-none border-white/15 bg-black/60 font-mono text-xs focus-visible:ring-[#FF5A00]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="font-mono text-xs uppercase tracking-wider text-zinc-300">Confirm New Security Key</Label>
            <Input id="confirmPassword" type="password" placeholder="•••••••••••• (repeat)" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} disabled={loading} className="rounded-none border-white/15 bg-black/60 font-mono text-xs focus-visible:ring-[#FF5A00]" />
          </div>
          <Button type="submit" className="w-full h-11 bg-[#FF5A00] text-black hover:bg-white hover:text-black font-mono font-black text-xs uppercase tracking-wider rounded-none transition-colors" disabled={loading}>
            {loading ? (<span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />UPDATING CREDENTIALS...</span>) : (<span className="flex items-center gap-2"><KeyRound className="h-4 w-4" />Update Password</span>)}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

