"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Copy,
  Eye,
  EyeOff,
  Check,
  X,
  ScanFace,
  Lock,
  ExternalLink,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { authenticateWithBiometric } from "@/lib/auth-biometric";
import type { PasswordEntry } from "@/lib/types";

export default function VaultSearchPage() {
  const { passwords, deletePassword, updatePassword, settings, recordActivity } = useStore();
  const [search, setSearch] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<PasswordEntry | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus search on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return [];
    return passwords.filter(
      (p) =>
        p.app_name.toLowerCase().includes(search.toLowerCase()) ||
        p.username.toLowerCase().includes(search.toLowerCase()) ||
        (p.url && p.url.toLowerCase().includes(search.toLowerCase()))
    );
  }, [passwords, search]);

  async function handleCopy(text: string, field: string) {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    recordActivity();
    setTimeout(() => setCopiedField(null), 1500);
  }

  async function handleFaceUnlock() {
    setScanning(true);
    if (settings.biometric_enabled) {
      const ok = await authenticateWithBiometric();
      setScanning(false);
      if (ok) setUnlocked(true);
    } else {
      setScanning(false);
      setUnlocked(true);
    }
    recordActivity();
  }

  function handleSelectEntry(entry: PasswordEntry) {
    setSelectedEntry(entry);
    setUnlocked(false);
    setEditMode(false);
    setEditUsername(entry.username);
    setEditPassword(entry.password);
    setEditNotes(entry.notes || "");
  }

  function handleDelete() {
    if (!selectedEntry) return;
    if (confirm(`Delete ${selectedEntry.app_name}?`)) {
      deletePassword(selectedEntry.id);
      setSelectedEntry(null);
    }
  }

  function handleSaveEdit() {
    if (!selectedEntry) return;
    updatePassword(selectedEntry.id, {
      username: editUsername.trim(),
      password: editPassword.trim(),
      notes: editNotes.trim() || null,
    });
    setSelectedEntry({ ...selectedEntry, username: editUsername.trim(), password: editPassword.trim(), notes: editNotes.trim() || null });
    setEditMode(false);
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] max-w-lg mx-auto">
      {/* Header */}
      <div className="px-1 pt-2 pb-4">
        <h1 className="text-xl font-bold mb-4">Search</h1>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Find a password..."
            className="w-full pl-10 pr-10 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-cyan-glow/30 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center text-muted-foreground"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 space-y-2 px-1 pb-6">
        {!search.trim() ? (
          <div className="text-center py-20">
            <Search className="w-10 h-10 text-muted-foreground/15 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Type to search your passwords</p>
            <p className="text-xs text-muted-foreground/50 mt-1">{passwords.length} accounts saved</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-muted-foreground">No results for &ldquo;{search}&rdquo;</p>
          </div>
        ) : (
          filtered.map((entry, i) => (
            <button
              key={entry.id}
              onClick={() => handleSelectEntry(entry)}
              className="w-full p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] active:bg-white/[0.05] transition-all text-left flex items-center gap-3 animate-in opacity-0"
              style={{ animationDelay: `${Math.min(i * 40, 250)}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 overflow-hidden">
                <img src={entry.icon_url} alt={entry.app_name} className="w-6 h-6 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate">{entry.app_name}</h3>
                <p className="text-xs text-muted-foreground truncate">{entry.username}</p>
              </div>
              <Lock className="w-4 h-4 text-muted-foreground/30 shrink-0" />
            </button>
          ))
        )}
      </div>

      {/* ═══ DETAIL BOTTOM SHEET ═══ */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedEntry(null)} />
          <div className="relative w-full max-w-lg animate-in opacity-0">
            <div className="bg-[hsl(222,44%,7%)] border border-white/[0.06] rounded-t-3xl p-6 pb-10 safe-bottom max-h-[80vh] overflow-y-auto">
              <button onClick={() => setSelectedEntry(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-muted-foreground">
                <X className="w-4 h-4" />
              </button>

              {/* App header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center overflow-hidden">
                  <img src={selectedEntry.icon_url} alt="" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">{selectedEntry.app_name}</h2>
                  <p className="text-xs text-muted-foreground capitalize">{selectedEntry.category}</p>
                </div>
              </div>

              {editMode ? (
                /* ─── EDIT MODE ─── */
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Username</label>
                    <input value={editUsername} onChange={(e) => setEditUsername(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm focus:outline-none focus:ring-2 focus:ring-cyan-glow/30 transition-all" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Password</label>
                    <input value={editPassword} onChange={(e) => setEditPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-glow/30 transition-all" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Notes</label>
                    <input value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="Optional" className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-cyan-glow/30 transition-all" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setEditMode(false)} className="flex-1 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm font-medium active:scale-[0.97] transition-transform">Cancel</button>
                    <button onClick={handleSaveEdit} className="flex-1 py-3 rounded-xl bg-cyan-glow text-navy-950 text-sm font-semibold active:scale-[0.97] transition-transform shadow-glow">Save</button>
                  </div>
                </div>
              ) : (
                /* ─── VIEW MODE ─── */
                <div className="space-y-3">
                  {/* Username */}
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Username</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{selectedEntry.username}</p>
                      <button onClick={() => handleCopy(selectedEntry.username, "s-user")} className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-cyan-glow shrink-0">
                        {copiedField === "s-user" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Password — biometric gated */}
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Password</p>
                    {unlocked ? (
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-mono text-cyan-glow truncate flex-1">{selectedEntry.password}</code>
                        <button onClick={() => handleCopy(selectedEntry.password, "s-pass")} className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-cyan-glow shrink-0 ml-2">
                          {copiedField === "s-pass" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground/50">••••••••••••</p>
                        <button
                          onClick={handleFaceUnlock}
                          disabled={scanning}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${scanning ? "bg-cyan-glow/10 text-cyan-glow animate-pulse" : "bg-cyan-glow/10 text-cyan-glow active:scale-95"}`}
                        >
                          {scanning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ScanFace className="w-3.5 h-3.5" />}
                          {scanning ? "Verifying..." : "Unlock"}
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
                        <a href={selectedEntry.url} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-cyan-glow shrink-0">
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

                  {/* Actions */}
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => setEditMode(true)} className="flex-1 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.97] transition-transform">
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                    <button onClick={handleDelete} className="flex-1 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.97] transition-transform">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
