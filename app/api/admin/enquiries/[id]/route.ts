import { type NextRequest, NextResponse } from "next/server"
import { getRepository } from "@/lib/repo"
import { getSession } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const { status } = await request.json()

    if (!["pending", "contacted", "resolved"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const repo = getRepository()
    const enquiry = await repo.updateEnquiryStatus(id, status)

    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 })
    }

    return NextResponse.json(enquiry)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update enquiry" }, { status: 400 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return PUT(request, { params })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const repo = getRepository()
    const success = await repo.deleteEnquiry(id)

    if (!success) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Enquiry deleted successfully" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete enquiry" }, { status: 400 })
  }
}
