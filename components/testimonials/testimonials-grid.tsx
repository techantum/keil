"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Testimonial } from "@/types";
import { asArray } from "@/lib/utils";
import { usePageHero } from "@/hooks/use-public-settings";
import { ScrollReveal } from "@/components/common/scroll-reveal";

export function TestimonialsGrid() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const { hero } = usePageHero("testimonials");

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => setTestimonials(asArray<Testimonial>(data)))
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 h-64 bg-gray-100 animate-pulse rounded-lg" />
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <ScrollReveal>
        <div className="container mx-auto px-4">
        {hero?.title && (
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">{hero.title}</h2>
          </div>
        )}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="rounded-lg border p-6 shadow-sm">
              {testimonial.content && <p className="text-gray-600 mb-4">{testimonial.content}</p>}
              <div className="flex items-center gap-3">
                {testimonial.image && (
                  <Image src={testimonial.image} alt={testimonial.name} width={48} height={48} className="rounded-full object-cover" />
                )}
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  {(testimonial.title || testimonial.company) && (
                    <p className="text-sm text-gray-500">
                      {[testimonial.title, testimonial.company].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
