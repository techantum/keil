import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingHeader } from "@/components/common/landing-header";
import { LandingBrandScope } from "@/components/common/landing-brand-scope";
import { Footer } from "@/components/common/footer";
import { WhatsAppButton } from "@/components/common/whatsapp-button";
import { LandingPageRenderer } from "@/components/client/landing-page-renderer";
import { ConsultationProvider } from "@/components/keil/consultation-provider";
import { getLandingPageBySlug } from "@/lib/landing-pages/store";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);
  if (!page || page.status !== "published") {
    return { title: "Landing Page" };
  }

  const title = page.seo?.title || page.title;
  const description = page.seo?.description || undefined;
  const ogImage = page.branding?.ogImage?.trim() || undefined;
  const favicon = page.branding?.favicon?.trim() || undefined;

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
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function PublicLandingPage({ params }: Props) {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);
  if (!page || page.status !== "published") {
    notFound();
  }

  const shedKinds = (page.sections.find((s) => s.type === "applications")?.items || [])
    .map((i) => i.title)
    .filter(Boolean);

  return (
    <LandingBrandScope branding={page.branding}>
      <ConsultationProvider shedKinds={shedKinds}>
        <LandingHeader page={page} />
        <main>
          <LandingPageRenderer page={page} />
        </main>
        <Footer logoOverride={page.branding?.footerLogo || undefined} />
        <WhatsAppButton />
      </ConsultationProvider>
    </LandingBrandScope>
  );
}
