"use client";

import Image from "next/image";
import { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { PLACEHOLDER_HERO } from "@/lib/content/default-content";
import type { HeroMediaType } from "@/types";

type HeroMediaProps = {
  mediaType: HeroMediaType;
  backgroundImage: string;
  backgroundVideo?: string;
  carouselImages?: string[];
  alt: string;
};

export function HeroMedia({
  mediaType,
  backgroundImage,
  backgroundVideo,
  carouselImages = [],
  alt,
}: HeroMediaProps) {
  const heroImage = backgroundImage || PLACEHOLDER_HERO;
  const slides =
    carouselImages.filter(Boolean).length > 0
      ? carouselImages.filter(Boolean)
      : [heroImage];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (mediaType !== "carousel" || !emblaApi) return;

    const interval = window.setInterval(scrollNext, 5000);
    return () => window.clearInterval(interval);
  }, [emblaApi, mediaType, scrollNext]);

  if (mediaType === "video" && backgroundVideo) {
    const isYoutube =
      backgroundVideo.includes("youtube.com") ||
      backgroundVideo.includes("youtu.be");
    const isVimeo = backgroundVideo.includes("vimeo.com");

    if (isYoutube || isVimeo) {
      let embedUrl = backgroundVideo;
      if (backgroundVideo.includes("youtu.be/")) {
        const id = backgroundVideo.split("youtu.be/")[1]?.split("?")[0];
        embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&showinfo=0&rel=0`;
      } else if (backgroundVideo.includes("watch?v=")) {
        const id = backgroundVideo.split("watch?v=")[1]?.split("&")[0];
        embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&showinfo=0&rel=0`;
      } else if (backgroundVideo.includes("vimeo.com/")) {
        const id = backgroundVideo.split("vimeo.com/")[1]?.split("?")[0];
        embedUrl = `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=1`;
      }

      return (
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            src={embedUrl}
            title={alt}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
            allow="autoplay; fullscreen"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      );
    }

    return (
      <div className="absolute inset-0">
        <video
          src={backgroundVideo}
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
    );
  }

  if (mediaType === "carousel") {
    return (
      <div className="absolute inset-0 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div key={`${slide}-${index}`} className="relative min-w-0 shrink-0 grow-0 basis-full">
              <Image
                src={slide}
                alt={`${alt} slide ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PLACEHOLDER_HERO;
                }}
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-black/25" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <Image
        src={heroImage}
        alt={alt}
        fill
        className="object-cover"
        priority
        onError={(e) => {
          (e.target as HTMLImageElement).src = PLACEHOLDER_HERO;
        }}
      />
    </div>
  );
}
