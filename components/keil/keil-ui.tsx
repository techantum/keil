import Link from "next/link";
import { cn } from "@/lib/utils";
import { ContentHeading } from "@/components/common/content-heading";
import type { HeadingTag } from "@/types";

export function KeilContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("keil-container mx-auto w-full px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

export function KeilSectionBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("keil-section-badge", className)}>
      {children}
    </span>
  );
}

export function KeilSectionTitle({
  tag = "h2",
  children,
  className,
}: {
  tag?: HeadingTag;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ContentHeading tag={tag} className={cn("keil-section-title", className)}>
      {children}
    </ContentHeading>
  );
}

export function KeilButtonPrimary({
  href,
  children,
  className,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const classes = cn("keil-btn keil-btn-primary", className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

export function KeilButtonSecondary({
  href,
  children,
  className,
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const classes = cn("keil-btn keil-btn-secondary", className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return <button type="button" className={classes}>{children}</button>;
}

export function KeilButtonOutline({
  href,
  children,
  className,
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const classes = cn("keil-btn keil-btn-outline", className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return <button type="button" className={classes}>{children}</button>;
}
