import type { HeadingTag } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

type ContentHeadingProps = {
  tag?: HeadingTag;
  children: React.ReactNode;
  className?: string;
  /** When true, applies site typography token for this tag */
  useSiteStyles?: boolean;
};

const SITE_CLASS: Record<HeadingTag, string> = {
  h1: "site-h1",
  h2: "site-h2",
  h3: "site-h3",
  h4: "site-h4",
  h5: "site-h5",
  h6: "site-h6",
  p: "site-paragraph",
};

export function ContentHeading({
  tag = "p",
  children,
  className,
  useSiteStyles = true,
}: ContentHeadingProps) {
  const Component = tag;
  return (
    <Component className={cn(useSiteStyles && SITE_CLASS[tag], className)}>
      {children}
    </Component>
  );
}
