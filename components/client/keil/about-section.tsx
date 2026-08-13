"use client";

import Image from "next/image";
import { ContentHeading } from "@/components/common/content-heading";
import {
  KeilContainer,
  KeilSectionTitle,
} from "@/components/keil/keil-ui";
import { KeilIcon } from "@/components/keil/icon-map";
import { isSectionEnabled } from "@/lib/cms/section-utils";
import type { HomePageContent } from "@/types";

export function KeilAboutSection({ content }: { content: HomePageContent["aboutKeil"] }) {
  if (!content || !isSectionEnabled(content)) return null;

  const glanceItems = content.glanceItems || [];
  const imageSrc = content.image || "/keil/about-chickens.jpg";

  return (
    <section className="lp-about keil-section" id="about">
      <div className="lp-about-media">
        <Image
          src={imageSrc}
          alt={content.title || "About KEIL"}
          fill
          className="object-cover object-[center_40%]"
          sizes="(max-width: 1024px) 100vw, 36vw"
        />
        <div className="lp-about-media__fade" aria-hidden />
        {content.imageBadge && (
          <div className="keil-badge-overlay text-[10px]">{content.imageBadge}</div>
        )}
      </div>

      <KeilContainer className="lp-about-inner">
        <div className="lp-about-grid">
          <div className="lp-about-spacer" aria-hidden />

          <div className="lp-about-copy">
            {content.badge ? <p className="lp-about-eyebrow">{content.badge}</p> : null}
            <KeilSectionTitle tag={content.titleTag || "h2"} className="lp-about-title">
              {content.title}
            </KeilSectionTitle>
            <ContentHeading
              tag={content.descriptionTag || "p"}
              className="lp-about-body"
            >
              {content.description}
            </ContentHeading>
            {content.subHeading && (
              <ContentHeading
                tag={content.subHeadingTag || "h3"}
                className="lp-about-subhead"
              >
                {content.subHeading}
              </ContentHeading>
            )}
            {content.subDescription && (
              <ContentHeading tag="p" className="lp-about-body">
                {content.subDescription}
              </ContentHeading>
            )}
          </div>

          <aside className="lp-about-glance">
            <h3 className="lp-about-glance-title">
              {content.glanceTitle || "Company at a Glance"}
            </h3>
            <ul className="lp-about-glance-list">
              {glanceItems.map((item) => (
                <li key={item.label} className="lp-about-glance-item">
                  <span className="lp-about-glance-icon">
                    <KeilIcon name={item.icon} className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="lp-about-glance-label">{item.label}</span>
                    <span className="lp-about-glance-value">{item.value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </KeilContainer>
    </section>
  );
}
