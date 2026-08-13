"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { LandingSectionItem } from "@/types/landing-page";

export function LandingProjectsCarousel({ items }: { items: LandingSectionItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);

  const updateOverflow = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScroll(el.scrollWidth > el.clientWidth + 2);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    updateOverflow();
    const ro = new ResizeObserver(updateOverflow);
    ro.observe(el);

    window.addEventListener("resize", updateOverflow);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateOverflow);
    };
  }, [updateOverflow, items.length]);

  const scrollBy = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".lp-projects-card");
    const amount = card ? card.offsetWidth + 16 : el.clientWidth * 0.7;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <div className={`lp-projects-carousel${canScroll ? " is-scrollable" : ""}`}>
      {canScroll ? (
        <button
          type="button"
          className="lp-projects-nav lp-projects-nav--prev"
          onClick={() => scrollBy(-1)}
          aria-label="Previous projects"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      ) : null}

      <div ref={trackRef} className="lp-projects-track">
        {items.map((item, i) => (
          <article key={`${item.title}-${i}`} className="lp-projects-card">
            <div className="lp-projects-media">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title || `Project ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 80vw, 22vw"
                />
              ) : null}
              {item.title ? (
                <span className="lp-projects-caption">{item.title}</span>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      {canScroll ? (
        <button
          type="button"
          className="lp-projects-nav lp-projects-nav--next"
          onClick={() => scrollBy(1)}
          aria-label="Next projects"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      ) : null}
    </div>
  );
}
