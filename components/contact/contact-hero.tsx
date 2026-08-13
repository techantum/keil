"use client";

import { useEffect, useState } from "react";
import type { ContactPageContent } from "@/types";
import { defaultContactPageContent, PLACEHOLDER_HERO, withDefault } from "@/lib/content/default-content";
import { ScrollReveal } from "@/components/common/scroll-reveal";

const DEFAULT_HERO = defaultContactPageContent().hero;

export function ContactHero() {
  const [content, setContent] = useState(DEFAULT_HERO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content/contact")
      .then((res) => res.json())
      .then((data: ContactPageContent) => {
        const hero = data?.hero;
        if (hero) {
          setContent({
            title: withDefault(hero.title, DEFAULT_HERO.title),
            subtitle: withDefault(hero.subtitle, DEFAULT_HERO.subtitle),
            backgroundImage: withDefault(hero.backgroundImage, DEFAULT_HERO.backgroundImage),
          });
        }
      })
      .catch(() => setContent(DEFAULT_HERO))
      .finally(() => setLoading(false));
  }, []);

  const heroImage = content.backgroundImage || PLACEHOLDER_HERO;

  if (loading) {
    return (
      <section className="relative h-[400px] w-full overflow-hidden bg-gray-200 animate-pulse" />
    );
  }

  return (
    <section className="relative h-[400px] w-full overflow-hidden bg-[#0A2540] hero-enter">
      <div className="absolute inset-0">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A2540]/90 to-[#0A2540]/70" />
      </div>

      <ScrollReveal className="container relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 md:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-2 font-sans text-[42px] font-medium uppercase tracking-wide text-brand-primary">
            {content.title}
          </p>
          <h1 className="font-sans text-[42px] font-normal leading-tight text-white">
            {content.subtitle}
          </h1>
        </div>
      </ScrollReveal>
    </section>
  );
}
