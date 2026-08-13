import { NextResponse } from "next/server";
import { getSession, requireSuperAdminApi } from "@/lib/auth";
import {
  getNavItems,
  updateNavItems,
  type NavItemUpdate,
} from "@/lib/nav/get-nav-items";
import { NAV_KEYS, isValidNavSlug, normalizeNavSlug, type NavKey } from "@/lib/nav/registry";
import {
  navCookieOptions,
  serializeNavCookie,
  NAV_COOKIE,
} from "@/lib/nav/nav-cookie";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = await getNavItems();
    return NextResponse.json({
      items,
      role: session.role,
      canManage: session.role === "super_admin",
    });
  } catch (error) {
    console.error("Failed to fetch nav items:", error);
    return NextResponse.json({ error: "Failed to fetch nav items" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireSuperAdminApi();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const incoming = body.items as NavItemUpdate[] | undefined;

    if (!Array.isArray(incoming) || incoming.length === 0) {
      return NextResponse.json({ error: "items array is required" }, { status: 400 });
    }

    const updates: NavItemUpdate[] = [];
    const slugs = new Set<string>();

    for (const item of incoming) {
      if (!item?.key || !NAV_KEYS.includes(item.key as NavKey)) continue;

      const update: NavItemUpdate = { key: item.key as NavKey };

      if (typeof item.label === "string") {
        update.label = item.label.trim();
      }
      if (typeof item.slug === "string") {
        const slug = normalizeNavSlug(item.slug);
        if (!isValidNavSlug(slug)) {
          return NextResponse.json(
            { error: `Invalid slug for ${item.key}. Use lowercase letters, numbers, and hyphens.` },
            { status: 400 },
          );
        }
        if (item.key === "home" && slug !== "/") {
          return NextResponse.json(
            { error: "Home slug must remain /" },
            { status: 400 },
          );
        }
        update.slug = slug;
      }
      if (typeof item.enabled === "boolean") {
        update.enabled = item.enabled;
      }

      updates.push(update);
    }

    const current = await getNavItems();
    const merged = current.map((item) => {
      const update = updates.find((u) => u.key === item.key);
      return {
        ...item,
        label: update?.label ?? item.label,
        slug: update?.slug ?? item.slug,
        enabled: update?.enabled ?? item.enabled,
      };
    });

    for (const item of merged) {
      const slug = normalizeNavSlug(item.slug);
      if (slugs.has(slug)) {
        return NextResponse.json(
          { error: `Duplicate slug: ${slug}. Each menu item needs a unique path.` },
          { status: 400 },
        );
      }
      slugs.add(slug);
    }

    await updateNavItems(updates);
    const items = await getNavItems();

    const response = NextResponse.json({ success: true, items });
    response.cookies.set(NAV_COOKIE, serializeNavCookie(items), navCookieOptions());
    return response;
  } catch (error) {
    console.error("Failed to update nav items:", error);
    return NextResponse.json({ error: "Failed to update nav items" }, { status: 500 });
  }
}
