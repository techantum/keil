"use client";

import { Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminSaveButton } from "@/components/admin/admin-form";
import { ContactCmsForm } from "@/components/admin/cms/contact-form";
import { useCmsPage } from "@/hooks/use-cms-page";
import { mergeContactContent } from "@/lib/cms/merge-content";
import type { ContactPageContent } from "@/types";

export default function CmsContactPage() {
  const { content, setContent, loading, saving, save } = useCmsPage<ContactPageContent>(
    "/api/admin/content/contact",
    mergeContactContent,
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
      title="CMS · Contact"
      description="Edit contact page content and enquiry form"
      actions={<AdminSaveButton saving={saving} onClick={save} label="Save Contact" />}
    >
      <ContactCmsForm content={content} onChange={setContent} />
    </AdminShell>
  );
}
