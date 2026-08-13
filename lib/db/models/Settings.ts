import mongoose, { Schema, type Document } from "mongoose";

export interface SettingsDocument extends Document {
  _id: mongoose.Types.ObjectId;
  seo: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    ogImage: string;
    twitterHandle: string;
    keywords: string[];
    pages: {
      home: { title: string; description: string; keywords: string[] };
      about: { title: string; description: string; keywords: string[] };
      products: { title: string; description: string; keywords: string[] };
      services: { title: string; description: string; keywords: string[] };
      gallery: { title: string; description: string; keywords: string[] };
      clients: { title: string; description: string; keywords: string[] };
      testimonials: { title: string; description: string; keywords: string[] };
      contact: { title: string; description: string; keywords: string[] };
    };
  };
  pageHeroes: {
    products: { backgroundImage: string; title: string };
    services: { backgroundImage: string; title: string };
    gallery: { backgroundImage: string; title: string };
    clients: { backgroundImage: string; title: string };
    testimonials: { backgroundImage: string; title: string };
  };
  branding: {
    websiteLogo: string;
    websiteFavicon: string;
    dashboardLogo: string;
    dashboardFavicon: string;
    colors: {
      primary: string;
      secondary: string;
      primaryTextColor: string;
      secondaryTextColor: string;
    };
    fonts: {
      primaryFont: string;
      secondaryFont: string;
      paragraphFont: string;
      sizes: {
        h1: string;
        h2: string;
        h3: string;
        h4: string;
        h5: string;
        h6: string;
        paragraph: string;
      };
    };
  };
  company: {
    name: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    phone: string;
    email: string;
    socialMedia: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      youtube?: string;
      instagram?: string;
      whatsapp?: string;
    };
  };
  updatedAt: Date;
}

const defaultPageHeroes = {
  products: { backgroundImage: "", title: "PRODUCTS" },
  services: { backgroundImage: "", title: "SERVICES" },
  gallery: { backgroundImage: "", title: "GALLERY" },
  clients: { backgroundImage: "", title: "CLIENTS" },
  testimonials: { backgroundImage: "", title: "TESTIMONIALS" },
};

const SettingsSchema = new Schema<SettingsDocument>(
  {
    seo: {
      siteName: {
        type: String,
        required: true,
        default: "My CMS Site",
      },
      siteDescription: {
        type: String,
        required: true,
        default: "A flexible content-managed business website.",
      },
      siteUrl: {
        type: String,
        required: true,
        default: "http://localhost:3000",
      },
      ogImage: { type: String, default: "/og-image.jpg" },
      twitterHandle: { type: String, default: "" },
      keywords: { type: [String], default: [] },
      pages: {
        home: {
          title: { type: String, default: "Home" },
          description: { type: String, default: "" },
          keywords: { type: [String], default: [] },
        },
        about: {
          title: { type: String, default: "About Us" },
          description: { type: String, default: "" },
          keywords: { type: [String], default: [] },
        },
        products: {
          title: { type: String, default: "Products" },
          description: { type: String, default: "" },
          keywords: { type: [String], default: [] },
        },
        services: {
          title: { type: String, default: "Services" },
          description: { type: String, default: "" },
          keywords: { type: [String], default: [] },
        },
        gallery: {
          title: { type: String, default: "Gallery" },
          description: { type: String, default: "" },
          keywords: { type: [String], default: [] },
        },
        clients: {
          title: { type: String, default: "Clients" },
          description: { type: String, default: "" },
          keywords: { type: [String], default: [] },
        },
        testimonials: {
          title: { type: String, default: "Testimonials" },
          description: { type: String, default: "" },
          keywords: { type: [String], default: [] },
        },
        contact: {
          title: { type: String, default: "Contact Us" },
          description: { type: String, default: "" },
          keywords: { type: [String], default: [] },
        },
      },
    },
    branding: {
      websiteLogo: { type: String, default: "/logo.png" },
      websiteFavicon: { type: String, default: "/favicon.ico" },
      dashboardLogo: { type: String, default: "/logo.png" },
      dashboardFavicon: { type: String, default: "/favicon.ico" },
      colors: {
        primary: { type: String, default: "#4384C5" },
        secondary: { type: String, default: "#053C74" },
        primaryTextColor: { type: String, default: "#000000" },
        secondaryTextColor: { type: String, default: "#333333" },
      },
      fonts: {
        primaryFont: { type: String, default: "Poppins" },
        secondaryFont: { type: String, default: "Inter" },
        paragraphFont: { type: String, default: "Poppins" },
        sizes: {
          h1: { type: String, default: "3rem" },
          h2: { type: String, default: "2.5rem" },
          h3: { type: String, default: "2rem" },
          h4: { type: String, default: "1.5rem" },
          h5: { type: String, default: "1.25rem" },
          h6: { type: String, default: "1rem" },
          paragraph: { type: String, default: "1rem" },
        },
      },
    },
    company: {
      name: { type: String, default: "My Company" },
      address: {
        street: { type: String, default: "123 Pharma Street" },
        city: { type: String, default: "Mumbai" },
        state: { type: String, default: "Maharashtra" },
        zipCode: { type: String, default: "400001" },
        country: { type: String, default: "IN" },
      },
      phone: { type: String, default: "+91-22-1234-5678" },
      email: { type: String, default: "contact@example.com" },
      socialMedia: {
        facebook: { type: String, default: "" },
        twitter: { type: String, default: "" },
        linkedin: {
          type: String,
          default: "",
        },
        youtube: { type: String, default: "" },
        instagram: { type: String, default: "" },
        whatsapp: { type: String, default: "" },
      },
    },
    pageHeroes: {
      products: {
        backgroundImage: { type: String, default: "" },
        title: { type: String, default: "PRODUCTS" },
      },
      services: {
        backgroundImage: { type: String, default: "" },
        title: { type: String, default: "SERVICES" },
      },
      gallery: {
        backgroundImage: { type: String, default: "" },
        title: { type: String, default: "GALLERY" },
      },
      clients: {
        backgroundImage: { type: String, default: "" },
        title: { type: String, default: "CLIENTS" },
      },
      testimonials: {
        backgroundImage: { type: String, default: "" },
        title: { type: String, default: "TESTIMONIALS" },
      },
    },
  },
  { timestamps: true },
);

export const SettingsModel =
  mongoose.models.Settings ||
  mongoose.model<SettingsDocument>("Settings", SettingsSchema);
