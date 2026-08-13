import { type NextRequest, NextResponse } from "next/server";
import { getRepository } from "@/lib/repo";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const repo = getRepository();

    if (body.status && !body.stage && !body.priority) {
      const lead = await repo.updateEnquiryStatus(id, body.status);
      if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
      return NextResponse.json(lead);
    }

    const lead = await repo.updateLead(id, body);
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    return NextResponse.json(lead);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update lead";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  return PUT(request, ctx);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const repo = getRepository();
    const success = await repo.deleteEnquiry(id);
    if (!success) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete lead";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
