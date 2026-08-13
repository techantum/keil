"use client";

import { useEffect, useState } from "react";
import type { Service } from "@/types";
import { ServiceCard } from "@/components/services/service-card";
import { asArray } from "@/lib/utils";
import { usePageHero } from "@/hooks/use-public-settings";
import { ScrollReveal } from "@/components/common/scroll-reveal";

export function ServicesGrid() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
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
      <ScrollReveal>
        <div className="container mx-auto px-4">
        {hero?.title && (
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">{hero.title}</h2>
          </div>
        )}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
