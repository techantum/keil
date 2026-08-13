import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  createLandingPage,
  listLandingPages,
  makeLandingSlug,
} from "@/lib/landing-pages/store";
import { analyzeLandingDesign } from "@/lib/landing-pages/analyze";
import { refreshLandingRedirectCookie } from "@/lib/landing-pages/sync-redirects";
import { DEFAULT_LANDING_REDIRECT } from "@/types/landing-page";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const pages = await listLandingPages();
    await refreshLandingRedirectCookie();
    return NextResponse.json(pages);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to list landing pages" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const title = String(body.title || "").trim();
    const designImage = String(body.designImage || "").trim();
    const slug = String(body.slug || makeLandingSlug(title || "landing-page")).trim();
    const analyze = body.analyze !== false;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!designImage) {
      return NextResponse.json({ error: "Design image is required" }, { status: 400 });
    }

    let sections = Array.isArray(body.sections) ? body.sections : [];
    let analysisMessage = "Landing page created.";
    let analysisSource: "openai" | "template" | "manual" = "manual";

    if (analyze || sections.length === 0) {
      const result = await analyzeLandingDesign(designImage);
      sections = result.sections.map((s) => ({ ...s, showInNav: s.showInNav !== false }));
      analysisMessage = result.message;
      analysisSource = result.source;
    }

    const page = await createLandingPage({
      title,
      slug,
      designImage,
      sections,
      status: body.status === "published" ? "published" : "draft",
      seo: {
        title: body.seo?.title || title,
        description: body.seo?.description || "",
        keywords: body.seo?.keywords || [],
      },
      redirect: body.redirect || DEFAULT_LANDING_REDIRECT,
    });

    await refreshLandingRedirectCookie();

    return NextResponse.json({
      page,
      analysis: { source: analysisSource, message: analysisMessage },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create landing page" }, { status: 500 });
  }
}
