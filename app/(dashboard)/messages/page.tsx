"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Mail,
  Clock,
  Trash2,
  Pencil,
  Loader2,
  Send,
  XCircle,
  Lock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { encrypt, decrypt, getSessionKey, generateKey, storeSessionKey } from "@/lib/crypto/encryption";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import type { ScheduledMessage, MessageStatus } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

const statusConfig: Record<
  MessageStatus,
  { label: string; variant: "default" | "success" | "destructive" | "warning" }
> = {
  pending: { label: "Scheduled", variant: "warning" },
  sent: { label: "Sent", variant: "success" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  failed: { label: "Failed", variant: "destructive" },
};

interface DecryptedMessage extends Omit<ScheduledMessage, "subject" | "content"> {
  subject: string;
  content: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<DecryptedMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editMessage, setEditMessage] = useState<DecryptedMessage | null>(null);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("scheduled_messages")
      .select("*")
      .eq("user_id", user.id)
      .order("scheduled_at", { ascending: true });

    if (!data) {
      setLoading(false);
      return;
    }

    let key = await getSessionKey();
    if (!key) {
      key = await generateKey();
      await storeSessionKey(key);
    }

    const decrypted: DecryptedMessage[] = [];
    for (const msg of data as ScheduledMessage[]) {
      try {
        const subject = await decrypt(msg.subject, msg.iv, key);
        const content = await decrypt(msg.content, msg.iv, key);
        decrypted.push({ ...msg, subject, content });
      } catch {
        decrypted.push({
          ...msg,
          subject: "[Encrypted]",
          content: "[Unable to decrypt]",
        });
      }
    }

    setMessages(decrypted);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this scheduled message?")) return;
    const supabase = createClient();
    await supabase.from("scheduled_messages").delete().eq("id", id);
    loadMessages();
  }

  async function handleCancel(id: string) {
    const supabase = createClient();
    await supabase
      .from("scheduled_messages")
      .update({ status: "cancelled" })
      .eq("id", id);
    loadMessages();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Mail className="w-6 h-6 text-violet-400" />
            Scheduled Messages
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Encrypted messages to be delivered in the future.
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Message
        </Button>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : messages.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <Mail className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">
              No scheduled messages yet. Write one for the future.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => {
            const status = statusConfig[msg.status];
            return (
              <Card key={msg.id} className="hover:border-white/[0.1] transition-all">
                <CardContent>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-violet-400/10 flex items-center justify-center text-violet-400 mt-0.5 shrink-0">
                        <Send className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">
                            {msg.subject}
                          </h3>
                          <Badge variant={status.variant}>
                            {status.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          To: {msg.recipient_name || msg.recipient_email}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {formatDateTime(msg.scheduled_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {msg.status === "pending" && (
                        <>
                          <button
                            onClick={() => setEditMessage(msg)}
                            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCancel(msg.id)}
                            className="p-2 rounded-lg hover:bg-amber-400/10 text-muted-foreground hover:text-amber-400 transition-colors"
                            title="Cancel"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Dialog */}
      <MessageDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onSuccess={loadMessages}
        mode="create"
      />

      {/* Edit Dialog */}
      {editMessage && (
        <MessageDialog
          open={!!editMessage}
          onOpenChange={(open) => !open && setEditMessage(null)}
          onSuccess={loadMessages}
          mode="edit"
          message={editMessage}
        />
      )}
    </div>
  );
}

function MessageDialog({
  open,
  onOpenChange,
  onSuccess,
  mode,
  message,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  mode: "create" | "edit";
  message?: DecryptedMessage;
}) {
  const [recipientEmail, setRecipientEmail] = useState(message?.recipient_email || "");
  const [recipientName, setRecipientName] = useState(message?.recipient_name || "");
  const [subject, setSubject] = useState(message?.subject || "");
  const [content, setContent] = useState(message?.content || "");
  const [scheduledAt, setScheduledAt] = useState(
    message?.scheduled_at ? message.scheduled_at.slice(0, 16) : ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (message) {
      setRecipientEmail(message.recipient_email);
      setRecipientName(message.recipient_name || "");
      setSubject(message.subject);
      setContent(message.content);
      setScheduledAt(message.scheduled_at.slice(0, 16));
    } else {
      setRecipientEmail("");
      setRecipientName("");
      setSubject("");
      setContent("");
      setScheduledAt("");
    }
  }, [message, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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

      const encSubject = await encrypt(subject, key);
      const encContent = await encrypt(content, key);
      const iv = encSubject.iv;

      const payload = {
        user_id: user.id,
        recipient_email: recipientEmail,
        recipient_name: recipientName || null,
        subject: encSubject.ciphertext,
        content: encContent.ciphertext,
        iv,
        scheduled_at: new Date(scheduledAt).toISOString(),
      };

      if (mode === "create") {
        const { error: dbError } = await supabase
          .from("scheduled_messages")
          .insert(payload);
        if (dbError) throw new Error(dbError.message);
      } else if (message) {
        const { error: dbError } = await supabase
          .from("scheduled_messages")
          .update(payload)
          .eq("id", message.id);
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
            {mode === "create" ? "Schedule a Message" : "Edit Message"}
          </DialogTitle>
          <DialogDescription>
            The subject and content are encrypted client-side before saving.
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
              <Label>Recipient Email *</Label>
              <Input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="recipient@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Recipient Name</Label>
              <Input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Their name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Subject *</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Message subject"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Message Content *</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Your message to them..."
              rows={5}
              required
            />
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Encrypted client-side with AES-256-GCM
            </p>
          </div>

          <div className="space-y-2">
            <Label>Deliver On *</Label>
            <Input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              required
              min={new Date().toISOString().slice(0, 16)}
            />
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
              {mode === "create" ? "Schedule Message" : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
