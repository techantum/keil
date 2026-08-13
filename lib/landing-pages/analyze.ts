import { randomUUID } from "crypto";
import { readFile } from "fs/promises";
import path from "path";
import type { LandingSection, LandingSectionType } from "@/types/landing-page";
import { KEIL_IMAGES } from "@/lib/content/default-content";

function section(
  type: LandingSectionType,
  partial: Omit<LandingSection, "id" | "type" | "enabled"> & { enabled?: boolean },
): LandingSection {
  return {
    id: randomUUID(),
    type,
    enabled: partial.enabled !== false,
    ...partial,
  };
}

/** Template sections when no vision API is configured — still editable in CMS */
export function buildTemplateSectionsFromDesign(designImage: string): LandingSection[] {
  return [
    section("hero", {
      label: "Hero",
      title: "ENGINEERED EC SHEDS FOR MODERN POULTRY FARMING",
      subtitle:
        "First End-to-End EC Shed Solution Provider in AP & Telangana. Among India's Finest Poultry Infrastructure Partners.",
      description:
        "KEIL delivers engineered EC shed solutions with complete in-house engineering, manufacturing, installation, commissioning and turnkey support for high-performance poultry operations.\n\nWe build better farms that deliver better control, better performance and better returns – every day.",
      image: KEIL_IMAGES.hero,
      badgeText: "",
      buttonText: "Get a Project Consultation",
      buttonLink: "",
      buttonAction: "modal",
      secondaryButtonText: "Explore EC Shed Solutions",
      secondaryButtonLink: "#solutions",
      secondaryButtonAction: "section",
      items: [
        { title: "Engineered Solutions", icon: "settings" },
        { title: "End-to-End Execution", icon: "workflow" },
        { title: "Built for Performance", icon: "shield-check" },
        { title: "Trusted Across AP & Telangana", icon: "map-pin" },
      ],
    }),
    section("about", {
      label: "About",
      title: "Engineering Better Infrastructure for Poultry Farming",
      subtitle: "ABOUT KEIL",
      description:
        "KEIL is a Hyderabad-based engineering and infrastructure company focused on poultry farm development. We combine structural engineering, environmental control systems and practical farm execution to deliver sheds that perform in real operating conditions — not just on paper.\n\nWhether you are setting up a new farm or upgrading an existing facility, KEIL supports you with end-to-end EC shed solutions built for performance, durability and long-term farm profitability.\n\nFrom planning and shed design through construction, equipment integration and handover, our team stays accountable at every stage.",
      subHeading: "From Concept to Commissioning",
      image: KEIL_IMAGES.about,
      items: [
        { title: "Established", description: "2021", icon: "calendar" },
        { title: "Location", description: "Hyderabad, Telangana", icon: "map-pin" },
        { title: "Industry", description: "Engineering & Infrastructure", icon: "building" },
        { title: "Core Focus", description: "EC Shed Solutions", icon: "target" },
        { title: "Our Strength", description: "Turnkey Project Execution", icon: "user-cog" },
      ],
    }),
    section("team", {
      label: "Team",
      title: "MANAGEMENT & CORE TEAM",
      subtitle: "Experienced Leadership, Execution-Driven Excellence.",
      buttonText: "Get a Project Consultation",
      buttonLink: "",
      buttonAction: "modal",
      items: [
        {
          title: "Mr. Hidayath Khan",
          role: "Chairman / Chairperson",
          description:
            "Provides strategic direction and oversees KEIL’s long-term vision for sustainable poultry infrastructure development across the region.",
          image: KEIL_IMAGES.team1,
        },
        {
          title: "Mr. Hyder Khan",
          role: "Director",
          description:
            "Leads operations, project execution and client partnerships with a focus on quality delivery and farm performance outcomes.",
          image: KEIL_IMAGES.team2,
        },
        {
          title: "Mr. Rahman Khan",
          role: "Director",
          description:
            "Drives engineering standards, shed design innovation and technical excellence across KEIL’s EC shed projects.",
          image: KEIL_IMAGES.team3,
        },
      ],
    }),
    section("features", {
      label: "Why Us",
      navLabel: "Why KEIL",
      showInNav: true,
      title:
        "First End-to-End EC Shed Solution Provider in AP & Telangana. Among India's Finest.",
      subtitle: "WHY KEIL?",
      description:
        "KEIL is the first company in AP & Telangana to deliver complete end-to-end EC shed solutions — from concept and engineering to manufacturing, installation, commissioning, and long-term support.",
      descriptionSecondary:
        "Our integrated approach ensures better control, better performance and better farm efficiency for poultry operations.",
      promiseTitle: "Our Promise",
      promiseItems: [
        "Better Control.",
        "Better Performance.",
        "Better Farm Efficiency.",
      ],
      items: [
        {
          title: "First End-to-End EC Shed Provider in AP & Telangana",
          description: "Complete solutions from concept to commissioning.",
          icon: "settings",
        },
        {
          title: "Among India's Finest",
          description: "Recognized for quality, innovation, and customer satisfaction.",
          icon: "award",
        },
        {
          title: "Trusted Engineering Expertise",
          description: "Experienced engineers delivering reliable, high-performance sheds.",
          icon: "shield-check",
        },
        {
          title: "Quality & Reliability",
          description: "Premium materials and precision engineering for long-term durability.",
          icon: "badge-check",
        },
        {
          title: "End-to-End Execution",
          description: "In-house manufacturing, installation, commissioning, and support.",
          icon: "network",
        },
        {
          title: "Long-Term Partnership",
          description: "Reliable support and maintenance for lasting farm performance.",
          icon: "users",
        },
      ],
    }),
    section("leaders", {
      label: "Industry Leaders",
      showInNav: false,
      title: "WHY INDUSTRY LEADERS CHOOSE KEIL",
      subtitle: "WHY INDUSTRY LEADERS CHOOSE KEIL",
      description:
        "Proven capability, disciplined execution, and long-term partnership — the reasons farms across AP & Telangana trust KEIL.",
      items: [
        {
          title: "First End-to-End EC Shed Solution Provider in AP & Telangana",
          icon: "trophy",
        },
        {
          title: "Among India's Best & Finest EC Shed Solution Partners",
          icon: "award",
        },
        {
          title: "End-to-End Capabilities from Concept to Commissioning",
          icon: "settings",
        },
        {
          title: "Proven Quality, Strong Execution & Reliable Delivery",
          icon: "shield-check",
        },
        {
          title: "Long-Term Support for Better Performance & Higher Returns",
          icon: "users",
        },
      ],
    }),
    section("solutions", {
      label: "Solutions",
      navLabel: "Solutions",
      showInNav: true,
      subtitle: "OUR EC SHED SOLUTIONS",
      title: "Complete EC Shed Solutions. One Integrated Approach.",
      buttonText: "Get a Project Consultation",
      buttonLink: "",
      buttonAction: "modal",
      items: [
        {
          title: "EC Poultry Sheds",
          description:
            "Modern, engineered structures for superior bird comfort, hygiene, and productivity.",
          image: KEIL_IMAGES.solutionShed,
        },
        {
          title: "PUF Insulated Panels",
          description:
            "High-performance panels for temperature control and energy efficiency.",
          image: KEIL_IMAGES.solutionPanels,
        },
        {
          title: "Ventilation Systems",
          description: "Advanced airflow solutions for optimal climate and air quality.",
          image: KEIL_IMAGES.solutionVent,
        },
        {
          title: "Feeding Systems",
          description:
            "Efficient feeding infrastructure for consistent nutrition and better growth.",
          image: KEIL_IMAGES.solutionFeed,
        },
        {
          title: "Drinking Systems",
          description:
            "Clean water delivery systems designed for healthy, stress-free flocks.",
          image: KEIL_IMAGES.solutionWater,
        },
        {
          title: "Farm Automation",
          description:
            "Smart automation for monitoring, control, and operational efficiency.",
          image: KEIL_IMAGES.solutionAuto,
        },
        {
          title: "Turnkey Projects",
          description:
            "Complete project execution from planning to commissioning and hand-holding.",
          image: KEIL_IMAGES.solutionTurnkey,
        },
      ],
    }),
    section("benefits", {
      label: "Key Benefits",
      navLabel: "Benefits",
      showInNav: true,
      subtitle: "KEY BENEFITS",
      title: "Better Control. Better Performance. Better Farm Efficiency.",
      items: [
        {
          title: "Better Environment Control",
          description: "Maintain ideal temperature, ventilation, and air quality.",
          icon: "thermometer",
        },
        {
          title: "Improved Bird Comfort",
          description:
            "Create a comfortable environment for healthier, stress-free birds.",
          icon: "heart",
        },
        {
          title: "Higher Farm Productivity",
          description:
            "Consistent performance with improved FCR and higher returns.",
          icon: "gauge",
        },
        {
          title: "Energy-Efficient Operations",
          description:
            "Advanced systems reduce energy consumption and operating costs.",
          icon: "zap",
        },
        {
          title: "Reduced Maintenance",
          description: "Durable materials and smart design minimize downtime.",
          icon: "wrench",
        },
        {
          title: "Leadership & Trust",
          description:
            "First in AP & Telangana. One of India's finest EC shed solution providers.",
          icon: "award",
        },
      ],
    }),
    section("applications", {
      label: "Applications",
      navLabel: "Applications",
      showInNav: true,
      subtitle: "APPLICATIONS",
      title: "EC Shed Solutions for Every Poultry Operation",
      items: [
        {
          title: "Broiler Farms",
          description: "Efficient environments for fast and healthy bird growth.",
          image: KEIL_IMAGES.appBroiler,
        },
        {
          title: "Layer Farms",
          description: "Optimized conditions for higher egg production.",
          image: KEIL_IMAGES.appLayer,
        },
        {
          title: "Breeder Farms",
          description: "Controlled environments for breeding performance.",
          image: KEIL_IMAGES.appBreeder,
        },
        {
          title: "Hatcheries",
          description: "Stable temperature and humidity control.",
          image: KEIL_IMAGES.solutionAuto,
        },
        {
          title: "Commercial Poultry Farms",
          description: "Scalable infrastructure for large operations.",
          image: KEIL_IMAGES.solutionShed,
        },
        {
          title: "Integrated Poultry Projects",
          description: "Complete solutions for end-to-end poultry businesses.",
          image: KEIL_IMAGES.solutionTurnkey,
        },
      ],
    }),
    section("process", {
      label: "Process",
      navLabel: "Process",
      showInNav: true,
      title: "OUR PROCESS",
      subtitle: "From concept to commissioning — one team, one complete solution.",
      items: [
        {
          title: "Consultation &\nPlanning",
          description: "Understanding needs and site evaluation.",
          icon: "01",
        },
        {
          title: "Design &\nEngineering",
          description: "Custom design with precise engineering.",
          icon: "02",
        },
        {
          title: "Manufacturing &\nProcurement",
          description: "Quality manufacturing and material sourcing.",
          icon: "03",
        },
        {
          title: "Installation &\nExecution",
          description: "On-site installation with expert team.",
          icon: "04",
        },
        {
          title: "Testing &\nCommissioning",
          description: "Rigorous testing for optimal performance.",
          icon: "05",
        },
        {
          title: "After-Sales Support &\nMaintenance",
          description: "Reliable support for long-term performance.",
          icon: "06",
        },
      ],
    }),
    section("gallery", {
      label: "Projects",
      navLabel: "Projects",
      showInNav: true,
      title: "OUR RECENT PROJECTS",
      subtitle: "Delivering Excellence Across Andhra Pradesh & Telangana",
      buttonText: "Get a Project Consultation",
      buttonLink: "",
      buttonAction: "modal",
      items: [
        { title: "Project 1", image: KEIL_IMAGES.project1 },
        { title: "Project 2", image: KEIL_IMAGES.project2 },
        { title: "Project 3", image: KEIL_IMAGES.project3 },
        { title: "Project 4", image: KEIL_IMAGES.project4 },
        { title: "Project 5", image: KEIL_IMAGES.project5 },
      ],
    }),
    section("cta", {
      label: "CTA Banner",
      title: "Ready to Build Better Farms?",
      description:
        "Connect with KEIL today for the best EC shed solutions in Andhra Pradesh & Telangana.",
      image: KEIL_IMAGES.cta,
      buttonText: "90505 40505",
      buttonLink: "tel:9050540505",
      buttonAction: "external",
      items: [
        { title: "Expert Engineering", icon: "settings" },
        { title: "Quality Assured", icon: "shield-check" },
        { title: "On-Time Delivery", icon: "truck" },
        { title: "24/7 Support & Service", icon: "headphones" },
      ],
    }),
  ];
}

