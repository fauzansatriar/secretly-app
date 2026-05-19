import Link from "next/link";
import {
  Shield,
  Lock,
  Clock,
  Users,
  AlertTriangle,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid opacity-30" />
      <div className="fixed inset-0 bg-grid-fade" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-cyan-glow/5 rounded-full blur-[120px]" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Shield className="w-7 h-7 text-cyan-glow" />
          <span className="text-xl font-semibold tracking-tight">Secretly</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/20 hover:bg-cyan-glow/20 transition-all"
          >
            Get Started
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6">
        <section className="pt-24 pb-20 text-center">
          <div className="animate-in opacity-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-muted-foreground mb-8">
              <Sparkles className="w-3.5 h-3.5 text-cyan-glow" />
              <span>End-to-end encrypted. Zero-knowledge architecture.</span>
            </div>
          </div>

          <h1 className="animate-in opacity-0 delay-100 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Your secrets deserve
            <br />
            <span className="text-gradient">a better future</span>
          </h1>

          <p className="animate-in opacity-0 delay-200 mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Secretly is a secure digital legacy platform. Store encrypted
            information, schedule future messages, and ensure your loved ones are
            never left without answers.
          </p>

          <div className="animate-in opacity-0 delay-300 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl bg-cyan-glow text-navy-950 hover:bg-cyan-soft transition-all shadow-glow"
            >
              Start Securing Your Legacy
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl glass glass-hover"
            >
              Learn More
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">
              Everything you need for digital peace of mind
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Military-grade encryption meets thoughtful design. Every feature
              built with your privacy as the foundation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <FeatureCard
              icon={<Lock className="w-5 h-5" />}
              title="Encrypted Vault"
              description="Store passwords, documents, and secrets with AES-256-GCM encryption. Only you hold the key."
            />
            <FeatureCard
              icon={<Clock className="w-5 h-5" />}
              title="Scheduled Messages"
              description="Write messages to be delivered in the future. Letters to loved ones, on your terms."
            />
            <FeatureCard
              icon={<Users className="w-5 h-5" />}
              title="Emergency Contacts"
              description="Designate trusted people who can access your information when it matters most."
            />
            <FeatureCard
              icon={<AlertTriangle className="w-5 h-5" />}
              title="Dead-Man Switch"
              description="Automated check-in system. If you don't respond, your contacts are notified."
            />
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="mt-3 text-muted-foreground">
              Start free. Upgrade when you need more.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <PricingCard
              plan="Free"
              price="$0"
              features={[
                "5 vault items",
                "1 emergency contact",
                "1 scheduled message",
                "Basic dead-man switch",
                "50 MB storage",
              ]}
            />
            <PricingCard
              plan="Pro"
              price="$9"
              period="/month"
              featured
              features={[
                "Unlimited vault items",
                "Unlimited contacts & messages",
                "Encrypted file/video upload",
                "Advanced dead-man switch",
                "10 GB storage",
                "Family sharing",
                "Encrypted archive export",
              ]}
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-glow" />
              <span className="text-sm font-medium">Secretly</span>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Secretly. Your secrets, your
              legacy, your control.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group p-6 rounded-2xl glass glass-hover">
      <div className="w-10 h-10 rounded-xl bg-cyan-glow/10 flex items-center justify-center text-cyan-glow mb-4 group-hover:shadow-glow transition-shadow">
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function PricingCard({
  plan,
  price,
  period,
  features,
  featured,
}: {
  plan: string;
  price: string;
  period?: string;
  features: string[];
  featured?: boolean;
}) {
  return (
    <div
      className={`p-8 rounded-2xl ${
        featured ? "glow-border glass" : "glass"
      } relative`}
    >
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-cyan-glow text-navy-950 text-xs font-medium">
          Most Popular
        </div>
      )}
      <h3 className="text-lg font-semibold">{plan}</h3>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-4xl font-bold">{price}</span>
        {period && (
          <span className="text-sm text-muted-foreground">{period}</span>
        )}
      </div>
      <ul className="mt-6 space-y-3">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-glow" />
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href="/signup"
        className={`mt-8 block text-center py-2.5 rounded-xl text-sm font-medium transition-all ${
          featured
            ? "bg-cyan-glow text-navy-950 hover:bg-cyan-soft shadow-glow"
            : "glass glass-hover"
        }`}
      >
        {featured ? "Upgrade to Pro" : "Get Started Free"}
      </Link>
    </div>
  );
}
