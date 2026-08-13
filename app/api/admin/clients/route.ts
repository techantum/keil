import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getRepository } from "@/lib/repo"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const repository = getRepository()
    const clients = await repository.getAllClients()
    return NextResponse.json(clients)
  } catch (error) {
    console.error("Failed to fetch clients:", error)
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, logo, website, order } = body

    if (!name || !logo) {
      return NextResponse.json(
        { error: "Missing required fields: name, logo" },
        { status: 400 },
      )
    }

    const repository = getRepository()
    const newClient = await repository.createClient({
      name,
      logo,
      website: website || "",
      order: order || 0,
    })

    return NextResponse.json(newClient, { status: 201 })
  } catch (error: any) {
    console.error("Failed to create client:", error)
    return NextResponse.json({ error: error.message || "Failed to create client" }, { status: 500 })
  }
}
