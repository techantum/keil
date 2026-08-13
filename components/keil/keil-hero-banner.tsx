"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { KeilContainer } from "@/components/keil/keil-ui";
import {
  KeilHeroTrustBar,
  type HeroTrustItem,
} from "@/components/keil/hero-trust-bar";
import { LandingCtaButton } from "@/components/keil/landing-cta-button";
import type { LandingCtaAction } from "@/types/landing-page";

function HeroBadge({ text }: { text: string }) {
  const match = text.match(/^(.*?)(\bTOMORROW\b)?$/i);
  const main = (match?.[1] || text).trim();
  const accent = match?.[2];

  return (
    <div className="keil-badge-overlay keil-badge-overlay--hero">
      <span className="keil-badge-overlay__text">
        {main.split(/\s+/).map((word, i) => (
          <span key={`${word}-${i}`} className="block leading-tight">
            {word}
          </span>
        ))}
        {accent ? (
          <span className="keil-badge-overlay__accent block leading-tight">{accent}</span>
        ) : null}
      </span>
    </div>
  );
}

export type KeilHeroBannerProps = {
  id?: string;
  title: string;
  tagline?: string;
  description?: string;
  image: string;
  badgeText?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  primaryButtonAction?: LandingCtaAction;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  secondaryButtonAction?: LandingCtaAction;
  items?: HeroTrustItem[];
  theme?: "green" | "red";
};

export function KeilHeroBanner({
  id,
  title,
  tagline,
  description,
  image,
  badgeText,
  primaryButtonText,
  primaryButtonLink,
  primaryButtonAction,
  secondaryButtonText,
  secondaryButtonLink,
  secondaryButtonAction,
  items = [],
  theme = "green",
}: KeilHeroBannerProps) {
  const imageSrc = image || "/keil/hero-ec-shed.jpg";
  const paragraphs = (description || "")
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section
      id={id}
      className={`keil-hero scroll-mt-24 ${theme === "red" ? "keil-hero--red" : ""}`}
    >
      <div className="keil-hero-media">
        <Image
          src={imageSrc}
          alt={title}
          fill
          priority
          className="object-cover object-[center_45%]"
          sizes="(max-width: 1024px) 100vw, 58vw"
        />
        <div className="keil-hero-media__fade" aria-hidden />
        {badgeText ? <HeroBadge text={badgeText} /> : null}
      </div>

      <KeilContainer className="keil-hero-inner">
        <div className="keil-hero-grid">
          <div className="keil-hero-copy">
            <h1 className="keil-hero-title">
              {theme === "red" ? (
                <span className="keil-hero-title__navy">{title}</span>
              ) : (
                (() => {
                  const match = title.match(/^(.*?)\s+(FOR\s+.+)$/i);
                  if (!match) {
                    return <span className="keil-hero-title__navy">{title}</span>;
                  }
                  return (
                    <>
                      <span className="keil-hero-title__navy">{match[1]}</span>
                      <span className="keil-hero-title__green">{match[2]}</span>
                    </>
                  );
                })()
              )}
            </h1>

            {tagline ? <p className="keil-hero-tagline-wrap">{tagline}</p> : null}

            {paragraphs.map((para) => (
              <p key={para.slice(0, 24)} className="keil-hero-desc">
                {para}
              </p>
            ))}

            <div className="keil-hero-ctas">
              {primaryButtonText ? (
                <LandingCtaButton
                  text={primaryButtonText}
                  link={primaryButtonLink}
                  action={primaryButtonAction}
                  className="keil-btn keil-btn-primary keil-hero-cta keil-hero-cta--primary"
                >
                  {primaryButtonText}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </LandingCtaButton>
              ) : null}
              {secondaryButtonText ? (
                <LandingCtaButton
                  text={secondaryButtonText}
                  link={secondaryButtonLink}
                  action={secondaryButtonAction}
                  className="keil-btn keil-btn-outline keil-hero-cta keil-hero-cta--outline"
                >
                  {secondaryButtonText}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </LandingCtaButton>
              ) : null}
            </div>
          </div>

          <div className="keil-hero-spacer" aria-hidden />
        </div>
      </KeilContainer>

      {items.length > 0 ? (
        <KeilHeroTrustBar items={items} className={theme === "red" ? "is-navy-icons" : undefined} />
      ) : null}
    </section>
  );
}
