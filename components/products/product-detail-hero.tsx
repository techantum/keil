"use client";

import Image from "next/image";
import { usePageHero } from "@/hooks/use-public-settings";

export function ProductDetailHero() {
  const { hero, loading } = usePageHero("products");

  if (loading) {
    return <section className="relative h-[300px] w-full bg-gray-200 animate-pulse" />;
  }

  if (!hero?.backgroundImage && !hero?.title) return null;

  return (
    <section
      className="relative h-[300px] w-full overflow-hidden"
      style={{
        backgroundColor: hero.backgroundImage ? undefined : "var(--color-secondary, #f3f4f6)",
      }}
    >
      {hero.backgroundImage && (
        <Image src={hero.backgroundImage} alt={hero.title || "Products"} fill className="object-cover" priority />
      )}
      {hero.title && (
        <div className="relative z-10 flex h-full items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-normal text-foreground md:text-4xl">{hero.title}</h1>
          </div>
        </div>
      )}
    </section>
  );
}
