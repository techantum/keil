import type { Settings } from "@/types";
import { KEIL_COLORS, PLACEHOLDER_HERO } from "@/lib/content/default-content";

/** KEIL defaults for new CMS installations */
export const defaultSettingsData: Omit<Settings, "id" | "updatedAt"> = {
  seo: {
    siteName: "KEIL — Koneru Engineering & Infrastructure",
    siteDescription:
      "Engineered EC sheds for modern poultry farming across AP & Telangana.",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    ogImage: "/keil/hero-ec-shed.jpg",
    twitterHandle: "",
    keywords: ["EC sheds", "poultry farming", "KEIL", "Hyderabad"],
    pages: {
      home: {
        title: "KEIL | Engineered EC Sheds for Modern Poultry Farming",
        description:
          "KEIL designs and builds environment-controlled poultry sheds across AP & Telangana.",
        keywords: ["EC sheds", "poultry", "KEIL"],
      },
      about: { title: "About KEIL", description: "Learn about KEIL.", keywords: [] },
      products: { title: "EC Shed Solutions", description: "Explore KEIL solutions.", keywords: [] },
      services: { title: "Why KEIL", description: "Why choose KEIL.", keywords: [] },
      gallery: { title: "Projects", description: "View KEIL projects.", keywords: [] },
      clients: { title: "Resources", description: "KEIL resources.", keywords: [] },
      testimonials: { title: "Testimonials", description: "Client testimonials.", keywords: [] },
      contact: { title: "Contact KEIL", description: "Get in touch with KEIL.", keywords: [] },
    },
  },
  pageHeroes: {
    products: { backgroundImage: PLACEHOLDER_HERO, title: "Solutions" },
    services: { backgroundImage: PLACEHOLDER_HERO, title: "Why KEIL" },
    gallery: { backgroundImage: PLACEHOLDER_HERO, title: "Projects" },
    clients: { backgroundImage: PLACEHOLDER_HERO, title: "Resources" },
    testimonials: { backgroundImage: PLACEHOLDER_HERO, title: "Testimonials" },
  },
  branding: {
    websiteLogo: "/logo.png",
    websiteFavicon: "/favicon.ico",
    dashboardLogo: "/logo.png",
    dashboardFavicon: "/favicon.ico",
    navbarPhone: "",
    colors: {
      primary: KEIL_COLORS.green,
      secondary: KEIL_COLORS.navy,
      primaryTextColor: KEIL_COLORS.text,
      secondaryTextColor: "#656565",
    },
    fonts: {
      primaryFont: "Oswald",
      secondaryFont: "Oswald",
      paragraphFont: "Inter",
      fontSource: "google",
      googleFontUrl:
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@500;600;700&display=swap",
      sizes: {
        h1: "2.75rem",
        h2: "2rem",
        h3: "1.5rem",
        h4: "1.25rem",
        h5: "1.125rem",
        h6: "1rem",
        paragraph: "1rem",
      },
      weights: {
        h1: "700",
        h2: "600",
        h3: "600",
        h4: "700",
        h5: "600",
        h6: "600",
        paragraph: "400",
      },
    },
  },
  company: {
    name: "KEIL",
    address: {
      street: "",
      city: "Hyderabad",
      state: "Telangana",
      zipCode: "",
      country: "India",
    },
    phone: "90505 40505",
    email: "info@keil.in",
    socialMedia: {
      facebook: "",
      twitter: "",
      linkedin: "",
      youtube: "",
      instagram: "",
      whatsapp: "",
    },
  },
};
