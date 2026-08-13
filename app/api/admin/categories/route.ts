import { type NextRequest, NextResponse } from "next/server"
import { getRepository } from "@/lib/repo/index"
import { getSession } from "@/lib/auth"
import { z } from "zod"

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().optional(),
  image: z.string().optional(),
  slug: z.string().optional(),
})

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const repo = getRepository()
  const categories = await repo.getAllCategories()

  return NextResponse.json(categories)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()
    const validated = categorySchema.parse(data)

    const slug = validated.slug || generateSlug(validated.name)

    const icon = validated.icon || "/placeholder.svg?height=40&width=40"

    const repo = getRepository()
    const category = await repo.createCategory({
      name: validated.name,
      description: validated.description,
      slug,
      icon,
      image: validated.image || "",
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Invalid category data" }, { status: 400 })
  }
}
