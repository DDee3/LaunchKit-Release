import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, email")
    .eq("id", user.id)
    .single();

  const userData = {
    email: user.email || profile?.email || "",
    fullName: profile?.full_name || user.user_metadata?.full_name || "Operator",
    avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url || "",
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col selection:bg-[#FF5A00] selection:text-black">
      <DashboardNav user={userData} />
      <main className="flex-1 container max-w-6xl mx-auto px-6 pt-24 md:pt-28 pb-20">
        {children}
      </main>
    </div>
  );
}