async function resolveImageToDataUrl(imageUrl: string): Promise<string | null> {
  try {
    if (imageUrl.startsWith("data:")) return imageUrl;

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      const res = await fetch(imageUrl);
      if (!res.ok) return null;
      const buffer = Buffer.from(await res.arrayBuffer());
      const contentType = res.headers.get("content-type") || "image/png";
      return `data:${contentType};base64,${buffer.toString("base64")}`;
    }

    const relative = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
    const filePath = path.join(process.cwd(), "public", relative);
    const buffer = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const mime =
      ext === ".jpg" || ext === ".jpeg"
        ? "image/jpeg"
        : ext === ".webp"
          ? "image/webp"
          : ext === ".gif"
            ? "image/gif"
            : "image/png";
    return `data:${mime};base64,${buffer.toString("base64")}`;
  } catch (error) {
    console.error("resolveImageToDataUrl failed:", error);
    return null;
  }
}

function normalizeAiSections(raw: unknown, designImage: string): LandingSection[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return buildTemplateSectionsFromDesign(designImage);
  }

  return raw.map((item) => {
    const s = item as Partial<LandingSection>;
    const type = (s.type || "custom") as LandingSectionType;
    return section(type, {
      label: s.label || type,
      title: s.title || "",
      subtitle: s.subtitle || "",
      description: s.description || "",
      image: s.image || (type === "hero" ? designImage : ""),
      badgeText: s.badgeText || "",
      buttonText: s.buttonText || "",
      buttonLink: s.buttonLink || "",
      secondaryButtonText: s.secondaryButtonText || "",
      secondaryButtonLink: s.secondaryButtonLink || "",
      items: Array.isArray(s.items)
        ? s.items.map((it) => ({
            title: it.title || "",
            description: it.description || "",
            image: it.image || "",
            icon: it.icon || "",
            link: it.link || "",
            role: it.role || "",
          }))
        : [],
      enabled: s.enabled !== false,
    });
  });
}

