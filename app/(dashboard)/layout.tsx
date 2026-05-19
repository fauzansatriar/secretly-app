import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DEMO_PROFILE } from "@/lib/demo-data";
import { MobileNav } from "@/components/dashboard/mobile-nav";

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
  }

  return (
    <div className="relative min-h-screen flex flex-col max-w-lg mx-auto">
      {/* Background */}
      <div className="fixed inset-0 bg-dot-pattern opacity-10" />

      {/* Main content */}
      <main className="flex-1 relative z-10 px-4 pt-4 pb-24">
        {children}
      </main>

      {/* Bottom navigation */}
      <MobileNav />
    </div>
  );
}
