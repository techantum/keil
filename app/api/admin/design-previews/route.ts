import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createDesignPreview, listDesignPreviews } from "@/lib/design-previews/store";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await listDesignPreviews();
    return NextResponse.json(items);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to list design previews" }, { status: 500 });
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
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const image = String(body.image || body.designImage || "").trim();
    const pageLabel = String(body.pageLabel || "Home").trim() || "Home";

    const preview = await createDesignPreview({
      title,
      clientName: body.clientName,
      siteUrl: body.siteUrl,
      showBrowserChrome: Boolean(body.showBrowserChrome),
      pages: image
        ? [{ id: "", label: pageLabel, slug: "", image }]
        : undefined,
      status: body.status === "live" ? "live" : "draft",
    });

    return NextResponse.json({ preview });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create design preview" }, { status: 500 });
  }
}
