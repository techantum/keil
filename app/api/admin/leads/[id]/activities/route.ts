import { type NextRequest, NextResponse } from "next/server";
import { getRepository } from "@/lib/repo";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const repo = getRepository();
  const activities = await repo.getLeadActivities(id);
  return NextResponse.json(activities);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const repo = getRepository();
    const activity = await repo.addLeadActivity(id, {
      activityType: body.activityType || "note",
      content: body.content,
      createdBy: body.createdBy,
    });
    return NextResponse.json(activity, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to add activity";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
