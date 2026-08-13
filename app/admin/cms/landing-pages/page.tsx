"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  Pencil,
  Plus,
  Rocket,
  Search,
  Trash2,
  Loader2,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MediaUpload } from "@/components/admin/media-upload";
import { IMAGE_PRESETS } from "@/lib/cms/image-presets";
import { useToastContext } from "@/components/providers/toast-provider";
import type { LandingPage } from "@/types/landing-page";
import { makeLandingSlug } from "@/lib/landing-pages/slug";

export default function LandingPagesAdminPage() {
  const { success, error } = useToastContext();
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ title: "", slug: "", designImage: "" });

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/admin/landing-pages");
      if (!res.ok) throw new Error("Failed");
      setPages(await res.json());
    } catch {
      error("Failed to load landing pages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleCreate = async () => {
    if (!form.title.trim()) {
      error("Please enter a page title");
      return;
    }
    if (!form.designImage) {
      error("Please upload a landing page UI design image");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/admin/landing-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug || makeLandingSlug(form.title),
          designImage: form.designImage,
          analyze: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create");

      success(data.analysis?.message || "Landing page created");
      setDialogOpen(false);
      setForm({ title: "", slug: "", designImage: "" });
      window.location.href = `/admin/cms/landing-pages/${data.page.id}`;
    } catch (err) {
      error(err instanceof Error ? err.message : "Failed to create landing page");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this landing page?")) return;
    try {
      const res = await fetch(`/api/admin/landing-pages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      success("Landing page deleted");
      fetchPages();
    } catch {
      error("Failed to delete landing page");
    }
  };

  const handlePublish = async (page: LandingPage) => {
    setPublishingId(page.id);
    try {
      const nextStatus = page.status === "published" ? "draft" : "published";
      const res = await fetch(`/api/admin/landing-pages/${page.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      success(
        nextStatus === "published"
          ? `Published at /lp/${page.slug}`
          : "Moved to draft",
      );
      fetchPages();
    } catch {
      error("Failed to update status");
    } finally {
      setPublishingId(null);
    }
  };

  const filtered = pages.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="cms-studio lp-studio">
      <div className="lp-studio-header">
        <div>
          <div className="lp-studio-title">Landing Pages</div>
          <div className="lp-studio-sub">
            Create from UI designs · edit content · publish to /lp/slug
          </div>
        </div>
        <div className="cms-studio-actions">
        <button
          type="button"
          className="lp-btn lp-btn-save"
          onClick={() => {
            setForm({ title: "", slug: "", designImage: "" });
            setDialogOpen(true);
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          Add landing page
        </button>
        </div>
      </div>

      <div className="cms-studio-body">
      <div className="lp-panel">
        <div className="lp-panel-body">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                className="lp-input pl-9"
                placeholder="Search by title or slug…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="lp-badge lp-badge-live">{filtered.length} pages</span>
          </div>

          {loading ? (
            <div className="lp-hint py-8 text-center">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-teal-200 bg-teal-50/40 px-4 py-10 text-center">
              <Sparkles className="mx-auto mb-2 h-6 w-6 text-teal-600" />
              <p className="text-sm font-semibold text-slate-800">No landing pages yet</p>
              <p className="lp-hint mt-1">
                Upload a UI design screenshot to generate an editable page.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filtered.map((page) => {
                const isLive = page.status === "published";
                return (
                  <div key={page.id} className="lp-list-card">
                    {page.designImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={page.designImage}
                        alt=""
                        className="h-16 w-24 rounded-lg object-cover object-top shadow-sm"
                      />
                    ) : (
                      <div className="h-16 w-24 rounded-lg bg-slate-100" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="truncate text-sm font-bold text-slate-900">
                          {page.title}
                        </div>
                        <span className={`lp-badge ${isLive ? "lp-badge-live" : "lp-badge-draft"}`}>
                          {isLive ? "Published" : "Draft"}
                        </span>
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-500">
                        /lp/{page.slug} · {page.sections?.length || 0} sections
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        className={`lp-btn ${isLive ? "lp-btn-unpublish" : "lp-btn-publish"}`}
                        onClick={() => handlePublish(page)}
                        disabled={publishingId === page.id}
                      >
                        {publishingId === page.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Rocket className="h-3.5 w-3.5" />
                        )}
                        {isLive ? "Unpublish" : "Publish"}
                      </button>
                      {isLive && (
                        <a
                          href={`/lp/${page.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="lp-btn lp-btn-ghost !bg-slate-900 !text-white"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          View
                        </a>
                      )}
                      <Link
                        href={`/admin/cms/landing-pages/${page.id}`}
                        className="lp-btn lp-btn-accent"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="lp-btn lp-btn-danger"
                        onClick={() => handleDelete(page.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg overflow-hidden border-0 p-0 shadow-2xl">
          <div className="bg-gradient-to-r from-slate-900 via-teal-800 to-sky-600 px-5 py-4 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Add landing page</DialogTitle>
              <DialogDescription className="text-teal-100">
                Upload a full-page UI design. Sections are detected automatically.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-3 px-5 py-4">
            <div className="lp-field">
              <label>Page title</label>
              <input
                value={form.title}
                placeholder="KEIL EC Sheds Landing"
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    title: e.target.value,
                    slug: f.slug || makeLandingSlug(e.target.value),
                  }))
                }
              />
            </div>
            <div className="lp-field">
              <label>URL slug</label>
              <input
                value={form.slug}
                placeholder="keil-ec-sheds"
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              />
              <p className="lp-hint">Public URL: /lp/{form.slug || "your-slug"}</p>
            </div>
            <div className="lp-field">
              <label>Landing page UI design</label>
              <MediaUpload
                value={form.designImage}
                onChange={(url) => setForm((f) => ({ ...f, designImage: url }))}
                accept="image"
                {...IMAGE_PRESETS.hero}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 border-t bg-slate-50 px-5 py-3">
            <button
              type="button"
              className="lp-btn lp-btn-danger"
              onClick={() => setDialogOpen(false)}
              disabled={creating}
            >
              Cancel
            </button>
            <button
              type="button"
              className="lp-btn lp-btn-publish"
              onClick={handleCreate}
              disabled={creating}
            >
              {creating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              {creating ? "Analyzing design…" : "Create from design"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
