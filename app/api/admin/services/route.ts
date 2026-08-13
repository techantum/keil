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
    const services = await repository.getAllServices()
    return NextResponse.json(services)
  } catch (error) {
    console.error("Failed to fetch services:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

export async function POST(request: Request) {
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
        { status: 400 },
      )
    }

    const serviceSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const repository = getRepository()
    const newService = await repository.createService({
      title,
      subtitle: shortDescription, // Map shortDescription to subtitle for the database
      description,
      slug: serviceSlug,
      icon: icon || "",
      image: image || "",
      features: [],
      featured: featured || false
    })

    // Map back subtitle to shortDescription for the frontend
    const responseService = {
      ...newService,
      shortDescription: newService.subtitle
    }

    return NextResponse.json(responseService, { status: 201 })
  } catch (error: any) {
    console.error("Failed to create service:", error)
    return NextResponse.json({ error: error.message || "Failed to create service" }, { status: 500 })
  }
}
