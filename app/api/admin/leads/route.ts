import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repo";

export async function GET() {
  const repo = getRepository();
  const leads = await repo.getAllEnquiries();
  return NextResponse.json(leads);
}
