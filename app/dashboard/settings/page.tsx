import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DeleteAccountButton } from "@/components/dashboard/delete-account-button";
import { Settings, User, Mail, ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const fullName = profile?.full_name || user.user_metadata?.full_name || "Operator";
  const email = user.email || profile?.email || "";

  return (
    <div className="space-y-10 pb-16 font-mono">
      {/* Settings Header */}
      <div className="pb-8 border-b border-white/[0.08]">
        <div className="text-xs uppercase tracking-[0.25em] text-[#FF5A00] mb-2 flex items-center gap-2">
          <span>// OPERATOR PREFERENCES</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-[-0.04em] uppercase text-white leading-tight">
          System Settings
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2">
          Manage operator profile identity and account lifecycle parameters.
        </p>
      </div>

      {/* General Settings */}
      <div className="border border-white/10 bg-zinc-950/80 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-black/60">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 bg-zinc-900 border border-white/15 flex items-center justify-center text-[#FF5A00]">
              <Settings className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-widest">
                General Settings
              </h2>
              <p className="text-[11px] text-zinc-500">
                Primary operator identity credentials (read-only)
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 border border-white/20 text-zinc-400 font-bold">
            IDENTITY // ACTIVE
          </span>
        </div>

        <div className="p-6 space-y-6 text-xs">
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-[#FF5A00]" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              readOnly
              value={fullName}
              className="w-full bg-black/60 border border-white/15 px-4 py-2.5 text-zinc-200 text-xs font-mono rounded-none cursor-not-allowed select-all focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-[#FF5A00]" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              readOnly
              value={email}
              className="w-full bg-black/60 border border-white/15 px-4 py-2.5 text-zinc-200 text-xs font-mono rounded-none cursor-not-allowed select-all focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border border-rose-500/30 bg-zinc-950/80 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-rose-500 font-bold mb-1 flex items-center gap-2">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>// DANGER ZONE</span>
            </div>
            <h3 className="text-base font-black uppercase tracking-tight text-white">
              Permanent Workspace Deletion
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Permanently delete your account and all associated data.
            </p>
          </div>

          <div>
            <DeleteAccountButton />
          </div>
        </div>
      </div>
    </div>
  );
}

