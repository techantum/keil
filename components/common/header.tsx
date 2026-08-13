"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import type { SiteNavItem } from "@/lib/nav/default-nav-items";
import { usePublicSettings } from "@/hooks/use-public-settings";
import { defaultPublicSettings } from "@/lib/content/default-content";

const DEFAULT_COMPANY = defaultPublicSettings().company;

export function Header() {
  const { settings } = usePublicSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState<SiteNavItem[]>([]);
  const pathname = usePathname();
  const [logo, setLogo] = useState<string | null>(null);

  const company = settings?.company ?? DEFAULT_COMPANY;
  const phone = company.phone || DEFAULT_COMPANY.phone;
  const phoneHref = `tel:${phone.replace(/\s/g, "")}`;

  useEffect(() => {
    fetch("/api/nav")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.items)) {
          setNavItems(data.items);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (settings?.branding?.websiteLogo) {
      setLogo(settings.branding.websiteLogo);
    }
  }, [settings]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const linkClass = (href: string) => {
    const active = isActive(href);
    return `text-sm font-medium transition-colors lg:text-[15px] ${
      active
        ? "text-[var(--keil-green)]"
        : "text-[var(--keil-navy)] hover:text-[var(--keil-green)]"
    }`;
  };

  const homeItem = navItems.find((item) => item.key === "home");
  const logoHref = homeItem?.slug || "/";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
      <nav className="keil-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between lg:h-24">
          <Link href={logoHref} className="flex shrink-0 items-center">
            {logo ? (
              <Image
                src={logo}
                alt={company.name || "KEIL"}
                width={180}
                height={72}
                className="h-14 w-auto object-contain lg:h-16"
                priority
              />
            ) : (
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[var(--keil-navy)]">KEIL</span>
                <span className="text-[10px] font-medium text-[var(--keil-green)]">
                  Building Better Farms. Growing Together.
                </span>
              </div>
            )}
          </Link>

          <div className="hidden items-center gap-6 lg:flex xl:gap-8">
            {navItems
              .filter((item) => item.enabled)
              .map((item) => (
                <Link key={item.key} href={item.slug} className={linkClass(item.slug)}>
                  {item.label}
                </Link>
              ))}

            <a href={phoneHref} className="keil-btn keil-btn-primary !py-2.5 !text-xs">
              <Phone className="h-4 w-4" />
              {phone}
            </a>
          </div>

          <button
            className="rounded-md p-2 text-[var(--keil-navy)] lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-gray-100 py-4 lg:hidden">
            <div className="flex flex-col gap-1">
              {navItems
                .filter((item) => item.enabled)
                .map((item) => (
                  <Link
                    key={item.key}
                    href={item.slug}
                    className={`rounded-md px-3 py-2.5 ${linkClass(item.slug)}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              <a
                href={phoneHref}
                className="keil-btn keil-btn-primary mt-3 w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Phone className="h-4 w-4" />
                {phone}
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
