"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useCmsPage<T>(apiPath: string, mergeDefaults?: (data: T) => T) {
  const [content, setContent] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiPath);
      const data = await res.json();
      setContent(mergeDefaults ? mergeDefaults(data) : data);
    } catch {
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  }, [apiPath, mergeDefaults]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const save = async () => {
    if (!content) return;
    setSaving(true);
    try {
      const res = await fetch(apiPath, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        toast.success("Saved");
      } else {
        toast.error("Save failed");
      }
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return { content, setContent, loading, saving, save };
}
