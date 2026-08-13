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
    const testimonials = await repository.getAllTestimonials()
    return NextResponse.json(testimonials)
  } catch (error) {
    console.error("Failed to fetch testimonials:", error)
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}

export async function POST(request: Request) {
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
        { status: 400 },
      )
    }

    const repository = getRepository()
    const newTestimonial = await repository.createTestimonial({
      name,
      title,
      company,
      content,
      image: image || "",
      rating: rating || undefined,
      featured: featured || false,
    })

    return NextResponse.json(newTestimonial, { status: 201 })
  } catch (error: any) {
    console.error("Failed to create testimonial:", error)
    return NextResponse.json({ error: error.message || "Failed to create testimonial" }, { status: 500 })
  }
}
