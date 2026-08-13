"use client";

import { useEffect, useState } from "react";
import type { HomePageContent } from "@/types";
import { defaultHomePageContent, PLACEHOLDER_IMAGE } from "@/lib/content/default-content";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { ContentHeading } from "@/components/common/content-heading";
import { isSectionEnabled } from "@/lib/cms/section-utils";

const DEFAULT_PROCESS = defaultHomePageContent().process;

export function ProcessSection() {
  const [process, setProcess] = useState(DEFAULT_PROCESS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content/home")
      .then((res) => res.json())
      .then((data: HomePageContent) => {
        if (data?.process && isSectionEnabled(data.process)) {
          setProcess({
            title: data.process.title || DEFAULT_PROCESS.title,
            titleTag: data.process.titleTag || DEFAULT_PROCESS.titleTag || "h2",
            subtitle: data.process.subtitle || DEFAULT_PROCESS.subtitle,
            subtitleTag: data.process.subtitleTag || DEFAULT_PROCESS.subtitleTag || "p",
            steps: data.process.steps?.length ? data.process.steps : DEFAULT_PROCESS.steps,
            enabled: data.process.enabled,
          });
        } else if (data?.process && !isSectionEnabled(data.process)) {
          setProcess({ ...DEFAULT_PROCESS, enabled: false });
        }
      })
      .catch(() => setProcess({ ...DEFAULT_PROCESS, enabled: false }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto h-48 animate-pulse rounded-lg bg-gray-100 px-4" />
      </section>
    );
  }

  if (!isSectionEnabled(process)) return null;

  if (!process.title && !process.steps?.length) return null;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <ScrollReveal variant="fade">
          <div className="mb-12 space-y-2 text-center">
            <ContentHeading tag={process.titleTag || "h2"} className="text-gray-900">
              {process.title}
            </ContentHeading>
            {process.subtitle ? (
              <ContentHeading tag={process.subtitleTag || "p"} className="text-gray-600">
                {process.subtitle}
              </ContentHeading>
            ) : null}
          </div>
        </ScrollReveal>

        {process.steps?.length ? (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {process.steps.map((step, index) => (
              <ScrollReveal
                key={`${step.number ?? "step"}-${index}`}
                delay={index * 120}
                variant="up"
              >
                <div
                  className={`flex flex-col items-center space-y-4 text-center ${
                    index % 2 === 1 ? "lg:mt-16" : ""
                  }`}
                >
                  {step.icon ? (
                    <img
                      src={step.icon}
                      alt={step.title}
                      className="h-12 w-12 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary text-xl font-bold text-white">
                      {step.number ?? index + 1}
                    </div>
                  )}
                  {step.title ? <h3 className="text-lg font-semibold">{step.title}</h3> : null}
                  {step.description ? (
                    <p className="max-w-xs text-gray-600">{step.description}</p>
                  ) : null}
                </div>
              </ScrollReveal>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
