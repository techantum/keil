"use client";

import Image from "next/image";
import { Phone } from "lucide-react";
import { ContentHeading } from "@/components/common/content-heading";
import { KeilContainer } from "@/components/keil/keil-ui";
import { KeilIcon } from "@/components/keil/icon-map";
import { isSectionEnabled } from "@/lib/cms/section-utils";
import type { HomePageContent } from "@/types";

export function KeilCtaBannerSection({ content }: { content: HomePageContent["ctaBanner"] }) {
  if (!isSectionEnabled(content)) return null;

  const phoneHref = `tel:${content.phone.replace(/\s/g, "")}`;

  return (
    <section className="keil-section bg-[#1a5c3a] py-8 lg:py-10">
      <KeilContainer>
        <div className="grid items-center gap-8 lg:grid-cols-12">
          {content.image && (
            <div className="relative mx-auto aspect-square w-32 lg:col-span-2 lg:mx-0 lg:w-40">
              <Image
                src={content.image}
                alt=""
                fill
                className="object-contain"
                sizes="160px"
              />
            </div>
          )}

          <div className="space-y-4 text-center text-white lg:col-span-6 lg:text-left">
            <ContentHeading
              tag={content.titleTag || "h2"}
              className="text-2xl font-bold uppercase lg:text-3xl"
            >
              {content.title}
            </ContentHeading>
            <ContentHeading tag="p" className="text-sm leading-relaxed text-white/90 lg:text-base">
              {content.description}
            </ContentHeading>
            {content.features.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                {content.features.map((feature) => (
                  <div key={feature.title} className="flex items-center gap-2 text-xs font-medium">
                    <KeilIcon name={feature.icon} className="h-4 w-4 text-white" />
                    {feature.title}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-center lg:col-span-4 lg:justify-end">
            <a
              href={phoneHref}
              className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-bold text-[var(--keil-navy)] shadow-lg transition-shadow hover:shadow-xl"
            >
              <Phone className="h-5 w-5 text-[var(--keil-green)]" />
              {content.phone}
            </a>
          </div>
        </div>
      </KeilContainer>
    </section>
  );
}
