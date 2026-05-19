"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Check,
  Globe,
  Mail,
  CreditCard,
  ShoppingBag,
  Tv,
  Briefcase,
  MoreHorizontal,
  ScanFace,
} from "lucide-react";
import { DEMO_PASSWORDS, isDemoMode } from "@/lib/demo-data";
import type { PasswordEntry, PasswordCategory } from "@/lib/types";

const categoryConfig: Record<PasswordCategory, { label: string; icon: any }> = {
  social: { label: "Social", icon: Globe },
  email: { label: "Email", icon: Mail },
  banking: { label: "Banking", icon: CreditCard },
  shopping: { label: "Shopping", icon: ShoppingBag },
  entertainment: { label: "Entertainment", icon: Tv },
  work: { label: "Work", icon: Briefcase },
  other: { label: "Other", icon: MoreHorizontal },
};

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const passwords = DEMO_PASSWORDS;

  const filtered = useMemo(() => {
    return passwords.filter((p) => {
      const matchSearch =
        p.app_name.toLowerCase().includes(search.toLowerCase()) ||
        p.username.toLowerCase().includes(search.toLowerCase());
      const matchCategory = activeCategory === "all" || p.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [passwords, search, activeCategory]);

  async function handleCopy(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  function toggleReveal(id: string) {
    setRevealedId(revealedId === id ? null : id);
  }

  const categories = [
    { key: "all", label: "All" },
    ...Object.entries(categoryConfig).map(([key, val]) => ({
      key,
      label: val.label,
    })),
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] max-w-lg mx-auto">
      {/* Header */}
      <div className="px-1 pt-2 pb-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold">Passwords</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {passwords.length} saved accounts
            </p>
          </div>
          <button className="w-10 h-10 rounded-xl bg-cyan-glow/10 border border-cyan-glow/20 flex items-center justify-center text-cyan-glow hover:bg-cyan-glow/20 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search apps..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-cyan-glow/30 focus:border-cyan-glow/30 transition-all"
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.key
                  ? "bg-cyan-glow/15 text-cyan-glow border border-cyan-glow/25"
                  : "bg-white/[0.03] text-muted-foreground border border-white/[0.06] hover:bg-white/[0.06]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Password list */}
      <div className="flex-1 space-y-2 px-1 pb-6">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No passwords found</p>
          </div>
        ) : (
          filtered.map((entry, i) => (
            <PasswordCard
              key={entry.id}
              entry={entry}
              isRevealed={revealedId === entry.id}
              isCopied={copiedId === entry.id}
              onToggleReveal={() => toggleReveal(entry.id)}
              onCopy={() => handleCopy(entry.password, entry.id)}
              index={i}
            />
          ))
        )}
      </div>
    </div>
  );
}

function PasswordCard({
  entry,
  isRevealed,
  isCopied,
  onToggleReveal,
  onCopy,
  index,
}: {
  entry: PasswordEntry;
  isRevealed: boolean;
  isCopied: boolean;
  onToggleReveal: () => void;
  onCopy: () => void;
  index: number;
}) {
  const Icon = categoryConfig[entry.category]?.icon || Globe;

  return (
    <div
      className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all animate-in opacity-0"
      style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
    >
      <div className="flex items-center gap-3">
        {/* App icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${entry.icon_color}15` }}
        >
          <span
            className="text-lg font-bold"
            style={{ color: entry.icon_color }}
          >
            {entry.app_name[0]}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold truncate">{entry.app_name}</h3>
          <p className="text-xs text-muted-foreground truncate">{entry.username}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onToggleReveal}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-colors"
          >
            {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onCopy}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-cyan-glow hover:bg-cyan-glow/10 transition-colors"
          >
            {isCopied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Password reveal row */}
      {isRevealed && (
        <div className="mt-3 pt-3 border-t border-white/[0.05]">
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs font-mono text-cyan-glow bg-cyan-glow/5 px-3 py-2 rounded-lg truncate">
              {entry.password}
            </code>
          </div>
          {entry.notes && (
            <p className="text-[11px] text-muted-foreground mt-2">
              Note: {entry.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
