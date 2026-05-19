"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  Lock,
  Users,
  Mail,
  AlertTriangle,
  Settings,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Profile } from "@/lib/types";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Vault", href: "/vault", icon: Lock },
  { name: "Contacts", href: "/contacts", icon: Users },
  { name: "Messages", href: "/messages", icon: Mail },
  { name: "Dead-Man Switch", href: "/deadman", icon: AlertTriangle },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function DashboardSidebar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden lg:flex w-64 flex-col glass border-r border-border/50">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-border/50">
        <Shield className="w-6 h-6 text-cyan-glow" />
        <span className="text-lg font-semibold tracking-tight">Secretly</span>
        {profile?.plan === "pro" && (
          <Crown className="w-4 h-4 text-amber-400 ml-auto" />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
              )}
            >
              <item.icon className="w-4.5 h-4.5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Plan Banner */}
      {profile?.plan === "free" && (
        <div className="mx-3 mb-4 p-4 rounded-xl bg-gradient-to-br from-cyan-glow/5 to-transparent border border-cyan-glow/10">
          <p className="text-xs font-medium text-cyan-glow mb-1">
            Upgrade to Pro
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            Unlock unlimited vault items, messages & more
          </p>
          <Link
            href="/settings"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-glow/10 text-cyan-glow text-xs font-medium hover:bg-cyan-glow/20 transition-colors"
          >
            <Crown className="w-3 h-3" />
            Upgrade
          </Link>
        </div>
      )}
    </aside>
  );
}
