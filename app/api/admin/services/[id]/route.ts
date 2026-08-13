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
    const { title, description, shortDescription, icon, image, featured, slug } = body

    if (!title || !description || !shortDescription) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, shortDescription" },
        { status: 400 }
      )
    }

    const serviceSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const repository = getRepository()
    const updatedService = await repository.updateService(params.id, {
      title,
      subtitle: shortDescription, // Map shortDescription to subtitle for the database
      description,
      slug: serviceSlug,
      icon: icon || "",
      image: image || "",
      featured: featured || false
    })

    if (!updatedService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    // Map back subtitle to shortDescription for the frontend
    const responseService = {
      ...updatedService,
      shortDescription: updatedService.subtitle
    }

    return NextResponse.json(responseService)
  } catch (error: any) {
    console.error("Failed to update service:", error)
    return NextResponse.json({ error: error.message || "Failed to update service" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const repository = getRepository()
    const success = await repository.deleteService(params.id)

    if (!success) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Failed to delete service:", error)
    return NextResponse.json({ error: error.message || "Failed to delete service" }, { status: 500 })
  }
}
