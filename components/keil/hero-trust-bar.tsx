"use client";

import { KeilContainer } from "@/components/keil/keil-ui";
import { KeilIcon } from "@/components/keil/icon-map";
import { cn } from "@/lib/utils";

function splitFeatureTitle(title: string): [string, string] {
  const words = title.trim().split(/\s+/);
  if (words.length <= 1) return [title, ""];
  if (words.length === 2) return [words[0], words[1]];
  if (words.length === 3) return [`${words[0]} ${words[1]}`, words[2]];
  return [words.slice(0, 2).join(" "), words.slice(2).join(" ")];
}

export type HeroTrustItem = {
  title: string;
  icon?: string;
};

/**
 * White info ribbon — not full-bleed.
 * Aligns to keil-container; rounded top-right so the hero photo peeks on the right.
 */
export function KeilHeroTrustBar({
  items,
  className,
}: {
  items: HeroTrustItem[];
  className?: string;
}) {
  if (!items.length) return null;

  return (
    <div className={cn("keil-hero-trust-wrap", className)}>
      <KeilContainer>
        <div className="keil-hero-trust-bar">
          {items.map((item, index) => {
            const [line1, line2] = splitFeatureTitle(item.title);
            return (
              <div
                key={`${item.title}-${index}`}
                className={cn(
                  "keil-hero-trust-item",
                  index > 0 && "keil-hero-trust-item--divided",
                )}
              >
                <KeilIcon
                  name={item.icon || "settings"}
                  className="keil-hero-trust-icon h-7 w-7 shrink-0 sm:h-8 sm:w-8"
                />
                <p className="keil-hero-trust-text">
                  <span>{line1}</span>
                  {line2 ? <span>{line2}</span> : null}
                </p>
              </div>
            );
          })}
        </div>
      </KeilContainer>
    </div>
  );
}
