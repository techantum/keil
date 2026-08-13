"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { AboutPageContent } from "@/types";
import { defaultAboutPageContent, PLACEHOLDER_HERO } from "@/lib/content/default-content";

const DEFAULT_HERO = defaultAboutPageContent().hero;

export function AboutHero() {
  const [backgroundImage, setBackgroundImage] = useState(DEFAULT_HERO.backgroundImage);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content/about")
      .then((res) => res.json())
      .then((data: AboutPageContent) => {
        setBackgroundImage(data?.hero?.backgroundImage || DEFAULT_HERO.backgroundImage);
      })
      .catch(() => setBackgroundImage(DEFAULT_HERO.backgroundImage))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <section className="relative h-[400px] w-full bg-gray-200 animate-pulse md:h-[500px]" />;
  }

  const heroImage = backgroundImage || PLACEHOLDER_HERO;

  return (
    <section className="relative h-[400px] w-full md:h-[500px] hero-enter">
      <Image
        src={heroImage}
        alt="About"
        fill
        className="object-cover"
        priority
        onError={(e) => {
          (e.target as HTMLImageElement).src = PLACEHOLDER_HERO;
        }}
      />
    </section>
  );
}
