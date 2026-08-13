import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repo";
import { contentErrorResponse } from "@/lib/content/api-helpers";
import { defaultFooterContent } from "@/lib/content/default-content";
import { mergeFooterContent } from "@/lib/content/merge-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const repo = getRepository();
    const content = await repo.getFooterContent();
    return NextResponse.json(mergeFooterContent(content), {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" },
    });
  } catch (error) {
    return contentErrorResponse(error, defaultFooterContent());
  }
}
