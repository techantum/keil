"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  KeilContainer,
  KeilSectionTitle,
  KeilButtonOutline,
} from "@/components/keil/keil-ui";
import { isSectionEnabled } from "@/lib/cms/section-utils";
import type { HomePageContent } from "@/types";

export function KeilProjectsSection({ content }: { content: HomePageContent["projects"] }) {
  if (!isSectionEnabled(content)) return null;

  return (
    <section className="keil-section bg-[var(--keil-gray-bg)]" id="projects">
      <KeilContainer>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <KeilSectionTitle tag={content.titleTag || "h2"}>{content.title}</KeilSectionTitle>
          {content.buttonText && content.buttonLink && (
            <KeilButtonOutline href={content.buttonLink}>{content.buttonText}</KeilButtonOutline>
          )}
        </div>

        <Carousel
          opts={{ align: "start", loop: true }}
          className="relative w-full"
        >
          <CarouselContent className="-ml-3">
            {content.images.map((project, index) => (
              <CarouselItem
                key={`${project.image}-${index}`}
                className="pl-3 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-gray-200">
                  <Image
                    src={project.image}
                    alt={project.alt || project.title || "KEIL project"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 400px"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 -translate-x-1/2 border-none bg-[var(--keil-green)] text-white hover:bg-[var(--keil-green-dark)] hover:text-white" />
          <CarouselNext className="right-0 translate-x-1/2 border-none bg-[var(--keil-green)] text-white hover:bg-[var(--keil-green-dark)] hover:text-white" />
        </Carousel>
      </KeilContainer>
    </section>
  );
}
