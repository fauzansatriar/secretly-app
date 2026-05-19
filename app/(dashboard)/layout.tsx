"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { StoreProvider, useStore } from "@/lib/store";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { authenticateWithBiometric } from "@/lib/auth-biometric";
import { ScanFace, Shield, Loader2 } from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <LockGate>{children}</LockGate>
    </StoreProvider>
  );
}

function LockGate({ children }: { children: React.ReactNode }) {
  const { isLocked, unlock, settings, recordActivity } = useStore();
  const [unlocking, setUnlocking] = useState(false);

  // Record activity on any interaction
  useEffect(() => {
    function onActivity() { recordActivity(); }
    window.addEventListener("touchstart", onActivity, { passive: true });
    window.addEventListener("click", onActivity);
    window.addEventListener("keydown", onActivity);
    return () => {
      window.removeEventListener("touchstart", onActivity);
      window.removeEventListener("click", onActivity);
      window.removeEventListener("keydown", onActivity);
    };
  }, [recordActivity]);

  async function handleUnlock() {
    setUnlocking(true);
    if (settings.biometric_enabled) {
      const ok = await authenticateWithBiometric();
      if (ok) unlock();
    } else {
      unlock();
    }
    setUnlocking(false);
  }

  if (isLocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 max-w-sm mx-auto text-center">
        <div className="fixed inset-0 bg-dot-pattern opacity-10" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-glow/10 border border-cyan-glow/20 flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-cyan-glow" />
          </div>
          <h1 className="text-xl font-bold mb-2">Secretly Locked</h1>
          <p className="text-sm text-muted-foreground mb-8">Verify your identity to continue</p>
          <button
            onClick={handleUnlock}
            disabled={unlocking}
            className="w-full py-4 rounded-2xl bg-cyan-glow text-navy-950 font-semibold text-sm active:scale-[0.97] transition-transform shadow-glow flex items-center justify-center gap-2.5 disabled:opacity-60"
          >
            {unlocking ? <Loader2 className="w-5 h-5 animate-spin" /> : <ScanFace className="w-5 h-5" />}
            {unlocking ? "Verifying..." : "Unlock"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col max-w-lg mx-auto">
      <div className="fixed inset-0 bg-dot-pattern opacity-[0.07]" />
      <main className="flex-1 relative z-10 px-4 pt-4 pb-24">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
