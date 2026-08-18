"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  Pencil,
  Plus,
  Trash2,
  Loader2,
  MonitorSmartphone,
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
import type { DesignPreview } from "@/types/design-preview";

export default function DesignPreviewsAdminPage() {
  const { success, error } = useToastContext();
  const [items, setItems] = useState<DesignPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    clientName: "",
    siteUrl: "",
    image: "",
    showBrowserChrome: true,
  });

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/design-previews");
      if (!res.ok) throw new Error("Failed");
      setItems(await res.json());
    } catch {
      error("Failed to load design previews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCreate = async () => {
    if (!form.title.trim()) {
      error("Please enter a title");
      return;
    }
    if (!form.image) {
      error("Please upload a preview image");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/admin/design-previews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          clientName: form.clientName,
          siteUrl: form.siteUrl,
          showBrowserChrome: form.showBrowserChrome,
          image: form.image,
          status: "draft",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create");
      success("Design preview created");
      setDialogOpen(false);
      window.location.href = `/admin/cms/design-previews/${data.preview.id}`;
    } catch (err) {
      error(err instanceof Error ? err.message : "Failed to create preview");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this design preview?")) return;
    try {
      const res = await fetch(`/api/admin/design-previews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      success("Design preview deleted");
      fetchItems();
    } catch {
      error("Failed to delete preview");
    }
  };

  const handleToggleLive = async (item: DesignPreview) => {
    try {
      const next = item.status === "live" ? "draft" : "live";
      const res = await fetch(`/api/admin/design-previews/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error("Failed");
      success(next === "live" ? "Share link is live" : "Moved to draft");
      fetchItems();
    } catch {
      error("Failed to update status");
    }
  };

  return (
    <div className="cms-studio lp-studio">
      <div className="lp-studio-header">
        <div>
          <div className="lp-studio-title">Design Previews</div>
          <div className="lp-studio-sub">
            Upload page mockups and share a client review link at /p/…
          </div>
        </div>
        <div className="cms-studio-actions">
          <button
            type="button"
            className="lp-btn lp-btn-save"
            onClick={() => {
              setForm({
                title: "",
                clientName: "",
                siteUrl: "",
                image: "",
                showBrowserChrome: true,
              });
              setDialogOpen(true);
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            Add preview
          </button>
        </div>
      </div>

      <div className="cms-studio-body">
        <div className="lp-panel">
          <div className="lp-panel-body">
            {loading ? (
              <div className="lp-hint py-8 text-center">Loading…</div>
            ) : items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-teal-200 bg-teal-50/40 px-4 py-10 text-center">
                <MonitorSmartphone className="mx-auto mb-2 h-6 w-6 text-teal-600" />
                <p className="text-sm font-semibold text-slate-800">No design previews yet</p>
                <p className="lp-hint mt-1">
                  Upload a full-page UI image to share a website-style preview.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {items.map((item) => {
                  const cover = item.pages.find((page) => page.image)?.image;
                  const isLive = item.status === "live";
                  return (
                    <div key={item.id} className="lp-list-card">
                      {cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cover}
                          alt=""
                          className="h-16 w-24 rounded-lg object-cover object-top shadow-sm"
                        />
                      ) : (
                        <div className="h-16 w-24 rounded-lg bg-slate-100" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="truncate text-sm font-bold text-slate-900">
                            {item.title}
                          </div>
                          <span className={`lp-badge ${isLive ? "lp-badge-live" : "lp-badge-draft"}`}>
                            {isLive ? "Live" : "Draft"}
                          </span>
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-500">
                          {item.clientName ? `${item.clientName} · ` : ""}
                          {item.pages.length} page{item.pages.length === 1 ? "" : "s"}
                          {item.siteUrl ? ` · ${item.siteUrl}` : ""}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          className={`lp-btn ${isLive ? "lp-btn-unpublish" : "lp-btn-publish"}`}
                          onClick={() => handleToggleLive(item)}
                        >
                          {isLive ? "Unpublish" : "Go live"}
                        </button>
                        <a
                          href={`/p/${item.shareToken}`}
                          target="_blank"
                          rel="noreferrer"
                          className="lp-btn lp-btn-ghost !bg-slate-900 !text-white"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          View
                        </a>
                        <Link
                          href={`/admin/cms/design-previews/${item.id}`}
                          className="lp-btn lp-btn-accent"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="lp-btn lp-btn-danger"
                          onClick={() => handleDelete(item.id)}
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
              <DialogTitle className="text-white">Add design preview</DialogTitle>
              <DialogDescription className="text-teal-100">
                Upload a full-page mock. You can add more pages after creating.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="space-y-3 px-5 py-4">
            <div className="lp-field">
              <label>Title</label>
              <input
                value={form.title}
                placeholder="KEIL website preview"
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="lp-field">
              <label>Client name (optional)</label>
              <input
                value={form.clientName}
                placeholder="Client or project name"
                onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
              />
            </div>
            <div className="lp-field">
              <label>Address bar URL (optional)</label>
              <input
                value={form.siteUrl}
                placeholder="www.keil.co.in"
                onChange={(e) => setForm((f) => ({ ...f, siteUrl: e.target.value }))}
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-700">
              <input
                type="checkbox"
                checked={form.showBrowserChrome}
                onChange={(e) =>
                  setForm((f) => ({ ...f, showBrowserChrome: e.target.checked }))
                }
              />
              Show browser chrome on the public preview
            </label>
            <div className="lp-field">
              <label>First page image</label>
              <MediaUpload
                value={form.image}
                onChange={(url) => setForm((f) => ({ ...f, image: url }))}
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
              {creating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {creating ? "Creating…" : "Create preview"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
