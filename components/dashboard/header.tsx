"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Shield,
  LayoutDashboard,
  Lock,
  Users,
  Mail,
  AlertTriangle,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { exitDemoMode } from "@/lib/demo-data";
import { getInitials } from "@/lib/utils";
import type { Profile } from "@/lib/types";

const mobileNav = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Vault", href: "/vault", icon: Lock },
  { name: "Contacts", href: "/contacts", icon: Users },
  { name: "Messages", href: "/messages", icon: Mail },
  { name: "Dead-Man Switch", href: "/deadman", icon: AlertTriangle },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function DashboardHeader({
  user,
  profile,
  isDemoMode = false,
}: {
  user: any;
  profile: Profile | null;
  isDemoMode?: boolean;
}) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleLogout() {
    if (isDemoMode) {
      exitDemoMode();
      router.push("/login");
      router.refresh();
      return;
    }

    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 glass border-b border-border/50 lg:justify-end">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-accent transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-glow" />
          <span className="font-semibold">Secretly</span>
          {isDemoMode && (
            <span className="px-1.5 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-[9px] font-medium text-violet-400">
              DEMO
            </span>
          )}
        </div>

        {/* User info */}
        <div className="flex items-center gap-3">
          {isDemoMode && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20">
              <Sparkles className="w-3 h-3 text-violet-400" />
              <span className="text-xs text-violet-400 font-medium">Demo Mode</span>
            </div>
          )}
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">
              {profile?.full_name || user?.email}
            </p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-cyan-glow/10 border border-cyan-glow/20 flex items-center justify-center text-xs font-medium text-cyan-glow">
            {getInitials(profile?.full_name || user?.email || "")}
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            title={isDemoMode ? "Exit demo" : "Sign out"}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 glass border-r border-border/50 p-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-cyan-glow" />
                <span className="text-lg font-semibold">Secretly</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg hover:bg-accent transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="space-y-1">
              {mobileNav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.03] transition-all"
                >
                  <item.icon className="w-4.5 h-4.5" />
                  {item.name}
                </Link>
              ))}
            </nav>

            {isDemoMode && (
              <div className="mt-6 p-4 rounded-xl bg-violet-500/5 border border-violet-500/15">
                <p className="text-xs text-violet-400 font-medium mb-2">Demo Mode Active</p>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-cyan-glow hover:text-cyan-soft transition-colors"
                >
                  Create a real account →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
