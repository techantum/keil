"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/types";
import { asArray } from "@/lib/utils";
import { PLACEHOLDER_IMAGE } from "@/lib/content/default-content";
import { ScrollReveal } from "@/components/common/scroll-reveal";

export function GalleryGrid() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => setItems(asArray<GalleryItem>(data)))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-[#141570]" />
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">No gallery items available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-20">
      <ScrollReveal>
        <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="relative aspect-square">
                <Image
                  src={item.image || PLACEHOLDER_IMAGE}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-[#E67E22]">{item.name}</h3>
                {item.category && <p className="mt-1 text-sm text-gray-500">{item.category}</p>}
              </div>
            </div>
          ))}
        </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
