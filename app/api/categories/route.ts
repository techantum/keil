import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repo";
import { isDbConnectionError } from "@/lib/db/db-error";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const repository = getRepository();
    const categories = await repository.getAllCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    if (isDbConnectionError(error)) {
      return NextResponse.json([]);
    }
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
