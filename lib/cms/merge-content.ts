import {
  defaultAboutPageContent,
  defaultContactPageContent,
  defaultHomePageContent,
} from "@/lib/content/default-content";
import type {
  AboutPageContent,
  ContactPageContent,
  HomePageContent,
} from "@/types";

export { mergeFooterContent } from "@/lib/content/merge-content";

export function mergeHomeContent(data: Partial<HomePageContent>): HomePageContent {
  const d = defaultHomePageContent();
  return {
    ...d,
    ...data,
    hero: {
      ...d.hero,
      ...data.hero,
      features: data.hero?.features ?? d.hero.features,
    },
    aboutKeil: {
      ...d.aboutKeil,
      ...data.aboutKeil,
      glanceItems: data.aboutKeil?.glanceItems ?? d.aboutKeil.glanceItems,
    },
    team: {
      ...d.team,
      ...data.team,
      members: data.team?.members ?? d.team.members,
    },
    whyKeil: {
      ...d.whyKeil,
      ...data.whyKeil,
      promiseItems: data.whyKeil?.promiseItems ?? d.whyKeil.promiseItems,
      features: data.whyKeil?.features ?? d.whyKeil.features,
    },
    solutions: {
      ...d.solutions,
      ...data.solutions,
      items: data.solutions?.items ?? d.solutions.items,
    },
    benefitsApplications: {
      ...d.benefitsApplications,
      ...data.benefitsApplications,
      benefits: {
        ...d.benefitsApplications.benefits,
        ...data.benefitsApplications?.benefits,
        items:
          data.benefitsApplications?.benefits?.items ??
          d.benefitsApplications.benefits.items,
        outcomeSteps:
          data.benefitsApplications?.benefits?.outcomeSteps ??
          d.benefitsApplications.benefits.outcomeSteps,
      },
      applications: {
        ...d.benefitsApplications.applications,
        ...data.benefitsApplications?.applications,
        items:
          data.benefitsApplications?.applications?.items ??
          d.benefitsApplications.applications.items,
      },
    },
    projects: {
      ...d.projects,
      ...data.projects,
      images: data.projects?.images ?? d.projects.images,
    },
    ctaBanner: {
      ...d.ctaBanner,
      ...data.ctaBanner,
      features: data.ctaBanner?.features ?? d.ctaBanner.features,
    },
    stats: { ...d.stats, ...data.stats },
    aboutPreview: {
      ...d.aboutPreview,
      ...data.aboutPreview,
      features: data.aboutPreview?.features ?? d.aboutPreview.features,
    },
    process: {
      ...d.process,
      ...data.process,
      steps: data.process?.steps ?? d.process.steps,
    },
  };
}

export function mergeAboutContent(data: Partial<AboutPageContent>): AboutPageContent {
  const d = defaultAboutPageContent();
  return {
    ...d,
    ...data,
    hero: { ...d.hero, ...data.hero },
    intro: { ...d.intro, ...data.intro },
    vision: { ...d.vision, ...data.vision },
    mission: { ...d.mission, ...data.mission },
    whyUs: {
      ...d.whyUs,
      ...data.whyUs,
      features: data.whyUs?.features ?? d.whyUs.features,
    },
  };
}

export function mergeContactContent(data: Partial<ContactPageContent>): ContactPageContent {
  const d = defaultContactPageContent();
  return {
    ...d,
    ...data,
    hero: { ...d.hero, ...data.hero },
    contactInfo: {
      email: { ...d.contactInfo.email, ...data.contactInfo?.email },
      phone: { ...d.contactInfo.phone, ...data.contactInfo?.phone },
      office: { ...d.contactInfo.office, ...data.contactInfo?.office },
      enabled: data.contactInfo?.enabled ?? d.contactInfo.enabled,
    },
    form: { ...d.form, ...data.form },
    enquiry: { ...d.enquiry, ...data.enquiry },
  };
}
