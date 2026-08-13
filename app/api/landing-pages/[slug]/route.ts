import { NextRequest, NextResponse } from "next/server";
import { getLandingPageBySlug } from "@/lib/landing-pages/store";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const page = await getLandingPageBySlug(slug);
    if (!page || page.status !== "published") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(page);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load landing page" }, { status: 500 });
  }
}
