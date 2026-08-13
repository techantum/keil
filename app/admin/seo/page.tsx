"use client";

import { AdminShell, AdminCard } from "@/components/admin/admin-shell";
import { AdminSaveButton } from "@/components/admin/admin-form";
import { useAdminSettings } from "@/hooks/use-admin-settings";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { MediaUpload } from "@/components/admin/media-upload";

const PAGE_KEYS = ["home", "about", "products", "services", "gallery", "clients", "testimonials", "contact"] as const;

export default function SeoPage() {
  const { settings, setSettings, loading, saving, save } = useAdminSettings();
  const seo = (settings?.seo as Record<string, unknown>) || {};
  const pages = (seo.pages as Record<string, { title: string; description: string; keywords: string[] }>) || {};

  if (loading) {
    return (
      <AdminShell title="SEO">
        <Loader2 className="h-4 w-4 animate-spin" />
      </AdminShell>
    );
  }

  const setSeo = (patch: Record<string, unknown>) => {
    setSettings((prev) => ({ ...prev, seo: { ...seo, ...patch } }));
  };

  return (
    <AdminShell
      title="SEO"
      description="Global SEO defaults and per-page metadata."
      actions={
        <AdminSaveButton saving={saving} onClick={() => save({ seo })} label="Save SEO" />
      }
    >
      <AdminCard title="Global SEO" className="mb-4">
        <div className="grid gap-2 md:grid-cols-2">
          <div className="space-y-1">
            <Label className="text-xs">Site name</Label>
            <Input className="h-8 text-sm" value={(seo.siteName as string) || ""} onChange={(e) => setSeo({ siteName: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Site URL</Label>
            <Input className="h-8 text-sm" value={(seo.siteUrl as string) || ""} onChange={(e) => setSeo({ siteUrl: e.target.value })} />
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label className="text-xs">Default description</Label>
            <Textarea className="min-h-[60px] text-sm" value={(seo.siteDescription as string) || ""} onChange={(e) => setSeo({ siteDescription: e.target.value })} />
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label className="text-xs">OG image</Label>
            <MediaUpload
              value={(seo.ogImage as string) || ""}
              onChange={(url) => setSeo({ ogImage: url })}
              accept="image"
              maxWidth={1200}
              maxHeight={630}
              maxSizeMB={5}
              aspectRatio="16:9"
              placeholder="Upload Open Graph image"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Twitter handle</Label>
            <Input className="h-8 text-sm" value={(seo.twitterHandle as string) || ""} onChange={(e) => setSeo({ twitterHandle: e.target.value })} />
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Page SEO">
        <div className="space-y-3">
          {PAGE_KEYS.map((key) => {
            const page = pages[key] || { title: "", description: "", keywords: [] };
            return (
              <div key={key} className="rounded border border-slate-100 p-3 dark:border-slate-800">
                <p className="mb-2 text-xs font-medium capitalize">{key}</p>
                <div className="grid gap-2 md:grid-cols-2">
                  <Input
                    className="h-8 text-sm"
                    placeholder="Title"
                    value={page.title}
                    onChange={(e) =>
                      setSeo({
                        pages: {
                          ...pages,
                          [key]: { ...page, title: e.target.value },
                        },
                      })
                    }
                  />
                  <Input
                    className="h-8 text-sm"
                    placeholder="Keywords (comma-separated)"
                    value={page.keywords?.join(", ") || ""}
                    onChange={(e) =>
                      setSeo({
                        pages: {
                          ...pages,
                          [key]: {
                            ...page,
                            keywords: e.target.value.split(",").map((k) => k.trim()).filter(Boolean),
                          },
                        },
                      })
                    }
                  />
                  <Textarea
                    className="min-h-[50px] text-sm md:col-span-2"
                    placeholder="Description"
                    value={page.description}
                    onChange={(e) =>
                      setSeo({
                        pages: {
                          ...pages,
                          [key]: { ...page, description: e.target.value },
                        },
                      })
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      </AdminCard>
    </AdminShell>
  );
}
