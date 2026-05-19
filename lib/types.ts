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
  icon_url: string;
  notes: string | null;
  iv: string;
  created_at: string;
  updated_at: string;
}

export interface AppSettings {
  biometric_enabled: boolean;
  auto_lock_seconds: number;
  dark_mode: boolean;
  notifications_enabled: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  biometric_enabled: true,
  auto_lock_seconds: 60,
  dark_mode: true,
  notifications_enabled: false,
};

export const PLAN_LIMITS = {
  free: { passwords: 15 },
  pro: { passwords: Infinity },
} as const;
