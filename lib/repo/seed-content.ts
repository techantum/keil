import type {
  HomePageContent,
  AboutPageContent,
  ContactPageContent,
  FooterContent,
} from "@/types";

export const seedHomePageContent: HomePageContent = {
  id: "home_content_1",
  hero: {
    title: "Welcome to your site",
    description:
      "A flexible CMS-powered business website. Customize this content from the admin panel.",
    primaryButtonText: "Explore Products",
    primaryButtonLink: "/products",
    secondaryButtonText: "Contact Us",
    secondaryButtonLink: "/contact",
    backgroundImage: "/images/hero-bg.jpg",
  },
  stats: {
    yearsExperience: 10,
    yearsExperienceLabel: "Years of Experience",
    productsDelivered: 100,
    productsDeliveredLabel: "Projects Delivered",
    satisfiedClients: 50,
    satisfiedClientsLabel: "Happy Clients",
    countriesServed: 5,
    countriesServedLabel: "Regions Served",
  },
  aboutPreview: {
    badge: "WHO WE ARE",
    title: "About our company",
    description:
      "Replace this placeholder with your company story, mission, and values.",
    features: [
      {
        icon: "💼",
        title: "Reliability",
        description: "Consistent quality and dependable service.",
      },
      {
        icon: "🌱",
        title: "Sustainability",
        description: "Responsible practices for long-term growth.",
      },
      {
        icon: "✓",
        title: "Quality",
        description: "High standards in everything we deliver.",
      },
    ],
    primaryButtonText: "Learn more",
    secondaryButtonText: "Get in touch",
  },
  process: {
    title: "Our process",
    subtitle: "How we work with you",
    steps: [
      {
        number: "01",
        title: "Discovery",
        description: "We understand your requirements and goals.",
        icon: "/images/icons/microscope.png",
      },
      {
        number: "02",
        title: "Planning",
        description: "We propose a tailored solution.",
        icon: "/images/icons/prescription.png",
      },
      {
        number: "03",
        title: "Delivery",
        description: "We execute with quality and care.",
        icon: "/images/icons/molecule.png",
      },
      {
        number: "04",
        title: "Support",
        description: "Ongoing support when you need it.",
        icon: "/images/icons/report.png",
      },
    ],
  },
  updatedAt: new Date(),
};

export const seedAboutPageContent: AboutPageContent = {
  id: "about_content_1",
  hero: {
    backgroundImage: "/images/about-hero.png",
  },
  intro: {
    badge: "ABOUT US",
    title: "Our story",
    description:
      "Tell visitors about your company, expertise, and what makes you different. Edit this content in Admin → Content.",
    features: [
      {
        icon: "reliability",
        title: "Reliability",
        description: "Trusted by clients across industries.",
      },
      {
        icon: "sustainability",
        title: "Sustainability",
        description: "Committed to responsible business practices.",
      },
      {
        icon: "quality",
        title: "Quality",
        description: "Excellence in every project we undertake.",
      },
    ],
  },
  vision: {
    badge: "OUR APPROACH",
    mainHeading: "Vision and mission",
    visionTitle: "OUR VISION",
    visionDescription:
      "Describe your long-term vision for the company and the impact you aim to make.",
    visionImage: "/images/vision-holographic.jpg",
  },
  mission: {
    missionTitle: "OUR MISSION",
    missionDescription:
      "Explain your mission — how you serve customers, partners, and communities.",
    missionImage: "/images/compass-mission.jpg",
  },
  whyUs: {
    badge: "Why us",
    title: "Why choose us",
    description:
      "Highlight your key differentiators and reasons clients trust your business.",
    features: [
      {
        icon: "expertise",
        title: "Expertise",
        description: "Experienced team with proven results.",
      },
      {
        icon: "quality",
        title: "Quality assurance",
        description: "Rigorous standards and attention to detail.",
      },
      {
        icon: "innovation",
        title: "Innovation",
        description: "Forward-thinking solutions for modern challenges.",
      },
    ],
  },
  updatedAt: new Date(),
};

export const seedContactPageContent: ContactPageContent = {
  id: "contact_content_1",
  hero: {
    title: "CONTACT US",
    subtitle: "We would love to hear from you",
    backgroundImage: "/images/contact/contact-hero-bg.png",
  },
  contactInfo: {
    email: {
      title: "Email",
      description: "Our team is here to help.",
      value: "contact@example.com",
    },
    phone: {
      title: "Phone",
      description: "Monday to Friday | 9:00 AM - 5:00 PM",
      value: "+1 000 000 0000",
    },
    office: {
      title: "Office",
      address: "Your street address, City, Country",
    },
  },
  updatedAt: new Date(),
};

export const seedFooterContent: FooterContent = {
  id: "footer_content_1",
  logo: "/logo.png",
  companyInfo: "A flexible CMS-powered business website.",
  productLinks: [
    { name: "Products", href: "/products" },
    { name: "Services", href: "/services" },
  ],
  aboutLinks: [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  socialMedia: {
    facebook: "",
    twitter: "",
    youtube: "",
    linkedin: "",
  },
  newsletter: {
    heading: "Newsletter",
    placeholder: "Your email address",
  },
  contact: {
    location: "Your city, Country",
    phone: "+1 000 000 0000",
    email: "contact@example.com",
  },
  copyright: "© 2026 My CMS Site. All rights reserved.",
  updatedAt: new Date(),
};
