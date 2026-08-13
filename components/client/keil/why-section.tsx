"use client";

import { ContentHeading } from "@/components/common/content-heading";
import {
  KeilContainer,
  KeilSectionBadge,
  KeilSectionTitle,
  KeilButtonPrimary,
} from "@/components/keil/keil-ui";
import { KeilIcon } from "@/components/keil/icon-map";
import { isSectionEnabled } from "@/lib/cms/section-utils";
import type { HomePageContent } from "@/types";

export function KeilWhySection({ content }: { content: HomePageContent["whyKeil"] }) {
  if (!isSectionEnabled(content)) return null;

  const leftFeatures = content.features.filter((_, i) => i % 2 === 0);
  const rightFeatures = content.features.filter((_, i) => i % 2 === 1);

  const renderFeature = (feature: (typeof content.features)[number]) => (
    <div key={feature.title} className="lp-why-feature">
      <div className="lp-why-feature-icon">
        <KeilIcon name={feature.icon} className="h-6 w-6" />
      </div>
      <div className="lp-why-feature-copy">
        <h4 className="lp-why-feature-title">{feature.title}</h4>
        {feature.description ? (
          <p className="lp-why-feature-desc">{feature.description}</p>
        ) : null}
      </div>
    </div>
  );

  return (
    <section className="keil-section lp-why" id="why-keil">
      <KeilContainer>
        <div className="lp-why-grid">
          <div className="lp-why-copy">
            <div className="lp-why-copy-top">
              <KeilSectionBadge>{content.badge}</KeilSectionBadge>
              <KeilSectionTitle tag={content.titleTag || "h2"} className="lp-why-title">
                {content.title}
              </KeilSectionTitle>
              <ContentHeading
                tag={content.descriptionTag || "p"}
                className="lp-why-body"
              >
                {content.description}
              </ContentHeading>
            </div>

            <div className="lp-why-promise">
              <h3 className="lp-why-promise-title">{content.promiseTitle}</h3>
              <ul className="lp-why-promise-list">
                {content.promiseItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {content.promiseButtonText && content.promiseButtonLink ? (
                <div className="lp-why-promise-cta">
                  <KeilButtonPrimary href={content.promiseButtonLink}>
                    {content.promiseButtonText}
                  </KeilButtonPrimary>
                </div>
              ) : null}
            </div>
          </div>

          <div className="lp-why-feature-col">{leftFeatures.map(renderFeature)}</div>
          <div className="lp-why-feature-col">{rightFeatures.map(renderFeature)}</div>
        </div>
      </KeilContainer>
    </section>
  );
}
