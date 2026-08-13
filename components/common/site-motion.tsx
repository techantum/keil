"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function SiteMotion() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;

    document.documentElement.classList.add("site-smooth-scroll");
    return () => {
      document.documentElement.classList.remove("site-smooth-scroll");
    };
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) return;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, isAdmin]);

  return null;
}
