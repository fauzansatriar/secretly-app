"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AlertTriangle,
  Activity,
  Clock,
  Shield,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Settings,
  Bell,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { DeadmanStatus } from "@/lib/types";
import { formatDateTime, timeUntil } from "@/lib/utils";

export default function DeadmanPage() {
  const [status, setStatus] = useState<DeadmanStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Settings form
  const [intervalDays, setIntervalDays] = useState(30);
  const [gracePeriod, setGracePeriod] = useState(48);
  const [alertContacts, setAlertContacts] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadStatus = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("deadman_status")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setStatus(data as DeadmanStatus);
      setIntervalDays(data.check_in_interval_days);
      setGracePeriod(data.grace_period_hours);
      setAlertContacts(data.alert_contacts);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  async function handleActivate() {
    setSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const now = new Date();
    const nextDeadline = new Date(
      now.getTime() + intervalDays * 24 * 60 * 60 * 1000
    );

    if (status) {
      await supabase
        .from("deadman_status")
        .update({
          is_active: true,
          check_in_interval_days: intervalDays,
          grace_period_hours: gracePeriod,
          alert_contacts: alertContacts,
          last_check_in: now.toISOString(),
          next_deadline: nextDeadline.toISOString(),
        })
        .eq("id", status.id);
    } else {
      await supabase.from("deadman_status").insert({
        user_id: user.id,
        is_active: true,
        check_in_interval_days: intervalDays,
        grace_period_hours: gracePeriod,
        alert_contacts: alertContacts,
        last_check_in: now.toISOString(),
        next_deadline: nextDeadline.toISOString(),
      });
    }

    setSaving(false);
    setShowSettings(false);
    loadStatus();
  }

  async function handleDeactivate() {
    if (!status) return;
    if (!confirm("Are you sure you want to deactivate the dead-man switch?"))
      return;

    const supabase = createClient();
    await supabase
      .from("deadman_status")
      .update({ is_active: false })
      .eq("id", status.id);
    loadStatus();
  }

  async function handleCheckIn() {
    if (!status) return;
    setChecking(true);

    const supabase = createClient();
    const now = new Date();
    const nextDeadline = new Date(
      now.getTime() + status.check_in_interval_days * 24 * 60 * 60 * 1000
    );

    await supabase
      .from("deadman_status")
      .update({
        last_check_in: now.toISOString(),
        next_deadline: nextDeadline.toISOString(),
      })
      .eq("id", status.id);

    setChecking(false);
    loadStatus();
  }

  async function handleSaveSettings() {
    if (!status) return;
    setSaving(true);

    const supabase = createClient();
    const now = new Date();
    const nextDeadline = new Date(
      now.getTime() + intervalDays * 24 * 60 * 60 * 1000
    );

    await supabase
      .from("deadman_status")
      .update({
        check_in_interval_days: intervalDays,
        grace_period_hours: gracePeriod,
        alert_contacts: alertContacts,
        next_deadline: nextDeadline.toISOString(),
      })
      .eq("id", status.id);

    setSaving(false);
    setShowSettings(false);
    loadStatus();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isOverdue =
    status?.is_active &&
    new Date(status.next_deadline).getTime() < Date.now();

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-400" />
          Dead-Man Switch
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Automated safety check. If you don&apos;t check in, your contacts
          are notified.
        </p>
      </div>

      {/* Main Status Card */}
      <Card className={status?.is_active ? "glow-border" : ""}>
        <CardContent className="space-y-6">
          {/* Status Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  status?.is_active
                    ? isOverdue
                      ? "bg-destructive/10 text-destructive"
                      : "bg-emerald-400/10 text-emerald-400"
                    : "bg-muted/10 text-muted-foreground"
                }`}
              >
                {status?.is_active ? (
                  isOverdue ? (
                    <AlertTriangle className="w-6 h-6" />
                  ) : (
                    <Shield className="w-6 h-6" />
                  )
                ) : (
                  <Activity className="w-6 h-6" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  {status?.is_active
                    ? isOverdue
                      ? "Check-in Overdue!"
                      : "Switch Active"
                    : "Switch Inactive"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {status?.is_active
                    ? isOverdue
                      ? "You missed your check-in deadline"
                      : "Everything is fine. Check in regularly."
                    : "Enable to protect your loved ones"}
                </p>
              </div>
            </div>
            <Badge
              variant={
                status?.is_active
                  ? isOverdue
                    ? "destructive"
                    : "success"
                  : "secondary"
              }
            >
              {status?.is_active
                ? isOverdue
                  ? "Overdue"
                  : "Active"
                : "Inactive"}
            </Badge>
          </div>

          {/* Active State Content */}
          {status?.is_active && (
            <>
              {/* Timer Display */}
              <div className="p-5 rounded-xl bg-secondary/30 border border-border text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Next Check-in Deadline
                </p>
                <p
                  className={`text-2xl font-bold ${
                    isOverdue ? "text-destructive" : "text-foreground"
                  }`}
                >
                  {timeUntil(status.next_deadline)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDateTime(status.next_deadline)}
                </p>
              </div>

              {/* Check In Button */}
              <Button
                onClick={handleCheckIn}
                disabled={checking}
                className="w-full gap-2 h-12 text-base"
              >
                {checking ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
                I&apos;m OK — Check In Now
              </Button>

              {/* Info Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-secondary/30 border border-border text-center">
                  <Clock className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                  <p className="text-sm font-semibold">
                    {status.check_in_interval_days}d
                  </p>
                  <p className="text-[10px] text-muted-foreground">Interval</p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/30 border border-border text-center">
                  <RefreshCw className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                  <p className="text-sm font-semibold">
                    {status.grace_period_hours}h
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Grace Period
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/30 border border-border text-center">
                  <Bell className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                  <p className="text-sm font-semibold">
                    {status.alert_contacts ? "Yes" : "No"}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Alert Contacts
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex-1 gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleDeactivate}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  Deactivate
                </Button>
              </div>
            </>
          )}

          {/* Inactive State */}
          {!status?.is_active && !showSettings && (
            <div className="text-center py-6">
              <AlertTriangle className="w-12 h-12 text-amber-400/30 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                When enabled, the dead-man switch monitors your regular
                check-ins. If you miss a deadline plus the grace period, your
                emergency contacts will be automatically notified.
              </p>
              <Button
                onClick={() => setShowSettings(true)}
                className="gap-2"
              >
                <Shield className="w-4 h-4" />
                Enable Dead-Man Switch
              </Button>
            </div>
          )}

          {/* Settings Panel */}
          {showSettings && (
            <div className="p-5 rounded-xl bg-secondary/30 border border-border space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Settings className="w-4 h-4 text-muted-foreground" />
                Switch Settings
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Check-in Interval (days)</Label>
                  <Input
                    type="number"
                    value={intervalDays}
                    onChange={(e) =>
                      setIntervalDays(parseInt(e.target.value) || 30)
                    }
                    min={1}
                    max={365}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Grace Period (hours)</Label>
                  <Input
                    type="number"
                    value={gracePeriod}
                    onChange={(e) =>
                      setGracePeriod(parseInt(e.target.value) || 48)
                    }
                    min={1}
                    max={720}
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={alertContacts}
                  onChange={(e) => setAlertContacts(e.target.checked)}
                  className="rounded border-border bg-secondary/50 text-cyan-glow focus:ring-ring"
                />
                <div>
                  <p className="text-sm font-medium">
                    Alert emergency contacts
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Notify contacts after grace period expires
                  </p>
                </div>
              </label>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={
                    status?.is_active ? handleSaveSettings : handleActivate
                  }
                  disabled={saving}
                  className="gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {status?.is_active ? "Save Settings" : "Activate Switch"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowSettings(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* How it works */}
      <Card>
        <CardContent>
          <h3 className="font-semibold mb-4">How it works</h3>
          <div className="space-y-4">
            <Step
              number={1}
              title="Set your interval"
              description="Choose how often you want to check in (e.g., every 30 days)."
            />
            <Step
              number={2}
              title="Check in regularly"
              description="Click the check-in button before your deadline expires."
            />
            <Step
              number={3}
              title="Grace period"
              description="If you miss a check-in, a grace period starts before any action is taken."
            />
            <Step
              number={4}
              title="Contacts notified"
              description="After the grace period, your emergency contacts are automatically alerted."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-cyan-glow/10 flex items-center justify-center text-cyan-glow text-xs font-bold shrink-0">
        {number}
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
