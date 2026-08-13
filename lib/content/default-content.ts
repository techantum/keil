import type {
  AboutPageContent,
  ContactPageContent,
  FooterContent,
  HomePageContent,
  Settings,
} from "@/types";

/** Shared placeholder assets for the public site */
export const PLACEHOLDER_HERO = "/keil/hero-ec-shed.jpg";
export const PLACEHOLDER_IMAGE = "/keil/about-chickens.jpg";
export const PLACEHOLDER_PRODUCT = "/product-placeholder.svg";

/** Section-specific stock imagery (poultry / farm / industrial — not the UI mock) */
export const KEIL_IMAGES = {
  hero: "/keil/hero-ec-shed.jpg",
  about: "/keil/about-chickens.jpg",
  team1: "/keil/team-1.jpg",
  team2: "/keil/team-2.jpg",
  team3: "/keil/team-3.jpg",
  solutionShed: "/keil/solution-shed.jpg",
  solutionPanels: "/keil/solution-panels.png",
  solutionVent: "/keil/solution-vent.jpg",
  solutionFeed: "/keil/solution-feed.jpg",
  solutionWater: "/keil/solution-water.jpg",
  solutionAuto: "/keil/solution-auto.jpg",
  solutionTurnkey: "/keil/solution-turnkey.jpg",
  appBroiler: "/keil/app-broiler.jpg",
  appLayer: "/keil/app-layer.jpg",
  appBreeder: "/keil/app-breeder.jpg",
  project1: "/keil/project-1.jpg",
  project2: "/keil/project-2.jpg",
  project3: "/keil/project-3.jpg",
  project4: "/keil/project-4.jpg",
  project5: "/keil/project-5.jpg",
  cta: "/keil/cta-chicken.jpg",
} as const;

/** KEIL brand colors — also set in default-settings branding */
export const KEIL_COLORS = {
  green: "#5BA525",
  navy: "#002B5B",
  navyDark: "#0B2545",
  grayBg: "#F8F9FA",
  text: "#333333",
} as const;

export const DEFAULT_NAV_LABELS = {
  home: "Home",
  about: "About Us",
  products: "Solutions",
  services: "Why KEIL",
  gallery: "Projects",
  clients: "Resources",
  testimonials: "Testimonials",
  contact: "Contact Us",
} as const;

