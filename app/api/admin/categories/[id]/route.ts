import { type NextRequest, NextResponse } from "next/server"
import { getRepository } from "@/lib/repo/index"
import { getSession } from "@/lib/auth"
import { z } from "zod"

const categorySchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
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

async function updateCategory(request: NextRequest, params: { id: string }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()
    console.log("Updating category with data:", data)
    
    const validated = categorySchema.parse(data)

    const updates: any = { ...validated }
    if (validated.name && !validated.slug) {
      updates.slug = generateSlug(validated.name)
    }

    const repo = getRepository()
    const category = await repo.updateCategory(params.id, updates)

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    console.log("Category updated successfully:", category.name)
    return NextResponse.json(category)
  } catch (error: any) {
    console.error("Failed to update category:", error)
    return NextResponse.json({ error: error.message || "Invalid category data" }, { status: 400 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return updateCategory(request, params)
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  return updateCategory(request, params)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const repo = getRepository()
  const success = await repo.deleteCategory(params.id)

  if (!success) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}