"use client";

import { Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminSaveButton } from "@/components/admin/admin-form";
import { AboutCmsForm } from "@/components/admin/cms/about-form";
import { useCmsPage } from "@/hooks/use-cms-page";
import { mergeAboutContent } from "@/lib/cms/merge-content";
import type { AboutPageContent } from "@/types";

export default function CmsAboutPage() {
  const { content, setContent, loading, saving, save } = useCmsPage<AboutPageContent>(
    "/api/admin/content/about",
    mergeAboutContent,
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
      title="CMS · About"
      description="Edit about page content and sections"
      actions={<AdminSaveButton saving={saving} onClick={save} label="Save About" />}
    >
      <AboutCmsForm content={content} onChange={setContent} />
    </AdminShell>
  );
}
