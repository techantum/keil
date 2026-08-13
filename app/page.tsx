import type { Metadata } from "next";
import { KeilHomePage } from "@/components/client/keil-home-page";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { WhatsAppButton } from "@/components/common/whatsapp-button";
import { LandingPageView } from "@/components/client/landing-page-view";
import { generateSEOMetadata } from "@/lib/seo";
import { listLandingPages } from "@/lib/landing-pages/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getHomepageTakeover() {
  const pages = await listLandingPages();
  return (
    pages.find(
      (p) => p.status === "published" && p.redirect?.mode === "any_slug",
    ) ||
    pages.find(
      (p) =>
        p.status === "published" &&
        p.redirect?.mode === "specific_pages" &&
        (p.redirect.paths || []).includes("/"),
    ) ||
    null
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const takeover = await getHomepageTakeover();
  if (takeover) {
    const title = takeover.seo?.title || takeover.title;
    const description = takeover.seo?.description || undefined;
    const ogImage = takeover.branding?.ogImage?.trim() || undefined;
    const favicon = takeover.branding?.favicon?.trim() || undefined;
    return {
      title,
      description,
      ...(favicon
        ? { icons: { icon: favicon, shortcut: favicon, apple: favicon } }
        : {}),
      openGraph: {
        title,
        description,
        ...(ogImage
          ? { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] }
          : {}),
      },
    };
  }

  return generateSEOMetadata({
    path: "/",
  });
}

export default async function Home() {
  const takeover = await getHomepageTakeover();
  if (takeover) {
    return <LandingPageView page={takeover} homeHref="/" />;
  }

  return (
    <>
      <Header />
      <main>
        <KeilHomePage />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
