"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { AboutPageContent } from "@/types";
import { defaultAboutPageContent, DEFAULT_NAV_LABELS, PLACEHOLDER_IMAGE } from "@/lib/content/default-content";
import { ScrollReveal } from "@/components/common/scroll-reveal";

const DEFAULT_WHY = defaultAboutPageContent().whyUs;

export function WhyLabrix() {
  const [whyUs, setWhyUs] = useState(DEFAULT_WHY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content/about")
      .then((res) => res.json())
      .then((data: AboutPageContent) => {
        if (data?.whyUs) {
          setWhyUs({ ...DEFAULT_WHY, ...data.whyUs });
        }
      })
      .catch(() => setWhyUs(DEFAULT_WHY))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 h-64 bg-gray-100 animate-pulse rounded-lg" />
      </section>
    );
  }

  return (
    <section className="bg-white py-16 md:py-24">
      <ScrollReveal>
        <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <span className="inline-block rounded-full border-2 border-[var(--color-primary)] px-6 py-2 text-sm font-medium uppercase tracking-wide text-[var(--color-primary)]">
              {whyUs.badge}
            </span>
            <h2 className="text-3xl font-light">{whyUs.title}</h2>
            <p className="leading-relaxed text-gray-600">{whyUs.description}</p>
            {whyUs.features?.length > 0 && (
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {whyUs.features.map((feature, index) => (
                  <div key={index} className="text-center">
                    {feature.icon && (
                      <div className="mb-4 flex justify-center">
                        <Image src={feature.icon} alt={feature.title} width={48} height={48} className="h-12 w-12 object-contain" />
                      </div>
                    )}
                    <h3 className="mb-2 text-lg font-semibold text-[var(--color-primary)]">{feature.title}</h3>
                    {feature.description && <p className="text-sm text-gray-600">{feature.description}</p>}
                  </div>
                ))}
              </div>
            )}
            <div className="pt-6">
              <Link
                href="/contact"
                className="inline-block rounded-full bg-[var(--color-primary)] px-8 py-3 font-medium text-white"
              >
                {DEFAULT_NAV_LABELS.contact}
              </Link>
            </div>
          </div>
          <div>
            <Image
              src={whyUs.image || PLACEHOLDER_IMAGE}
              alt={whyUs.title}
              width={600}
              height={500}
              className="h-auto w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
