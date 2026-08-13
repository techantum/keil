import { NextRequest, NextResponse } from "next/server"
import { getRepository } from "@/lib/repo"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    
    const search = searchParams.get("search")
    const inStock = searchParams.get("inStock")
    const sort = searchParams.get("sort")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")

    const repository = getRepository()
    
    // Build query filters
    const filters: any = {}
    
    if (category) {
      filters.category = category
    }
    
    if (inStock === "true") {
      filters.inStock = true
    } else if (inStock === "false") {
      filters.inStock = false
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get paginated products with total count
    const [products, total] = await Promise.all([
      repository.getFilteredProducts(filters, search, sort, limit, skip),
      repository.getProductsCount(filters, search)
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + products.length < total
      }
    })
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
