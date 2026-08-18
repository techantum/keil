"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminSaveButton } from "@/components/admin/admin-form";
import { HomeCmsForm } from "@/components/admin/cms/home-form";
import { useCmsPage } from "@/hooks/use-cms-page";
import { mergeHomeContent } from "@/lib/cms/merge-content";
import type { HomePageContent } from "@/types";
import type { LandingPage } from "@/types/landing-page";

export default function CmsHomePage() {
  const { content, setContent, loading, saving, save } = useCmsPage<HomePageContent>(
    "/api/admin/content/home",
    mergeHomeContent,
  );
  const [takeover, setTakeover] = useState<LandingPage | null>(null);

  useEffect(() => {
    fetch("/api/admin/landing-pages")
      .then((res) => (res.ok ? res.json() : []))
      .then((pages: LandingPage[]) => {
        const live =
          pages.find(
            (p) => p.status === "published" && p.redirect?.mode === "any_slug",
          ) ||
          pages.find(
            (p) =>
              p.status === "published" &&
              p.redirect?.mode === "specific_pages" &&
              (p.redirect.paths || []).includes("/"),
          ) ||
          null;
        setTakeover(live);
      })
      .catch(() => {});
  }, []);

  if (loading || !content) {
    return (
      <div className="flex items-center gap-2 p-3 text-xs text-slate-500">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading...
      </div>
    );
  }

  return (
    <AdminShell
      title="CMS · Home"
      description="Edit homepage sections shown on the public site"
      actions={<AdminSaveButton saving={saving} onClick={save} label="Save Home" />}
    >
      {takeover ? (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          The live website currently shows landing page{" "}
          <strong>{takeover.title}</strong> instead of this CMS Home content.
          Edit the live site in{" "}
          <Link
            href={`/admin/cms/landing-pages/${takeover.id}`}
            className="font-semibold underline"
          >
            Landing Pages
          </Link>
          , or share a mockup from{" "}
          <Link href="/admin/cms/design-previews" className="font-semibold underline">
            Design Previews
          </Link>
          .
        </div>
      ) : null}
      <HomeCmsForm content={content} onChange={setContent} />
    </AdminShell>
  );
}
