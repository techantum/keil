"use client";

import Image from "next/image";
import type { Service } from "@/types";
import { PLACEHOLDER_IMAGE } from "@/lib/content/default-content";

const MAX_DESCRIPTION_WORDS = 7;

function truncateToWords(text: string | undefined, maxWords: number = MAX_DESCRIPTION_WORDS): string {
  if (!text || !text.trim()) return "";
  return text.trim().split(/\s+/).slice(0, maxWords).join(" ");
}

interface ServiceCardProps {
  service: Service;
  className?: string;
}

export function ServiceCard({ service, className = "" }: ServiceCardProps) {
  const description = truncateToWords(service.subtitle || service.shortDescription);

  return (
    <div className={`overflow-hidden rounded-3xl bg-white shadow-lg transition-shadow hover:shadow-xl ${className}`}>
      <div className="relative h-64 overflow-hidden">
        <Image
          src={service.image || PLACEHOLDER_IMAGE}
          alt={service.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="space-y-2 p-8 pt-6 text-center">
        <h3 className="text-[32px] font-bold text-brand-primary">{service.title}</h3>
        {description && (
          <p className="text-sm uppercase tracking-wide text-[#8893B9]">{description}</p>
        )}
      </div>
    </div>
  );
}
