"use client";

import { useEffect, useRef } from "react";
import { FooterCmsForm } from "@/components/admin/cms/footer-form";
import { mergeFooterContent } from "@/lib/cms/merge-content";
import type { FooterContent } from "@/types";

export function LandingFooterEditor({
  content,
  onChange,
}: {
  content?: FooterContent;
  onChange: (content: FooterContent) => void;
}) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (content) return;
    let cancelled = false;
    fetch("/api/admin/content/footer", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        onChangeRef.current(mergeFooterContent(data && !data.error ? data : {}));
      })
      .catch(() => {
        if (!cancelled) onChangeRef.current(mergeFooterContent({}));
      });
    return () => {
      cancelled = true;
    };
  }, [content]);

  return (
    <div className="lp-panel mb-3">
      <div className="lp-panel-head">
        <div>
          <h3>Landing page footer</h3>
          <p className="lp-hint mt-0.5">
            Unique to this landing page. Use the landing page Save button to publish footer changes.
          </p>
        </div>
      </div>
      <div className="lp-panel-body">
        {content ? (
          <FooterCmsForm content={content} onChange={onChange} />
        ) : (
          <p className="lp-hint">Loading footer...</p>
        )}
      </div>
    </div>
  );
}
