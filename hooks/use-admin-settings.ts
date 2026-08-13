"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useAdminSettings() {
  const [settings, setSettings] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) throw new Error("Failed to load settings");
      setSettings(await res.json());
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (partial: Record<string, unknown>) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, ...partial }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const updated = await res.json();
      setSettings(updated);
      toast.success("Saved successfully");
      return updated;
    } catch {
      toast.error("Failed to save settings");
      return null;
    } finally {
      setSaving(false);
    }
  };

  return { settings, setSettings, loading, saving, save, reload: load };
}
