"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Category } from "@/types";
import { asArray } from "@/lib/utils";
import { usePageHero } from "@/hooks/use-public-settings";
import { PLACEHOLDER_HERO, PLACEHOLDER_PRODUCT } from "@/lib/content/default-content";
import { ScrollReveal } from "@/components/common/scroll-reveal";

export function ProductsPreview() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { hero } = usePageHero("products");

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(asArray<Category>(data)))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 h-64 bg-gray-100 animate-pulse rounded-lg" />
      </section>
    );
  }

  if (categories.length === 0) return null;

  const bgStyle = hero?.backgroundImage
    ? {
        backgroundImage: `url(${hero.backgroundImage})`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center" as const,
      }
    : { backgroundColor: "var(--color-primary, #5d7aa7)" };

  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0" style={bgStyle} />

      <div className="container relative z-10 mx-auto px-4">
        <ScrollReveal variant="fade">
          <div className="mb-16 text-center">
            <h2 className="text-[42px] font-bold text-white">{hero?.title || "Products"}</h2>
          </div>
        </ScrollReveal>

        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <ScrollReveal key={category.id} delay={index * 100} variant="scale">
              <Link
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="group block overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-2xl"
              >
                <div className="flex h-[200px] items-center justify-center bg-white p-8">
                  <img
                    src={category.image || PLACEHOLDER_PRODUCT}
                    alt={category.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PLACEHOLDER_PRODUCT;
                    }}
                  />
                </div>
                <div className="border-t border-gray-100 px-4 py-5 text-center">
                  <h3 className="text-lg font-bold text-[#3b5998]">{category.name}</h3>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={categories.length * 80}>
          <div className="text-center">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-2 border-white bg-transparent px-10 py-6 text-white hover:bg-white hover:text-[#5d7aa7]"
            >
              <Link href="/products">View all products</Link>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
