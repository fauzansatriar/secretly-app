"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Users,
  Mail,
  Phone,
  Heart,
  Trash2,
  Pencil,
  Loader2,
  CheckCircle2,
  XCircle,
  Bell,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { EmergencyContact } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editContact, setEditContact] = useState<EmergencyContact | null>(null);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("emergency_contacts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setContacts((data || []) as EmergencyContact[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  async function handleDelete(id: string) {
    if (!confirm("Remove this emergency contact?")) return;
    const supabase = createClient();
    await supabase.from("emergency_contacts").delete().eq("id", id);
    loadContacts();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" />
            Emergency Contacts
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Trusted people who can be notified when it matters most.
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Contact
        </Button>
      </div>

      {/* Contacts List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : contacts.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">
              No emergency contacts yet. Add someone you trust.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <Card key={contact.id} className="hover:border-white/[0.1] transition-all">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 font-medium text-sm">
                      {contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{contact.name}</h3>
                        {contact.is_verified ? (
                          <Badge variant="success" className="gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <XCircle className="w-3 h-3" />
                            Pending
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {contact.email}
                        </span>
                        {contact.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {contact.phone}
                          </span>
                        )}
                        {contact.relationship && (
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {contact.relationship}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {contact.notify_on_deadman && (
                      <div className="p-1.5 text-amber-400" title="Notified on dead-man switch">
                        <Bell className="w-4 h-4" />
                      </div>
                    )}
                    <button
                      onClick={() => setEditContact(contact)}
                      className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <ContactDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onSuccess={loadContacts}
        mode="create"
      />

      {/* Edit Dialog */}
      {editContact && (
        <ContactDialog
          open={!!editContact}
          onOpenChange={(open) => !open && setEditContact(null)}
          onSuccess={loadContacts}
          mode="edit"
          contact={editContact}
        />
      )}
    </div>
  );
}

function ContactDialog({
  open,
  onOpenChange,
  onSuccess,
  mode,
  contact,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  mode: "create" | "edit";
  contact?: EmergencyContact;
}) {
  const [name, setName] = useState(contact?.name || "");
  const [email, setEmail] = useState(contact?.email || "");
  const [phone, setPhone] = useState(contact?.phone || "");
  const [relationship, setRelationship] = useState(contact?.relationship || "");
  const [notifyOnDeadman, setNotifyOnDeadman] = useState(
    contact?.notify_on_deadman ?? true
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setEmail(contact.email);
      setPhone(contact.phone || "");
      setRelationship(contact.relationship || "");
      setNotifyOnDeadman(contact.notify_on_deadman);
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setRelationship("");
      setNotifyOnDeadman(true);
    }
  }, [contact, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const payload = {
        user_id: user.id,
        name,
        email,
        phone: phone || null,
        relationship: relationship || null,
        notify_on_deadman: notifyOnDeadman,
      };

      if (mode === "create") {
        const { error: dbError } = await supabase
          .from("emergency_contacts")
          .insert(payload);
        if (dbError) throw new Error(dbError.message);
      } else if (contact) {
        const { error: dbError } = await supabase
          .from("emergency_contacts")
          .update(payload)
          .eq("id", contact.id);
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
            {mode === "create" ? "Add Emergency Contact" : "Edit Contact"}
          </DialogTitle>
          <DialogDescription>
            This person will be notified based on your dead-man switch settings.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Relationship</Label>
              <Input
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="Spouse, Sibling..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email *</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyOnDeadman}
              onChange={(e) => setNotifyOnDeadman(e.target.checked)}
              className="rounded border-border bg-secondary/50 text-cyan-glow focus:ring-ring"
            />
            <div>
              <p className="text-sm font-medium">Notify on dead-man switch</p>
              <p className="text-xs text-muted-foreground">
                Alert this person if you miss a check-in
              </p>
            </div>
          </label>

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
              {mode === "create" ? "Add Contact" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
