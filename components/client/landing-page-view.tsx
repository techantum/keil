import { LandingHeader } from "@/components/common/landing-header";
import { LandingBrandScope } from "@/components/common/landing-brand-scope";
import { Footer } from "@/components/common/footer";
import { WhatsAppButton } from "@/components/common/whatsapp-button";
import { LandingPageRenderer } from "@/components/client/landing-page-renderer";
import { ConsultationProvider } from "@/components/keil/consultation-provider";
import type { LandingPage } from "@/types/landing-page";

export function LandingPageView({
  page,
  homeHref,
}: {
  page: LandingPage;
  homeHref?: string;
}) {
  const shedKinds = (page.sections.find((s) => s.type === "applications")?.items || [])
    .map((i) => i.title)
    .filter(Boolean);

  return (
    <LandingBrandScope branding={page.branding}>
      <ConsultationProvider shedKinds={shedKinds}>
        <LandingHeader page={page} homeHref={homeHref} />
        <main>
          <LandingPageRenderer page={page} />
        </main>
        <Footer logoOverride={page.branding?.footerLogo || undefined} />
        <WhatsAppButton />
      </ConsultationProvider>
    </LandingBrandScope>
  );
}
