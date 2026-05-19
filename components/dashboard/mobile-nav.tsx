"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Search, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: Shield, label: "Vault" },
  { href: "/vault", icon: Search, label: "Search" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-lg mx-auto safe-bottom">
      <div className="mx-4 mb-3 px-3 py-2.5 rounded-2xl bg-[hsl(222,44%,7%)]/90 backdrop-blur-xl border border-white/[0.06] shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-5 py-2 rounded-xl transition-all active:scale-90",
                  isActive
                    ? "text-cyan-glow bg-cyan-glow/10"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_6px_rgba(103,232,249,0.5)]")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
