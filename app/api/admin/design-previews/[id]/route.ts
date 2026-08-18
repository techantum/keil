import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  deleteDesignPreview,
  getDesignPreviewById,
  updateDesignPreview,
} from "@/lib/design-previews/store";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Ctx) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const preview = await getDesignPreviewById(id);
  if (!preview) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(preview);
}

export async function PATCH(request: NextRequest, { params }: Ctx) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const preview = await updateDesignPreview(id, {
      title: body.title,
      clientName: body.clientName,
      siteUrl: body.siteUrl,
      showBrowserChrome: body.showBrowserChrome,
      pages: body.pages,
      status: body.status,
      shareToken: body.shareToken,
    });
    if (!preview) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ preview });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update design preview" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Ctx) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const ok = await deleteDesignPreview(id);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
