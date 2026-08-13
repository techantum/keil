"use client";

import { Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminSaveButton } from "@/components/admin/admin-form";
import { HomeCmsForm } from "@/components/admin/cms/home-form";
import { useCmsPage } from "@/hooks/use-cms-page";
import { mergeHomeContent } from "@/lib/cms/merge-content";
import type { HomePageContent } from "@/types";

export default function CmsHomePage() {
  const { content, setContent, loading, saving, save } = useCmsPage<HomePageContent>(
    "/api/admin/content/home",
    mergeHomeContent,
  );

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
      <HomeCmsForm content={content} onChange={setContent} />
    </AdminShell>
  );
}
