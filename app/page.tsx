"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Shield, ScanFace, Loader2, Lock, Eye, Fingerprint } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  async function handleFaceScan() {
    setScanning(true);
    // Simulate face scan animation
    await new Promise((r) => setTimeout(r, 2000));
    setScanned(true);
    await new Promise((r) => setTimeout(r, 600));
    // Set demo mode and enter
    document.cookie = "demo_mode=true; path=/; max-age=86400; SameSite=Lax";
    sessionStorage.setItem("secretly_demo_mode", "true");
    router.push("/dashboard");
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between px-6 py-12 max-w-md mx-auto">
      {/* Background */}
      <div className="fixed inset-0 bg-dot-pattern opacity-10" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-cyan-glow/[0.04] rounded-full blur-[120px]" />

      {/* Top section — branding */}
      <div className="relative z-10 flex flex-col items-center pt-8">
        <div className="w-14 h-14 rounded-2xl bg-cyan-glow/10 border border-cyan-glow/20 flex items-center justify-center mb-4 animate-in opacity-0">
          <Shield className="w-7 h-7 text-cyan-glow" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight animate-in opacity-0 delay-100">Secretly</h1>
        <p className="text-sm text-muted-foreground mt-1 animate-in opacity-0 delay-150">Password Manager</p>
      </div>

      {/* Middle section — Face scan */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Scan circle */}
        <div className="relative animate-in opacity-0 delay-200">
          <div className={`w-48 h-48 rounded-full border-2 flex items-center justify-center transition-all duration-700 ${
            scanning
              ? scanned
                ? "border-emerald-400 bg-emerald-400/5 shadow-[0_0_40px_rgba(52,211,153,0.2)]"
                : "border-cyan-glow bg-cyan-glow/5 shadow-[0_0_40px_rgba(103,232,249,0.15)] animate-pulse"
              : "border-white/10 bg-white/[0.02]"
          }`}>
            {scanned ? (
              <div className="flex flex-col items-center gap-2 animate-in opacity-0">
                <Fingerprint className="w-12 h-12 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">Verified</span>
              </div>
            ) : scanning ? (
              <div className="flex flex-col items-center gap-2">
                <ScanFace className="w-16 h-16 text-cyan-glow animate-pulse" />
                <span className="text-xs text-cyan-glow">Scanning...</span>
              </div>
            ) : (
              <ScanFace className="w-16 h-16 text-muted-foreground/40" />
            )}
          </div>

          {/* Corner brackets for scan effect */}
          {scanning && !scanned && (
            <>
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-glow rounded-tl-lg animate-pulse" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-cyan-glow rounded-tr-lg animate-pulse" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-cyan-glow rounded-bl-lg animate-pulse" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-glow rounded-br-lg animate-pulse" />
            </>
          )}
        </div>

        <p className="text-sm text-muted-foreground mt-6 text-center animate-in opacity-0 delay-300">
          {scanned
            ? "Welcome back, Alex"
            : scanning
            ? "Hold still..."
            : "Tap to unlock with Face ID"}
        </p>
      </div>

      {/* Bottom section — CTA button */}
      <div className="relative z-10 w-full space-y-4 animate-in opacity-0 delay-400">
        <button
          onClick={handleFaceScan}
          disabled={scanning}
          className="w-full py-4 rounded-2xl bg-cyan-glow text-navy-950 font-semibold text-sm hover:bg-cyan-soft transition-all shadow-glow disabled:opacity-60 flex items-center justify-center gap-2.5"
        >
          {scanning ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ScanFace className="w-5 h-5" />
          )}
          {scanned ? "Entering..." : scanning ? "Verifying Face..." : "Unlock with Face ID"}
        </button>

        {/* Trust pills */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground/60">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            AES-256
          </span>
          <span className="w-px h-3 bg-border" />
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            Biometric
          </span>
          <span className="w-px h-3 bg-border" />
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Offline
          </span>
        </div>
      </div>
    </div>
  );
}
