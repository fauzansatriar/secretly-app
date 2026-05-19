"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ScanFace,
  Shield,
  Lock,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Bell,
  BellOff,
  Fingerprint,
  Info,
  Clock,
  Trash2,
  CheckCircle2,
  Download,
  AlertTriangle,
  Pencil,
  Check,
  User,
} from "lucide-react";
import { useStore } from "@/lib/store";
import {
  isBiometricAvailable,
  registerBiometric,
  removeBiometricRegistration,
  isCredentialRegistered,
  authenticateWithBiometric,
} from "@/lib/auth-biometric";
import { exitDemoMode } from "@/lib/demo-data";

const AUTO_LOCK_OPTIONS = [
  { value: 0, label: "Never" },
  { value: 30, label: "30 seconds" },
  { value: 60, label: "1 minute" },
  { value: 300, label: "5 minutes" },
  { value: 600, label: "10 minutes" },
];

export default function SettingsPage() {
  const router = useRouter();
  const { settings, updateSettings, passwords, lock } = useStore();
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricRegistered, setBiometricRegistered] = useState(false);
  const [showAutoLock, setShowAutoLock] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  // Profile editing
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(settings.display_name);
  const [nameSaved, setNameSaved] = useState(false);

  useEffect(() => {
    isBiometricAvailable().then(setBiometricSupported);
    setBiometricRegistered(isCredentialRegistered());
  }, []);

  useEffect(() => {
    setNameInput(settings.display_name);
  }, [settings.display_name]);

  // ─── Profile name save ───────────────────────────────────────────────────
  function handleSaveName() {
    const trimmed = nameInput.trim() || "Demo";
    updateSettings({ display_name: trimmed });
    setEditingName(false);
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  }

  // ─── Biometric toggle ────────────────────────────────────────────────────
  async function handleBiometricToggle() {
    if (settings.biometric_enabled) {
      const ok = await authenticateWithBiometric();
      if (!ok) return;
      removeBiometricRegistration();
      updateSettings({ biometric_enabled: false });
      setBiometricRegistered(false);
    } else {
      const registered = await registerBiometric();
      if (registered) {
        updateSettings({ biometric_enabled: true });
        setBiometricRegistered(true);
      }
    }
  }

  // ─── Auto-lock ───────────────────────────────────────────────────────────
  function handleAutoLockChange(seconds: number) {
    updateSettings({ auto_lock_seconds: seconds });
    setShowAutoLock(false);
  }

  // ─── Dark mode toggle ────────────────────────────────────────────────────
  function handleThemeToggle() {
    const newValue = !settings.dark_mode;
    updateSettings({ dark_mode: newValue });
    document.documentElement.classList.toggle("dark", newValue);
  }

  // ─── Notifications toggle ────────────────────────────────────────────────
  async function handleNotificationsToggle() {
    if (!settings.notifications_enabled) {
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          updateSettings({ notifications_enabled: true });
          new Notification("Secretly", { body: "Notifications enabled!" });
        }
      }
    } else {
      updateSettings({ notifications_enabled: false });
    }
  }

  // ─── Export passwords ────────────────────────────────────────────────────
  async function handleExport() {
    if (settings.biometric_enabled) {
      const ok = await authenticateWithBiometric();
      if (!ok) return;
    }
    const exportData = passwords.map((p) => ({
      app: p.app_name, username: p.username, password: p.password,
      url: p.url, category: p.category, notes: p.notes,
    }));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `secretly-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportStatus("Exported!");
    setTimeout(() => setExportStatus(null), 2000);
  }

  // ─── Delete all data ─────────────────────────────────────────────────────
  function handleDeleteAll() {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });
    router.push("/");
    router.refresh();
  }

  // ─── Lock & Exit ─────────────────────────────────────────────────────────
  function handleLockExit() {
    lock();
    exitDemoMode();
    router.push("/");
  }

  const autoLockLabel = AUTO_LOCK_OPTIONS.find((o) => o.value === settings.auto_lock_seconds)?.label || "1 minute";

  return (
    <div className="flex flex-col max-w-lg mx-auto pb-6">
      {/* Header */}
      <div className="px-1 pt-2 pb-6">
        <h1 className="text-xl font-bold">Settings</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Manage your account & preferences</p>
      </div>

      {/* ─── Profile Card (editable name) ─── */}
      <div className="mx-1 p-5 rounded-2xl surface-card mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">
              {(settings.display_name || "D")[0].toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                  autoFocus
                  className="flex-1 px-3 py-1.5 rounded-lg text-sm font-semibold surface-input focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                  placeholder="Your name"
                />
                <button
                  onClick={handleSaveName}
                  className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary active:scale-90 transition-transform"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="font-semibold truncate">{settings.display_name}</h2>
                <button
                  onClick={() => setEditingName(true)}
                  className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                </button>
                {nameSaved && (
                  <span className="text-xs text-emerald-500 font-medium animate-in opacity-0">Saved!</span>
                )}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-0.5">Tap name to edit</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 px-1">
        {/* ─── Security ─── */}
        <SettingsGroup title="Security">
          <SettingsToggle
            icon={ScanFace}
            label="Biometric Lock"
            description={biometricSupported ? (biometricRegistered ? "Face ID / Touch ID active" : "Tap to set up") : "Not supported on this device"}
            color="text-primary"
            enabled={settings.biometric_enabled}
            onToggle={handleBiometricToggle}
            disabled={!biometricSupported}
          />

          <button onClick={() => setShowAutoLock(!showAutoLock)} className="w-full flex items-center gap-3 p-4">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-500">
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex-1 text-left">
              <span className="text-sm font-medium">Auto-lock</span>
              <p className="text-[11px] text-muted-foreground">Lock after inactivity</p>
            </div>
            <span className="text-xs text-muted-foreground mr-1">{autoLockLabel}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
          </button>

          {showAutoLock && (
            <div className="px-4 pb-3 space-y-1">
              {AUTO_LOCK_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAutoLockChange(opt.value)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                    settings.auto_lock_seconds === opt.value
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {opt.label}
                  {settings.auto_lock_seconds === opt.value && <CheckCircle2 className="w-3.5 h-3.5 inline ml-2" />}
                </button>
              ))}
            </div>
          )}
        </SettingsGroup>

        {/* ─── Preferences ─── */}
        <SettingsGroup title="Preferences">
          <SettingsToggle
            icon={settings.dark_mode ? Moon : Sun}
            label="Dark Mode"
            description={settings.dark_mode ? "Dark theme active" : "Light theme active"}
            color="text-amber-500"
            enabled={settings.dark_mode}
            onToggle={handleThemeToggle}
          />
          <SettingsToggle
            icon={settings.notifications_enabled ? Bell : BellOff}
            label="Notifications"
            description={settings.notifications_enabled ? "Enabled" : "Disabled"}
            color="text-rose-500"
            enabled={settings.notifications_enabled}
            onToggle={handleNotificationsToggle}
          />
        </SettingsGroup>

        {/* ─── Data ─── */}
        <SettingsGroup title="Data">
          <button onClick={handleExport} className="w-full flex items-center gap-3 p-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Download className="w-4 h-4" />
            </div>
            <div className="flex-1 text-left">
              <span className="text-sm font-medium">Export Passwords</span>
              <p className="text-[11px] text-muted-foreground">Download as JSON</p>
            </div>
            {exportStatus && <span className="text-xs text-emerald-500 font-medium">{exportStatus}</span>}
            <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
          </button>
        </SettingsGroup>

        {/* ─── About ─── */}
        <SettingsGroup title="About">
          <SettingsRow icon={Shield} label="Encryption" value="AES-256-GCM" color="text-primary" />
          <SettingsRow icon={Fingerprint} label="Auth" value="WebAuthn API" color="text-emerald-500" />
          <SettingsRow icon={Info} label="Version" value="2.1.0" color="text-muted-foreground" />
          <SettingsRow icon={Lock} label="Passwords" value={`${passwords.length} saved`} color="text-violet-500" />
        </SettingsGroup>

        {/* ─── Danger Zone ─── */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleLockExit}
            className="w-full p-4 rounded-2xl surface-card flex items-center gap-3 text-foreground active:scale-[0.98] transition-transform"
          >
            <LogOut className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium">Lock & Exit</span>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full p-4 rounded-2xl bg-destructive/5 border border-destructive/15 flex items-center gap-3 text-destructive active:scale-[0.98] transition-transform"
          >
            <Trash2 className="w-5 h-5" />
            <span className="text-sm font-medium">Delete All Data</span>
          </button>
        </div>
      </div>

      {/* ─── Delete Confirm Modal ─── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative w-full max-w-sm surface-elevated rounded-3xl p-6 text-center animate-in opacity-0">
            <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Delete Everything?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              This will permanently erase all passwords, settings, and biometric data. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 rounded-xl surface-card text-sm font-medium active:scale-[0.97] transition-transform">Cancel</button>
              <button onClick={handleDeleteAll} className="flex-1 py-3 rounded-xl bg-destructive text-white text-sm font-semibold active:scale-[0.97] transition-transform">Delete All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Components ──────────────────────────────────────────────────────────────

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 px-1 font-semibold">{title}</p>
      <div className="rounded-2xl surface-card divide-y divide-border overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function SettingsToggle({
  icon: Icon, label, description, color, enabled, onToggle, disabled,
}: {
  icon: any; label: string; description?: string; color: string;
  enabled: boolean; onToggle: () => void; disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className={`w-8 h-8 rounded-lg bg-secondary flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <span className="text-sm font-medium">{label}</span>
        {description && <p className="text-[11px] text-muted-foreground">{description}</p>}
      </div>
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`w-11 h-6 rounded-full transition-colors relative ${
          enabled ? "bg-primary" : "bg-border"
        } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${enabled ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function SettingsRow({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className={`w-8 h-8 rounded-lg bg-secondary flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm font-medium flex-1">{label}</span>
      <span className="text-xs text-muted-foreground">{value}</span>
    </div>
  );
}
