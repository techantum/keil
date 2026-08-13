"use client";

import { Loader2, Save } from "lucide-react";
import { FooterCmsForm } from "@/components/admin/cms/footer-form";
import { useCmsPage } from "@/hooks/use-cms-page";
import { mergeFooterContent } from "@/lib/cms/merge-content";
import type { FooterContent } from "@/types";

export function LandingFooterEditor() {
  const { content, setContent, loading, saving, save } = useCmsPage<FooterContent>(
    "/api/admin/content/footer",
    mergeFooterContent,
  );

  return (
    <div className="lp-panel mb-3">
      <div className="lp-panel-head flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3>Site footer</h3>
          <p className="lp-hint mt-0.5">
            Shared across the website and this landing page. Save footer separately from the landing page.
          </p>
        </div>
        <button
          type="button"
          className="lp-btn lp-btn-save"
          onClick={() => save()}
          disabled={saving || loading || !content}
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Save footer
        </button>
      </div>
      <div className="lp-panel-body">
        {loading || !content ? (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading footer...
          </div>
        ) : (
          <FooterCmsForm content={content} onChange={setContent} />
        )}
      </div>
    </div>
  );
}
