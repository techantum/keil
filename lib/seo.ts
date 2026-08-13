import type { Metadata } from "next";
import { getRepository } from "@/lib/repo";
import { buildDefaultSettings } from "@/lib/db/db-error";
import type { Settings } from "@/types";

export const siteConfig = {
  name: "My CMS Site",
  description: "A flexible content-managed business website.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/og-image.jpg",
  links: {
    twitter: "",
    linkedin: "",
  },
};

async function getSettings(): Promise<Settings | null> {
  try {
    const repo = getRepository();
    const settings = await repo.getSettings();
    if (!settings || settings.id === "default") {
      return buildDefaultSettings();
    }
    return settings;
  } catch {
    return buildDefaultSettings();
  }
}

type PageSeoKey = keyof Settings["seo"]["pages"];

function pathToPageKey(path: string): PageSeoKey | null {
  const map: Record<string, PageSeoKey> = {
    "/": "home",
    "/about": "about",
    "/products": "products",
    "/services": "services",
    "/gallery": "gallery",
    "/clients": "clients",
    "/testimonials": "testimonials",
    "/contact": "contact",
  };
  return map[path] ?? null;
}

export async function generateSEOMetadata({
  title,
  description,
  image,
  path = "",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  noIndex?: boolean;
}): Promise<Metadata> {
  const settings = await getSettings();
  const seoSettings = settings?.seo;
  const pageKey = pathToPageKey(path);
  const pageSeo = pageKey ? seoSettings?.pages?.[pageKey] : undefined;

  const siteName = seoSettings?.siteName || siteConfig.name;
  const metaTitle = pageSeo?.title || title || siteName;
  const metaDescription =
    pageSeo?.description || description || seoSettings?.siteDescription || siteConfig.description;
  const metaKeywords = pageSeo?.keywords?.length
    ? pageSeo.keywords
    : seoSettings?.keywords?.length
      ? seoSettings.keywords
      : ["business", "cms", "website"];

  const url = `${siteConfig.url}${path}`;
  const ogImage = image || seoSettings?.ogImage || siteConfig.ogImage;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    metadataBase: new URL(seoSettings?.siteUrl || siteConfig.url),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      title: metaTitle,
      description: metaDescription,
      siteName,
      images: [{ url: ogImage, width: 1200, height: 630, alt: metaTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [ogImage],
      creator: seoSettings?.twitterHandle || "",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export async function generateProductStructuredData(product: {
  name: string;
  description?: string;
  slug: string;
  inStock?: boolean;
}) {
  const settings = await getSettings();
  const siteName = settings?.seo?.siteName || siteConfig.name;
  const siteUrl = settings?.seo?.siteUrl || siteConfig.url;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: siteName },
    manufacturer: { "@type": "Organization", name: siteName },
    offers: {
      "@type": "Offer",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: "USD",
      url: `${siteUrl}/products/${product.slug}`,
    },
  };
}

export async function generateOrganizationStructuredData() {
  const settings = await getSettings();
  const company = settings?.company;
  const seo = settings?.seo;
  const siteUrl = seo?.siteUrl || siteConfig.url;
  const siteName = seo?.siteName || siteConfig.name;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company?.name || siteName,
    url: siteUrl,
    logo: `${siteUrl}${settings?.branding?.websiteLogo || "/logo.png"}`,
    description: seo?.siteDescription || siteConfig.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: company?.address?.street || "",
      addressLocality: company?.address?.city || "",
      addressRegion: company?.address?.state || "",
      postalCode: company?.address?.zipCode || "",
      addressCountry: company?.address?.country || "",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: company?.phone || "",
      contactType: "Customer Service",
      email: company?.email || "contact@example.com",
      availableLanguage: ["English"],
    },
    sameAs: [
      company?.socialMedia?.twitter,
      company?.socialMedia?.linkedin,
      siteConfig.links.twitter,
      siteConfig.links.linkedin,
    ].filter(Boolean),
  };
}

export function generateBreadcrumbStructuredData(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}
