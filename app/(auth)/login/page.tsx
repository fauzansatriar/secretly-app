"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Shield, Fingerprint, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDemoAccess() {
    setLoading(true);
    document.cookie = "demo_mode=true; path=/; max-age=86400; SameSite=Lax";
    sessionStorage.setItem("secretly_demo_mode", "true");
    await new Promise((r) => setTimeout(r, 400));
    router.push("/dashboard");
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6">
      <div className="fixed inset-0 bg-dot-pattern opacity-20" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-glow/[0.03] rounded-full blur-[120px]" />

      <div className="relative w-full max-w-sm flex flex-col items-center text-center">
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-10 h-10 rounded-xl bg-cyan-glow/10 border border-cyan-glow/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-cyan-glow" />
          </div>
          <span className="text-xl font-semibold tracking-tight">Secretly</span>
        </Link>

        <div className="w-full glass-strong rounded-3xl p-8 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-cyan-glow/10 border border-cyan-glow/20 flex items-center justify-center mb-5">
            <Fingerprint className="w-6 h-6 text-cyan-glow" />
          </div>
          <h1 className="text-xl font-semibold mb-2">Access Secretly</h1>
          <p className="text-sm text-muted-foreground mb-8 max-w-xs">
            Explore the platform instantly with our demo workspace. No sign-up needed.
          </p>

          <button
            onClick={handleDemoAccess}
            disabled={loading}
            className="group w-full py-3.5 rounded-xl bg-cyan-glow text-navy-950 font-semibold text-sm hover:bg-cyan-soft transition-all shadow-glow hover:shadow-glow-lg disabled:opacity-70 flex items-center justify-center gap-2.5"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Fingerprint className="w-4 h-4" />
            )}
            Enter Demo
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <p className="mt-5 text-xs text-muted-foreground/70">
            Full features &middot; Sample data &middot; Zero commitment
          </p>
        </div>
      </div>
    </div>
  );
}
