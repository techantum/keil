import type React from "react";
import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/common/analytics";
import { BrandColorsLoader } from "@/components/common/brand-colors-loader";
import { SiteMotion } from "@/components/common/site-motion";
import { StructuredData } from "@/components/common/structured-data";
import { generateOrganizationStructuredData } from "@/lib/seo";
import { Suspense } from "react";
import { getRepository } from "@/lib/repo";
import { getAnalyticsSettings } from "@/lib/db/settings-service";

import { siteConfig } from "@/lib/seo";
import { buildDefaultSettings } from "@/lib/db/db-error";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

async function getSettings() {
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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  const siteName = settings.seo?.siteName || siteConfig.name;
  const siteDescription = settings.seo?.siteDescription || siteConfig.description;
  const siteUrl = settings.seo?.siteUrl || siteConfig.url;
  const ogImage = settings.seo?.ogImage || siteConfig.ogImage;
  const twitterHandle = settings.seo?.twitterHandle || "";
  const keywords = settings.seo?.keywords || ["business", "cms", "website"];
  const favicon = settings.branding?.websiteFavicon || "/favicon.ico";

  return {
    metadataBase: new URL(siteUrl),
    title: { default: siteName, template: `%s | ${siteName}` },
    description: siteDescription,
    keywords,
    authors: [{ name: siteName }],
    creator: siteName,
    icons: { icon: favicon, shortcut: favicon, apple: favicon },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      title: siteName,
      description: siteDescription,
      siteName,
      images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: siteDescription,
      images: [ogImage],
      creator: twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  let analyticsConfig = { googleAnalyticsId: "", enabled: false };
  try {
    analyticsConfig = await getAnalyticsSettings();
  } catch {
    analyticsConfig = {
      googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || "",
      enabled: Boolean(process.env.NEXT_PUBLIC_GA_ID),
    };
  }

  const fontSizes = settings?.branding?.fonts?.sizes;
  const fontWeights = settings?.branding?.fonts?.weights;
  const primaryColor = settings?.branding?.colors?.primary || "#4384C5";
  const secondaryColor = settings?.branding?.colors?.secondary || "#053C74";
  const primaryTextColor =
    settings?.branding?.colors?.primaryTextColor || "#000000";
  const secondaryTextColor =
    settings?.branding?.colors?.secondaryTextColor || "#333333";

  const organizationData = await generateOrganizationStructuredData();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${oswald.variable} ${inter.variable}`}
    >
      <head>
        {organizationData ? <StructuredData data={organizationData} /> : null}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            :root {
              --color-primary: ${primaryColor};
              --color-secondary: ${secondaryColor};
              --color-text-primary: ${primaryTextColor};
              --color-text-secondary: ${secondaryTextColor};
              --font-heading: var(--font-oswald), "Oswald", sans-serif;
              --font-body: var(--font-inter), "Inter", sans-serif;
              --font-primary: var(--font-heading);
              --font-paragraph: var(--font-body);
              --site-h1-size: ${fontSizes?.h1 || "2.75rem"};
              --site-h2-size: ${fontSizes?.h2 || "2rem"};
              --site-h3-size: ${fontSizes?.h3 || "1.5rem"};
              --site-h4-size: ${fontSizes?.h4 || "1.25rem"};
              --site-h5-size: ${fontSizes?.h5 || "1.125rem"};
              --site-h6-size: ${fontSizes?.h6 || "1rem"};
              --site-paragraph-size: ${fontSizes?.paragraph || "1rem"};
              --site-h1-weight: ${fontWeights?.h1 || "700"};
              --site-h2-weight: ${fontWeights?.h2 || "600"};
              --site-h3-weight: ${fontWeights?.h3 || "600"};
              --site-h4-weight: ${fontWeights?.h4 || "700"};
              --site-h5-weight: ${fontWeights?.h5 || "600"};
              --site-h6-weight: ${fontWeights?.h6 || "600"};
              --site-paragraph-weight: ${fontWeights?.paragraph || "400"};
            }
          `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="font-body antialiased">
        <Suspense>
          <SiteMotion />
          <BrandColorsLoader />
          {children}
          <Analytics gaId={analyticsConfig.googleAnalyticsId} enabled={analyticsConfig.enabled} />
        </Suspense>
      </body>
    </html>
  );
}

// Force dynamic rendering to ensure settings are always fetched fresh
export const dynamic = "force-dynamic";
export const revalidate = 0;
