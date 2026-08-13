import { type NextRequest, NextResponse } from "next/server"
import { getRepository } from "@/lib/repo"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const repo = getRepository()
    const products = await repo.getAllProducts()
    const categories = await repo.getAllCategories()

    // Calculate total and active products
    const totalProducts = products.length
    const activeProducts = products.filter(p => p.inStock).length

    // Calculate category-wise stats
    const categoryStats = categories.map(category => {
      const categoryProducts = products.filter(p => p.category === category.name)
      const activeCategoryProducts = categoryProducts.filter(p => p.inStock)
      
      return {
        categoryId: category.id,
        categoryName: category.name,
        totalProducts: categoryProducts.length,
        activeProducts: activeCategoryProducts.length,
        inactiveProducts: categoryProducts.length - activeCategoryProducts.length
      }
    })

    return NextResponse.json({
      totalProducts,
      activeProducts,
      inactiveProducts: totalProducts - activeProducts,
      categoryStats
    })
  } catch (error: any) {
    console.error("Error fetching product stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
