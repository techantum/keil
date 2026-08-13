import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";
import { MODULES_COOKIE } from "@/lib/modules/module-cookie";

export async function POST() {
  await clearSession();
  const response = NextResponse.json({ success: true });
  response.cookies.delete(MODULES_COOKIE);
  return response;
}
