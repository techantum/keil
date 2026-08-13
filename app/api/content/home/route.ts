import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repo";
import { contentErrorResponse } from "@/lib/content/api-helpers";
import { defaultHomePageContent } from "@/lib/content/default-content";
import { mergeHomeContent } from "@/lib/cms/merge-content";

export async function GET() {
  try {
    const repo = getRepository();
    const content = await repo.getHomePageContent();
    return NextResponse.json(mergeHomeContent(content ?? {}));
  } catch (error) {
    return contentErrorResponse(error, defaultHomePageContent());
  }
}
