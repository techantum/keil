import type { MetadataRoute } from "next";
import { getRepository } from "@/lib/repo";
import { siteConfig } from "@/lib/seo";
import { getEnabledModules } from "@/lib/modules/get-enabled-modules";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const repo = getRepository();
  const enabled = await getEnabledModules();
  const base = siteConfig.url;

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  if (enabled.services) {
    staticUrls.push(
      {
        url: `${base}/services`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.9,
      },
      {
        url: `${base}/services/cmo`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: `${base}/services/cdmo`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: `${base}/services/partnering`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      },
    );
  }

  if (enabled.products) {
    staticUrls.push({
      url: `${base}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    });
  }

  if (enabled.gallery) {
    staticUrls.push({
      url: `${base}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  if (enabled.clients) {
    staticUrls.push({
      url: `${base}/clients`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  if (enabled.testimonials) {
    staticUrls.push({
      url: `${base}/testimonials`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  let productUrls: MetadataRoute.Sitemap = [];
  if (enabled.products) {
    const products = await repo.getAllProducts();
    productUrls = products.map((product) => ({
      url: `${base}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  }

  return [...staticUrls, ...productUrls];
}
