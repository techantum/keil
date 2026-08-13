"use client";

import { useEffect, useState } from "react";
import { mergeHomeContent } from "@/lib/cms/merge-content";
import { defaultHomePageContent } from "@/lib/content/default-content";
import type { HomePageContent } from "@/types";

export function useHomeContent() {
  const [content, setContent] = useState<HomePageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content/home")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setContent(mergeHomeContent(data as Partial<HomePageContent>));
        } else {
          setContent(defaultHomePageContent());
        }
      })
      .catch(() => setContent(defaultHomePageContent()))
      .finally(() => setLoading(false));
  }, []);

  return { content, loading };
}
