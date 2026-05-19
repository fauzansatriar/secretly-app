"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Check,
  Trash2,
  Pencil,
  X,
  ScanFace,
  Lock,
  Globe,
  Mail,
  CreditCard,
  ShoppingBag,
  Tv,
  Briefcase,
  MoreHorizontal,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { authenticateWithBiometric } from "@/lib/auth-biometric";
import type { PasswordEntry, PasswordCategory } from "@/lib/types";

const CATEGORIES: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "social", label: "Social" },
  { key: "email", label: "Email" },
  { key: "banking", label: "Banking" },
  { key: "shopping", label: "Shopping" },
  { key: "entertainment", label: "Entertainment" },
  { key: "work", label: "Work" },
  { key: "other", label: "Other" },
];

export default function DashboardPage() {
  const { passwords, addPassword, updatePassword, deletePassword, settings, recordActivity } = useStore();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editEntry, setEditEntry] = useState<PasswordEntry | null>(null);
  const [detailEntry, setDetailEntry] = useState<PasswordEntry | null>(null);
  const [detailUnlocked, setDetailUnlocked] = useState(false);
  const [scanning, setScanning] = useState(false);

  const filtered = useMemo(() => {
    return passwords.filter((p) => {
      const matchSearch =
        p.app_name.toLowerCase().includes(search.toLowerCase()) ||
        p.username.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === "all" || p.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [passwords, search, activeCategory]);

  async function handleCopy(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    recordActivity();
    setTimeout(() => setCopiedId(null), 1500);
  }

  async function handleReveal(id: string) {
    if (revealedId === id) {
      setRevealedId(null);
      return;
    }
    if (settings.biometric_enabled) {
      const ok = await authenticateWithBiometric();
      if (!ok) return;
    }
    setRevealedId(id);
    recordActivity();
  }

  async function handleDetailUnlock() {
    setScanning(true);
    if (settings.biometric_enabled) {
      const ok = await authenticateWithBiometric();
      setScanning(false);
      if (ok) setDetailUnlocked(true);
    } else {
      setScanning(false);
      setDetailUnlocked(true);
    }
    recordActivity();
  }

  function openDetail(entry: PasswordEntry) {
    setDetailEntry(entry);
    setDetailUnlocked(false);
  }

  function handleDelete(id: string) {
    if (confirm("Delete this password?")) {
      deletePassword(id);
      setDetailEntry(null);
    }
  }

  function handleEdit(entry: PasswordEntry) {
    setDetailEntry(null);
    setEditEntry(entry);
    setShowForm(true);
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] max-w-lg mx-auto">
      {/* Header */}
      <div className="px-1 pt-2 pb-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-muted-foreground">Hi, {settings.display_name}</p>
            <h1 className="text-xl font-bold">Passwords</h1>
          </div>
          <button
            onClick={() => { setEditEntry(null); setShowForm(true); }}
            className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary active:scale-95 transition-transform"
          >
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
            className="w-full pl-10 pr-4 py-3 rounded-xl surface-input text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.key
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-secondary text-muted-foreground border border-border"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 space-y-2 px-1 pb-6">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Lock className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No passwords found</p>
          </div>
        ) : (
          filtered.map((entry, i) => (
            <div
              key={entry.id}
              onClick={() => openDetail(entry)}
              className="p-3.5 rounded-2xl surface-card active:scale-[0.99] transition-all flex items-center gap-3 cursor-pointer animate-in opacity-0"
              style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src={entry.icon_url}
                  alt={entry.app_name}
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate">{entry.app_name}</h3>
                <p className="text-xs text-muted-foreground truncate">{entry.username}</p>
              </div>
              {/* Quick actions */}
              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleReveal(entry.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  {revealedId === entry.id ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleCopy(entry.password, entry.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  {copiedId === entry.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ═══ CREATE / EDIT FORM (bottom sheet) ═══ */}
      {showForm && (
        <PasswordForm
          entry={editEntry}
          onClose={() => { setShowForm(false); setEditEntry(null); }}
          onSave={(data) => {
            if (editEntry) {
              updatePassword(editEntry.id, data);
            } else {
              addPassword(data);
            }
            setShowForm(false);
            setEditEntry(null);
          }}
        />
      )}

      {/* ═══ DETAIL SHEET ═══ */}
      {detailEntry && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => setDetailEntry(null)} />
          <div className="relative w-full max-w-lg animate-in opacity-0">
            <div className="bg-card border border-border rounded-t-3xl p-6 pb-24 safe-bottom">
              <button onClick={() => setDetailEntry(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-secondary border border-border flex items-center justify-center overflow-hidden">
                  <img src={detailEntry.icon_url} alt="" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">{detailEntry.app_name}</h2>
                  <p className="text-xs text-muted-foreground capitalize">{detailEntry.category}</p>
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-3">
                {/* Username */}
                <DetailField label="Username" value={detailEntry.username} onCopy={() => handleCopy(detailEntry.username, "detail-user")} copied={copiedId === "detail-user"} />

                {/* Password — biometric gated */}
                <div className="p-3.5 rounded-xl bg-secondary border border-border">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Password</p>
                  {detailUnlocked ? (
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono text-primary truncate flex-1">{detailEntry.password}</code>
                      <button onClick={() => handleCopy(detailEntry.password, "detail-pass")} className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary shrink-0 ml-2">
                        {copiedId === "detail-pass" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground/50">••••••••••••</p>
                      <button
                        onClick={handleDetailUnlock}
                        disabled={scanning}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                          scanning ? "bg-primary/10 text-primary animate-pulse" : "bg-primary/10 text-primary active:scale-95"
                        }`}
                      >
                        {scanning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ScanFace className="w-3.5 h-3.5" />}
                        {scanning ? "Verifying..." : "Unlock"}
                      </button>
                    </div>
                  )}
                </div>

                {/* URL */}
                {detailEntry.url && (
                  <div className="p-3.5 rounded-xl bg-secondary border border-border">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Website</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">{detailEntry.url}</p>
                      <a href={detailEntry.url} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary shrink-0">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {detailEntry.notes && (
                  <div className="p-3.5 rounded-xl bg-secondary border border-border">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm text-muted-foreground">{detailEntry.notes}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleEdit(detailEntry)}
                  className="flex-1 py-3 rounded-xl surface-card text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(detailEntry.id)}
                  className="flex-1 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Detail Field ────────────────────────────────────────────────────────────
function DetailField({ label, value, onCopy, copied }: { label: string; value: string; onCopy: () => void; copied: boolean }) {
  return (
    <div className="p-3.5 rounded-xl bg-secondary border border-border">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium truncate">{value}</p>
        <button onClick={onCopy} className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary shrink-0 ml-2">
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

// ─── Password Form (Create / Edit) ──────────────────────────────────────────
function PasswordForm({
  entry,
  onClose,
  onSave,
}: {
  entry: PasswordEntry | null;
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [appName, setAppName] = useState(entry?.app_name || "");
  const [username, setUsername] = useState(entry?.username || "");
  const [password, setPassword] = useState(entry?.password || "");
  const [url, setUrl] = useState(entry?.url || "");
  const [category, setCategory] = useState<PasswordCategory>(entry?.category || "other");
  const [notes, setNotes] = useState(entry?.notes || "");
  const [showPass, setShowPass] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!appName.trim() || !username.trim() || !password.trim()) return;

    const domain = url ? new URL(url.startsWith("http") ? url : `https://${url}`).hostname : appName.toLowerCase().replace(/\s+/g, "") + ".com";
    const icon_url = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

    onSave({
      app_name: appName.trim(),
      username: username.trim(),
      password: password.trim(),
      url: url.trim() || null,
      category,
      icon_url,
      notes: notes.trim() || null,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-in opacity-0">
        <div className="bg-card border border-border rounded-t-3xl p-6 pb-24 safe-bottom max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold">{entry ? "Edit Password" : "Add Password"}</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="App Name *" value={appName} onChange={setAppName} placeholder="e.g. Instagram" />
            <FormField label="Username / Email *" value={username} onChange={setUsername} placeholder="your@email.com" />

            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block font-semibold">Password *</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-10 rounded-xl surface-input text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <FormField label="URL" value={url} onChange={setUrl} placeholder="https://..." />

            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block font-semibold">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PasswordCategory)}
                className="w-full px-4 py-3 rounded-xl surface-input text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all appearance-none"
              >
                {CATEGORIES.filter((c) => c.key !== "all").map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>

            <FormField label="Notes" value={notes} onChange={setNotes} placeholder="Optional notes..." />

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm active:scale-[0.97] transition-transform shadow-sm mt-2"
            >
              {entry ? "Save Changes" : "Add Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block font-semibold">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl surface-input text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
      />
    </div>
  );
}
