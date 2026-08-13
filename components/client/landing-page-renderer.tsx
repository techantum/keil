"use client";

import Image from "next/image";
import { ArrowRight, Phone, Check } from "lucide-react";
import {
  KeilContainer,
  KeilSectionTitle,
  KeilSectionBadge,
} from "@/components/keil/keil-ui";
import { KeilIcon } from "@/components/keil/icon-map";
import { KeilHeroBanner } from "@/components/keil/keil-hero-banner";
import { LandingCtaButton } from "@/components/keil/landing-cta-button";
import { LandingProjectsCarousel } from "@/components/keil/landing-projects-carousel";
import type { LandingPage, LandingSection } from "@/types/landing-page";
import { sectionAnchorId } from "@/lib/landing-pages/nav";

function SectionShell({
  children,
  id,
  className = "bg-white",
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={`keil-section scroll-mt-24 ${className}`}>
      <KeilContainer>{children}</KeilContainer>
    </section>
  );
}

function LpSectionHeader({
  eyebrow,
  title,
  action,
  titleClassName = "",
  stackedTitle = false,
}: {
  eyebrow?: string;
  title?: string;
  action?: React.ReactNode;
  titleClassName?: string;
  stackedTitle?: boolean;
}) {
  const titleLines =
    stackedTitle && title
      ? title.split(/(?<=\.)\s+/).filter(Boolean)
      : title
        ? [title]
        : [];

  return (
    <div className={`lp-sec-header${action ? " lp-sec-header--with-action" : ""}`}>
      <div className="lp-sec-header-copy">
        {eyebrow ? <p className="lp-sec-eyebrow">{eyebrow}</p> : null}
        {titleLines.length > 0 ? (
          <h2 className={`lp-sec-title ${titleClassName}`.trim()}>
            {titleLines.map((line, i) => (
              <span key={line} className="lp-sec-title-line">
                {line}
                {i < titleLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </h2>
        ) : null}
      </div>
      {action ? <div className="lp-sec-header-action">{action}</div> : null}
    </div>
  );
}

function LpOfferCard({
  title,
  description,
  image,
}: {
  title: string;
  description?: string;
  image?: string;
}) {
  return (
    <article className="lp-offer-card">
      {image ? (
        <div className="lp-offer-card-media">
          <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 14vw" />
        </div>
      ) : null}
      <div className="lp-offer-card-body">
        <h3 className="lp-offer-card-title">{title}</h3>
        {description ? <p className="lp-offer-card-desc">{description}</p> : null}
      </div>
    </article>
  );
}

function renderSection(section: LandingSection, index: number) {
  if (!section.enabled) return null;
  const items = section.items || [];
  const anchor = sectionAnchorId(section, index);

  switch (section.type) {
    case "hero":
      return (
        <KeilHeroBanner
          key={section.id}
          id={anchor}
          theme="red"
          title={section.title || ""}
          tagline={section.subtitle}
          description={section.description}
          image={
            section.image && !/landingpage|landing-reference|final_ecshed/i.test(section.image)
              ? section.image
              : "/keil/hero-ec-shed.jpg"
          }
          badgeText={section.badgeText}
          primaryButtonText={section.buttonText || "Get a Project Consultation"}
          primaryButtonLink={section.buttonLink}
          primaryButtonAction={section.buttonAction || "modal"}
          secondaryButtonText={section.secondaryButtonText}
          secondaryButtonLink={section.secondaryButtonLink}
          secondaryButtonAction={section.secondaryButtonAction}
          items={items}
        />
      );

    case "about": {
      const paragraphs = (section.description || "")
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean);
      const leadParas = section.subHeading
        ? paragraphs.slice(0, Math.min(2, paragraphs.length))
        : paragraphs;
      const restParas = section.subHeading ? paragraphs.slice(leadParas.length) : [];

      return (
        <section
          key={section.id}
          id={anchor}
          className="lp-about keil-section scroll-mt-24"
        >
          {section.image ? (
            <div className="lp-about-media">
              <Image
                src={section.image}
                alt={section.title || "About KEIL"}
                fill
                className="object-cover object-[center_40%]"
                sizes="(max-width: 1024px) 100vw, 36vw"
              />
              <div className="lp-about-media__fade" aria-hidden />
            </div>
          ) : null}

          <KeilContainer className="lp-about-inner">
            <div className="lp-about-grid">
              <div className="lp-about-spacer" aria-hidden />

              <div className="lp-about-copy">
                {section.subtitle ? (
                  <p className="lp-about-eyebrow">{section.subtitle}</p>
                ) : null}
                {section.title ? (
                  <h2 className="lp-about-title">{section.title}</h2>
                ) : null}
                {leadParas.map((para) => (
                  <p key={para.slice(0, 32)} className="lp-about-body">
                    {para}
                  </p>
                ))}
                {section.subHeading ? (
                  <p className="lp-about-subhead">{section.subHeading}</p>
                ) : null}
                {restParas.map((para) => (
                  <p key={para.slice(0, 32)} className="lp-about-body">
                    {para}
                  </p>
                ))}
              </div>

              {items.length > 0 ? (
                <aside className="lp-about-glance">
                  <h3 className="lp-about-glance-title">Company at a Glance</h3>
                  <ul className="lp-about-glance-list">
                    {items.map((item) => (
                      <li key={item.title} className="lp-about-glance-item">
                        <span className="lp-about-glance-icon">
                          <KeilIcon name={item.icon || "settings"} className="h-5 w-5" />
                        </span>
                        <span>
                          <span className="lp-about-glance-label">
                            {item.description ? item.title : ""}
                          </span>
                          <span className="lp-about-glance-value">
                            {item.description || item.title}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </aside>
              ) : null}
            </div>
          </KeilContainer>
        </section>
      );
    }

    case "team":
      return (
        <section
          key={section.id}
          id={anchor}
          className="lp-team keil-section scroll-mt-24"
        >
          <KeilContainer>
            <div className="lp-team-panel">
              <div className="lp-team-intro">
                {section.title ? (
                  <h2 className="lp-team-title">{section.title}</h2>
                ) : null}
                {section.subtitle ? (
                  <p className="lp-team-subtitle">{section.subtitle}</p>
                ) : null}
                {section.buttonText ? (
                  <LandingCtaButton
                    text={section.buttonText}
                    link={section.buttonLink}
                    action={section.buttonAction || "modal"}
                    className="keil-btn keil-btn-secondary lp-team-cta"
                  >
                    {section.buttonText}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </LandingCtaButton>
                ) : null}
              </div>

              {items.map((member) => (
                <article key={member.title} className="lp-team-member">
                  {member.image ? (
                    <div className="lp-team-avatar">
                      <Image
                        src={member.image}
                        alt={member.title}
                        fill
                        className="object-cover object-top"
                        sizes="96px"
                      />
                    </div>
                  ) : null}
                  <div className="lp-team-member-copy">
                    <h3 className="lp-team-name">{member.title}</h3>
                    {member.role ? (
                      <p className="lp-team-role">{member.role}</p>
                    ) : null}
                    {member.description ? (
                      <p className="lp-team-bio">{member.description}</p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </KeilContainer>
        </section>
      );

    case "features": {
      const promiseItems = section.promiseItems || [];
      const leftFeatures = items.filter((_, i) => i % 2 === 0);
      const rightFeatures = items.filter((_, i) => i % 2 === 1);

      const renderFeature = (item: (typeof items)[number]) => (
        <div key={item.title} className="lp-why-feature">
          <div className="lp-why-feature-icon">
            <KeilIcon name={item.icon || "settings"} className="h-6 w-6" />
          </div>
          <div className="lp-why-feature-copy">
            <h4 className="lp-why-feature-title">{item.title}</h4>
            {item.description ? (
              <p className="lp-why-feature-desc">{item.description}</p>
            ) : null}
          </div>
        </div>
      );

      return (
        <SectionShell key={section.id} id={anchor} className="lp-why">
          <div className="lp-why-grid">
            <div className="lp-why-copy">
              <div className="lp-why-copy-top">
                {section.subtitle ? (
                  <KeilSectionBadge>{section.subtitle}</KeilSectionBadge>
                ) : null}
                {section.title ? (
                  <KeilSectionTitle className="lp-why-title">{section.title}</KeilSectionTitle>
                ) : null}
                {section.description ? (
                  <p className="lp-why-body">{section.description}</p>
                ) : null}
                {section.descriptionSecondary ? (
                  <p className="lp-why-body">{section.descriptionSecondary}</p>
                ) : null}
              </div>

              {(section.promiseTitle || promiseItems.length > 0) && (
                <div className="lp-why-promise">
                  {section.promiseTitle ? (
                    <h3 className="lp-why-promise-title">{section.promiseTitle}</h3>
                  ) : null}
                  {promiseItems.length > 0 ? (
                    <ul className="lp-why-promise-list">
                      {promiseItems.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                  {section.buttonText ? (
                    <div className="lp-why-promise-cta">
                      <LandingCtaButton
                        text={section.buttonText}
                        link={section.buttonLink}
                        action={section.buttonAction || "modal"}
                        className="keil-btn keil-btn-primary"
                      />
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <div className="lp-why-feature-col">{leftFeatures.map(renderFeature)}</div>
            <div className="lp-why-feature-col">{rightFeatures.map(renderFeature)}</div>
          </div>
        </SectionShell>
      );
    }

    case "leaders":
      return (
        <section
          key={section.id}
          id={anchor}
          className="lp-leaders scroll-mt-24"
        >
          <KeilContainer>
            <header className="lp-leaders-head">
              {section.label ? (
                <p className="lp-leaders-eyebrow">{section.label}</p>
              ) : null}
              {section.title || section.subtitle ? (
                <h2 className="lp-leaders-title">
                  {section.title || section.subtitle}
                </h2>
              ) : null}
              {section.description ? (
                <p className="lp-leaders-intro">{section.description}</p>
              ) : null}
            </header>
            <div className="lp-leaders-grid">
              {items.map((item, i) => (
                <article
                  key={item.title}
                  className="lp-leaders-item"
                  data-accent={String(i % 3)}
                >
                  <span className="lp-leaders-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="lp-leaders-icon">
                    <KeilIcon name={item.icon || "trophy"} className="h-6 w-6" />
                  </div>
                  <p className="lp-leaders-text">{item.title}</p>
                  {item.description ? (
                    <p className="lp-leaders-desc">{item.description}</p>
                  ) : null}
                </article>
              ))}
            </div>
          </KeilContainer>
        </section>
      );

    case "solutions":
    case "cards":
      return (
        <SectionShell key={section.id} id={anchor} className="bg-white lp-sec-compact lp-sec-compact--after">
          <LpSectionHeader
            eyebrow={section.subtitle || section.label}
            title={section.title}
            action={
              section.buttonText ? (
                <LandingCtaButton
                  text={section.buttonText}
                  link={section.buttonLink}
                  action={section.buttonAction || "modal"}
                  className="keil-btn keil-btn-outline lp-sec-cta"
                >
                  {section.buttonText}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </LandingCtaButton>
              ) : null
            }
          />
          <div className="lp-offer-grid lp-offer-grid--3">
            {items.map((item) => (
              <LpOfferCard
                key={item.title}
                title={item.title}
                description={item.description}
                image={item.image}
              />
            ))}
          </div>
        </SectionShell>
      );

    case "benefits":
      return (
        <SectionShell key={section.id} id={anchor} className="lp-benefits-sec lp-sec-compact">
          <LpSectionHeader
            eyebrow={section.subtitle || "KEY BENEFITS"}
            title={section.title}
          />
          <div className="lp-benefits-grid">
            {items.map((item, i) => (
              <div
                key={item.title}
                className="lp-benefit-item"
                data-accent={String(i % 6)}
              >
                <div className="lp-benefit-icon">
                  <KeilIcon name={item.icon || "settings"} className="h-5 w-5" />
                </div>
                <div className="lp-benefit-copy">
                  <h3 className="lp-benefit-title">{item.title}</h3>
                  {item.description ? (
                    <p className="lp-benefit-desc">{item.description}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </SectionShell>
      );

    case "applications":
      return (
        <SectionShell
          key={section.id}
          id={anchor}
          className="bg-white lp-sec-compact lp-sec-compact--before lp-sec-compact--after"
        >
          <LpSectionHeader
            eyebrow={section.subtitle || "APPLICATIONS"}
            title={section.title}
          />
          <div className="lp-offer-grid lp-offer-grid--3">
            {items.map((item) => (
              <LpOfferCard
                key={item.title}
                title={item.title}
                description={item.description}
                image={item.image}
              />
            ))}
          </div>
        </SectionShell>
      );

    case "process":
      return (
        <SectionShell
          key={section.id}
          id={anchor}
          className="lp-process-sec lp-sec-compact lp-sec-compact--before lp-sec-compact--after"
        >
          <div className="lp-process">
            {section.title ? <h2 className="lp-process-title">{section.title}</h2> : null}
            {section.subtitle ? (
              <p className="lp-process-subtitle">{section.subtitle}</p>
            ) : null}
            <div className="lp-process-panel">
              <div className="lp-process-steps">
                {items.map((item, i) => {
                  const stepNo =
                    item.icon && /^\d+$/.test(item.icon)
                      ? item.icon.padStart(2, "0")
                      : String(i + 1).padStart(2, "0");
                  return (
                    <div
                      key={`${item.title}-${i}`}
                      className="lp-process-step"
                      data-accent={String(i % 6)}
                    >
                      <div className="lp-process-rail" aria-hidden>
                        <span className="lp-process-num">{stepNo}</span>
                      </div>
                      <h3 className="lp-process-step-title">{item.title}</h3>
                      {item.description ? (
                        <p className="lp-process-step-desc">{item.description}</p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </SectionShell>
      );

    case "gallery":
      return (
        <SectionShell
          key={section.id}
          id={anchor}
          className="lp-projects-sec lp-sec-compact lp-sec-compact--before"
        >
          <div className="lp-projects-header">
            <div>
              {section.title ? (
                <h2 className="lp-projects-title">{section.title}</h2>
              ) : null}
              {section.subtitle ? (
                <p className="lp-projects-subtitle">{section.subtitle}</p>
              ) : null}
            </div>
            {section.buttonText ? (
              <LandingCtaButton
                text={section.buttonText}
                link={section.buttonLink}
                action={section.buttonAction || "modal"}
                className="keil-btn keil-btn-outline lp-projects-cta"
              >
                {section.buttonText}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </LandingCtaButton>
            ) : null}
          </div>
          <LandingProjectsCarousel items={items} />
        </SectionShell>
      );

    case "cta":
      return (
        <section key={section.id} id={anchor} className="lp-cta-banner scroll-mt-24">
          <KeilContainer>
            <div className="lp-cta-inner">
              {section.image ? (
                <div className="lp-cta-media">
                  <Image
                    src={section.image}
                    alt=""
                    fill
                    className="object-contain object-bottom"
                    sizes="180px"
                  />
                </div>
              ) : null}

              <div className="lp-cta-copy">
                {section.title ? <h2 className="lp-cta-title">{section.title}</h2> : null}
                {section.description ? (
                  <p className="lp-cta-desc">{section.description}</p>
                ) : null}
                {items.length > 0 ? (
                  <ul className="lp-cta-chips">
                    {items.map((item) => (
                      <li key={item.title} className="lp-cta-chip">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                        <span>{item.title}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              {section.buttonText ? (
                <div className="lp-cta-action">
                  <LandingCtaButton
                    text={section.buttonText}
                    link={section.buttonLink || "tel:9050540505"}
                    action={section.buttonAction || "external"}
                    className="lp-cta-phone"
                  >
                    <Phone className="h-4 w-4" aria-hidden />
                    <span className="lp-cta-phone-label">
                      <span className="lp-cta-phone-kicker">Call Us Now</span>
                      <span className="lp-cta-phone-num">{section.buttonText}</span>
                    </span>
                  </LandingCtaButton>
                </div>
              ) : null}
            </div>
          </KeilContainer>
        </section>
      );

    default:
      return (
        <SectionShell key={section.id} id={anchor}>
          {section.subtitle && <KeilSectionBadge>{section.subtitle}</KeilSectionBadge>}
          {section.title && <KeilSectionTitle className="mt-2">{section.title}</KeilSectionTitle>}
          {section.description && (
            <p className="mt-3 max-w-3xl text-[15px] text-[var(--keil-text-muted)]">
              {section.description}
            </p>
          )}
          {section.image && (
            <div className="relative mt-6 aspect-[21/9] overflow-hidden rounded-lg">
              <Image src={section.image} alt="" fill className="object-cover" sizes="100vw" />
            </div>
          )}
          {items.length > 0 && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <div key={item.title} className="rounded-lg border border-gray-100 p-4">
                  <h3 className="font-semibold text-[var(--keil-navy)]">{item.title}</h3>
                  {item.description && (
                    <p className="mt-1 text-sm text-[var(--keil-text-muted)]">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </SectionShell>
      );
  }
}

export function LandingPageRenderer({ page }: { page: LandingPage }) {
  return <>{page.sections.map((section, index) => renderSection(section, index))}</>;
}
