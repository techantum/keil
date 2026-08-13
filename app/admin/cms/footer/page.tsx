"use client";

import { Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminSaveButton } from "@/components/admin/admin-form";
import { FooterCmsForm } from "@/components/admin/cms/footer-form";
import { useCmsPage } from "@/hooks/use-cms-page";
import { mergeFooterContent } from "@/lib/cms/merge-content";
import type { FooterContent } from "@/types";

export default function CmsFooterPage() {
  const { content, setContent, loading, saving, save } = useCmsPage<FooterContent>(
    "/api/admin/content/footer",
    mergeFooterContent,
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
      title="CMS · Footer"
      description="Edit footer links, contact details and social media"
      actions={<AdminSaveButton saving={saving} onClick={save} label="Save Footer" />}
    >
      <FooterCmsForm content={content} onChange={setContent} />
    </AdminShell>
  );
}
