// ─── Database Types ──────────────────────────────────────────────────────────

export type Plan = "free" | "pro";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: Plan;
  created_at: string;
  updated_at: string;
}

export type VaultCategory =
  | "note"
  | "password"
  | "document"
  | "media"
  | "financial"
  | "other";

export interface VaultItem {
  id: string;
  user_id: string;
  title: string; // encrypted
  content: string; // encrypted
  category: VaultCategory;
  iv: string;
  created_at: string;
  updated_at: string;
}

export interface DecryptedVaultItem {
  id: string;
  user_id: string;
  title: string; // decrypted
  content: string; // decrypted
  category: VaultCategory;
  iv: string;
  created_at: string;
  updated_at: string;
}

export interface EmergencyContact {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  relationship: string | null;
  is_verified: boolean;
  notify_on_deadman: boolean;
  created_at: string;
  updated_at: string;
}

export type MessageStatus = "pending" | "sent" | "cancelled" | "failed";

export interface ScheduledMessage {
  id: string;
  user_id: string;
  recipient_email: string;
  recipient_name: string | null;
  subject: string; // encrypted
  content: string; // encrypted
  iv: string;
  scheduled_at: string;
  status: MessageStatus;
  created_at: string;
  updated_at: string;
}

export interface DeadmanStatus {
  id: string;
  user_id: string;
  is_active: boolean;
  check_in_interval_days: number;
  last_check_in: string;
  next_deadline: string;
  grace_period_hours: number;
  alert_contacts: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Plan Limits ─────────────────────────────────────────────────────────────

export const PLAN_LIMITS = {
  free: {
    vault_items: 5,
    emergency_contacts: 1,
    scheduled_messages: 1,
    storage_mb: 50,
  },
  pro: {
    vault_items: Infinity,
    emergency_contacts: Infinity,
    scheduled_messages: Infinity,
    storage_mb: 10_000,
  },
} as const;

// ─── Form Types ──────────────────────────────────────────────────────────────

export interface VaultItemFormData {
  title: string;
  content: string;
  category: VaultCategory;
}

export interface EmergencyContactFormData {
  name: string;
  email: string;
  phone?: string;
  relationship?: string;
  notify_on_deadman: boolean;
}

export interface ScheduledMessageFormData {
  recipient_email: string;
  recipient_name?: string;
  subject: string;
  content: string;
  scheduled_at: string;
}
