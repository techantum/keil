"use client";

import { useEffect, useState } from "react";
import type { AboutPageContent } from "@/types";
import { defaultAboutPageContent, PLACEHOLDER_IMAGE, withDefault } from "@/lib/content/default-content";
import { ScrollReveal } from "@/components/common/scroll-reveal";

const DEFAULT_INTRO = defaultAboutPageContent().intro;

export function AboutIntro() {
  const [content, setContent] = useState(DEFAULT_INTRO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content/about")
      .then((res) => res.json())
      .then((data: AboutPageContent) => {
        const intro = data?.intro;
        if (intro) {
          setContent({
            badge: withDefault(intro.badge, DEFAULT_INTRO.badge),
            title: withDefault(intro.title, DEFAULT_INTRO.title),
            description: withDefault(intro.description, DEFAULT_INTRO.description),
            image: withDefault(intro.image, DEFAULT_INTRO.image || PLACEHOLDER_IMAGE),
          });
        }
      })
      .catch(() => setContent(DEFAULT_INTRO))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 h-96 bg-gray-200 animate-pulse rounded-lg" />
      </section>
    );
  }

  const imageSrc = content.image || PLACEHOLDER_IMAGE;

  return (
    <section className="py-16 bg-gray-50">
      <ScrollReveal>
        <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src={imageSrc}
              alt={content.title}
              className="rounded-lg shadow-lg w-full h-auto object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
              }}
            />
          </div>
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
              {content.badge}
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">{content.title}</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              {content.description.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
