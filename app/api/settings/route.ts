import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repo";
import { defaultPublicSettings } from "@/lib/content/default-content";
import { buildDefaultSettings, isDbConnectionError } from "@/lib/db/db-error";
import type { Settings } from "@/types";

export const dynamic = "force-dynamic";

function settingsPayload(settings: Settings) {
  const defaults = defaultPublicSettings();
  return {
    company: settings.company?.name ? settings.company : defaults.company,
    branding: {
      websiteLogo: settings.branding?.websiteLogo || defaults.branding.websiteLogo,
      navbarPhone: settings.branding?.navbarPhone || defaults.branding.navbarPhone || "",
      colors: settings.branding?.colors || defaults.branding.colors,
    },
    pageHeroes: settings.pageHeroes || defaults.pageHeroes,
    seo: {
      siteName: settings.seo?.siteName || defaults.seo.siteName,
      pages: settings.seo?.pages || defaults.seo.pages,
    },
  };
}

export async function GET() {
  try {
    const repo = getRepository();
    const settings = await repo.getSettings();

    if (!settings || settings.id === "default") {
      return NextResponse.json(settingsPayload(buildDefaultSettings()));
    }

    return NextResponse.json(settingsPayload(settings));
  } catch (error) {
    if (isDbConnectionError(error)) {
      return NextResponse.json(settingsPayload(buildDefaultSettings()));
    }
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}
