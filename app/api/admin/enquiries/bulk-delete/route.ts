import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getRepository } from "@/lib/repo"
import { z } from "zod"

const bulkDeleteSchema = z.object({
  enquiryIds: z.array(z.string()).min(1, "At least one enquiry ID is required")
})

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    console.log("Bulk delete enquiries request:", body)
    
    const { enquiryIds } = bulkDeleteSchema.parse(body)

    const repo = getRepository()
    
    let deleted = 0
    let failed = 0
    const errors: string[] = []

    // Delete each enquiry
    for (const enquiryId of enquiryIds) {
      try {
        const success = await repo.deleteEnquiry(enquiryId)
        if (success) {
          deleted++
          console.log(`Successfully deleted enquiry: ${enquiryId}`)
        } else {
          failed++
          errors.push(`Enquiry not found: ${enquiryId}`)
        }
      } catch (error: any) {
        failed++
        errors.push(`Failed to delete enquiry ${enquiryId}: ${error.message}`)
        console.error(`Error deleting enquiry ${enquiryId}:`, error)
      }
    }

    console.log(`Bulk delete completed: ${deleted} deleted, ${failed} failed`)

    return NextResponse.json({
      success: true,
      deleted,
      failed,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully deleted ${deleted} enquir${deleted !== 1 ? 'ies' : 'y'}${failed > 0 ? `, ${failed} failed` : ''}`
    })
  } catch (error: any) {
    console.error("Bulk delete error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to delete enquiries" },
      { status: 400 }
    )
  }
}
