import { NextResponse } from "next/server"
import { getRepository } from "@/lib/repo"

export async function GET() {
  try {
    const repository = getRepository()
    const items = await repository.getAllGalleryItems()
    return NextResponse.json(items)
  } catch (error) {
    console.error("Failed to fetch gallery items:", error)
    return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 })
  }
}
