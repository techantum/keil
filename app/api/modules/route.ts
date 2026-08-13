import { NextResponse } from "next/server";
import { getEnabledModules } from "@/lib/modules/get-enabled-modules";

export async function GET() {
  const modules = await getEnabledModules();
  return NextResponse.json(modules);
}
