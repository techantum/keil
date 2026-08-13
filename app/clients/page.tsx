import type { Metadata } from "next"
import { generateSEOMetadata } from "@/lib/seo"
import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { WhatsAppButton } from "@/components/common/whatsapp-button"
import { ClientsHero } from "@/components/clients/clients-hero"
import { ClientsGrid } from "@/components/clients/clients-grid"
import { getRepository } from "@/lib/repo"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({ path: "/clients" });
}

export default async function ClientsPage() {
  const repo = getRepository()
  const settings = await repo.getSettings()
  const heroData = settings?.pageHeroes?.clients

  return (
    <>
      <Header />
      <main>
        <ClientsHero 
          backgroundImage={heroData?.backgroundImage}
          title={heroData?.title}
        />
        <ClientsGrid />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
