"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Shield, ScanFace, Loader2, Lock, Eye, Fingerprint } from "lucide-react";
import { authenticateWithBiometric, isBiometricAvailable, registerBiometric, isCredentialRegistered } from "@/lib/auth-biometric";

export default function LandingPage() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFaceScan() {
    setScanning(true);
    setError(null);

    try {
      const available = await isBiometricAvailable();

      if (available) {
        // If not registered yet, register first
        if (!isCredentialRegistered()) {
          const registered = await registerBiometric();
          if (!registered) {
            // If registration was cancelled/failed, still allow demo access
            enterApp();
            return;
          }
        }
        // Authenticate
        const ok = await authenticateWithBiometric();
        if (ok) {
          setScanned(true);
          await new Promise((r) => setTimeout(r, 500));
          enterApp();
        } else {
          setError("Verification cancelled. Try again.");
          setScanning(false);
        }
      } else {
        // No biometric available — just enter
        setScanned(true);
        await new Promise((r) => setTimeout(r, 400));
        enterApp();
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
      setScanning(false);
    }
  }

  function enterApp() {
    document.cookie = "demo_mode=true; path=/; max-age=86400; SameSite=Lax";
    sessionStorage.setItem("secretly_demo_mode", "true");
    router.push("/dashboard");
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between px-6 py-12 max-w-md mx-auto">
      {/* Background */}
      <div className="fixed inset-0 bg-dot-pattern opacity-[0.08]" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-cyan-glow/[0.04] rounded-full blur-[120px]" />

      {/* Top — branding */}
      <div className="relative z-10 flex flex-col items-center pt-10">
        <div className="w-14 h-14 rounded-2xl bg-cyan-glow/10 border border-cyan-glow/20 flex items-center justify-center mb-4 animate-in opacity-0">
          <Shield className="w-7 h-7 text-cyan-glow" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight animate-in opacity-0 delay-100">Secretly</h1>
        <p className="text-sm text-muted-foreground mt-1 animate-in opacity-0 delay-150">Password Manager</p>
      </div>

      {/* Middle — Face scan */}
      <div className="relative z-10 flex flex-col items-center animate-in opacity-0 delay-200">
        <div className={`relative w-44 h-44 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
          scanning
            ? scanned
              ? "border-emerald-400 bg-emerald-400/5 shadow-[0_0_50px_rgba(52,211,153,0.2)]"
              : "border-cyan-glow bg-cyan-glow/5 shadow-[0_0_50px_rgba(103,232,249,0.15)]"
            : "border-white/10 bg-white/[0.02]"
        }`}>
          {scanned ? (
            <div className="flex flex-col items-center gap-2">
              <Fingerprint className="w-12 h-12 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">Verified</span>
            </div>
          ) : scanning ? (
            <div className="flex flex-col items-center gap-2">
              <ScanFace className="w-14 h-14 text-cyan-glow animate-pulse" />
              <span className="text-xs text-cyan-glow">Verifying...</span>
            </div>
          ) : (
            <ScanFace className="w-14 h-14 text-muted-foreground/30" />
          )}

          {/* Corner brackets */}
          {scanning && !scanned && (
            <>
              <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-cyan-glow rounded-tl-lg" />
              <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-cyan-glow rounded-tr-lg" />
              <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-cyan-glow rounded-bl-lg" />
              <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-cyan-glow rounded-br-lg" />
            </>
          )}
        </div>

        <p className="text-sm text-muted-foreground mt-6 text-center">
          {scanned ? "Welcome back" : scanning ? "Hold still..." : "Tap to unlock with biometrics"}
        </p>
        {error && <p className="text-xs text-rose-400 mt-2">{error}</p>}
      </div>

      {/* Bottom — CTA */}
      <div className="relative z-10 w-full space-y-4 animate-in opacity-0 delay-300">
        <button
          onClick={handleFaceScan}
          disabled={scanning}
          className="w-full py-4 rounded-2xl bg-cyan-glow text-navy-950 font-semibold text-sm active:scale-[0.97] transition-transform shadow-glow disabled:opacity-60 flex items-center justify-center gap-2.5"
        >
          {scanning ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ScanFace className="w-5 h-5" />
          )}
          {scanned ? "Entering..." : scanning ? "Verifying..." : "Unlock with Biometrics"}
        </button>

        <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground/50">
          <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> AES-256</span>
          <span className="w-px h-3 bg-border" />
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> WebAuthn</span>
          <span className="w-px h-3 bg-border" />
          <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Local</span>
        </div>
      </div>
    </div>
  );
}
