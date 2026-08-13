"use client";

import { PLACEHOLDER_HERO } from "@/lib/content/default-content";
import { ScrollReveal } from "@/components/common/scroll-reveal";

interface PageHeroProps {
  backgroundImage?: string;
  title?: string;
  alt?: string;
}

export function PageHero({ backgroundImage, title, alt }: PageHeroProps) {
  const heroImage = backgroundImage || PLACEHOLDER_HERO;
  const heroTitle = title || "";

  return (
    <section className="relative h-[400px] bg-gray-200 hero-enter">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt={alt || heroTitle || "Page hero"}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = PLACEHOLDER_HERO;
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      {heroTitle ? (
        <ScrollReveal className="relative container mx-auto flex h-full items-center justify-center px-4">
          <h1 className="text-5xl font-bold uppercase tracking-wider text-white md:text-6xl">
            {heroTitle}
          </h1>
        </ScrollReveal>
      ) : null}
    </section>
  );
}
