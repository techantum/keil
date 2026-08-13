export function isSectionEnabled(section: { enabled?: boolean } | null | undefined): boolean {
  if (!section) return false;
  return section.enabled !== false;
}
