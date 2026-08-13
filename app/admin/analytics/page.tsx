"use client";

import { useEffect, useState } from "react";
import { AdminShell, AdminCard } from "@/components/admin/admin-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState("");

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((data) => {
        setEnabled(data.enabled ?? false);
        setGoogleAnalyticsId(data.googleAnalyticsId || "");
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/analytics", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled, googleAnalyticsId }),
      });
      if (!res.ok) throw new Error();
      toast.success("Analytics settings saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminShell title="Analytics">
        <Loader2 className="h-4 w-4 animate-spin" />
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Analytics"
      description="Google Analytics 4 measurement ID for the public site."
      actions={
        <Button size="sm" className="h-8 text-xs" disabled={saving} onClick={save}>
          {saving ? "Saving..." : "Save"}
        </Button>
      }
    >
      <AdminCard title="Google Analytics">
        <div className="space-y-3 max-w-md">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Enable Google Analytics</Label>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Measurement ID (G-XXXXXXXX)</Label>
            <Input
              className="h-8 text-sm"
              placeholder="G-XXXXXXXXXX"
              value={googleAnalyticsId}
              onChange={(e) => setGoogleAnalyticsId(e.target.value)}
            />
          </div>
          <p className="text-xs text-slate-500">
            When enabled, the GA script is injected on all public pages. Leave disabled during development.
          </p>
        </div>
      </AdminCard>
    </AdminShell>
  );
}