export const defaultHomePageContent = (): HomePageContent => ({
  id: "home",
  hero: {
    enabled: true,
    title: "ENGINEERED EC SHEDS FOR MODERN POULTRY FARMING",
    titleTag: "h1",
    tagline: "Better Environment. Better Performance. Better Farms.",
    taglineTag: "p",
    description:
      "KEIL (Koneru Engineering & Infrastructure Private Limited) designs, builds and delivers environment-controlled poultry sheds engineered for performance, durability and long-term farm profitability across Andhra Pradesh and Telangana.",
    descriptionTag: "p",
    primaryButtonText: "Get a Project Consultation",
    primaryButtonLink: "/contact",
    secondaryButtonText: "Explore EC Shed Solutions",
    secondaryButtonLink: "#solutions",
    mediaType: "image",
    backgroundImage: KEIL_IMAGES.hero,
    backgroundVideo: "",
    carouselImages: [],
    badgeText: "BUILT FOR A GREENER TOMORROW",
    badgeImage: "",
    features: [
      { icon: "settings", title: "Engineered Solutions" },
      { icon: "workflow", title: "End-to-End Execution" },
      { icon: "shield-check", title: "Built for Performance" },
      { icon: "leaf", title: "Trusted Across AP & Telangana" },
    ],
  },
  aboutKeil: {
    enabled: true,
    badge: "ABOUT KEIL",
    badgeTag: "p",
    title: "Engineering Better Infrastructure for Poultry Farming",
    titleTag: "h2",
    description:
      "KEIL is a Hyderabad-based engineering and infrastructure company focused on poultry farm development. We combine structural engineering, environmental control systems and practical farm execution to deliver sheds that perform in real operating conditions — not just on paper.",
    descriptionTag: "p",
    subHeading: "From Concept to Commissioning",
    subHeadingTag: "h3",
    subDescription:
      "Whether you are setting up a new farm or upgrading an existing facility, KEIL supports you from site planning and shed design through construction, equipment integration and handover.",
    image: KEIL_IMAGES.about,
    imageBadge: "BUILDING INDIA GREENER TOMORROW",
    glanceTitle: "COMPANY AT A GLANCE",
    glanceItems: [
      { icon: "calendar", label: "Established", value: "2021" },
      { icon: "map-pin", label: "Location", value: "Hyderabad, Telangana" },
      { icon: "building", label: "Industry", value: "Engineering & Infrastructure" },
      {
        icon: "target",
        label: "Core Focus",
        value: "Poultry Infrastructure & EC Shed Solutions",
      },
    ],
  },
  team: {
    enabled: true,
    badge: "LEADERSHIP",
    badgeTag: "p",
    title: "MANAGEMENT & CORE TEAM",
    titleTag: "h2",
    subtitle: "Experienced Leadership, Engineering-Driven Execution",
    subtitleTag: "p",
    buttonText: "Know More About KEIL",
    buttonLink: "/about",
    members: [
      {
        name: "Mr. Hidayath Khan",
        role: "Chairman / Chairperson",
        bio: "Provides strategic direction and oversees KEIL's long-term vision for sustainable poultry infrastructure development.",
        image: KEIL_IMAGES.team1,
      },
      {
        name: "Mr. Hyder Khan",
        role: "Managing Director",
        bio: "Leads operations, project execution and client partnerships with a focus on quality delivery and farm performance.",
        image: KEIL_IMAGES.team2,
      },
      {
        name: "Mr. Rahman Khan",
        role: "Director — Engineering",
        bio: "Drives engineering standards, shed design innovation and technical excellence across all KEIL projects.",
        image: KEIL_IMAGES.team3,
      },
    ],
  },
  whyKeil: {
    enabled: true,
    badge: "WHY KEIL?",
    badgeTag: "p",
    title: "More Than a Shed. An Engineered Farm Environment.",
    titleTag: "h2",
    description:
      "Poultry performance depends on the environment inside the shed. KEIL approaches every project as an integrated system — structure, insulation, ventilation, feeding and automation working together.",
    descriptionTag: "p",
    promiseTitle: "Our Promise",
    promiseItems: [
      "Engineered designs tailored to your farm scale and climate",
      "Quality materials and proven construction methods",
      "End-to-end project support from planning to commissioning",
    ],
    promiseButtonText: "Talk to a KEIL Expert",
    promiseButtonLink: "/contact",
    features: [
      {
        icon: "gauge",
        title: "Engineered for Performance",
        description: "Sheds designed for optimal airflow, insulation and bird comfort.",
      },
      {
        icon: "sliders",
        title: "Customized Solutions",
        description: "Layouts and systems tailored to your farm requirements.",
      },
      {
        icon: "shield-check",
        title: "Quality Materials",
        description: "PUF panels, ventilation and equipment from trusted suppliers.",
      },
      {
        icon: "thermometer",
        title: "Controlled Environment",
        description: "Precise temperature and humidity management for better yields.",
      },
      {
        icon: "workflow",
        title: "End-to-End Execution",
        description: "Single partner from design through construction and handover.",
      },
      {
        icon: "headphones",
        title: "Long-Term Support",
        description: "Continued assistance after project completion.",
      },
    ],
  },
  solutions: {
    enabled: true,
    title: "OUR EC SHED SOLUTIONS",
    titleTag: "h2",
    buttonText: "Build Your EC Shed with KEIL",
    buttonLink: "/contact",
    items: [
      {
        title: "EC Poultry Sheds",
        description: "Complete environment-controlled shed structures for modern poultry farms.",
        image: KEIL_IMAGES.solutionShed,
      },
      {
        title: "PUF Insulated Panels",
        description: "High-performance insulated panels for thermal efficiency and durability.",
        image: KEIL_IMAGES.solutionPanels,
      },
      {
        title: "Ventilation Systems",
        description: "Engineered airflow solutions for optimal bird health and productivity.",
        image: KEIL_IMAGES.solutionVent,
      },
      {
        title: "Feeding Systems",
        description: "Automated feeding solutions for efficient farm operations.",
        image: KEIL_IMAGES.solutionFeed,
      },
      {
        title: "Drinking Systems",
        description: "Reliable nipple and drinking line systems for clean water delivery.",
        image: KEIL_IMAGES.solutionWater,
      },
      {
        title: "Farm Automation",
        description: "Smart controls for lighting, climate and monitoring systems.",
        image: KEIL_IMAGES.solutionAuto,
      },
      {
        title: "Turnkey Poultry Projects",
        description: "Complete farm setup from design to commissioning.",
        image: KEIL_IMAGES.solutionTurnkey,
      },
    ],
  },
  benefitsApplications: {
    enabled: true,
    benefits: {
      title: "KEY BENEFITS",
      titleTag: "h2",
      description:
        "Environment-controlled sheds deliver measurable improvements in bird health, feed conversion and operational efficiency.",
      items: [
        "Better Environmental Control",
        "Improved Bird Health & Welfare",
        "Higher Productivity & Yield",
        "Energy-Conscious Design",
        "Reduced Mortality Rates",
        "Lower Feed Conversion Ratio",
        "Year-Round Production Stability",
        "Long-Term Structural Durability",
      ],
      outcomeTitle: "THE KEIL OUTCOME",
      outcomeSteps: [
        "Better Control",
        "Better Farm Conditions",
        "Better Operational Performance",
      ],
    },
    applications: {
      title: "APPLICATIONS",
      titleTag: "h2",
      description:
        "KEIL EC sheds are designed for every type of commercial poultry operation.",
      exploreText: "Explore Applications",
      exploreLink: "/services",
      items: [
        { title: "Broiler Farms", image: KEIL_IMAGES.appBroiler, link: "/services" },
        { title: "Layer Farms", image: KEIL_IMAGES.appLayer, link: "/services" },
        { title: "Breeder Farms", image: KEIL_IMAGES.appBreeder, link: "/services" },
      ],
    },
  },
  projects: {
    enabled: true,
    title: "OUR RECENT PROJECTS",
    titleTag: "h2",
    buttonText: "View All Projects",
    buttonLink: "/gallery",
    images: [
      { image: KEIL_IMAGES.project1, title: "EC Shed Project 1", alt: "KEIL EC shed exterior" },
      { image: KEIL_IMAGES.project2, title: "EC Shed Project 2", alt: "KEIL poultry farm interior" },
      { image: KEIL_IMAGES.project3, title: "EC Shed Project 3", alt: "KEIL ventilation system" },
      { image: KEIL_IMAGES.project4, title: "EC Shed Project 4", alt: "KEIL farm construction" },
      { image: KEIL_IMAGES.project5, title: "EC Shed Project 5", alt: "KEIL completed project" },
    ],
  },
  ctaBanner: {
    enabled: true,
    title: "Ready to Build Better Farms?",
    titleTag: "h2",
    description:
      "Connect with KEIL today for a project consultation. Our team is ready to help you plan, design and build your next EC poultry shed.",
    phone: "90505 40505",
    image: KEIL_IMAGES.cta,
    features: [
      { icon: "settings", title: "Expert Engineering" },
      { icon: "shield-check", title: "Quality Assured" },
      { icon: "truck", title: "Timely Delivery" },
      { icon: "headphones", title: "Dedicated Support" },
    ],
  },
  stats: {
    enabled: false,
    yearsExperience: 2021,
    yearsExperienceLabel: "Established",
    productsDelivered: 50,
    productsDeliveredLabel: "Projects Delivered",
    satisfiedClients: 40,
    satisfiedClientsLabel: "Happy Clients",
    countriesServed: 2,
    countriesServedLabel: "States Served",
  },
  aboutPreview: {
    enabled: false,
    badge: "About Us",
    badgeTag: "p",
    title: "Your Trusted Business Partner",
    titleTag: "h2",
    description: "",
    descriptionTag: "p",
    image: PLACEHOLDER_IMAGE,
    features: [],
    primaryButtonText: "Learn More",
    secondaryButtonText: "Contact Us",
  },
  process: {
    enabled: false,
    title: "Our Process",
    titleTag: "h2",
    subtitle: "How we work with you",
    subtitleTag: "p",
    steps: [],
  },
  updatedAt: new Date(),
});

