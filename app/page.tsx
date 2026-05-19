"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Shield,
  Lock,
  Clock,
  Users,
  AlertTriangle,
  ChevronRight,
  Fingerprint,
  Eye,
  EyeOff,
  Zap,
  ArrowRight,
  Check,
  Star,
  Globe,
  Server,
  KeyRound,
  ShieldCheck,
  Loader2,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [demoLoading, setDemoLoading] = useState(false);

  async function handleDemoAccess() {
    setDemoLoading(true);
    document.cookie = "demo_mode=true; path=/; max-age=86400; SameSite=Lax";
    sessionStorage.setItem("secretly_demo_mode", "true");
    await new Promise((r) => setTimeout(r, 400));
    router.push("/dashboard");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">

      {/* Ambient background layers */}
      <div className="fixed inset-0 bg-dot-pattern opacity-20" />
      <div className="fixed top-0 left-1/3 w-[600px] h-[600px] bg-cyan-glow/[0.03] rounded-full blur-[150px]" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/[0.02] rounded-full blur-[120px]" />

      {/* ═══ NAVIGATION ═══ */}
      <nav className="relative z-50 flex items-center justify-between px-6 lg:px-10 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-glow/10 border border-cyan-glow/20 flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-cyan-glow" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Secretly</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDemoAccess}
            disabled={demoLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl bg-cyan-glow text-navy-950 hover:bg-cyan-soft transition-all shadow-glow disabled:opacity-70"
          >
            {demoLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            Open App
          </button>
        </div>
      </nav>


      {/* ═══ HERO SECTION ═══ */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-20 lg:pt-32 pb-24">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-cyan-glow/40 float" />
        <div className="absolute top-40 right-20 w-1.5 h-1.5 rounded-full bg-violet-400/40 float-delay" />
        <div className="absolute bottom-20 left-1/4 w-1 h-1 rounded-full bg-cyan-glow/30 float-slow" />

        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="animate-in opacity-0 inline-flex items-center gap-2 px-4 py-2 rounded-full glass-strong text-xs text-muted-foreground mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Zero-knowledge encryption &middot; Your data stays yours</span>
          </div>

          {/* Headline */}
          <h1 className="animate-in opacity-0 delay-100 text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.08]">
            <span className="text-gradient-subtle">Protect what matters</span>
            <br />
            <span className="text-gradient">beyond your lifetime</span>
          </h1>

          {/* Sub */}
          <p className="animate-in opacity-0 delay-200 mt-6 text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Military-grade encrypted vault, scheduled messages, emergency contacts,
            and a dead-man switch — all in one elegant platform built for digital peace of mind.
          </p>

          {/* CTA */}
          <div className="animate-in opacity-0 delay-300 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleDemoAccess}
              disabled={demoLoading}
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-semibold rounded-2xl bg-cyan-glow text-navy-950 hover:bg-cyan-soft transition-all shadow-glow hover:shadow-glow-lg disabled:opacity-70"
            >
              {demoLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Fingerprint className="w-4.5 h-4.5" />
              )}
              Enter Secretly
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium rounded-2xl glass glass-hover text-muted-foreground hover:text-foreground"
            >
              See how it works
            </a>
          </div>

          {/* Trust signals */}
          <div className="animate-in opacity-0 delay-500 mt-14 flex items-center justify-center gap-6 text-xs text-muted-foreground/70">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3 h-3" /> AES-256-GCM
            </span>
            <span className="w-px h-3 bg-border" />
            <span className="flex items-center gap-1.5">
              <Server className="w-3 h-3" /> Zero-knowledge
            </span>
            <span className="w-px h-3 bg-border" />
            <span className="flex items-center gap-1.5">
              <Globe className="w-3 h-3" /> Open source
            </span>
          </div>
        </div>
      </section>


      {/* ═══ FEATURES SECTION — Asymmetric bento grid ═══ */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <div className="text-center mb-16">
          <p className="animate-in opacity-0 text-xs font-medium text-cyan-glow uppercase tracking-widest mb-3">Core Features</p>
          <h2 className="animate-in opacity-0 delay-100 text-3xl lg:text-4xl font-bold tracking-tight">
            Everything encrypted. <span className="text-muted-foreground">Nothing exposed.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Large card — Vault */}
          <div className="lg:col-span-2 group p-8 rounded-3xl glass glass-hover relative overflow-hidden animate-in opacity-0 delay-150">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-glow/[0.03] rounded-full blur-[80px] group-hover:bg-cyan-glow/[0.06] transition-all duration-700" />
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-cyan-glow/10 border border-cyan-glow/20 flex items-center justify-center text-cyan-glow mb-5 group-hover:shadow-glow transition-all duration-500">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Encrypted Vault</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                Store passwords, documents, seed phrases, and secrets. AES-256-GCM encryption happens entirely in your browser — the server never sees plaintext.
              </p>
              {/* Mini UI mockup */}
              <div className="mt-6 grid grid-cols-3 gap-2">
                {["Gmail", "Bitcoin Wallet", "Insurance"].map((item, i) => (
                  <div key={item} className={`p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] animate-in opacity-0 delay-${(i + 3) * 100}`}>
                    <div className="w-6 h-6 rounded-lg bg-cyan-glow/10 flex items-center justify-center mb-2">
                      <KeyRound className="w-3 h-3 text-cyan-glow" />
                    </div>
                    <p className="text-xs font-medium truncate">{item}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">••••••••</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stacked cards — right column */}
          <div className="flex flex-col gap-4">
            {/* Messages */}
            <div className="group p-6 rounded-3xl glass glass-hover relative overflow-hidden flex-1 animate-in opacity-0 delay-200">
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-violet-500/[0.03] rounded-full blur-[60px] group-hover:bg-violet-500/[0.06] transition-all duration-700" />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-violet-400/10 border border-violet-400/20 flex items-center justify-center text-violet-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-semibold mb-1">Scheduled Messages</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Write encrypted letters delivered at a future date. Your words, their time.
                </p>
              </div>
            </div>

            {/* Dead-Man Switch */}
            <div className="group p-6 rounded-3xl glass glass-hover relative overflow-hidden flex-1 animate-in opacity-0 delay-300">
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/[0.03] rounded-full blur-[60px] group-hover:bg-amber-500/[0.06] transition-all duration-700" />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-semibold mb-1">Dead-Man Switch</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Miss a check-in? Your trusted contacts are automatically notified.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Second row */}
        <div className="grid lg:grid-cols-2 gap-4 mt-4">
          {/* Emergency Contacts */}
          <div className="group p-8 rounded-3xl glass glass-hover relative overflow-hidden animate-in opacity-0 delay-400">
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-400/[0.03] rounded-full blur-[80px] group-hover:bg-emerald-400/[0.06] transition-all duration-700" />
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:shadow-[0_0_30px_rgba(52,211,153,0.15)] transition-all duration-500">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Emergency Contacts</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Assign trusted people who receive critical info. Verified, notified, prepared.
              </p>
              <div className="mt-5 flex -space-x-2">
                {["S", "J", "E"].map((l, i) => (
                  <div key={l} className={`w-8 h-8 rounded-full bg-emerald-400/10 border-2 border-background flex items-center justify-center text-xs font-medium text-emerald-400 animate-in opacity-0 delay-${(i + 5) * 100}`}>
                    {l}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full bg-white/[0.03] border-2 border-background flex items-center justify-center text-xs text-muted-foreground">
                  +
                </div>
              </div>
            </div>
          </div>

          {/* Security Architecture */}
          <div className="group p-8 rounded-3xl glass glass-hover relative overflow-hidden animate-in opacity-0 delay-500">
            <div className="absolute top-0 left-0 w-48 h-48 bg-cyan-glow/[0.02] rounded-full blur-[80px] group-hover:bg-cyan-glow/[0.04] transition-all duration-700" />
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-cyan-glow/10 border border-cyan-glow/20 flex items-center justify-center text-cyan-glow mb-5 group-hover:shadow-glow transition-all duration-500">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Zero-Knowledge Security</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Client-side encryption with Web Crypto API. Row-level security in the database. We literally cannot read your data.
              </p>
              <div className="mt-5 space-y-2">
                {["Encrypted in browser", "Never stored as plaintext", "RLS on every table"].map((t, i) => (
                  <div key={t} className={`flex items-center gap-2 text-xs text-muted-foreground animate-in opacity-0 delay-${(i + 6) * 100}`}>
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══ HOW IT WORKS — Steps ═══ */}
      <section id="how-it-works" className="relative z-10 max-w-5xl mx-auto px-6 lg:px-10 py-24">
        {/* Decorative line */}
        <div className="absolute left-1/2 top-24 bottom-24 w-px bg-gradient-to-b from-transparent via-border to-transparent hidden lg:block" />

        <div className="text-center mb-16">
          <p className="text-xs font-medium text-cyan-glow uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
            Simple. Secure. <span className="text-muted-foreground">Seamless.</span>
          </h2>
        </div>

        <div className="grid gap-12 lg:gap-16">
          {[
            {
              step: "01",
              title: "Enter the vault",
              description: "Access your encrypted workspace instantly. No sign-up friction — try the demo or create a real account.",
              icon: Fingerprint,
              color: "cyan-glow",
            },
            {
              step: "02",
              title: "Store your secrets",
              description: "Add passwords, documents, notes. Everything is encrypted with AES-256-GCM before it ever leaves your device.",
              icon: Lock,
              color: "violet-400",
            },
            {
              step: "03",
              title: "Set your safety net",
              description: "Configure emergency contacts and the dead-man switch. If something happens, your people are prepared.",
              icon: Shield,
              color: "emerald-400",
            },
            {
              step: "04",
              title: "Live with peace of mind",
              description: "Check in periodically. Your digital legacy is secure, organized, and ready — whenever it's needed.",
              icon: Star,
              color: "amber-400",
            },
          ].map((item, idx) => (
            <div key={item.step} className={`flex items-start gap-6 lg:gap-10 animate-in opacity-0 delay-${(idx + 1) * 100}`}>
              <div className="shrink-0">
                <div className={`w-14 h-14 rounded-2xl bg-${item.color}/10 border border-${item.color}/20 flex items-center justify-center text-${item.color} float`}>
                  <item.icon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <span className={`text-xs font-mono text-${item.color} mb-1 block`}>{item.step}</span>
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ═══ STATS SECTION ═══ */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="rounded-3xl glass-strong p-10 lg:p-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "256", suffix: "-bit", label: "Encryption standard" },
              { value: "0", suffix: "", label: "Data we can read" },
              { value: "100", suffix: "%", label: "Client-side encrypted" },
              { value: "24/7", suffix: "", label: "Dead-man monitoring" },
            ].map((stat, i) => (
              <div key={stat.label} className={`text-center animate-in opacity-0 delay-${(i + 1) * 100}`}>
                <p className="text-3xl lg:text-4xl font-bold text-gradient">
                  {stat.value}<span className="text-lg">{stat.suffix}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══ PRICING ═══ */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 lg:px-10 py-24">
        <div className="text-center mb-14">
          <p className="text-xs font-medium text-cyan-glow uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
            Start free. <span className="text-muted-foreground">Scale when ready.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Free */}
          <div className="p-8 rounded-3xl glass glass-hover animate-in opacity-0 delay-100">
            <h3 className="text-lg font-semibold">Free</h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-sm text-muted-foreground">/forever</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Perfect for getting started</p>
            <ul className="mt-6 space-y-3">
              {["5 vault items", "1 emergency contact", "1 scheduled message", "Basic dead-man switch", "50 MB storage"].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Check className="w-3.5 h-3.5 text-cyan-glow shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={handleDemoAccess}
              className="mt-8 w-full py-3 rounded-xl glass glass-hover text-sm font-medium text-center"
            >
              Try Free
            </button>
          </div>

          {/* Pro */}
          <div className="p-8 rounded-3xl glass glow-border relative animate-in opacity-0 delay-200">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-cyan-glow text-navy-950 text-[10px] font-semibold uppercase tracking-wider">
              Recommended
            </div>
            <h3 className="text-lg font-semibold">Pro</h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-bold">$9</span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Full digital legacy protection</p>
            <ul className="mt-6 space-y-3">
              {["Unlimited vault items", "Unlimited contacts & messages", "Encrypted file/video upload", "Advanced dead-man switch", "10 GB storage", "Family sharing", "Encrypted archive export"].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Check className="w-3.5 h-3.5 text-cyan-glow shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={handleDemoAccess}
              className="mt-8 w-full py-3 rounded-xl bg-cyan-glow text-navy-950 text-sm font-medium hover:bg-cyan-soft transition-all shadow-glow"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>


      {/* ═══ FINAL CTA ═══ */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 py-24 text-center">
        <div className="rounded-3xl glass-strong p-12 lg:p-16 relative overflow-hidden">
          {/* Animated glow */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-cyan-glow/10 blur-[80px] pulse-glow" />
          </div>
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-cyan-glow/10 border border-cyan-glow/20 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-7 h-7 text-cyan-glow" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight mb-3">
              Your secrets deserve protection
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-8">
              Don&apos;t leave your digital life unprotected. Start exploring Secretly now — no sign-up required.
            </p>
            <button
              onClick={handleDemoAccess}
              disabled={demoLoading}
              className="group inline-flex items-center gap-2.5 px-8 py-4 text-sm font-semibold rounded-2xl bg-cyan-glow text-navy-950 hover:bg-cyan-soft transition-all shadow-glow hover:shadow-glow-lg disabled:opacity-70"
            >
              {demoLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Fingerprint className="w-5 h-5" />
              )}
              Enter Secretly — Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-10 border-t border-border/50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-cyan-glow/10 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-cyan-glow" />
            </div>
            <span className="text-sm font-medium">Secretly</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <span>Privacy-first</span>
            <span className="w-px h-3 bg-border" />
            <span>Open source</span>
            <span className="w-px h-3 bg-border" />
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
