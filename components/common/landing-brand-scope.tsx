"use client";

import type { CSSProperties, ReactNode } from "react";
import type { LandingPageBranding } from "@/types/landing-page";
import { DEFAULT_LANDING_BRANDING } from "@/types/landing-page";

function darkenHex(hex: string, amount = 0.12): string {
  const raw = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(raw)) return hex;
  const n = parseInt(raw, 16);
  const r = Math.max(0, Math.round(((n >> 16) & 255) * (1 - amount)));
  const g = Math.max(0, Math.round(((n >> 8) & 255) * (1 - amount)));
  const b = Math.max(0, Math.round((n & 255) * (1 - amount)));
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

/** Applies landing CMS primary/secondary colors as CSS variables for the page. */
export function LandingBrandScope({
  branding,
  children,
}: {
  branding?: LandingPageBranding | null;
  children: ReactNode;
}) {
  const primary =
    branding?.primaryColor?.trim() || DEFAULT_LANDING_BRANDING.primaryColor!;
  const secondary =
    branding?.secondaryColor?.trim() || DEFAULT_LANDING_BRANDING.secondaryColor!;

  const style = {
    "--lp-primary": primary,
    "--lp-secondary": secondary,
    "--lp-secondary-dark": darkenHex(secondary),
    "--keil-navy": primary,
    "--keil-red": secondary,
    "--keil-red-dark": darkenHex(secondary),
    "--keil-green": secondary,
    "--keil-green-dark": darkenHex(secondary),
  } as CSSProperties;

  return (
    <div className="lp-brand-scope" style={style}>
      {children}
    </div>
  );
}