export const defaultAboutPageContent = (): AboutPageContent => ({
  id: "about",
  hero: { enabled: true, backgroundImage: PLACEHOLDER_HERO },
  intro: {
    enabled: true,
    badge: "Who We Are",
    badgeTag: "p",
    title: "About Our Company",
    titleTag: "h1",
    description:
      "Tell your story here. Share your mission, values, and what makes your business unique. Edit this content in Admin → CMS → About.",
    descriptionTag: "p",
    image: PLACEHOLDER_IMAGE,
  },
  vision: {
    enabled: true,
    badge: "Vision & Mission",
    badgeTag: "p",
    mainHeading: "Driving Excellence",
    mainHeadingTag: "h2",
    visionTitle: "Our Vision",
    visionTitleTag: "h3",
    visionDescription:
      "To be a leading provider of quality solutions that exceed customer expectations.",
    visionDescriptionTag: "p",
    visionImage: PLACEHOLDER_IMAGE,
  },
  mission: {
    enabled: true,
    missionTitle: "Our Mission",
    missionTitleTag: "h3",
    missionDescription:
      "To deliver exceptional value through innovation, integrity, and customer-focused service.",
    missionDescriptionTag: "p",
    missionImage: PLACEHOLDER_IMAGE,
  },
  whyUs: {
    enabled: true,
    badge: "Why Choose Us",
    badgeTag: "p",
    title: "What Sets Us Apart",
    titleTag: "h2",
    description:
      "Quality products, expert support, and a commitment to your success.",
    descriptionTag: "p",
    image: PLACEHOLDER_IMAGE,
    features: [],
  },
  updatedAt: new Date(),
});

