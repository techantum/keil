import type { Metadata } from "next"
import { generateSEOMetadata } from "@/lib/seo"
import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { WhatsAppButton } from "@/components/common/whatsapp-button"
import { ServicesHero } from "@/components/services/services-hero"
import { ServicesGrid } from "@/components/services/services-grid"
import { getRepository } from "@/lib/repo"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    path: "/services",
  })
}

export default async function ServicesPage() {
  const repo = getRepository()
  const settings = await repo.getSettings()
  const heroData = settings?.pageHeroes?.services

  return (
    <>
      <Header />
      <main>
        <ServicesHero 
          backgroundImage={heroData?.backgroundImage}
          title={heroData?.title}
        />
        <ServicesGrid />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
