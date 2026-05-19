import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

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
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="relative min-h-screen flex">
      {/* Background */}
      <div className="fixed inset-0 bg-grid opacity-10" />
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-cyan-glow/3 rounded-full blur-[150px]" />

      {/* Sidebar */}
      <DashboardSidebar profile={profile} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <DashboardHeader user={user} profile={profile} />
        <main className="flex-1 relative z-10 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
