"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { LandingCtaAction } from "@/types/landing-page";
import { useConsultationModal } from "@/components/keil/consultation-provider";

const DEFAULT_LABEL = "Get a Project Consultation";

function resolveAction(
  action: LandingCtaAction | undefined,
  link: string | undefined,
): LandingCtaAction {
  if (action) return action;
  if (!link || link === "#" || link === "/contact") return "modal";
  if (link.startsWith("#")) return "section";
  if (/^https?:\/\//i.test(link)) return "external";
  return "path";
}

export function LandingCtaButton({
  text,
  link,
  action,
  className,
  children,
  asChildClassName,
}: {
  text?: string;
  link?: string;
  action?: LandingCtaAction;
  className?: string;
  children?: ReactNode;
  /** Extra classes applied when rendering as button/link */
  asChildClassName?: string;
}) {
  const { open } = useConsultationModal();
  const label = (text || DEFAULT_LABEL).trim() || DEFAULT_LABEL;
  const resolved = resolveAction(action, link);
  const classes = [className, asChildClassName].filter(Boolean).join(" ");

  const content = children ?? label;

  if (resolved === "modal") {
    return (
      <button type="button" className={classes} onClick={() => open()}>
        {content}
      </button>
    );
  }

  const href = (link || "#").trim() || "#";

  if (resolved === "external") {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

export { DEFAULT_LABEL as CONSULTATION_CTA_LABEL };
