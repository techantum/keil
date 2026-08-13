import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getRepository } from "@/lib/repo"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const repository = getRepository()
    const items = await repository.getAllGalleryItems()
    return NextResponse.json(items)
  } catch (error) {
    console.error("Failed to fetch gallery items:", error)
    return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, image, category, order } = body

    if (!name || !image) {
      return NextResponse.json(
        { error: "Missing required fields: name, image" },
        { status: 400 },
      )
    }

    const repository = getRepository()
    const newItem = await repository.createGalleryItem({
      name,
      image,
      category: category || "",
      order: order || 0,
    })

    return NextResponse.json(newItem, { status: 201 })
  } catch (error: any) {
    console.error("Failed to create gallery item:", error)
    return NextResponse.json({ error: error.message || "Failed to create gallery item" }, { status: 500 })
  }
}