export type AnalyzeDesignResult = {
  sections: LandingSection[];
  source: "openai" | "template";
  message: string;
};

/**
 * Analyze an uploaded landing-page UI design and extract editable sections.
 * Uses OpenAI Vision when OPENAI_API_KEY is set; otherwise returns a KEIL-style template.
 */
export async function analyzeLandingDesign(
  designImage: string,
): Promise<AnalyzeDesignResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      sections: buildTemplateSectionsFromDesign(designImage),
      source: "template",
      message:
        "Sections created from the KEIL landing template. Add OPENAI_API_KEY to .env to auto-detect sections from uploaded UI designs.",
    };
  }

  const dataUrl = await resolveImageToDataUrl(designImage);
  if (!dataUrl) {
    return {
      sections: buildTemplateSectionsFromDesign(designImage),
      source: "template",
      message: "Could not read the design image. Template sections were created instead.",
    };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_VISION_MODEL || "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You analyze website landing page UI design screenshots. Extract every visible section top-to-bottom. Return JSON only.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this landing page UI design image.
Identify each section (header is not a content section; skip sticky nav/footer if present, or include footer-like CTA as "cta").

Return JSON:
{
  "sections": [
    {
      "type": "hero|about|team|features|solutions|benefits|gallery|cta|text|cards|custom",
      "label": "short admin label",
      "title": "main heading text as shown",
      "subtitle": "eyebrow or supporting line",
      "description": "body copy if visible",
      "badgeText": "badge text if any",
      "buttonText": "primary CTA label",
      "buttonLink": "/contact",
      "secondaryButtonText": "secondary CTA if any",
      "secondaryButtonLink": "#",
      "items": [
        { "title": "", "description": "", "role": "", "icon": "" }
      ]
    }
  ]
}

Rules:
- Preserve visible copy as closely as possible.
- Create one section object per visual block.
- For grids/cards, put each card in items[].
- Do not invent long paragraphs if not visible; keep short.
- type must be one of the allowed values.`,
              },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI vision error:", response.status, errText);
      return {
        sections: buildTemplateSectionsFromDesign(designImage),
        source: "template",
        message: "AI analysis failed. Template sections were created — you can edit them manually.",
      };
    }

    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(content) as { sections?: unknown };
    const sections = normalizeAiSections(parsed.sections, designImage);

    return {
      sections,
      source: "openai",
      message: `Detected ${sections.length} sections from the uploaded design. Review and edit content/images below.`,
    };
  } catch (error) {
    console.error("analyzeLandingDesign error:", error);
    return {
      sections: buildTemplateSectionsFromDesign(designImage),
      source: "template",
      message: "AI analysis failed. Template sections were created — you can edit them manually.",
    };
  }
}
