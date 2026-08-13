import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repo";
import { contentErrorResponse } from "@/lib/content/api-helpers";
import { defaultContactPageContent } from "@/lib/content/default-content";
import { mergeContactContent } from "@/lib/content/merge-content";

export async function GET() {
  try {
    const repo = getRepository();
    const content = await repo.getContactPageContent();
    return NextResponse.json(mergeContactContent(content));
  } catch (error) {
    return contentErrorResponse(error, defaultContactPageContent());
  }
}
