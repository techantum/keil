"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { AboutPageContent } from "@/types";
import { defaultAboutPageContent, PLACEHOLDER_IMAGE } from "@/lib/content/default-content";
import { ScrollReveal } from "@/components/common/scroll-reveal";

const DEFAULT_ABOUT = defaultAboutPageContent();

export function VisionMission() {
  const [content, setContent] = useState<AboutPageContent>(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content/about")
      .then((res) => res.json())
      .then((data: AboutPageContent) => {
        if (data && !data.error) {
          setContent({
            ...DEFAULT_ABOUT,
            ...data,
            vision: { ...DEFAULT_ABOUT.vision, ...data.vision },
            mission: { ...DEFAULT_ABOUT.mission, ...data.mission },
          });
        }
      })
      .catch(() => setContent(DEFAULT_ABOUT))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 h-64 bg-gray-200 animate-pulse rounded-lg" />
      </section>
    );
  }

  const { vision, mission } = content;

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: "var(--color-secondary)" }}>
      <ScrollReveal>
        <div className="container mx-auto px-4">
        <div className="mb-12">
          <div className="inline-block rounded-full border-2 border-white/30 px-4 py-2">
            <p className="text-sm font-medium uppercase tracking-wide text-white">{vision.badge}</p>
          </div>
        </div>

        <div className="mb-16 grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-3xl font-light text-white">{vision.mainHeading}</h2>
            <h3 className="text-3xl font-bold text-white md:text-4xl">{vision.visionTitle}</h3>
            <p className="leading-relaxed text-white/90">{vision.visionDescription}</p>
          </div>
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            <Image
              src={vision.visionImage || PLACEHOLDER_IMAGE}
              alt={vision.visionTitle}
              width={600}
              height={400}
              className="h-auto w-full"
            />
          </div>
        </div>

        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative order-2 overflow-hidden rounded-2xl shadow-xl md:order-1">
            <Image
              src={mission.missionImage || PLACEHOLDER_IMAGE}
              alt={mission.missionTitle}
              width={600}
              height={400}
              className="h-auto w-full"
            />
          </div>
          <div className="order-1 space-y-6 md:order-2">
            <h3 className="text-3xl font-bold text-white md:text-4xl">{mission.missionTitle}</h3>
            <p className="leading-relaxed text-white/90">{mission.missionDescription}</p>
          </div>
        </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
