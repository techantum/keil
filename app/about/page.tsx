import type { Metadata } from "next"
import { generateSEOMetadata } from "@/lib/seo"
import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { WhatsAppButton } from "@/components/common/whatsapp-button"
import { AboutHero } from "@/components/about/about-hero"
import { AboutIntro } from "@/components/about/about-intro"
import { VisionMission } from "@/components/about/vision-mission"
import { WhyLabrix } from "@/components/about/why-labrix"

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    path: "/about",
  })
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <AboutHero />
        <AboutIntro />
        <VisionMission />
        <WhyLabrix />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
