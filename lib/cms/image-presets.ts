/** Suggested dimensions for admin UI labels only — not enforced on upload */
export const IMAGE_PRESETS = {
  hero: { maxWidth: 1920, maxHeight: 1080, aspectRatio: "16:9", maxSizeMB: 0, label: "Hero image" },
  section: { maxWidth: 1200, maxHeight: 800, aspectRatio: "3:2", maxSizeMB: 0, label: "Section image" },
  square: { maxWidth: 800, maxHeight: 800, aspectRatio: "1:1", maxSizeMB: 0, label: "Square image" },
  logo: { maxWidth: 400, maxHeight: 200, aspectRatio: "2:1", maxSizeMB: 0, label: "Logo" },
  icon: { maxWidth: 64, maxHeight: 64, aspectRatio: "1:1", maxSizeMB: 0, label: "Icon" },
  favicon: { maxWidth: 64, maxHeight: 64, aspectRatio: "1:1", maxSizeMB: 0, label: "Favicon (ICO/PNG)" },
} as const;

export type ImagePresetKey = keyof typeof IMAGE_PRESETS;
