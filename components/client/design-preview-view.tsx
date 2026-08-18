"use client";

import { useMemo, useState } from "react";
import type { DesignPreview, DesignPreviewPage } from "@/types/design-preview";

function pagePath(page: DesignPreviewPage, index: number) {
  if (index === 0) return "/";
  const slug = (page.slug || "").replace(/^\/+/, "");
  return slug ? `/${slug}` : "/";
}

function displayUrl(siteUrl: string, path: string) {
  const host = (siteUrl || "preview").replace(/^https?:\/\//, "").replace(/\/+$/, "");
  return path === "/" ? host : `${host}${path}`;
}

export function DesignPreviewView({ preview }: { preview: DesignPreview }) {
  const pages = preview.pages.filter((page) => page.image);
  const [activeId, setActiveId] = useState(pages[0]?.id || "");
  const activeIndex = Math.max(
    0,
    pages.findIndex((page) => page.id === activeId),
  );
  const active = pages[activeIndex] || pages[0];
  const path = active ? pagePath(active, activeIndex) : "/";
  const address = useMemo(
    () => displayUrl(preview.siteUrl, path),
    [preview.siteUrl, path],
  );

  if (!active) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6 text-center text-sm text-slate-500">
        This preview has no page images yet.
      </div>
    );
  }

  const frame = (
    <div className="overflow-hidden bg-white">
      {pages.length > 1 && !preview.showBrowserChrome ? (
        <div className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-slate-50 px-2 py-2">
          {pages.map((page) => (
            <button
              key={page.id}
              type="button"
              onClick={() => setActiveId(page.id)}
              className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium ${
                page.id === active.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {page.label}
            </button>
          ))}
        </div>
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={active.image}
        alt={active.label || preview.title}
        className="block h-auto w-full"
      />
    </div>
  );

  if (!preview.showBrowserChrome) {
    return <div className="min-h-screen bg-slate-100">{frame}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-200 px-3 py-4 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-xl border border-slate-300 bg-white shadow-lg">
        <div className="border-b border-slate-200 bg-slate-100 px-3 py-2">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1 truncate rounded-md bg-white px-3 py-1.5 text-center text-xs text-slate-600 ring-1 ring-slate-200">
              {address}
            </div>
          </div>
          {pages.length > 1 ? (
            <div className="mt-2 flex gap-1 overflow-x-auto">
              {pages.map((page, index) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => setActiveId(page.id)}
                  className={`shrink-0 rounded-t-md px-3 py-1.5 text-xs font-medium ${
                    page.id === active.id
                      ? "bg-white text-slate-900"
                      : "text-slate-500 hover:bg-white/60 hover:text-slate-800"
                  }`}
                >
                  {page.label || `Page ${index + 1}`}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        {frame}
      </div>
    </div>
  );
}
