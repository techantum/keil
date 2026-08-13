import type { Product, ProductDetailItem } from "@/types";

const DEFAULT_DETAILS_SECTION_TITLE = "Key Features and Details";

const LEGACY_DETAIL_FIELDS: Array<{ title: string; key: keyof Product }> = [
  { title: "Product Type", key: "productType" },
  { title: "Capacity", key: "capacity" },
  { title: "Screen Dimension", key: "screenDimension" },
  { title: "Number of Decks", key: "numberOfDecks" },
  { title: "Motor Power", key: "motorPower" },
  { title: "Gyratory / Circular", key: "gyratoryCircular" },
  { title: "Special Features", key: "specialFeatures" },
  { title: "Availability", key: "availability" },
];

export function getProductDetailsSectionTitle(product: Product): string {
  return product.detailsSectionTitle?.trim() || DEFAULT_DETAILS_SECTION_TITLE;
}

export function getProductDetails(product: Product): ProductDetailItem[] {
  if (product.details?.length) {
    return product.details.filter((item) => item.title?.trim() || item.description?.trim());
  }

  return LEGACY_DETAIL_FIELDS.map(({ title, key }) => ({
    title,
    description: String(product[key] ?? "").trim(),
  })).filter((item) => item.description);
}

export function productDetailsFromLegacy(product: Product): ProductDetailItem[] {
  return getProductDetails(product);
}

export { DEFAULT_DETAILS_SECTION_TITLE };
