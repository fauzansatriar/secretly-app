import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { DEMO_PROFILE } from "@/lib/demo-data";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get("demo_mode")?.value === "true";

  let user: any = null;
  let profile: any = null;

  if (isDemoMode) {
    // Demo mode — use mock data, skip Supabase
    user = { id: "demo-user-id", email: "demo@secretly.app" };
    profile = DEMO_PROFILE;
  } else {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      redirect("/login");
    }

    user = authUser;

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    profile = profileData;
  }

  return (
    <div className="relative min-h-screen flex">
      {/* Background */}
      <div className="fixed inset-0 bg-grid opacity-10" />
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-cyan-glow/3 rounded-full blur-[150px]" />

      {/* Sidebar */}
      <DashboardSidebar profile={profile} isDemoMode={isDemoMode} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <DashboardHeader user={user} profile={profile} isDemoMode={isDemoMode} />
        <main className="flex-1 relative z-10 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
