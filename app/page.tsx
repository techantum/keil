import type { Metadata } from "next";
import { KeilHomePage } from "@/components/client/keil-home-page";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { WhatsAppButton } from "@/components/common/whatsapp-button";
import { generateSEOMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    path: "/",
  });
}

export default function Home() {
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
