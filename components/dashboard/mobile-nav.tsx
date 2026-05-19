"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Search, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: Shield, label: "Vault" },
  { href: "/vault", icon: Search, label: "Search" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto safe-bottom">
      <div className="mx-4 mb-3 px-2 py-2.5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] shadow-soft">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all",
                  isActive
                    ? "text-cyan-glow bg-cyan-glow/10"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
