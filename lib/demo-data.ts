import type { PasswordEntry } from "@/lib/types";

export const INITIAL_PASSWORDS: PasswordEntry[] = [
  { id: "p1", user_id: "u", app_name: "Instagram", username: "@alex.demo", password: "Insta$ecure2024!", url: "https://instagram.com", category: "social", icon_url: "https://www.google.com/s2/favicons?domain=instagram.com&sz=128", notes: null, iv: "", created_at: "2025-01-10T08:00:00Z", updated_at: "2025-04-20T10:00:00Z" },
  { id: "p2", user_id: "u", app_name: "Gmail", username: "alex.demo@gmail.com", password: "Gm@il_Pass#99", url: "https://mail.google.com", category: "email", icon_url: "https://www.google.com/s2/favicons?domain=gmail.com&sz=128", notes: "2FA enabled", iv: "", created_at: "2024-11-01T08:00:00Z", updated_at: "2025-03-15T14:00:00Z" },
  { id: "p3", user_id: "u", app_name: "BCA Mobile", username: "1234567890", password: "192837", url: "https://www.bca.co.id", category: "banking", icon_url: "https://www.google.com/s2/favicons?domain=bca.co.id&sz=128", notes: "PIN m-banking", iv: "", created_at: "2024-10-05T09:00:00Z", updated_at: "2025-02-28T11:00:00Z" },
  { id: "p4", user_id: "u", app_name: "Spotify", username: "alex.demo", password: "Sp0tify_Rocks!", url: "https://spotify.com", category: "entertainment", icon_url: "https://www.google.com/s2/favicons?domain=spotify.com&sz=128", notes: "Family plan", iv: "", created_at: "2024-12-20T15:00:00Z", updated_at: "2025-01-05T09:00:00Z" },
  { id: "p5", user_id: "u", app_name: "Tokopedia", username: "alex@gmail.com", password: "Tokped#Shop2024", url: "https://tokopedia.com", category: "shopping", icon_url: "https://www.google.com/s2/favicons?domain=tokopedia.com&sz=128", notes: null, iv: "", created_at: "2025-02-01T10:00:00Z", updated_at: "2025-04-01T08:00:00Z" },
  { id: "p6", user_id: "u", app_name: "X (Twitter)", username: "@alexdemo", password: "Xitter_2024!pw", url: "https://x.com", category: "social", icon_url: "https://www.google.com/s2/favicons?domain=x.com&sz=128", notes: null, iv: "", created_at: "2024-09-15T12:00:00Z", updated_at: "2025-03-10T16:00:00Z" },
  { id: "p7", user_id: "u", app_name: "Netflix", username: "alex@gmail.com", password: "Netfl1x_Chill!", url: "https://netflix.com", category: "entertainment", icon_url: "https://www.google.com/s2/favicons?domain=netflix.com&sz=128", notes: "Premium 4K", iv: "", created_at: "2024-08-20T08:00:00Z", updated_at: "2025-01-20T10:00:00Z" },
  { id: "p8", user_id: "u", app_name: "Slack", username: "alex@company.com", password: "Sl@ck_W0rk2024", url: "https://slack.com", category: "work", icon_url: "https://www.google.com/s2/favicons?domain=slack.com&sz=128", notes: "Acme Corp", iv: "", created_at: "2025-03-01T09:00:00Z", updated_at: "2025-05-01T11:00:00Z" },
  { id: "p9", user_id: "u", app_name: "GoPay", username: "081234567890", password: "654321", url: "https://www.gojek.com", category: "banking", icon_url: "https://www.google.com/s2/favicons?domain=gojek.com&sz=128", notes: "PIN", iv: "", created_at: "2025-01-15T14:00:00Z", updated_at: "2025-04-15T09:00:00Z" },
  { id: "p10", user_id: "u", app_name: "GitHub", username: "alexdemo", password: "G1tHub_D3v!2024", url: "https://github.com", category: "work", icon_url: "https://www.google.com/s2/favicons?domain=github.com&sz=128", notes: "PAT in notes", iv: "", created_at: "2024-07-10T10:00:00Z", updated_at: "2025-02-20T15:00:00Z" },
];

export function isDemoMode(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("secretly_demo_mode") === "true" || document.cookie.includes("demo_mode=true");
}

export function exitDemoMode(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("secretly_demo_mode");
  document.cookie = "demo_mode=; path=/; max-age=0";
}
