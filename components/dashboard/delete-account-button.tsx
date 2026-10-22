"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

export function DeleteAccountButton() {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const isConfirmed = confirmText === "DELETE";

  const handleDeleteAccount = async () => {
    if (!isConfirmed || loading) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/user/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete account");
      }

      // Sign out client-side and redirect to homepage
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete account.";
      setErrorMsg(message);
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="border-2 border-rose-500/50 bg-black text-rose-400 hover:bg-rose-500 hover:text-black hover:border-rose-500 font-mono font-black text-xs uppercase tracking-wider rounded-none h-11 px-6 transition-all duration-200 gap-2"
        >
          <Trash2 className="h-4 w-4" />
          <span>DELETE ACCOUNT</span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="border border-rose-500/30 bg-zinc-950 text-white rounded-none p-6 font-mono max-w-md shadow-2xl">
        <AlertDialogHeader className="space-y-2 text-left">
          <div className="flex items-center gap-2 text-rose-500 text-xs font-mono uppercase tracking-widest">
            <AlertTriangle className="h-4 w-4" />
            <span>CRITICAL ACTION // PERMANENT DELETION</span>
          </div>

          <AlertDialogTitle className="text-xl font-black uppercase tracking-tight text-white">
            Terminate Operator Account
          </AlertDialogTitle>

          <AlertDialogDescription className="text-xs font-mono text-zinc-400 leading-relaxed">
            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {errorMsg && (
          <div className="border border-rose-500/40 bg-rose-500/10 p-3 text-xs font-mono text-rose-400">
            {errorMsg}
          </div>
        )}

        <div className="space-y-2 py-2">
          <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
            Type <span className="text-rose-400 font-bold underline">DELETE</span> to confirm:
          </label>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            disabled={loading}
            className="rounded-none border-white/20 bg-black font-mono text-xs text-white focus-visible:ring-rose-500"
          />
        </div>

        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
          <AlertDialogCancel
            disabled={loading}
            onClick={() => {
              setConfirmText("");
              setErrorMsg(null);
            }}
            className="rounded-none border border-white/20 bg-black text-zinc-300 hover:bg-white hover:text-black font-mono text-xs uppercase tracking-wider h-10 px-5 transition-colors cursor-pointer"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDeleteAccount();
            }}
            disabled={!isConfirmed || loading}
            className="rounded-none bg-rose-600 text-white hover:bg-rose-500 font-mono font-black text-xs uppercase tracking-wider h-10 px-5 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>TERMINATING...</span>
              </>
            ) : (
              <span>CONFIRM DELETION</span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

