import { NextResponse } from "next/server"
import { getRepository } from "@/lib/repo"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const repo = getRepository()
  const enquiries = await repo.getAllEnquiries()

  return NextResponse.json(enquiries)
}
