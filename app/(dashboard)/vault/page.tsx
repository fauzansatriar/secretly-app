"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Check,
  ExternalLink,
  ScanFace,
  Trash2,
  Pencil,
  X,
  Lock,
} from "lucide-react";
import { DEMO_PASSWORDS } from "@/lib/demo-data";
import type { PasswordEntry } from "@/lib/types";

export default function VaultPage() {
  const [search, setSearch] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<PasswordEntry | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const passwords = DEMO_PASSWORDS;

  const filtered = passwords.filter(
    (p) =>
      p.app_name.toLowerCase().includes(search.toLowerCase()) ||
      p.username.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCopy(text: string, field: string) {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  }

  async function handleFaceUnlock() {
    setScanning(true);
    await new Promise((r) => setTimeout(r, 1800));
    setUnlocked(true);
    setScanning(false);
  }

  function handleSelectEntry(entry: PasswordEntry) {
    setSelectedEntry(entry);
    setUnlocked(false);
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] max-w-lg mx-auto">
      {/* Header */}
      <div className="px-1 pt-2 pb-4">
        <h1 className="text-xl font-bold mb-4">Search Vault</h1>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Find a password..."
            autoFocus
            className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-cyan-glow/30 focus:border-cyan-glow/30 transition-all"
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 space-y-2 px-1 pb-6">
        {search.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Type to search your passwords</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              {passwords.length} accounts saved
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-muted-foreground">No results for &ldquo;{search}&rdquo;</p>
          </div>
        ) : (
          filtered.map((entry, i) => (
            <button
              key={entry.id}
              onClick={() => handleSelectEntry(entry)}
              className="w-full p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all text-left flex items-center gap-3 animate-in opacity-0"
              style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${entry.icon_color}15` }}
              >
                <span className="text-lg font-bold" style={{ color: entry.icon_color }}>
                  {entry.app_name[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate">{entry.app_name}</h3>
                <p className="text-xs text-muted-foreground truncate">{entry.username}</p>
              </div>
              <Lock className="w-4 h-4 text-muted-foreground/40 shrink-0" />
            </button>
          ))
        )}
      </div>

      {/* Detail sheet (bottom modal) */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
            onClick={() => setSelectedEntry(null)}
          />

          {/* Sheet */}
          <div className="relative w-full max-w-lg mx-auto animate-in opacity-0">
            <div className="bg-[hsl(222,44%,7%)] border border-white/[0.06] rounded-t-3xl p-6 pb-10">
              {/* Close */}
              <button
                onClick={() => setSelectedEntry(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* App header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${selectedEntry.icon_color}15` }}
                >
                  <span
                    className="text-2xl font-bold"
                    style={{ color: selectedEntry.icon_color }}
                  >
                    {selectedEntry.app_name[0]}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-bold">{selectedEntry.app_name}</h2>
                  <p className="text-xs text-muted-foreground">{selectedEntry.category}</p>
                </div>
              </div>

              {/* Username field */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Username</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{selectedEntry.username}</p>
                    <button
                      onClick={() => handleCopy(selectedEntry.username, "user")}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-cyan-glow hover:bg-cyan-glow/10 transition-colors shrink-0"
                    >
                      {copiedField === "user" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password field — requires face unlock */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Password</p>
                  {unlocked ? (
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono text-cyan-glow truncate">
                        {selectedEntry.password}
                      </code>
                      <button
                        onClick={() => handleCopy(selectedEntry.password, "pass")}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-cyan-glow hover:bg-cyan-glow/10 transition-colors shrink-0"
                      >
                        {copiedField === "pass" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground/60">••••••••••••</p>
                      <button
                        onClick={handleFaceUnlock}
                        disabled={scanning}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                          scanning
                            ? "bg-cyan-glow/10 text-cyan-glow animate-pulse"
                            : "bg-cyan-glow/10 text-cyan-glow hover:bg-cyan-glow/20"
                        }`}
                      >
                        <ScanFace className="w-3.5 h-3.5" />
                        {scanning ? "Scanning..." : "Face ID"}
                      </button>
                    </div>
                  )}
                </div>

                {/* URL */}
                {selectedEntry.url && (
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Website</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">{selectedEntry.url}</p>
                      <a
                        href={selectedEntry.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-cyan-glow hover:bg-cyan-glow/10 transition-colors shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedEntry.notes && (
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm text-muted-foreground">{selectedEntry.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
