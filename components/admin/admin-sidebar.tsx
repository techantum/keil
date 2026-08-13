"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { ADMIN_CORE_NAV, MODULES } from "@/lib/modules/registry";
import { CMS_ADMIN_BASE, CMS_MODULE_KEYS, getVisibleCmsNav, isCmsAdminPath } from "@/lib/cms/nav";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [logo, setLogo] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [enabledModules, setEnabledModules] = useState<Record<string, boolean>>({});
  const [role, setRole] = useState<"admin" | "super_admin" | null>(null);
  const [cmsOpen, setCmsOpen] = useState(isCmsAdminPath(pathname));

  useEffect(() => {
    if (isCmsAdminPath(pathname)) {
      setCmsOpen(true);
    }
  }, [pathname]);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.branding?.dashboardLogo) setLogo(data.branding.dashboardLogo);
      })
      .catch(() => {});

    fetch("/api/admin/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.role) setRole(data.role);
      })
      .catch(() => {});

    fetch("/api/admin/modules")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setEnabledModules(data.modules || {});
        if (data.role) setRole(data.role);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const cmsModule = MODULES.content;
  const isSuperAdmin = role === "super_admin";
  const cmsNavItems = getVisibleCmsNav(enabledModules, { showAll: isSuperAdmin });
  const cmsEnabled = isSuperAdmin || cmsNavItems.length > 0;

  const moduleNav = Object.values(MODULES)
    .filter(
      (m) =>
        m.adminNav &&
        !CMS_MODULE_KEYS.has(m.key) &&
        enabledModules[m.key] !== false,
    )
    .map((m) => ({
      name: m.label,
      href: m.adminRoutes[0],
      icon: m.icon,
    }));

  const coreNav = [
    ...ADMIN_CORE_NAV.filter((item) => item.href !== "/admin/modules"),
    ...(isSuperAdmin ? [ADMIN_CORE_NAV.find((item) => item.href === "/admin/modules")!] : []),
  ];

  const cmsActive = isCmsAdminPath(pathname);
  const CmsIcon = cmsModule.icon;

  const linkClass = (active: boolean) =>
    cn(
      "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
      active
        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900",
    );

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r border-slate-200 bg-white text-slate-900 transition-all dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100",
        collapsed ? "w-16" : "w-56",
      )}
    >
      <div className="flex h-12 items-center justify-between border-b border-slate-200 px-3 dark:border-slate-800">
        {!collapsed && (
          <div className="flex flex-col">
            {logo ? (
              <Image src={logo} alt="Logo" width={120} height={32} className="max-h-8 object-contain" />
            ) : (
              <span className="text-xs font-semibold tracking-wide text-indigo-600">CMS Admin</span>
            )}
            {role === "super_admin" && (
              <span className="mt-0.5 text-[10px] font-medium text-amber-600">Super Admin</span>
            )}
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        {coreNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href} title={item.name} className={linkClass(isActive)}>
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}

        {cmsEnabled && (
          <div className="space-y-0.5">
            <button
              type="button"
              title={cmsModule.label}
              onClick={() => {
                if (collapsed) {
                  router.push(cmsNavItems[0]?.href ?? `${CMS_ADMIN_BASE}/home`);
                  return;
                }
                setCmsOpen((open) => !open);
              }}
              className={cn(linkClass(cmsActive), "w-full text-left")}
            >
              <CmsIcon className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{cmsModule.label}</span>
                  {cmsOpen ? (
                    <ChevronUp className="h-3.5 w-3.5 shrink-0 opacity-60" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" />
                  )}
                </>
              )}
            </button>

            {!collapsed && cmsOpen && (
              <div className="ml-3 space-y-0.5 border-l border-slate-200 pl-2 dark:border-slate-800">
                {cmsNavItems.map((item) => {
                  const isActive =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const isDisabled = enabledModules[item.moduleKey] === false;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={item.name}
                      className={cn(
                        "block rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
                        isActive
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900",
                        isDisabled && !isActive && "opacity-50",
                      )}
                    >
                      {item.name}
                      {isSuperAdmin && isDisabled && (
                        <span className="ml-1 text-[9px] uppercase text-slate-400">off</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {moduleNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href} title={item.name} className={linkClass(isActive)}>
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-slate-200 p-2 dark:border-slate-800">
        <ThemeToggle compact={collapsed} />
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-8 w-full justify-start text-xs", collapsed && "justify-center px-0")}
          onClick={handleLogout}
        >
          <LogOut className={cn("h-4 w-4", !collapsed && "mr-2")} />
          {!collapsed && "Logout"}
        </Button>
      </div>
    </div>
  );
}
