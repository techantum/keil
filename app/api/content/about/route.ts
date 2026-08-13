import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repo";
import { contentErrorResponse } from "@/lib/content/api-helpers";
import { defaultAboutPageContent } from "@/lib/content/default-content";
import { mergeAboutContent } from "@/lib/content/merge-content";

export async function GET() {
  try {
    const repo = getRepository();
    const content = await repo.getAboutPageContent();
    return NextResponse.json(mergeAboutContent(content));
  } catch (error) {
    return contentErrorResponse(error, defaultAboutPageContent());
  }
}
