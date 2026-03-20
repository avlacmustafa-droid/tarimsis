import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import type { Database } from "@tarimsis/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = data as Profile | null;
  const userName = profile?.full_name || user.email || "";
  const avatarUrl = profile?.avatar_url || null;
  const isAdmin = profile?.is_admin || false;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isAdmin={isAdmin} />
      <div className="lg:pl-[260px]">
        <Header userName={userName} avatarUrl={avatarUrl} />
        <main className="bg-grid p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
