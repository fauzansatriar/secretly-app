"use client";

import { useRouter } from "next/navigation";
import {
  ScanFace,
  Shield,
  Lock,
  LogOut,
  ChevronRight,
  Moon,
  Bell,
  Fingerprint,
  Info,
} from "lucide-react";
import { exitDemoMode } from "@/lib/demo-data";

export default function SettingsPage() {
  const router = useRouter();

  function handleLogout() {
    exitDemoMode();
    router.push("/");
  }

  return (
    <div className="flex flex-col max-w-lg mx-auto pb-6">
      {/* Header */}
      <div className="px-1 pt-2 pb-6">
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      {/* Profile card */}
      <div className="mx-1 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-cyan-glow/10 border border-cyan-glow/20 flex items-center justify-center">
          <span className="text-lg font-bold text-cyan-glow">A</span>
        </div>
        <div>
          <h2 className="font-semibold">Alex</h2>
          <p className="text-xs text-muted-foreground">demo@secretly.app</p>
          <p className="text-[10px] text-cyan-glow mt-0.5">Pro Plan</p>
        </div>
      </div>

      {/* Settings groups */}
      <div className="space-y-6 px-1">
        {/* Security */}
        <SettingsGroup title="Security">
          <SettingsItem
            icon={ScanFace}
            label="Face ID"
            value="Enabled"
            color="text-cyan-glow"
          />
          <SettingsItem
            icon={Fingerprint}
            label="Biometric Lock"
            value="On"
            color="text-emerald-400"
          />
          <SettingsItem
            icon={Lock}
            label="Auto-lock"
            value="1 minute"
            color="text-violet-400"
          />
        </SettingsGroup>

        {/* Preferences */}
        <SettingsGroup title="Preferences">
          <SettingsItem
            icon={Moon}
            label="Theme"
            value="Dark"
            color="text-amber-400"
          />
          <SettingsItem
            icon={Bell}
            label="Notifications"
            value="Off"
            color="text-rose-400"
          />
        </SettingsGroup>

        {/* About */}
        <SettingsGroup title="About">
          <SettingsItem
            icon={Shield}
            label="Encryption"
            value="AES-256-GCM"
            color="text-cyan-glow"
          />
          <SettingsItem
            icon={Info}
            label="Version"
            value="1.0.0"
            color="text-muted-foreground"
          />
        </SettingsGroup>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex items-center gap-3 text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Lock & Exit</span>
        </button>
      </div>
    </div>
  );
}

function SettingsGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 px-1">
        {title}
      </p>
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] divide-y divide-white/[0.04] overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function SettingsItem({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className={`w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm flex-1">{label}</span>
      <span className="text-xs text-muted-foreground">{value}</span>
      <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
    </div>
  );
}
