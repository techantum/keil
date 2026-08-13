import type {
  AboutPageContent,
  ContactPageContent,
  FooterContent,
} from "@/types";
import {
  defaultAboutPageContent,
  defaultContactPageContent,
  defaultFooterContent,
} from "./default-content";

export { mergeHomeContent } from "@/lib/cms/merge-content";

function pickString(value: string | undefined, fallback: string): string {
  return value?.trim() ? value : fallback;
}

export function mergeAboutContent(data: Partial<AboutPageContent> | null | undefined): AboutPageContent {
  const defaults = defaultAboutPageContent();
  if (!data) return defaults;

  return {
    id: data.id || defaults.id,
    hero: {
      ...defaults.hero,
      ...data.hero,
      backgroundImage: pickString(data.hero?.backgroundImage, defaults.hero.backgroundImage),
    },
    intro: {
      ...defaults.intro,
      ...data.intro,
      badge: pickString(data.intro?.badge, defaults.intro.badge),
      title: pickString(data.intro?.title, defaults.intro.title),
      description: pickString(data.intro?.description, defaults.intro.description),
      image: pickString(data.intro?.image, defaults.intro.image || ""),
    },
    vision: {
      ...defaults.vision,
      ...data.vision,
      badge: pickString(data.vision?.badge, defaults.vision.badge),
      mainHeading: pickString(data.vision?.mainHeading, defaults.vision.mainHeading),
      visionTitle: pickString(data.vision?.visionTitle, defaults.vision.visionTitle),
      visionDescription: pickString(data.vision?.visionDescription, defaults.vision.visionDescription),
      visionImage: pickString(data.vision?.visionImage, defaults.vision.visionImage),
    },
    mission: {
      ...defaults.mission,
      ...data.mission,
      missionTitle: pickString(data.mission?.missionTitle, defaults.mission.missionTitle),
      missionDescription: pickString(data.mission?.missionDescription, defaults.mission.missionDescription),
      missionImage: pickString(data.mission?.missionImage, defaults.mission.missionImage),
    },
    whyUs: {
      ...defaults.whyUs,
      ...data.whyUs,
      badge: pickString(data.whyUs?.badge, defaults.whyUs.badge),
      title: pickString(data.whyUs?.title, defaults.whyUs.title),
      description: pickString(data.whyUs?.description, defaults.whyUs.description),
      image: pickString(data.whyUs?.image, defaults.whyUs.image || ""),
      features: data.whyUs?.features?.length ? data.whyUs.features : defaults.whyUs.features,
    },
    updatedAt: data.updatedAt ?? defaults.updatedAt,
  };
}

export function mergeContactContent(data: Partial<ContactPageContent> | null | undefined): ContactPageContent {
  const defaults = defaultContactPageContent();
  if (!data) return defaults;

  const heroImage = data.hero?.backgroundImage;
  const resolvedHeroImage =
    heroImage && heroImage !== "/placeholder.jpg" && heroImage.trim() !== ""
      ? heroImage
      : defaults.hero.backgroundImage;

  return {
    id: data.id || defaults.id,
    hero: {
      ...defaults.hero,
      ...data.hero,
      title: pickString(data.hero?.title, defaults.hero.title),
      subtitle: pickString(data.hero?.subtitle, defaults.hero.subtitle),
      backgroundImage: resolvedHeroImage,
    },
    contactInfo: {
      ...defaults.contactInfo,
      ...data.contactInfo,
      email: {
        ...defaults.contactInfo.email,
        ...data.contactInfo?.email,
        title: pickString(data.contactInfo?.email?.title, defaults.contactInfo.email.title),
        description: pickString(data.contactInfo?.email?.description, defaults.contactInfo.email.description),
        value: pickString(data.contactInfo?.email?.value, defaults.contactInfo.email.value),
      },
      phone: {
        ...defaults.contactInfo.phone,
        ...data.contactInfo?.phone,
        title: pickString(data.contactInfo?.phone?.title, defaults.contactInfo.phone.title),
        description: pickString(data.contactInfo?.phone?.description, defaults.contactInfo.phone.description),
        value: pickString(data.contactInfo?.phone?.value, defaults.contactInfo.phone.value),
      },
      office: {
        ...defaults.contactInfo.office,
        ...data.contactInfo?.office,
        title: pickString(data.contactInfo?.office?.title, defaults.contactInfo.office.title),
        address: pickString(data.contactInfo?.office?.address, defaults.contactInfo.office.address),
      },
    },
    form: {
      ...defaults.form,
      ...data.form,
      heading: pickString(data.form?.heading, defaults.form.heading),
      description: pickString(data.form?.description, defaults.form.description),
      submitButtonText: pickString(data.form?.submitButtonText, defaults.form.submitButtonText),
      submittingText: pickString(data.form?.submittingText, defaults.form.submittingText),
      successMessage: pickString(data.form?.successMessage, defaults.form.successMessage),
      privacyText: pickString(data.form?.privacyText, defaults.form.privacyText),
    },
    enquiry: {
      ...defaults.enquiry,
      ...data.enquiry,
      title: pickString(data.enquiry?.title, defaults.enquiry.title),
      buttonText: pickString(data.enquiry?.buttonText, defaults.enquiry.buttonText),
      submitButtonText: pickString(data.enquiry?.submitButtonText, defaults.enquiry.submitButtonText),
      submittingText: pickString(data.enquiry?.submittingText, defaults.enquiry.submittingText),
      successMessage: pickString(data.enquiry?.successMessage, defaults.enquiry.successMessage),
      defaultSubtitle: pickString(data.enquiry?.defaultSubtitle, defaults.enquiry.defaultSubtitle),
    },
    updatedAt: data.updatedAt ?? defaults.updatedAt,
  };
}

export function mergeFooterContent(data: Partial<FooterContent> | null | undefined): FooterContent {
  const defaults = defaultFooterContent();
  if (!data) return defaults;

  return {
    id: data.id || defaults.id,
    settings: { ...defaults.settings, ...data.settings },
    productLinksSection: { ...defaults.productLinksSection, ...data.productLinksSection },
    aboutLinksSection: { ...defaults.aboutLinksSection, ...data.aboutLinksSection },
    newsletterSection: { ...defaults.newsletterSection, ...data.newsletterSection },
    contactSection: { ...defaults.contactSection, ...data.contactSection },
    socialSection: { ...defaults.socialSection, ...data.socialSection },
    logo: data.logo || defaults.logo,
    productLinks: data.productLinks?.length ? data.productLinks : defaults.productLinks,
    aboutLinks: data.aboutLinks?.length ? data.aboutLinks : defaults.aboutLinks,
    newsletter: {
      ...defaults.newsletter,
      ...data.newsletter,
      heading: pickString(data.newsletter?.heading, defaults.newsletter.heading),
      placeholder: pickString(data.newsletter?.placeholder, defaults.newsletter.placeholder),
    },
    contact: {
      ...defaults.contact,
      ...data.contact,
      location: pickString(data.contact?.location, defaults.contact.location),
      phone: pickString(data.contact?.phone, defaults.contact.phone),
      email: pickString(data.contact?.email, defaults.contact.email),
    },
    socialMedia: { ...defaults.socialMedia, ...data.socialMedia },
    copyright: pickString(data.copyright, defaults.copyright),
    companyInfo: pickString(data.companyInfo, defaults.companyInfo),
    updatedAt: data.updatedAt ?? defaults.updatedAt,
  };
}
