import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repo";

export async function GET() {
  try {
    const repo = getRepository();
    const content = await repo.getFooterContent();
    return NextResponse.json(content);
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
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update footer content:", error);
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 },
    );
  }
}
