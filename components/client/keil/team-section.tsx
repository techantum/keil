"use client";

import Image from "next/image";
import { ContentHeading } from "@/components/common/content-heading";
import {
  KeilContainer,
  KeilSectionBadge,
  KeilSectionTitle,
  KeilButtonSecondary,
} from "@/components/keil/keil-ui";
import { isSectionEnabled } from "@/lib/cms/section-utils";
import type { HomePageContent } from "@/types";

export function KeilTeamSection({ content }: { content: HomePageContent["team"] }) {
  if (!isSectionEnabled(content)) return null;

  return (
    <section className="keil-section bg-[var(--keil-gray-bg)]">
      <KeilContainer>
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            {content.badge && <KeilSectionBadge>{content.badge}</KeilSectionBadge>}
            <KeilSectionTitle tag={content.titleTag || "h2"}>{content.title}</KeilSectionTitle>
            <ContentHeading
              tag={content.subtitleTag || "p"}
              className="max-w-2xl text-[15px] text-[var(--keil-text-muted)]"
            >
              {content.subtitle}
            </ContentHeading>
          </div>
          {content.buttonText && content.buttonLink && (
            <KeilButtonSecondary href={content.buttonLink} className="shrink-0">
              {content.buttonText}
            </KeilButtonSecondary>
          )}
        </div>

        <div className="lp-equal-grid lp-equal-grid--3">
          {content.members.map((member) => (
            <article
              key={member.name}
              className="lp-equal-card keil-card overflow-hidden shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[4/3] shrink-0 bg-gray-100">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="lp-equal-card-body space-y-2 p-5">
                <h3 className="text-lg font-bold text-[var(--keil-navy)]">{member.name}</h3>
                <p className="text-sm font-semibold text-[var(--keil-green)]">{member.role}</p>
                <p className="text-sm leading-relaxed text-[var(--keil-text-muted)]">{member.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </KeilContainer>
    </section>
  );
}
