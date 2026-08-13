import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getRepository } from "@/lib/repo"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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
        { status: 400 }
      )
    }

    const repository = getRepository()
    const updatedItem = await repository.updateGalleryItem(params.id, {
      name,
      image,
      category: category || "",
      order: order || 0,
    })

    if (!updatedItem) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 })
    }

    return NextResponse.json(updatedItem)
  } catch (error: any) {
    console.error("Failed to update gallery item:", error)
    return NextResponse.json({ error: error.message || "Failed to update gallery item" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const repository = getRepository()
    const success = await repository.deleteGalleryItem(params.id)

    if (!success) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Failed to delete gallery item:", error)
    return NextResponse.json({ error: error.message || "Failed to delete gallery item" }, { status: 500 })
  }
}
