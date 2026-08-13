import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  deleteLandingPage,
  getLandingPageById,
  updateLandingPage,
} from "@/lib/landing-pages/store";
import { refreshLandingRedirectCookie } from "@/lib/landing-pages/sync-redirects";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const page = await getLandingPageById(id);
  if (!page) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(page);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const page = await updateLandingPage(id, {
      title: body.title,
      slug: body.slug,
      designImage: body.designImage,
      sections: body.sections,
      seo: body.seo,
      branding: body.branding,
      footer: body.footer,
      status: body.status,
      redirect: body.redirect,
    });

    if (!page) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await refreshLandingRedirectCookie();
    return NextResponse.json(page);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update landing page" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const ok = await deleteLandingPage(id);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await refreshLandingRedirectCookie();
  return NextResponse.json({ success: true });
}
