/** Client-safe slug helper (no Node APIs) */
export function makeLandingSlug(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "landing-page"
  );
}
