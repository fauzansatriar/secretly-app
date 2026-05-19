import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Users,
  Mail,
  AlertTriangle,
  ChevronRight,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLAN_LIMITS } from "@/lib/types";
import { timeUntil } from "@/lib/utils";
import {
  DEMO_PROFILE,
  DEMO_VAULT_ITEMS,
  DEMO_CONTACTS,
  DEMO_MESSAGES,
  DEMO_DEADMAN,
} from "@/lib/demo-data";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get("demo_mode")?.value === "true";

  let plan: "free" | "pro";
  let vaultCount: number;
  let contactsCount: number;
  let messagesCount: number;
  let deadman: any;

  if (isDemoMode) {
    plan = DEMO_PROFILE.plan;
    vaultCount = DEMO_VAULT_ITEMS.length;
    contactsCount = DEMO_CONTACTS.length;
    messagesCount = DEMO_MESSAGES.filter((m) => m.status === "pending").length;
    deadman = DEMO_DEADMAN;
  } else {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const [profileRes, vaultRes, contactsRes, messagesRes, deadmanRes] =
      await Promise.all([
        supabase.from("profiles").select("plan").eq("id", user.id).single(),
        supabase
          .from("vault_items")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("emergency_contacts")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("scheduled_messages")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("status", "pending"),
        supabase
          .from("deadman_status")
          .select("*")
          .eq("user_id", user.id)
          .single(),
      ]);

    plan = (profileRes.data?.plan || "free") as "free" | "pro";
    vaultCount = vaultRes.count || 0;
    contactsCount = contactsRes.count || 0;
    messagesCount = messagesRes.count || 0;
    deadman = deadmanRes.data;
  }

  const limits = PLAN_LIMITS[plan];

  const stats = [
    {
      label: "Vault Items",
      value: vaultCount,
      limit: limits.vault_items === Infinity ? null : limits.vault_items,
      icon: Lock,
      href: "/vault",
      color: "text-cyan-glow",
      bgColor: "bg-cyan-glow/10",
    },
    {
      label: "Emergency Contacts",
      value: contactsCount,
      limit:
        limits.emergency_contacts === Infinity
          ? null
          : limits.emergency_contacts,
      icon: Users,
      href: "/contacts",
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
    },
    {
      label: "Pending Messages",
      value: messagesCount,
      limit:
        limits.scheduled_messages === Infinity
          ? null
          : limits.scheduled_messages,
      icon: Mail,
      href: "/messages",
      color: "text-violet-400",
      bgColor: "bg-violet-400/10",
    },
    {
      label: "Dead-Man Switch",
      value: deadman?.is_active ? "Active" : "Inactive",
      limit: null,
      icon: AlertTriangle,
      href: "/deadman",
      color: deadman?.is_active ? "text-amber-400" : "text-muted-foreground",
      bgColor: deadman?.is_active ? "bg-amber-400/10" : "bg-muted/10",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          {isDemoMode
            ? "Exploring Secretly with demo data. Everything you see is sample content."
            : "Your digital legacy at a glance. Everything encrypted, everything secure."}
        </p>
      </div>

      {/* Demo Banner */}
      {isDemoMode && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-cyan-glow/5 border border-violet-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <Activity className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-medium">You&apos;re in Demo Mode</p>
              <p className="text-xs text-muted-foreground">
                This is sample data. Create an account to store your own encrypted secrets.
              </p>
            </div>
          </div>
          <Link
            href="/signup"
            className="shrink-0 px-4 py-2 rounded-lg bg-cyan-glow text-navy-950 text-xs font-medium hover:bg-cyan-soft transition-all shadow-glow"
          >
            Sign Up Free
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="group hover:border-white/[0.1] transition-all cursor-pointer">
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl ${stat.bgColor} flex items-center justify-center ${stat.color} group-hover:shadow-glow transition-shadow`}
                  >
                    <stat.icon className="w-4.5 h-4.5" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  {stat.limit && (
                    <Badge variant="secondary" className="text-[10px]">
                      {stat.value}/{stat.limit}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Status Cards */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Security Status */}
        <Card>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold">Security Status</h3>
                <p className="text-xs text-muted-foreground">
                  All systems operational
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <StatusRow label="End-to-end encryption" status="active" />
              <StatusRow label="Zero-knowledge architecture" status="active" />
              <StatusRow label="Row-level security" status="active" />
              <StatusRow
                label="Dead-man switch"
                status={deadman?.is_active ? "active" : "inactive"}
              />
            </div>
          </CardContent>
        </Card>

        {/* Activity / Dead-man Switch Status */}
        <Card>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold">Check-in Status</h3>
                <p className="text-xs text-muted-foreground">
                  {deadman?.is_active
                    ? "Monitoring active"
                    : "Switch not enabled"}
                </p>
              </div>
            </div>
            {deadman?.is_active ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Next deadline</span>
                  <span className="font-medium">
                    {timeUntil(deadman.next_deadline)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Interval</span>
                  <span className="font-medium">
                    Every {deadman.check_in_interval_days} days
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Grace period</span>
                  <span className="font-medium">
                    {deadman.grace_period_hours} hours
                  </span>
                </div>
                <Link
                  href="/deadman"
                  className="inline-flex items-center gap-1 mt-2 text-xs text-cyan-glow hover:text-cyan-soft transition-colors"
                >
                  Check in now
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-3">
                  Enable the dead-man switch to protect your loved ones
                </p>
                <Link
                  href="/deadman"
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-amber-400/10 text-amber-400 text-xs font-medium hover:bg-amber-400/20 transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Set Up Switch
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatusRow({
  label,
  status,
}: {
  label: string;
  status: "active" | "inactive";
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Badge variant={status === "active" ? "success" : "secondary"}>
        {status === "active" ? "Active" : "Inactive"}
      </Badge>
    </div>
  );
}
