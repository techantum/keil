import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getRepository } from "@/lib/repo"
import { z } from "zod"

const bulkDeleteSchema = z.object({
  productIds: z.array(z.string()).min(1, "At least one product ID is required")
})

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    console.log("Bulk delete request:", body)
    
    const { productIds } = bulkDeleteSchema.parse(body)

    const repo = getRepository()
    
    let deleted = 0
    let failed = 0
    const errors: string[] = []

    // Delete each product
    for (const productId of productIds) {
      try {
        const success = await repo.deleteProduct(productId)
        if (success) {
          deleted++
          console.log(`Successfully deleted product: ${productId}`)
        } else {
          failed++
          errors.push(`Product not found: ${productId}`)
        }
      } catch (error: any) {
        failed++
        errors.push(`Failed to delete product ${productId}: ${error.message}`)
        console.error(`Error deleting product ${productId}:`, error)
      }
    }

    console.log(`Bulk delete completed: ${deleted} deleted, ${failed} failed`)

    return NextResponse.json({
      success: true,
      deleted,
      failed,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully deleted ${deleted} product${deleted !== 1 ? 's' : ''}${failed > 0 ? `, ${failed} failed` : ''}`
    })
  } catch (error: any) {
    console.error("Bulk delete error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to delete products" },
      { status: 400 }
    )
  }
}
