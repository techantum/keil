"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { ContentHeading } from "@/components/common/content-heading";
import { KeilContainer, KeilSectionTitle } from "@/components/keil/keil-ui";
import { isSectionEnabled } from "@/lib/cms/section-utils";
import type { HomePageContent } from "@/types";

export function KeilBenefitsApplicationsSection({
  content,
}: {
  content: HomePageContent["benefitsApplications"];
}) {
  if (!isSectionEnabled(content)) return null;

  const { benefits, applications } = content;

  return (
    <section className="keil-section bg-white">
      <KeilContainer>
        <div className="grid items-stretch gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="flex h-full flex-col">
            <KeilSectionTitle tag={benefits.titleTag || "h2"} className="mb-4">
              {benefits.title}
            </KeilSectionTitle>
            <ContentHeading tag="p" className="mb-6 text-[15px] text-[var(--keil-text-muted)]">
              {benefits.description}
            </ContentHeading>
            <div className="mb-6 grid flex-1 gap-3 sm:grid-cols-2">
              {benefits.items.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--keil-green)] text-white">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-sm text-[var(--keil-navy)]">{item}</span>
                </div>
              ))}
            </div>
            {benefits.outcomeTitle && benefits.outcomeSteps.length > 0 && (
              <div className="rounded-lg bg-[var(--keil-navy)] px-4 py-4 text-white sm:px-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider">
                  {benefits.outcomeTitle}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
                  {benefits.outcomeSteps.map((step, i) => (
                    <span key={step} className="flex items-center gap-2">
                      {step}
                      {i < benefits.outcomeSteps.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-[var(--keil-green)]" />
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex h-full flex-col">
            <KeilSectionTitle tag={applications.titleTag || "h2"} className="mb-4">
              {applications.title}
            </KeilSectionTitle>
            <ContentHeading tag="p" className="mb-6 text-[15px] text-[var(--keil-text-muted)]">
              {applications.description}
            </ContentHeading>
            <div className="lp-equal-grid lp-equal-grid--3 flex-1">
              {applications.items.map((item) => (
                <Link
                  key={item.title}
                  href={item.link || "#"}
                  className="lp-equal-card group keil-card overflow-hidden shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[3/4] min-h-0 flex-1 bg-gray-200">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="200px"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-sm font-bold text-white">{item.title}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {applications.exploreText && applications.exploreLink && (
              <Link
                href={applications.exploreLink}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--keil-navy)] hover:text-[var(--keil-green)]"
              >
                {applications.exploreText}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </KeilContainer>
    </section>
  );
}
