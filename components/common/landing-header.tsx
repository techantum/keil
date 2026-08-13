"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import Image from "next/image";
import { usePublicSettings } from "@/hooks/use-public-settings";
import { defaultPublicSettings } from "@/lib/content/default-content";
import { getLandingNavItems } from "@/lib/landing-pages/nav";
import type { LandingPage } from "@/types/landing-page";

const DEFAULT_COMPANY = defaultPublicSettings().company;

export function LandingHeader({ page }: { page: LandingPage }) {
  const { settings } = usePublicSettings();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [logo, setLogo] = useState<string | null>(null);

  const company = settings?.company ?? DEFAULT_COMPANY;
  const phone = company.phone || DEFAULT_COMPANY.phone;
  const phoneHref = `tel:${phone.replace(/\s/g, "")}`;
  const homeHref = `/lp/${page.slug}`;
  const navItems = getLandingNavItems(page);

  useEffect(() => {
    const override = page.branding?.navbarLogo?.trim();
    if (override) {
      setLogo(override);
      return;
    }
    if (settings?.branding?.websiteLogo) {
      setLogo(settings.branding.websiteLogo);
    }
  }, [settings, page.branding?.navbarLogo]);

  useEffect(() => {
    const ids = navItems.map((n) => n.id);
    if (ids.length === 0) return;

    setActiveId((prev) => (prev && ids.includes(prev) ? prev : ids[0]));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.1, 0.4, 0.7] },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [navItems]);

  return (
    <header className="lp-header sticky top-0 z-50 border-b border-[#edf0f3] bg-white">
      <nav className="keil-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[4.5rem] items-center justify-between gap-4 lg:h-[5.25rem]">
          <Link href={homeHref} className="flex shrink-0 items-center">
            {logo ? (
              <Image
                src={logo}
                alt={page.title || company.name || "KEIL"}
                width={180}
                height={64}
                className="h-11 w-auto object-contain lg:h-[3.25rem]"
                priority
              />
            ) : (
              <span className="text-2xl font-extrabold tracking-wide text-[var(--keil-navy)]">
                KEIL
              </span>
            )}
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-0.5 lg:flex xl:gap-1">
            {navItems.map((item) => {
              const active = activeId === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`lp-nav-link ${active ? "is-active" : ""}`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          <div className="hidden shrink-0 items-center lg:flex">
            {phone ? (
              <a href={phoneHref} className="lp-phone-btn">
                <Phone className="h-4 w-4" aria-hidden />
                {phone}
              </a>
            ) : null}
          </div>

          <button
            type="button"
            className="rounded-md p-2 text-[var(--keil-navy)] lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen ? (
          <div className="border-t border-[#edf0f3] py-3 lg:hidden">
            <div className="flex flex-col gap-0.5">
              {navItems.map((item) => {
                const active = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`lp-nav-link rounded-md px-3 py-2.5 ${
                      active ? "is-active" : ""
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                );
              })}
              {phone ? (
                <a
                  href={phoneHref}
                  className="lp-phone-btn mt-3 w-full"
                  onClick={() => setMobileOpen(false)}
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  {phone}
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
