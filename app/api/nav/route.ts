import { NextResponse } from "next/server";
import { getNavItems, getPublicNavItems } from "@/lib/nav/get-nav-items";
import {
  navCookieOptions,
  serializeNavCookie,
  NAV_COOKIE,
} from "@/lib/nav/nav-cookie";

export async function GET() {
  const [items, allItems] = await Promise.all([getPublicNavItems(), getNavItems()]);
  const response = NextResponse.json({ items });
  response.cookies.set(NAV_COOKIE, serializeNavCookie(allItems), navCookieOptions());
  return response;
}
