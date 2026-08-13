"use client";

import { KeilHeroBanner } from "@/components/keil/keil-hero-banner";
import { isSectionEnabled } from "@/lib/cms/section-utils";
import type { HomePageContent } from "@/types";

export function KeilHeroSection({ content }: { content: HomePageContent["hero"] }) {
  if (!isSectionEnabled(content)) return null;

  return (
    <KeilHeroBanner
      title={content.title}
      tagline={content.tagline}
      description={content.description}
      image={content.backgroundImage || "/keil/hero-ec-shed.jpg"}
      badgeText={content.badgeText}
      primaryButtonText={content.primaryButtonText}
      primaryButtonLink={content.primaryButtonLink}
      secondaryButtonText={content.secondaryButtonText}
      secondaryButtonLink={content.secondaryButtonLink}
      items={content.features}
    />
  );
}
