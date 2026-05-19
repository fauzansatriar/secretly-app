"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  User,
  Crown,
  Shield,
  Loader2,
  Check,
  LogOut,
  Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { clearSessionKey } from "@/lib/crypto/encryption";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/lib/types";

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data as Profile);
        setFullName(data.full_name || "");
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);

    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", profile.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleLogout() {
    const supabase = createClient();
    clearSessionKey();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  async function handleDeleteAccount() {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action is irreversible and all your data will be permanently destroyed."
      )
    )
      return;

    if (
      !confirm(
        "This will delete all your vault items, contacts, messages, and settings. Type DELETE to confirm."
      )
    )
      return;

    // Note: In production, account deletion would be handled via a server action
    // or edge function with service_role key to delete from auth.users
    alert(
      "Account deletion request submitted. In production, this would trigger a server-side deletion process."
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-muted-foreground" />
          Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account and preferences.
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-cyan-glow/10 flex items-center justify-center">
              <User className="w-5 h-5 text-cyan-glow" />
            </div>
            <div>
              <h3 className="font-semibold">Profile</h3>
              <p className="text-xs text-muted-foreground">
                Your personal information
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={profile?.email || ""}
                disabled
                className="opacity-60"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <Button type="submit" disabled={saving} className="gap-2">
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saved ? (
                <Check className="w-4 h-4" />
              ) : null}
              {saved ? "Saved!" : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Plan */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold">Subscription</h3>
                <p className="text-xs text-muted-foreground">
                  Manage your plan
                </p>
              </div>
            </div>
            <Badge variant={profile?.plan === "pro" ? "default" : "secondary"}>
              {profile?.plan === "pro" ? "Pro" : "Free Plan"}
            </Badge>
          </div>

          {profile?.plan === "free" ? (
            <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-glow/5 to-transparent border border-cyan-glow/10">
              <h4 className="font-medium text-sm mb-2">Upgrade to Pro</h4>
              <ul className="space-y-1.5 text-xs text-muted-foreground mb-4">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-cyan-glow" />
                  Unlimited vault items & messages
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-cyan-glow" />
                  Encrypted file/video upload
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-cyan-glow" />
                  Advanced dead-man switch settings
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-cyan-glow" />
                  Family sharing & archive export
                </li>
              </ul>
              <Button size="sm" className="gap-2">
                <Crown className="w-3.5 h-3.5" />
                Upgrade — $9/month
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              You&apos;re on the Pro plan. Thank you for supporting Secretly!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold">Security</h3>
              <p className="text-xs text-muted-foreground">
                Encryption and session management
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border">
              <div>
                <p className="text-sm font-medium">Encryption</p>
                <p className="text-xs text-muted-foreground">
                  AES-256-GCM client-side encryption
                </p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border">
              <div>
                <p className="text-sm font-medium">Session Key</p>
                <p className="text-xs text-muted-foreground">
                  Stored in sessionStorage (cleared on tab close)
                </p>
              </div>
              <Badge variant="success">Secure</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardContent>
          <h3 className="font-semibold text-destructive mb-4">Danger Zone</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Sign Out</p>
                <p className="text-xs text-muted-foreground">
                  Sign out and clear your session key
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </Button>
            </div>
            <div className="border-t border-border" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Delete Account</p>
                <p className="text-xs text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteAccount}
                className="gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
