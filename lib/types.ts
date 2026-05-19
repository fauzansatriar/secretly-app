// ─── Password Manager Types ──────────────────────────────────────────────────

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

export type PasswordCategory =
  | "social"
  | "email"
  | "banking"
  | "shopping"
  | "entertainment"
  | "work"
  | "other";

export interface PasswordEntry {
  id: string;
  user_id: string;
  app_name: string;
  username: string;
  password: string;
  url: string | null;
  category: PasswordCategory;
  icon_color: string;
  notes: string | null;
  iv: string;
  created_at: string;
  updated_at: string;
}

export const PLAN_LIMITS = {
  free: { passwords: 15 },
  pro: { passwords: Infinity },
} as const;
