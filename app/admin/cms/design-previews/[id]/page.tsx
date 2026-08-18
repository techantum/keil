"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Copy, ExternalLink, Loader2, Plus, Trash2 } from "lucide-react";
import { MediaUpload } from "@/components/admin/media-upload";
import { IMAGE_PRESETS } from "@/lib/cms/image-presets";
import { useToastContext } from "@/components/providers/toast-provider";
import { makeLandingSlug } from "@/lib/landing-pages/slug";
import type { DesignPreview, DesignPreviewPage } from "@/types/design-preview";

function blankPage(): DesignPreviewPage {
  return {
    id: crypto.randomUUID(),
    label: "Page",
    slug: "page",
    image: "",
  };
}

export default function DesignPreviewEditorPage() {
  const { id } = useParams<{ id: string }>();
  const { success, error } = useToastContext();
  const [preview, setPreview] = useState<DesignPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/design-previews/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setPreview(data))
      .catch(() => error("Failed to load preview"))
      .finally(() => setLoading(false));
  }, [id]);

  const persist = async (next: DesignPreview, message = "Saved") => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/design-previews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: next.title,
          clientName: next.clientName,
          siteUrl: next.siteUrl,
          showBrowserChrome: next.showBrowserChrome,
          pages: next.pages,
          status: next.status,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setPreview(data.preview);
      success(message);
    } catch (err) {
      error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const patch = (partial: Partial<DesignPreview>) => {
    if (!preview) return;
    setPreview({ ...preview, ...partial });
  };

  const updatePage = (pageId: string, partial: Partial<DesignPreviewPage>) => {
    if (!preview) return;
    patch({
      pages: preview.pages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              ...partial,
              slug:
                partial.label && !partial.slug
                  ? makeLandingSlug(partial.label)
                  : partial.slug ?? page.slug,
            }
          : page,
      ),
    });
  };

  const copyLink = async () => {
    if (!preview) return;
    const url = `${window.location.origin}/p/${preview.shareToken}`;
    try {
      await navigator.clipboard.writeText(url);
      success("Share link copied");
    } catch {
      error(url);
    }
  };

  if (loading) {
    return (
      <div className="cms-studio lp-studio">
        <div className="lp-panel">
          <div className="lp-panel-body lp-hint">Loading preview…</div>
        </div>
      </div>
    );
  }

  if (!preview) {
    return (
      <div className="cms-studio lp-studio">
        <div className="lp-panel">
          <div className="lp-panel-body">
            <p>Design preview not found.</p>
            <Link href="/admin/cms/design-previews" className="lp-btn lp-btn-accent mt-3">
              Back to list
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isLive = preview.status === "live";

  return (
    <div className="cms-studio lp-studio">
      <div className="lp-studio-header">
        <div>
          <div className="lp-studio-title">Design Preview</div>
          <div className="lp-studio-sub">{preview.title}</div>
        </div>
        <div className="cms-studio-actions">
          <Link href="/admin/cms/design-previews" className="lp-btn lp-btn-ghost">
            Back
          </Link>
          <a
            href={`/p/${preview.shareToken}`}
            target="_blank"
            rel="noreferrer"
            className="lp-btn lp-btn-ghost !bg-slate-900 !text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open preview
          </a>
          <button type="button" className="lp-btn lp-btn-accent" onClick={copyLink}>
            <Copy className="h-3.5 w-3.5" />
            Copy link
          </button>
          <button
            type="button"
            className="lp-btn lp-btn-save"
            disabled={saving}
            onClick={() => persist(preview)}
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Save
          </button>
        </div>
      </div>

      <div className="lp-panel mb-3">
        <div className="lp-panel-head">
          <h3>Details</h3>
        </div>
        <div className="lp-panel-body">
          <div className="lp-grid">
            <div className="lp-field lp-col-6">
              <label>Title</label>
              <input
                value={preview.title}
                onChange={(e) => patch({ title: e.target.value })}
              />
            </div>
            <div className="lp-field lp-col-6">
              <label>Client name</label>
              <input
                value={preview.clientName}
                onChange={(e) => patch({ clientName: e.target.value })}
              />
            </div>
            <div className="lp-field lp-col-6">
              <label>Address bar URL</label>
              <input
                value={preview.siteUrl}
                placeholder="www.client.com"
                onChange={(e) => patch({ siteUrl: e.target.value })}
              />
            </div>
            <div className="lp-field lp-col-6">
              <label>Status</label>
              <select
                value={preview.status}
                onChange={(e) =>
                  patch({ status: e.target.value as DesignPreview["status"] })
                }
              >
                <option value="draft">Draft</option>
                <option value="live">Live</option>
              </select>
            </div>
          </div>
          <label className="mt-3 flex items-center gap-2 text-xs text-slate-700">
            <input
              type="checkbox"
              checked={preview.showBrowserChrome}
              onChange={(e) => patch({ showBrowserChrome: e.target.checked })}
            />
            Show browser chrome (traffic lights + address bar)
          </label>
          <p className="lp-hint mt-2">
            Public URL: /p/{preview.shareToken}
            {isLive ? " · live" : " · draft (link still works)"}
          </p>
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Pages</h2>
          <p className="lp-hint">Each image is one screen in the preview</p>
        </div>
        <button
          type="button"
          className="lp-btn lp-btn-accent"
          onClick={() => patch({ pages: [...preview.pages, blankPage()] })}
        >
          <Plus className="h-3.5 w-3.5" />
          Add page
        </button>
      </div>

      <div className="space-y-3">
        {preview.pages.map((page, index) => (
          <div key={page.id} className="lp-panel">
            <div className="lp-panel-head">
              <h3>
                {index + 1}. {page.label || "Untitled page"}
              </h3>
              {preview.pages.length > 1 ? (
                <button
                  type="button"
                  className="lp-btn lp-btn-danger"
                  onClick={() =>
                    patch({ pages: preview.pages.filter((item) => item.id !== page.id) })
                  }
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>
            <div className="lp-panel-body">
              <div className="lp-grid mb-3">
                <div className="lp-field lp-col-6">
                  <label>Tab label</label>
                  <input
                    value={page.label}
                    onChange={(e) => updatePage(page.id, { label: e.target.value })}
                  />
                </div>
                <div className="lp-field lp-col-6">
                  <label>Path slug</label>
                  <input
                    value={page.slug}
                    placeholder="about"
                    onChange={(e) =>
                      updatePage(page.id, { slug: makeLandingSlug(e.target.value) })
                    }
                  />
                </div>
              </div>
              <MediaUpload
                value={page.image}
                onChange={(url) => updatePage(page.id, { image: url })}
                accept="image"
                {...IMAGE_PRESETS.hero}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
