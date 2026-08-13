import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const repo = getRepository();
    const content = await repo.getFooterContent();
    return NextResponse.json(content, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" },
    });
  } catch (error) {
    console.error("Failed to fetch footer content:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const repo = getRepository();
    const updates = await request.json();
    const updated = await repo.updateFooterContent(updates);
    return NextResponse.json(updated, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" },
    });
  } catch (error) {
    console.error("Failed to update footer content:", error);
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 },
    );
  }
}
