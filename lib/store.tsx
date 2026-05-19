"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { PasswordEntry, AppSettings, PasswordCategory } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/types";
import { INITIAL_PASSWORDS } from "@/lib/demo-data";

// ─── Storage Keys ────────────────────────────────────────────────────────────
const PASSWORDS_KEY = "secretly_passwords";
const SETTINGS_KEY = "secretly_settings";
const LOCKED_KEY = "secretly_locked";
const LAST_ACTIVITY_KEY = "secretly_last_activity";

// ─── Context Types ───────────────────────────────────────────────────────────
interface StoreContextType {
  // Passwords
  passwords: PasswordEntry[];
  addPassword: (entry: Omit<PasswordEntry, "id" | "user_id" | "iv" | "created_at" | "updated_at">) => void;
  updatePassword: (id: string, entry: Partial<PasswordEntry>) => void;
  deletePassword: (id: string) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;

  // Lock state
  isLocked: boolean;
  lock: () => void;
  unlock: () => void;

  // Activity tracking (for auto-lock)
  recordActivity: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────
export function StoreProvider({ children }: { children: ReactNode }) {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLocked, setIsLocked] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedPasswords = localStorage.getItem(PASSWORDS_KEY);
    const storedSettings = localStorage.getItem(SETTINGS_KEY);
    const storedLocked = localStorage.getItem(LOCKED_KEY);

    if (storedPasswords) {
      try { setPasswords(JSON.parse(storedPasswords)); } catch { setPasswords(INITIAL_PASSWORDS); }
    } else {
      setPasswords(INITIAL_PASSWORDS);
      localStorage.setItem(PASSWORDS_KEY, JSON.stringify(INITIAL_PASSWORDS));
    }

    if (storedSettings) {
      try {
        const parsed = { ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) };
        setSettings(parsed);
        // Apply theme
        document.documentElement.classList.toggle("dark", parsed.dark_mode !== false);
      } catch {}
    } else {
      document.documentElement.classList.add("dark");
    }

    if (storedLocked === "true") {
      setIsLocked(true);
    }

    setInitialized(true);
  }, []);

  // Persist passwords
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
    }
  }, [passwords, initialized]);

  // Persist settings
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
  }, [settings, initialized]);

  // Auto-lock timer
  useEffect(() => {
    if (!settings.auto_lock_seconds || settings.auto_lock_seconds === 0) return;

    const interval = setInterval(() => {
      const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
      if (lastActivity) {
        const elapsed = Date.now() - parseInt(lastActivity, 10);
        if (elapsed > settings.auto_lock_seconds * 1000) {
          setIsLocked(true);
          localStorage.setItem(LOCKED_KEY, "true");
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [settings.auto_lock_seconds]);

  // ─── Password CRUD ───────────────────────────────────────────────────────
  const addPassword = useCallback((entry: Omit<PasswordEntry, "id" | "user_id" | "iv" | "created_at" | "updated_at">) => {
    const now = new Date().toISOString();
    const newEntry: PasswordEntry = {
      ...entry,
      id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      user_id: "local",
      iv: "",
      created_at: now,
      updated_at: now,
    };
    setPasswords((prev) => [newEntry, ...prev]);
  }, []);

  const updatePassword = useCallback((id: string, patch: Partial<PasswordEntry>) => {
    setPasswords((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...patch, updated_at: new Date().toISOString() } : p
      )
    );
  }, []);

  const deletePassword = useCallback((id: string) => {
    setPasswords((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // ─── Settings ────────────────────────────────────────────────────────────
  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  // ─── Lock ────────────────────────────────────────────────────────────────
  const lock = useCallback(() => {
    setIsLocked(true);
    localStorage.setItem(LOCKED_KEY, "true");
  }, []);

  const unlock = useCallback(() => {
    setIsLocked(false);
    localStorage.removeItem(LOCKED_KEY);
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  }, []);

  const recordActivity = useCallback(() => {
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  }, []);

  if (!initialized) {
    return null; // Don't render until hydrated
  }

  return (
    <StoreContext.Provider
      value={{
        passwords,
        addPassword,
        updatePassword,
        deletePassword,
        settings,
        updateSettings,
        isLocked,
        lock,
        unlock,
        recordActivity,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
