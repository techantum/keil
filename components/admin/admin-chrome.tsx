"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div
        className={`fixed inset-y-0 left-0 z-50 h-full shadow-xl transition-transform duration-200 md:static md:z-auto md:translate-x-0 md:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar onNavigate={() => setMobileOpen(false)} />
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex h-12 shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-3 md:hidden dark:border-slate-800 dark:bg-slate-950">
          <button
            type="button"
            className="rounded-md p-1.5 text-slate-700 dark:text-slate-200"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            CMS Admin
          </span>
        </div>
        <main className="admin-compact flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden bg-gradient-to-b from-slate-50 to-indigo-50/40 dark:bg-slate-900">
          {children}
        </main>
      </div>
    </div>
  );
}