export const defaultContactPageContent = (): ContactPageContent => ({
  id: "contact",
  hero: {
    enabled: true,
    title: "Contact Us",
    titleTag: "h1",
    subtitle: "We'd love to hear from you",
    subtitleTag: "p",
    backgroundImage: PLACEHOLDER_HERO,
  },
  contactInfo: {
    enabled: true,
    email: {
      title: "Email",
      description: "Send us a message anytime",
      value: "contact@example.com",
    },
    phone: {
      title: "Phone",
      description: "Mon–Fri, 9am–6pm",
      value: "+1 (555) 000-0000",
    },
    office: {
      title: "Office",
      address: "123 Business Street\nCity, State 12345",
    },
  },
  form: {
    enabled: true,
    heading: "Get in touch",
    headingTag: "h2",
    description: "We'd love to hear from you. Please fill out this form.",
    descriptionTag: "p",
    submitButtonText: "Send Message",
    submittingText: "Sending...",
    successMessage: "Message sent successfully! We will contact you soon.",
    privacyText: "You agree to our friendly privacy policy.",
  },
  enquiry: {
    enabled: true,
    title: "Enquiry Now!",
    titleTag: "h2",
    buttonText: "Enquiry Now",
    submitButtonText: "Submit",
    submittingText: "Submitting...",
    successMessage: "Enquiry submitted successfully! We will contact you soon.",
    defaultSubtitle: "Product Enquiry",
  },
  updatedAt: new Date(),
});

