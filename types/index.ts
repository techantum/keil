export interface Service {
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
  image: string
  slug: string
  features: string[]
  featured?: boolean
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
  createdAt: Date
  updatedAt: Date
  shortDescription?: string // Add this for frontend compatibility
}

export interface ProductDetailItem {
  title: string
  description: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  category: string
  categoryId?: string
  image?: string
  detailsSectionTitle?: string
  details?: ProductDetailItem[]
  // Legacy specification fields (read-only fallback for older records)
  productType?: string
  capacity?: string
  screenDimension?: string
  numberOfDecks?: string
  motorPower?: string
  gyratoryCircular?: string
  specialFeatures?: string
  availability?: string
  featured?: boolean
  // SEO fields
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon?: string
  image?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface GalleryItem {
  id: string
  name: string
  image: string
  category?: string
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Client {
  id: string
  name: string
  logo: string
  website?: string
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Testimonial {
  id: string
  name: string
  title: string
  company: string
  content: string
  image?: string
  rating?: number
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Enquiry {
  id: string
  type: "general" | "product" | "general_product" | "bulk" | "service"
  name: string
  email: string
  phone?: string
  company?: string
  productName?: string
  productCategory?: string
  selectedProductId?: string
  message?: string
  status: "pending" | "contacted" | "resolved"
  stage?: "new" | "contacted" | "qualified" | "proposal" | "won" | "lost"
  priority?: "low" | "medium" | "high"
  assignedTo?: string
  source?: string
  followUpAt?: Date
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface LeadActivity {
  id: string
  leadId: string
  activityType: "note" | "status_change" | "stage_change" | "follow_up"
  content: string
  createdBy?: string
  createdAt: Date
}

export type HeroMediaType = "image" | "video" | "carousel"

export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p"

export interface HomeIconTextItem {
  icon: string
  title: string
  description?: string
}

export interface HomeImageCardItem {
  title: string
  description: string
  image: string
  link?: string
}

export interface HomeTeamMember {
  name: string
  role: string
  bio: string
  image: string
}

export interface HomeGlanceItem {
  icon: string
  label: string
  value: string
}

export interface HomeProjectImage {
  image: string
  title?: string
  alt?: string
}

export interface HomePageContent {
  id: string
  hero: {
    enabled?: boolean
    title: string
    titleTag?: HeadingTag
    tagline?: string
    taglineTag?: HeadingTag
    description: string
    descriptionTag?: HeadingTag
    primaryButtonText: string
    primaryButtonLink: string
    secondaryButtonText: string
    secondaryButtonLink: string
    mediaType?: HeroMediaType
    backgroundImage: string
    backgroundVideo?: string
    carouselImages?: string[]
    badgeText?: string
    badgeImage?: string
    features?: HomeIconTextItem[]
  }
  aboutKeil: {
    enabled?: boolean
    badge: string
    badgeTag?: HeadingTag
    title: string
    titleTag?: HeadingTag
    description: string
    descriptionTag?: HeadingTag
    subHeading?: string
    subHeadingTag?: HeadingTag
    subDescription?: string
    image?: string
    imageBadge?: string
    glanceTitle?: string
    glanceItems: HomeGlanceItem[]
  }
  team: {
    enabled?: boolean
    badge?: string
    badgeTag?: HeadingTag
    title: string
    titleTag?: HeadingTag
    subtitle: string
    subtitleTag?: HeadingTag
    buttonText: string
    buttonLink: string
    members: HomeTeamMember[]
  }
  whyKeil: {
    enabled?: boolean
    badge: string
    badgeTag?: HeadingTag
    title: string
    titleTag?: HeadingTag
    description: string
    descriptionTag?: HeadingTag
    promiseTitle: string
    promiseItems: string[]
    promiseButtonText: string
    promiseButtonLink: string
    features: HomeIconTextItem[]
  }
  solutions: {
    enabled?: boolean
    title: string
    titleTag?: HeadingTag
    buttonText: string
    buttonLink: string
    items: HomeImageCardItem[]
  }
  benefitsApplications: {
    enabled?: boolean
    benefits: {
      title: string
      titleTag?: HeadingTag
      description: string
      items: string[]
      outcomeTitle: string
      outcomeSteps: string[]
    }
    applications: {
      title: string
      titleTag?: HeadingTag
      description: string
      exploreText: string
      exploreLink: string
      items: Array<{ title: string; image: string; link?: string }>
    }
  }
  projects: {
    enabled?: boolean
    title: string
    titleTag?: HeadingTag
    buttonText: string
    buttonLink: string
    images: HomeProjectImage[]
  }
  ctaBanner: {
    enabled?: boolean
    title: string
    titleTag?: HeadingTag
    description: string
    phone: string
    image?: string
    features: HomeIconTextItem[]
  }
  /** @deprecated Legacy starter-kit section — kept for CMS backward compatibility */
  stats: {
    enabled?: boolean
    yearsExperience: number
    yearsExperienceLabel: string
    productsDelivered: number
    productsDeliveredLabel: string
    satisfiedClients: number
    satisfiedClientsLabel: string
    countriesServed: number
    countriesServedLabel: string
  }
  /** @deprecated Legacy starter-kit section — kept for CMS backward compatibility */
  aboutPreview: {
    enabled?: boolean
    badge: string
    badgeTag?: HeadingTag
    title: string
    titleTag?: HeadingTag
    description: string
    descriptionTag?: HeadingTag
    image?: string
    features: Array<{
      icon: string
      title: string
      description: string
    }>
    primaryButtonText: string
    secondaryButtonText: string
  }
  /** @deprecated Legacy starter-kit section — kept for CMS backward compatibility */
  process: {
    enabled?: boolean
    title: string
    titleTag?: HeadingTag
    subtitle: string
    subtitleTag?: HeadingTag
    steps: Array<{
      number: string
      title: string
      description: string
      icon: string
    }>
  }
  updatedAt: Date
}

export interface AboutPageContent {
  id: string
  hero: {
    enabled?: boolean
    backgroundImage: string
  }
  intro: {
    enabled?: boolean
    badge: string
    badgeTag?: HeadingTag
    title: string
    titleTag?: HeadingTag
    description: string
    descriptionTag?: HeadingTag
    image?: string
  }
  vision: {
    enabled?: boolean
    badge: string
    badgeTag?: HeadingTag
    mainHeading: string
    mainHeadingTag?: HeadingTag
    visionTitle: string
    visionTitleTag?: HeadingTag
    visionDescription: string
    visionDescriptionTag?: HeadingTag
    visionImage: string
  }
  mission: {
    enabled?: boolean
    missionTitle: string
    missionTitleTag?: HeadingTag
    missionDescription: string
    missionDescriptionTag?: HeadingTag
    missionImage: string
  }
  whyUs: {
    enabled?: boolean
    badge: string
    badgeTag?: HeadingTag
    title: string
    titleTag?: HeadingTag
    description: string
    descriptionTag?: HeadingTag
    image?: string
    features: Array<{
      icon: string
      title: string
      description: string
    }>
  }
  updatedAt: Date
}

export interface ContactPageContent {
  id: string
  hero: {
    enabled?: boolean
    title: string
    titleTag?: HeadingTag
    subtitle: string
    subtitleTag?: HeadingTag
    backgroundImage: string
  }
  contactInfo: {
    enabled?: boolean
    email: {
      title: string
      description: string
      value: string
    }
    phone: {
      title: string
      description: string
      value: string
    }
    office: {
      title: string
      address: string
    }
  }
  form: {
    enabled?: boolean
    heading: string
    headingTag?: HeadingTag
    description: string
    descriptionTag?: HeadingTag
    submitButtonText: string
    submittingText: string
    successMessage: string
    privacyText: string
  }
  enquiry: {
    enabled?: boolean
    title: string
    titleTag?: HeadingTag
    buttonText: string
    submitButtonText: string
    submittingText: string
    successMessage: string
    defaultSubtitle: string
  }
  updatedAt: Date
}

export interface FooterLink {
  name: string
  href: string
}

export interface FooterContent {
  id: string
  settings: {
    enabled?: boolean
  }
  productLinksSection: {
    enabled?: boolean
    title?: string
  }
  aboutLinksSection: {
    enabled?: boolean
    title?: string
  }
  resourcesLinksSection?: {
    enabled?: boolean
    title?: string
  }
  newsletterSection: {
    enabled?: boolean
  }
  contactSection: {
    enabled?: boolean
    title?: string
  }
  socialSection: {
    enabled?: boolean
  }
  logo: string
  companyInfo: string
  productLinks: FooterLink[]
  aboutLinks: FooterLink[]
  resourcesLinks?: FooterLink[]
  legalLinks?: FooterLink[]
  socialMedia: {
    facebook?: string
    twitter?: string
    youtube?: string
    linkedin?: string
    instagram?: string
  }
  newsletter: {
    heading: string
    headingTag?: HeadingTag
    placeholder: string
  }
  contact: {
    location: string
    phone: string
    email: string
  }
  copyright: string
  updatedAt: Date
}

export interface PageHero {
  backgroundImage: string
  title: string
}

export interface Settings {
  id: string
  seo: {
    siteName: string
    siteDescription: string
    siteUrl: string
    ogImage: string
    twitterHandle: string
    keywords: string[]
    pages: {
      home: { title: string; description: string; keywords: string[] }
      about: { title: string; description: string; keywords: string[] }
      products: { title: string; description: string; keywords: string[] }
      services: { title: string; description: string; keywords: string[] }
      gallery: { title: string; description: string; keywords: string[] }
      clients: { title: string; description: string; keywords: string[] }
      testimonials: { title: string; description: string; keywords: string[] }
      contact: { title: string; description: string; keywords: string[] }
    }
  }
  pageHeroes: {
    products: PageHero
    services: PageHero
    gallery: PageHero
    clients: PageHero
    testimonials: PageHero
  }
  branding: {
    websiteLogo: string
    websiteFavicon: string
    dashboardLogo: string
    dashboardFavicon: string
    /** Phone shown as the call button in the public navbar */
    navbarPhone?: string
    colors: {
      primary: string
      secondary: string
      primaryTextColor: string
      secondaryTextColor: string
    }
    fonts: {
      primaryFont: string
      secondaryFont: string
      paragraphFont: string
      fontSource?: "google" | "system"
      googleFontUrl?: string
      sizes: {
        h1: string
        h2: string
        h3: string
        h4: string
        h5: string
        h6: string
        paragraph: string
      }
      weights: {
        h1: string
        h2: string
        h3: string
        h4: string
        h5: string
        h6: string
        paragraph: string
      }
    }
  }
  company: {
    name: string
    address: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
    phone: string
    email: string
    socialMedia: {
      facebook?: string
      twitter?: string
      linkedin?: string
      youtube?: string
      instagram?: string
      whatsapp?: string
    }
  }
  updatedAt: Date
}
