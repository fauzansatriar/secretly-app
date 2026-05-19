/**
 * Demo mode — mock data for users who want to explore without signing up.
 * No real database calls are made in demo mode.
 */

import type {
  Profile,
  DecryptedVaultItem,
  EmergencyContact,
  ScheduledMessage,
  DeadmanStatus,
  VaultCategory,
} from "@/lib/types";

export const DEMO_PROFILE: Profile = {
  id: "demo-user-id",
  email: "demo@secretly.app",
  full_name: "Alex Demo",
  avatar_url: null,
  plan: "pro",
  created_at: "2024-09-15T10:00:00Z",
  updated_at: new Date().toISOString(),
};

export const DEMO_VAULT_ITEMS: DecryptedVaultItem[] = [
  {
    id: "demo-vault-1",
    user_id: "demo-user-id",
    title: "Gmail Account",
    content: "email: alex.demo@gmail.com\npassword: S3cur3P@ss!2024\n2FA backup: JBSWY3DPEHPK3PXP",
    category: "password" as VaultCategory,
    iv: "demo-iv",
    created_at: "2024-11-01T08:30:00Z",
    updated_at: "2025-01-15T14:20:00Z",
  },
  {
    id: "demo-vault-2",
    user_id: "demo-user-id",
    title: "Bitcoin Wallet Seed Phrase",
    content: "abandon ability able about above absent absorb abstract absurd abuse access accident",
    category: "financial" as VaultCategory,
    iv: "demo-iv",
    created_at: "2024-10-20T12:00:00Z",
    updated_at: "2024-12-05T09:45:00Z",
  },
  {
    id: "demo-vault-3",
    user_id: "demo-user-id",
    title: "Letter to My Family",
    content: "Dear family,\n\nIf you're reading this, I want you to know how much I love you all. Everything I've built has been for our future together.\n\nWith all my love,\nAlex",
    category: "note" as VaultCategory,
    iv: "demo-iv",
    created_at: "2024-08-10T16:00:00Z",
    updated_at: "2025-03-20T11:30:00Z",
  },
  {
    id: "demo-vault-4",
    user_id: "demo-user-id",
    title: "Insurance Policy #4821",
    content: "Policy: LIF-4821-7739\nProvider: SecureLife Insurance\nBeneficiary: Sarah Demo\nCoverage: $500,000\nAgent: John Smith (555-0142)",
    category: "document" as VaultCategory,
    iv: "demo-iv",
    created_at: "2024-07-05T09:00:00Z",
    updated_at: "2024-11-18T10:15:00Z",
  },
  {
    id: "demo-vault-5",
    user_id: "demo-user-id",
    title: "Safe Combination",
    content: "Home safe (bedroom closet):\nCombination: 24-08-36-12\nBackup key location: Under the blue flowerpot in the garden shed",
    category: "other" as VaultCategory,
    iv: "demo-iv",
    created_at: "2025-01-02T07:45:00Z",
    updated_at: "2025-04-10T15:00:00Z",
  },
];

export const DEMO_CONTACTS: EmergencyContact[] = [
  {
    id: "demo-contact-1",
    user_id: "demo-user-id",
    name: "Sarah Demo",
    email: "sarah@example.com",
    phone: "+1 (555) 123-4567",
    relationship: "Spouse",
    is_verified: true,
    notify_on_deadman: true,
    created_at: "2024-09-20T10:00:00Z",
    updated_at: "2025-02-14T08:00:00Z",
  },
  {
    id: "demo-contact-2",
    user_id: "demo-user-id",
    name: "James Demo",
    email: "james@example.com",
    phone: "+1 (555) 987-6543",
    relationship: "Brother",
    is_verified: true,
    notify_on_deadman: true,
    created_at: "2024-10-05T14:30:00Z",
    updated_at: "2025-01-10T16:00:00Z",
  },
  {
    id: "demo-contact-3",
    user_id: "demo-user-id",
    name: "Emily Chen",
    email: "emily.chen@example.com",
    phone: null,
    relationship: "Attorney",
    is_verified: false,
    notify_on_deadman: false,
    created_at: "2025-03-01T09:00:00Z",
    updated_at: "2025-03-01T09:00:00Z",
  },
];

export const DEMO_MESSAGES: (Omit<ScheduledMessage, "subject" | "content"> & { subject: string; content: string })[] = [
  {
    id: "demo-msg-1",
    user_id: "demo-user-id",
    recipient_email: "sarah@example.com",
    recipient_name: "Sarah",
    subject: "For you, when the time comes",
    content: "My dearest Sarah,\n\nI've left everything you need in our vault. The insurance policy details, account credentials, and my letter to you are all there.\n\nYou are stronger than you know.\n\nForever yours, Alex",
    iv: "demo-iv",
    scheduled_at: "2026-12-25T09:00:00Z",
    status: "pending" as const,
    created_at: "2025-01-01T10:00:00Z",
    updated_at: "2025-03-15T12:00:00Z",
  },
  {
    id: "demo-msg-2",
    user_id: "demo-user-id",
    recipient_email: "james@example.com",
    recipient_name: "James",
    subject: "Important: Access credentials",
    content: "Hey bro,\n\nIf you're reading this, please help Sarah with the technical stuff. My password manager master password is in the vault under 'Gmail Account'. The Bitcoin wallet info is there too.\n\nTake care of everyone.\n- Alex",
    iv: "demo-iv",
    scheduled_at: "2026-12-25T09:00:00Z",
    status: "pending" as const,
    created_at: "2025-02-10T08:00:00Z",
    updated_at: "2025-02-10T08:00:00Z",
  },
  {
    id: "demo-msg-3",
    user_id: "demo-user-id",
    recipient_email: "sarah@example.com",
    recipient_name: "Sarah",
    subject: "Happy Anniversary! 🎉",
    content: "Happy 10th anniversary, my love! I scheduled this message months ago because I knew I'd forget the exact date (again). You're the best thing that ever happened to me.\n\n- Your forgetful husband",
    iv: "demo-iv",
    scheduled_at: "2025-08-15T08:00:00Z",
    status: "pending" as const,
    created_at: "2025-04-01T20:00:00Z",
    updated_at: "2025-04-01T20:00:00Z",
  },
];

const now = new Date();
const nextDeadline = new Date(now.getTime() + 22 * 24 * 60 * 60 * 1000); // 22 days from now

export const DEMO_DEADMAN: DeadmanStatus = {
  id: "demo-deadman-1",
  user_id: "demo-user-id",
  is_active: true,
  check_in_interval_days: 30,
  last_check_in: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
  next_deadline: nextDeadline.toISOString(),
  grace_period_hours: 48,
  alert_contacts: true,
  created_at: "2024-11-01T10:00:00Z",
  updated_at: now.toISOString(),
};

/**
 * Check if the current session is in demo mode (client-side)
 */
export function isDemoMode(): boolean {
  if (typeof window === "undefined") return false;
  return (
    sessionStorage.getItem("secretly_demo_mode") === "true" ||
    document.cookie.includes("demo_mode=true")
  );
}

/**
 * Exit demo mode
 */
export function exitDemoMode(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("secretly_demo_mode");
  document.cookie = "demo_mode=; path=/; max-age=0";
}
