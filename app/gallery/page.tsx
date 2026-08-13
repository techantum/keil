import type { Metadata } from "next"
import { generateSEOMetadata } from "@/lib/seo"
import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { WhatsAppButton } from "@/components/common/whatsapp-button"
import { GalleryHero } from "@/components/gallery/gallery-hero"
import { GalleryGrid } from "@/components/gallery/gallery-grid"
import { getRepository } from "@/lib/repo"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({ path: "/gallery" });
}

export default async function GalleryPage() {
  const repo = getRepository()
  const settings = await repo.getSettings()
  const heroData = settings?.pageHeroes?.gallery

  return (
    <>
      <Header />
      <main>
        <GalleryHero 
          backgroundImage={heroData?.backgroundImage}
          title={heroData?.title}
        />
        <GalleryGrid />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
