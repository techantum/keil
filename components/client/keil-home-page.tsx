"use client";

import { useHomeContent } from "@/hooks/use-home-content";
import { KeilHeroSection } from "@/components/client/keil/hero-section";
import { KeilAboutSection } from "@/components/client/keil/about-section";
import { KeilTeamSection } from "@/components/client/keil/team-section";
import { KeilWhySection } from "@/components/client/keil/why-section";
import { KeilSolutionsSection } from "@/components/client/keil/solutions-section";
import { KeilBenefitsApplicationsSection } from "@/components/client/keil/benefits-section";
import { KeilProjectsSection } from "@/components/client/keil/projects-section";
import { KeilCtaBannerSection } from "@/components/client/keil/cta-banner-section";

export function KeilHomePage() {
  const { content, loading } = useHomeContent();

  if (loading || !content) {
    return (
      <div className="space-y-4 p-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    );
  }

  return (
    <>
      <KeilHeroSection content={content.hero} />
      <KeilAboutSection content={content.aboutKeil} />
      <KeilTeamSection content={content.team} />
      <KeilWhySection content={content.whyKeil} />
      <KeilSolutionsSection content={content.solutions} />
      <KeilBenefitsApplicationsSection content={content.benefitsApplications} />
      <KeilProjectsSection content={content.projects} />
      <KeilCtaBannerSection content={content.ctaBanner} />
    </>
  );
}
