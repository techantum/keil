import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getRepository } from "@/lib/repo"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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
        { status: 400 }
      )
    }

    const repository = getRepository()
    const updatedClient = await repository.updateClient(params.id, {
      name,
      logo,
      website: website || "",
      order: order || 0,
    })

    if (!updatedClient) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    return NextResponse.json(updatedClient)
  } catch (error: any) {
    console.error("Failed to update client:", error)
    return NextResponse.json({ error: error.message || "Failed to update client" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const repository = getRepository()
    const success = await repository.deleteClient(params.id)

    if (!success) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Failed to delete client:", error)
    return NextResponse.json({ error: error.message || "Failed to delete client" }, { status: 500 })
  }
}