export const defaultFooterContent = (): FooterContent => ({
  id: "footer",
  settings: { enabled: true },
  productLinksSection: { enabled: true, title: "Our Solutions" },
  aboutLinksSection: { enabled: true, title: "Quick Links" },
  resourcesLinksSection: { enabled: true, title: "Resources" },
  newsletterSection: { enabled: false },
  contactSection: { enabled: true, title: "Contact Us" },
  socialSection: { enabled: true },
  logo: "",
  companyInfo:
    "KEIL (Koneru Engineering & Infrastructure Private Limited) — Building Better Farms. Growing Together.",
  productLinks: [
    { name: "EC Poultry Sheds", href: "#solutions" },
    { name: "PUF Insulated Panels", href: "#solutions" },
    { name: "Ventilation Systems", href: "#solutions" },
    { name: "Farm Automation", href: "#solutions" },
    { name: "Turnkey Projects", href: "#solutions" },
  ],
  aboutLinks: [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Solutions", href: "#solutions" },
    { name: "Why KEIL", href: "#why-keil" },
    { name: "Projects", href: "/gallery" },
    { name: "Contact Us", href: "/contact" },
  ],
  resourcesLinks: [
    { name: "Brochures", href: "/gallery" },
    { name: "Case Studies", href: "/gallery" },
    { name: "Project Gallery", href: "/gallery" },
    { name: "FAQs", href: "/contact" },
  ],
  legalLinks: [
    { name: "Terms & Conditions", href: "/contact" },
    { name: "Privacy Policy", href: "/contact" },
  ],
  socialMedia: {},
  newsletter: { heading: "Stay Updated", headingTag: "p", placeholder: "Enter your email" },
  contact: {
    location: "Hyderabad, Telangana, India",
    phone: "90505 40505",
    email: "info@keil.in",
  },
  copyright: `© ${new Date().getFullYear()} Koneru Engineering & Infrastructure Private Limited. All rights reserved.`,
  updatedAt: new Date(),
});

export const defaultPublicSettings = () => ({
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
  branding: {
    websiteLogo: "/logo.png",
    colors: {
      primary: KEIL_COLORS.green,
      secondary: KEIL_COLORS.navy,
      primaryTextColor: KEIL_COLORS.text,
      secondaryTextColor: "#656565",
    },
  },
  pageHeroes: {
    products: { backgroundImage: PLACEHOLDER_HERO, title: "Solutions" },
    services: { backgroundImage: PLACEHOLDER_HERO, title: "Why KEIL" },
    gallery: { backgroundImage: PLACEHOLDER_HERO, title: "Projects" },
    clients: { backgroundImage: PLACEHOLDER_HERO, title: "Resources" },
    testimonials: { backgroundImage: PLACEHOLDER_HERO, title: "Testimonials" },
  },
  seo: {
    siteName: "KEIL — Koneru Engineering & Infrastructure",
    pages: {
      home: {
        title: "KEIL | Engineered EC Sheds for Modern Poultry Farming",
        description:
          "KEIL designs and builds environment-controlled poultry sheds across AP & Telangana. Engineering better infrastructure for modern poultry farming.",
        keywords: ["EC sheds", "poultry farming", "KEIL", "Hyderabad", "Telangana"],
      },
      about: { title: "About KEIL", description: "Learn about KEIL and our leadership team.", keywords: [] },
      products: { title: "EC Shed Solutions", description: "Explore KEIL EC shed solutions.", keywords: [] },
      services: { title: "Why KEIL", description: "Why choose KEIL for your poultry infrastructure.", keywords: [] },
      gallery: { title: "Projects", description: "View KEIL recent poultry farm projects.", keywords: [] },
      clients: { title: "Resources", description: "KEIL resources and materials.", keywords: [] },
      testimonials: { title: "Testimonials", description: "What clients say about KEIL.", keywords: [] },
      contact: { title: "Contact KEIL", description: "Get in touch with KEIL for a project consultation.", keywords: [] },
    },
  },
});

/** Pick CMS value or fallback default */
export function withDefault<T>(value: T | undefined | null, fallback: T): T {
  if (value === undefined || value === null) return fallback;
  if (typeof value === "string" && value.trim() === "") return fallback;
  return value;
}

export function mergePageHero(
  hero: Settings["pageHeroes"][keyof Settings["pageHeroes"]] | undefined,
  defaults: Settings["pageHeroes"][keyof Settings["pageHeroes"]],
) {
  return {
    title: withDefault(hero?.title, defaults.title),
    backgroundImage: withDefault(hero?.backgroundImage, defaults.backgroundImage),
  };
}
