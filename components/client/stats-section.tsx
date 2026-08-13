"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { HomePageContent } from "@/types";
import { defaultHomePageContent } from "@/lib/content/default-content";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { isSectionEnabled } from "@/lib/cms/section-utils";
import { cn } from "@/lib/utils";

type Stat = {
  id: string;
  label: string;
  value: number;
};

const DEFAULT_STATS = defaultHomePageContent().stats;

function useCountAnimation(end: number, duration = 2200) {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const startedRef = useRef(false);

  const start = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setHasStarted(true);
    setIsAnimating(true);
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number | null = null;
    let frameId = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(end * easeOutExpo));
      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCount(end);
        setIsAnimating(false);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [end, duration, hasStarted]);

  return { count, start, isAnimating };
}

function StatCard({
  label,
  value,
  index,
}: {
  label: string;
  value: number;
  index: number;
}) {
  const { count, start, isAnimating } = useCountAnimation(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [start]);

  return (
    <ScrollReveal delay={index * 120} variant="scale">
      <div ref={ref} className="space-y-2 text-center">
        <div className="text-sm font-medium text-white md:text-base">{label}</div>
        <div
          className={cn(
            "stat-count text-3xl font-bold text-white md:text-4xl",
            isAnimating && "stat-count-active",
          )}
        >
          {count}+
        </div>
      </div>
    </ScrollReveal>
  );
}

export function StatsSection() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [sectionEnabled, setSectionEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content/home", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: HomePageContent) => {
        const s = data?.stats ?? DEFAULT_STATS;
        setSectionEnabled(isSectionEnabled(s));
        if (!isSectionEnabled(s)) {
          setStats([]);
          return;
        }
        setStats([
          {
            id: "experience",
            label: s.yearsExperienceLabel || DEFAULT_STATS.yearsExperienceLabel,
            value: s.yearsExperience ?? DEFAULT_STATS.yearsExperience,
          },
          {
            id: "products",
            label: s.productsDeliveredLabel || DEFAULT_STATS.productsDeliveredLabel,
            value: s.productsDelivered ?? DEFAULT_STATS.productsDelivered,
          },
          {
            id: "clients",
            label: s.satisfiedClientsLabel || DEFAULT_STATS.satisfiedClientsLabel,
            value: s.satisfiedClients ?? DEFAULT_STATS.satisfiedClients,
          },
          {
            id: "countries",
            label: s.countriesServedLabel || DEFAULT_STATS.countriesServedLabel,
            value: s.countriesServed ?? DEFAULT_STATS.countriesServed,
          },
        ].filter((item) => item.value > 0));
      })
      .catch(() => {
        setStats([
          { id: "experience", label: DEFAULT_STATS.yearsExperienceLabel, value: DEFAULT_STATS.yearsExperience },
          { id: "products", label: DEFAULT_STATS.productsDeliveredLabel, value: DEFAULT_STATS.productsDelivered },
          { id: "clients", label: DEFAULT_STATS.satisfiedClientsLabel, value: DEFAULT_STATS.satisfiedClients },
          { id: "countries", label: DEFAULT_STATS.countriesServedLabel, value: DEFAULT_STATS.countriesServed },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !sectionEnabled) {
    if (loading) {
      return (
        <section className="relative z-10 -mt-12">
          <div className="container mx-auto px-4">
            <div className="h-[150px] animate-pulse rounded-[200px] bg-gray-200 p-8 shadow-2xl" />
          </div>
        </section>
      );
    }
    return null;
  }

  if (stats.length === 0) return null;

  return (
    <section className="relative z-10 -mt-12">
      <ScrollReveal variant="fade" delay={200}>
        <div className="container mx-auto px-4">
          <div className="rounded-[200px] bg-brand-primary p-8 shadow-2xl">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
              {stats.map((stat, index) => (
                <StatCard key={stat.id} label={stat.label} value={stat.value} index={index} />
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
