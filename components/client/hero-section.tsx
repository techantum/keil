"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  defaultHomePageContent,
  withDefault,
} from "@/lib/content/default-content";
import type { HeroMediaType } from "@/types";
import { HeroMedia } from "@/components/client/hero-media";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { ContentHeading } from "@/components/common/content-heading";
import { isSectionEnabled } from "@/lib/cms/section-utils";

const DEFAULT_HERO = defaultHomePageContent().hero;

export function HeroSection() {
  const [content, setContent] = useState(DEFAULT_HERO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content/home")
      .then((res) => res.json())
      .then((data) => {
        const hero = data?.hero;
        if (hero && isSectionEnabled(hero)) {
          setContent({
            title: withDefault(hero.title, DEFAULT_HERO.title),
            titleTag: hero.titleTag || DEFAULT_HERO.titleTag || "h1",
            description: withDefault(hero.description, DEFAULT_HERO.description),
            descriptionTag: hero.descriptionTag || DEFAULT_HERO.descriptionTag || "p",
            primaryButtonText: withDefault(hero.primaryButtonText, DEFAULT_HERO.primaryButtonText),
            primaryButtonLink: withDefault(hero.primaryButtonLink, DEFAULT_HERO.primaryButtonLink),
            secondaryButtonText: withDefault(hero.secondaryButtonText, DEFAULT_HERO.secondaryButtonText),
            secondaryButtonLink: withDefault(hero.secondaryButtonLink, DEFAULT_HERO.secondaryButtonLink),
            mediaType: (hero.mediaType as HeroMediaType) || DEFAULT_HERO.mediaType || "image",
            backgroundImage: withDefault(hero.backgroundImage, DEFAULT_HERO.backgroundImage),
            backgroundVideo: hero.backgroundVideo || DEFAULT_HERO.backgroundVideo || "",
            carouselImages: hero.carouselImages?.length
              ? hero.carouselImages
              : DEFAULT_HERO.carouselImages || [],
            enabled: hero.enabled,
          });
        } else if (hero && !isSectionEnabled(hero)) {
          setContent({ ...DEFAULT_HERO, enabled: false });
        }
      })
      .catch(() => setContent(DEFAULT_HERO))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-gray-200 animate-pulse hero-section-height" />
    );
  }

  if (!isSectionEnabled(content)) return null;

  const mediaType = content.mediaType || "image";

  return (
    <section className="relative flex items-center overflow-hidden hero-enter hero-section-height">
      <HeroMedia
        mediaType={mediaType}
        backgroundImage={content.backgroundImage}
        backgroundVideo={content.backgroundVideo}
        carouselImages={content.carouselImages}
        alt={content.title}
      />

      <div className="container relative mx-auto w-full px-4 py-10 md:py-12">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal className="space-y-8">
            <div className="space-y-4">
              <ContentHeading
                tag={content.titleTag || "h1"}
                className="color-blue-kk text-white drop-shadow-md"
              >
                {content.title}
              </ContentHeading>
              <ContentHeading
                tag={content.descriptionTag || "p"}
                className="text-pretty color-gray-kk max-w-lg text-white/90 drop-shadow"
              >
                {content.description}
              </ContentHeading>
            </div>

            <div className="flex flex-wrap gap-4">
              {content.primaryButtonLink && content.primaryButtonText && (
                <Button asChild size="md" variant="filled">
                  <Link href={content.primaryButtonLink}>{content.primaryButtonText}</Link>
                </Button>
              )}
              {content.secondaryButtonLink && content.secondaryButtonText && (
                <Button
                  asChild
                  size="md"
                  variant="filled"
                  className="bg-black/70 text-white hover:bg-black/100"
                >
                  <Link href={content.secondaryButtonLink}>{content.secondaryButtonText}</Link>
                </Button>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
