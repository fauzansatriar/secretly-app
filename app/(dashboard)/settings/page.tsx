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
  XCircle,
  Download,
  AlertTriangle,
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

  useEffect(() => {
    isBiometricAvailable().then(setBiometricSupported);
    setBiometricRegistered(isCredentialRegistered());
  }, []);

  // ─── Biometric toggle ────────────────────────────────────────────────────
  async function handleBiometricToggle() {
    if (settings.biometric_enabled) {
      // Disable: verify first, then remove
      const ok = await authenticateWithBiometric();
      if (!ok) return;
      removeBiometricRegistration();
      updateSettings({ biometric_enabled: false });
      setBiometricRegistered(false);
    } else {
      // Enable: register credential
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
    updateSettings({ dark_mode: !settings.dark_mode });
    // In a full app this would toggle the html class; for now it persists the setting
  }

  // ─── Notifications toggle ────────────────────────────────────────────────
  async function handleNotificationsToggle() {
    if (!settings.notifications_enabled) {
      // Request permission
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
    // Require biometric before export
    if (settings.biometric_enabled) {
      const ok = await authenticateWithBiometric();
      if (!ok) return;
    }

    const exportData = passwords.map((p) => ({
      app: p.app_name,
      username: p.username,
      password: p.password,
      url: p.url,
      category: p.category,
      notes: p.notes,
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
        <p className="text-xs text-muted-foreground mt-0.5">Manage security & preferences</p>
      </div>

      {/* Profile card */}
      <div className="mx-1 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-cyan-glow/10 border border-cyan-glow/20 flex items-center justify-center">
          <span className="text-lg font-bold text-cyan-glow">A</span>
        </div>
        <div className="flex-1">
          <h2 className="font-semibold">Alex</h2>
          <p className="text-xs text-muted-foreground">demo@secretly.app</p>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-cyan-glow/10 border border-cyan-glow/20">
          <span className="text-[10px] font-semibold text-cyan-glow">PRO</span>
        </div>
      </div>

      <div className="space-y-6 px-1">
        {/* ─── Security ─── */}
        <SettingsGroup title="Security">
          {/* Biometric */}
          <SettingsToggle
            icon={ScanFace}
            label="Biometric Lock"
            description={biometricSupported ? (biometricRegistered ? "Face ID / Touch ID active" : "Tap to set up") : "Not supported on this device"}
            color="text-cyan-glow"
            enabled={settings.biometric_enabled}
            onToggle={handleBiometricToggle}
            disabled={!biometricSupported}
          />

          {/* Auto-lock */}
          <button onClick={() => setShowAutoLock(!showAutoLock)} className="w-full flex items-center gap-3 p-4">
            <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center text-violet-400">
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex-1 text-left">
              <span className="text-sm">Auto-lock</span>
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
                      ? "bg-cyan-glow/10 text-cyan-glow"
                      : "text-muted-foreground hover:bg-white/[0.03]"
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
            description="Always dark for now"
            color="text-amber-400"
            enabled={settings.dark_mode}
            onToggle={handleThemeToggle}
          />
          <SettingsToggle
            icon={settings.notifications_enabled ? Bell : BellOff}
            label="Notifications"
            description={settings.notifications_enabled ? "Enabled" : "Disabled"}
            color="text-rose-400"
            enabled={settings.notifications_enabled}
            onToggle={handleNotificationsToggle}
          />
        </SettingsGroup>

        {/* ─── Data ─── */}
        <SettingsGroup title="Data">
          <button onClick={handleExport} className="w-full flex items-center gap-3 p-4">
            <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center text-emerald-400">
              <Download className="w-4 h-4" />
            </div>
            <div className="flex-1 text-left">
              <span className="text-sm">Export Passwords</span>
              <p className="text-[11px] text-muted-foreground">Download as JSON (biometric required)</p>
            </div>
            {exportStatus && <span className="text-xs text-emerald-400">{exportStatus}</span>}
            <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
          </button>
        </SettingsGroup>

        {/* ─── About ─── */}
        <SettingsGroup title="About">
          <SettingsRow icon={Shield} label="Encryption" value="AES-256-GCM" color="text-cyan-glow" />
          <SettingsRow icon={Fingerprint} label="Auth" value="WebAuthn API" color="text-emerald-400" />
          <SettingsRow icon={Info} label="Version" value="2.0.0" color="text-muted-foreground" />
          <SettingsRow icon={Lock} label="Passwords" value={`${passwords.length} saved`} color="text-violet-400" />
        </SettingsGroup>

        {/* ─── Danger Zone ─── */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleLockExit}
            className="w-full p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-3 text-foreground active:scale-[0.98] transition-transform"
          >
            <LogOut className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium">Lock & Exit</span>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex items-center gap-3 text-rose-400 active:scale-[0.98] transition-transform"
          >
            <Trash2 className="w-5 h-5" />
            <span className="text-sm font-medium">Delete All Data</span>
          </button>
        </div>
      </div>

      {/* ─── Delete Confirm Modal ─── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative w-full max-w-sm bg-[hsl(222,44%,7%)] border border-white/[0.08] rounded-3xl p-6 text-center animate-in opacity-0">
            <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Delete Everything?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              This will permanently erase all passwords, settings, and biometric data. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm font-medium active:scale-[0.97] transition-transform">Cancel</button>
              <button onClick={handleDeleteAll} className="flex-1 py-3 rounded-xl bg-rose-500 text-white text-sm font-semibold active:scale-[0.97] transition-transform">Delete All</button>
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
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 px-1">{title}</p>
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] divide-y divide-white/[0.04] overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function SettingsToggle({
  icon: Icon,
  label,
  description,
  color,
  enabled,
  onToggle,
  disabled,
}: {
  icon: any;
  label: string;
  description?: string;
  color: string;
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className={`w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <span className="text-sm">{label}</span>
        {description && <p className="text-[11px] text-muted-foreground">{description}</p>}
      </div>
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`w-11 h-6 rounded-full transition-colors relative ${
          enabled ? "bg-cyan-glow" : "bg-white/[0.1]"
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
      <div className={`w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm flex-1">{label}</span>
      <span className="text-xs text-muted-foreground">{value}</span>
    </div>
  );
}
