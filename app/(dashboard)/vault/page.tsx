"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Lock,
  FileText,
  CreditCard,
  Key,
  Film,
  Package,
  Search,
  Trash2,
  Pencil,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { encrypt, decrypt, getSessionKey, generateKey, storeSessionKey } from "@/lib/crypto/encryption";
import { isDemoMode, DEMO_VAULT_ITEMS } from "@/lib/demo-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { VaultItem, VaultCategory, DecryptedVaultItem } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const categoryIcons: Record<VaultCategory, React.ComponentType<{ className?: string }>> = {
  note: FileText,
  password: Key,
  document: FileText,
  media: Film,
  financial: CreditCard,
  other: Package,
};

const categoryLabels: Record<VaultCategory, string> = {
  note: "Note",
  password: "Password",
  document: "Document",
  media: "Media",
  financial: "Financial",
  other: "Other",
};

export default function VaultPage() {
  const [items, setItems] = useState<DecryptedVaultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState<DecryptedVaultItem | null>(null);
  const [viewItem, setViewItem] = useState<DecryptedVaultItem | null>(null);
  const [showContent, setShowContent] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  const loadItems = useCallback(async () => {
    setLoading(true);

    // Check demo mode
    if (isDemoMode()) {
      setIsDemo(true);
      setItems(DEMO_VAULT_ITEMS);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("vault_items")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (!data) {
      setLoading(false);
      return;
    }

    // Get or create encryption key
    let key = await getSessionKey();
    if (!key) {
      key = await generateKey();
      await storeSessionKey(key);
    }

    // Decrypt items
    const decrypted: DecryptedVaultItem[] = [];
    for (const item of data as VaultItem[]) {
      try {
        const title = await decrypt(item.title, item.iv, key);
        const content = await decrypt(item.content, item.iv, key);
        decrypted.push({ ...item, title, content });
      } catch {
        decrypted.push({
          ...item,
          title: "[Encrypted - wrong key]",
          content: "[Unable to decrypt]",
        });
      }
    }

    setItems(decrypted);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Lock className="w-6 h-6 text-cyan-glow" />
            Vault
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isDemo
              ? "Sample encrypted secrets. Sign up to store your own."
              : "Your encrypted secrets. Only you can see them."}
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search vault..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-40"
        >
          <option value="all">All Types</option>
          {Object.entries(categoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <Lock className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">
              {items.length === 0
                ? "Your vault is empty. Add your first secret."
                : "No items match your search."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const Icon = categoryIcons[item.category];
            return (
              <Card
                key={item.id}
                className="group cursor-pointer hover:border-white/[0.1] transition-all"
                onClick={() => {
                  setViewItem(item);
                  setShowContent(false);
                }}
              >
                <CardContent>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-glow/10 flex items-center justify-center text-cyan-glow">
                      <Icon className="w-4 h-4" />
                    </div>
                    <Badge variant="secondary">
                      {categoryLabels[item.category]}
                    </Badge>
                  </div>
                  <h3 className="font-semibold truncate">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Updated {formatDate(item.updated_at)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Dialog */}
      <VaultItemDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onSuccess={loadItems}
        mode="create"
        isDemo={isDemo}
      />

      {/* Edit Dialog */}
      {editItem && (
        <VaultItemDialog
          open={!!editItem}
          onOpenChange={(open) => !open && setEditItem(null)}
          onSuccess={loadItems}
          mode="edit"
          item={editItem}
          isDemo={isDemo}
        />
      )}

      {/* View Dialog */}
      {viewItem && (
        <Dialog open={!!viewItem} onOpenChange={(open) => !open && setViewItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{viewItem.title}</DialogTitle>
              <DialogDescription>
                {categoryLabels[viewItem.category]} &middot; Updated{" "}
                {formatDate(viewItem.updated_at)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <div className="p-4 rounded-xl bg-secondary/50 border border-border min-h-[100px]">
                  {showContent ? (
                    <pre className="text-sm whitespace-pre-wrap break-words font-mono">
                      {viewItem.content}
                    </pre>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      ••••••••••••••••••••••••
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setShowContent(!showContent)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
                >
                  {showContent ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setViewItem(null);
                  setEditItem(viewItem);
                }}
                className="gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </Button>
              <DeleteButton
                itemId={viewItem.id}
                onSuccess={() => {
                  setViewItem(null);
                  loadItems();
                }}
                isDemo={isDemo}
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// ─── Create/Edit Dialog ──────────────────────────────────────────────────────

function VaultItemDialog({
  open,
  onOpenChange,
  onSuccess,
  mode,
  item,
  isDemo,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  mode: "create" | "edit";
  item?: DecryptedVaultItem;
  isDemo: boolean;
}) {
  const [title, setTitle] = useState(item?.title || "");
  const [content, setContent] = useState(item?.content || "");
  const [category, setCategory] = useState<VaultCategory>(
    item?.category || "note"
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setContent(item.content);
      setCategory(item.category);
    } else {
      setTitle("");
      setContent("");
      setCategory("note");
    }
  }, [item, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isDemo) {
      alert("Demo mode: Sign up for a real account to save encrypted vault items.");
      onOpenChange(false);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let key = await getSessionKey();
      if (!key) {
        key = await generateKey();
        await storeSessionKey(key);
      }

      const encTitle = await encrypt(title, key);
      const encContent = await encrypt(content, key);
      const iv = encTitle.iv;

      if (mode === "create") {
        const { error: dbError } = await supabase.from("vault_items").insert({
          user_id: user.id,
          title: encTitle.ciphertext,
          content: encContent.ciphertext,
          category,
          iv,
        });
        if (dbError) throw new Error(dbError.message);
      } else if (item) {
        const { error: dbError } = await supabase
          .from("vault_items")
          .update({
            title: encTitle.ciphertext,
            content: encContent.ciphertext,
            category,
            iv,
          })
          .eq("id", item.id);
        if (dbError) throw new Error(dbError.message);
      }

      onOpenChange(false);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Vault Item" : "Edit Vault Item"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "This will be encrypted before leaving your device."
              : "Changes are re-encrypted client-side."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Gmail password"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as VaultCategory)}
            >
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Your secret content..."
              rows={5}
              required
            />
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Encrypted client-side with AES-256-GCM
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "create" ? "Encrypt & Save" : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Button ───────────────────────────────────────────────────────────

function DeleteButton({
  itemId,
  onSuccess,
  isDemo,
}: {
  itemId: string;
  onSuccess: () => void;
  isDemo: boolean;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (isDemo) {
      alert("Demo mode: Sign up for a real account to manage vault items.");
      return;
    }
    if (!confirm("Are you sure? This cannot be undone.")) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("vault_items").delete().eq("id", itemId);
    setDeleting(false);
    onSuccess();
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={deleting}
      className="gap-1.5"
    >
      {deleting ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Trash2 className="w-3.5 h-3.5" />
      )}
      Delete
    </Button>
  );
}
