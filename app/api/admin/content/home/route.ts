import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repo";
import type { HomePageContent } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const repo = getRepository();
    const content = await repo.getHomePageContent();

    return NextResponse.json(content, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Failed to fetch home page content:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const repo = getRepository();
    const updates = (await request.json()) as Partial<HomePageContent>;
    const updated = await repo.updateHomePageContent(updates);

    return NextResponse.json(updated, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Failed to update home page content:", error);
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 },
    );
  }
}
