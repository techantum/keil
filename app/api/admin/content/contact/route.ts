import { NextResponse } from "next/server"
import { getRepository } from "@/lib/repo"

export async function GET() {
  try {
    const repo = getRepository()
    const content = await repo.getContactPageContent()
    return NextResponse.json(content)
  } catch (error) {
    console.error("Failed to fetch contact page content:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const repo = getRepository()
    const updates = await request.json()
    const updated = await repo.updateContactPageContent(updates)
    return NextResponse.json(updated)
  } catch (error) {
    console.error("Failed to update contact page content:", error)
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}
