import { type NextRequest, NextResponse } from "next/server"
import { getRepository } from "@/lib/repo"
import { getSession } from "@/lib/auth"
import { productSchema } from "@/lib/validations"

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "100")
  const skip = (page - 1) * limit

  const repo = getRepository()
  
  // Use filtered products with pagination instead of getAllProducts
  const [products, total] = await Promise.all([
    repo.getFilteredProducts({}, undefined, "createdAt", limit, skip),
    repo.getProductsCount({}, undefined)
  ])

  return NextResponse.json({
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()
    const validated = productSchema.parse(data)

    const repo = getRepository()
    const product = await repo.createProduct(validated)

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Invalid product data" }, { status: 400 })
  }
}
