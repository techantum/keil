import type { Metadata } from "next"
import { generateSEOMetadata } from "@/lib/seo"
import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { ContactHero } from "@/components/contact/contact-hero"
import { ContactForm } from "@/components/contact/contact-form"
import { ContactInfo } from "@/components/contact/contact-info"
import { WhatsAppButton } from "@/components/common/whatsapp-button"
import { ScrollReveal } from "@/components/common/scroll-reveal"

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    path: "/contact",
  })
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <ContactHero />
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              <ScrollReveal>
                <ContactForm />
              </ScrollReveal>
              <ScrollReveal delay={120}>
                <ContactInfo />
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
