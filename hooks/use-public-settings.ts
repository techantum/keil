"use client";

import { useEffect, useState } from "react";
import { defaultPublicSettings, mergePageHero } from "@/lib/content/default-content";
import type { PageHero, Settings } from "@/types";

type PublicSettings = {
  company?: Settings["company"];
  branding?: Settings["branding"];
  pageHeroes?: Settings["pageHeroes"];
  seo?: Pick<Settings["seo"], "pages" | "siteName">;
};

const DEFAULTS = defaultPublicSettings();

export function usePublicSettings() {
  const [settings, setSettings] = useState<PublicSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setSettings({
            company: data.company || DEFAULTS.company,
            branding: data.branding || DEFAULTS.branding,
            pageHeroes: data.pageHeroes || DEFAULTS.pageHeroes,
            seo: {
              siteName: data.seo?.siteName || DEFAULTS.seo.siteName,
              pages: data.seo?.pages || DEFAULTS.seo.pages,
            },
          });
        }
      })
      .catch(() => setSettings(DEFAULTS))
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
}

export function usePageHero(key: keyof Settings["pageHeroes"]) {
  const { settings, loading } = usePublicSettings();
  const defaults = DEFAULTS.pageHeroes[key];
  const hero = settings?.pageHeroes?.[key] as PageHero | undefined;
  return {
    hero: mergePageHero(hero, defaults),
    loading,
  };
}
