"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Service } from "@/types";
import { ServiceCard } from "@/components/services/service-card";
import { asArray } from "@/lib/utils";
import { usePageHero } from "@/hooks/use-public-settings";
import { ScrollReveal } from "@/components/common/scroll-reveal";

export function ServicesPreview() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { hero } = usePageHero("services");

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => setServices(asArray<Service>(data)))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 h-64 bg-gray-100 animate-pulse rounded-lg" />
      </section>
    );
  }

  if (services.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <ScrollReveal variant="fade">
          {hero?.title && (
            <div className="text-center mb-16">
              <h2 className="text-[42px] font-bold text-black">{hero.title}</h2>
            </div>
          )}
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <div className="relative">
            <button
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? services.length - 1 : prev - 1))}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-transform duration-300 hover:scale-105"
              aria-label="Previous service"
            >
              <ChevronLeft className="w-6 h-6 text-brand-primary" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev === services.length - 1 ? 0 : prev + 1))}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-transform duration-300 hover:scale-105"
              aria-label="Next service"
            >
              <ChevronRight className="w-6 h-6 text-brand-primary" />
            </button>
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / Math.min(services.length, 3))}%)`,
                }}
              >
                {services.map((service) => (
                  <div key={service.id} className="w-full md:w-1/3 flex-shrink-0 px-4">
                    <ServiceCard service={service} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
