export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

export const HEADING_TAG_OPTIONS: { value: HeadingTag; label: string }[] = [
  { value: "h1", label: "H1" },
  { value: "h2", label: "H2" },
  { value: "h3", label: "H3" },
  { value: "h4", label: "H4" },
  { value: "h5", label: "H5" },
  { value: "h6", label: "H6" },
  { value: "p", label: "Paragraph" },
];

export type SectionEnabled = {
  enabled?: boolean;
};
