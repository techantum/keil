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
    const { name, title, company, content, image, rating, featured } = body

    if (!name || !title || !company || !content) {
      return NextResponse.json(
        { error: "Missing required fields: name, title, company, content" },
        { status: 400 }
      )
    }

    const repository = getRepository()
    const updatedTestimonial = await repository.updateTestimonial(params.id, {
      name,
      title,
      company,
      content,
      image: image || "",
      rating: rating || undefined,
      featured: featured || false,
    })

    if (!updatedTestimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 })
    }

    return NextResponse.json(updatedTestimonial)
  } catch (error: any) {
    console.error("Failed to update testimonial:", error)
    return NextResponse.json({ error: error.message || "Failed to update testimonial" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const repository = getRepository()
    const success = await repository.deleteTestimonial(params.id)

    if (!success) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Failed to delete testimonial:", error)
    return NextResponse.json({ error: error.message || "Failed to delete testimonial" }, { status: 500 })
  }
}
