import type { Metadata } from "next"
import { generateSEOMetadata } from "@/lib/seo"
import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { WhatsAppButton } from "@/components/common/whatsapp-button"
import { TestimonialsHero } from "@/components/testimonials/testimonials-hero"
import { TestimonialsGrid } from "@/components/testimonials/testimonials-grid"
import { getRepository } from "@/lib/repo"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({ path: "/testimonials" });
}

export default async function TestimonialsPage() {
  const repo = getRepository()
  const settings = await repo.getSettings()
  const heroData = settings?.pageHeroes?.testimonials

  return (
    <>
      <Header />
      <main>
        <TestimonialsHero 
          backgroundImage={heroData?.backgroundImage}
          title={heroData?.title}
        />
        <TestimonialsGrid />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
