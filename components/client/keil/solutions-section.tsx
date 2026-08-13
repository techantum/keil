"use client";

import Image from "next/image";
import Link from "next/link";
import {
  KeilContainer,
  KeilSectionTitle,
  KeilButtonPrimary,
} from "@/components/keil/keil-ui";
import { isSectionEnabled } from "@/lib/cms/section-utils";
import type { HomePageContent } from "@/types";

export function KeilSolutionsSection({ content }: { content: HomePageContent["solutions"] }) {
  if (!isSectionEnabled(content)) return null;

  return (
    <section className="keil-section bg-[var(--keil-gray-bg)]" id="solutions">
      <KeilContainer>
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <KeilSectionTitle tag={content.titleTag || "h2"}>{content.title}</KeilSectionTitle>
          {content.buttonText && content.buttonLink && (
            <KeilButtonPrimary href={content.buttonLink} className="shrink-0">
              {content.buttonText}
            </KeilButtonPrimary>
          )}
        </div>

        <div className="lp-equal-grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {content.items.map((item) => {
            const inner = (
              <>
                <div className="relative aspect-square shrink-0 overflow-hidden bg-gray-200">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 200px"
                  />
                </div>
                <div className="lp-equal-card-body space-y-1 p-3">
                  <h3 className="text-sm font-bold text-[var(--keil-navy)]">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-[var(--keil-text-muted)]">
                    {item.description}
                  </p>
                </div>
              </>
            );

            return item.link ? (
              <Link
                key={item.title}
                href={item.link}
                className="lp-equal-card keil-card group shadow-sm transition-shadow hover:shadow-md"
              >
                {inner}
              </Link>
            ) : (
              <article
                key={item.title}
                className="lp-equal-card keil-card group shadow-sm transition-shadow hover:shadow-md"
              >
                {inner}
              </article>
            );
          })}
        </div>
      </KeilContainer>
    </section>
  );
}
