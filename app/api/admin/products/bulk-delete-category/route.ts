import { type NextRequest, NextResponse } from "next/server"
import { getRepository } from "@/lib/repo"
import { getSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { categoryName } = await request.json()
    
    if (!categoryName) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    const repo = getRepository()
    const products = await repo.getAllProducts()
    
    // Filter products by category
    const productsToDelete = products.filter(p => p.category === categoryName)
    
    if (productsToDelete.length === 0) {
      return NextResponse.json({ 
        message: "No products found in this category",
        deletedCount: 0 
      })
    }

    // Delete all products in the category
    let deletedCount = 0
    const errors = []

    for (const product of productsToDelete) {
      try {
        await repo.deleteProduct(product.id)
        deletedCount++
      } catch (error: any) {
        errors.push({ productId: product.id, error: error.message })
      }
    }

    return NextResponse.json({ 
      message: `Successfully deleted ${deletedCount} products from category ${categoryName}`,
      deletedCount,
      totalAttempted: productsToDelete.length,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error: any) {
    console.error("Error bulk deleting products by category:", error)
    return NextResponse.json({ error: error.message || "Failed to delete products" }, { status: 500 })
  }
}
