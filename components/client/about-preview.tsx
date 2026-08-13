"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { HomePageContent } from "@/types";
import {
  defaultHomePageContent,
  PLACEHOLDER_IMAGE,
  withDefault,
} from "@/lib/content/default-content";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { ContentHeading } from "@/components/common/content-heading";
import { isSectionEnabled } from "@/lib/cms/section-utils";

const DEFAULT_PREVIEW = defaultHomePageContent().aboutPreview;

export function AboutPreview() {
  const [content, setContent] = useState(DEFAULT_PREVIEW);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content/home")
      .then((res) => res.json())
      .then((data: HomePageContent) => {
        const preview = data?.aboutPreview;
        if (preview && isSectionEnabled(preview)) {
          setContent({
            badge: withDefault(preview.badge, DEFAULT_PREVIEW.badge),
            badgeTag: preview.badgeTag || DEFAULT_PREVIEW.badgeTag || "p",
            title: withDefault(preview.title, DEFAULT_PREVIEW.title),
            titleTag: preview.titleTag || DEFAULT_PREVIEW.titleTag || "h2",
            description: withDefault(preview.description, DEFAULT_PREVIEW.description),
            descriptionTag: preview.descriptionTag || DEFAULT_PREVIEW.descriptionTag || "p",
            image: withDefault(preview.image, DEFAULT_PREVIEW.image || PLACEHOLDER_IMAGE),
            features: preview.features?.length ? preview.features : DEFAULT_PREVIEW.features,
            primaryButtonText: withDefault(preview.primaryButtonText, DEFAULT_PREVIEW.primaryButtonText),
            secondaryButtonText: withDefault(preview.secondaryButtonText, DEFAULT_PREVIEW.secondaryButtonText),
            enabled: preview.enabled,
          });
        } else if (preview && !isSectionEnabled(preview)) {
          setContent({ ...DEFAULT_PREVIEW, enabled: false });
        }
      })
      .catch(() => setContent(DEFAULT_PREVIEW))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 h-64 bg-gray-100 animate-pulse rounded-lg" />
      </section>
    );
  }

  if (!isSectionEnabled(content)) return null;

  const imageSrc = content.image || PLACEHOLDER_IMAGE;

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <ScrollReveal variant="left">
            <div>
              <Image
                src={imageSrc}
                alt={content.badge || content.title}
                width={1200}
                height={400}
                className="w-full h-auto rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                }}
              />
            </div>
          </ScrollReveal>
          <ScrollReveal variant="right" delay={120}>
            <div>
              <ContentHeading tag={content.badgeTag || "p"} className="color-blue-kk">
                {content.badge}
              </ContentHeading>
              <ContentHeading tag={content.titleTag || "h2"} className="color-black pt-2">
                {content.title}
              </ContentHeading>
              <ContentHeading tag={content.descriptionTag || "p"} className="color-gray-kk pt-3">
                {content.description}
              </ContentHeading>
              <div className="flex gap-4 pt-4">
                <Button asChild className="rounded-full px-8 text-white bg-color-blue-kk">
                  <Link href="/about">{content.primaryButtonText}</Link>
                </Button>
                <Button asChild className="rounded-full px-8 text-white bg-color-orange-kk">
                  <Link href="/contact">{content.secondaryButtonText}</Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
