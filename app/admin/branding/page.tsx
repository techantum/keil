"use client";

import { AdminShell, AdminCard } from "@/components/admin/admin-shell";
import { AdminField, AdminFormGrid, AdminSaveButton } from "@/components/admin/admin-form";
import { useAdminSettings } from "@/hooks/use-admin-settings";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MediaUpload } from "@/components/admin/media-upload";
import { IMAGE_PRESETS } from "@/lib/cms/image-presets";
import { Loader2 } from "lucide-react";

const FONT_WEIGHTS = ["300", "400", "500", "600", "700", "800"];

export default function BrandingPage() {
  const { settings, setSettings, loading, saving, save } = useAdminSettings();
  const branding = (settings?.branding as Record<string, unknown>) || {};
  const fonts = (branding.fonts as Record<string, unknown>) || {};
  const sizes = (fonts.sizes as Record<string, string>) || {};
  const weights = (fonts.weights as Record<string, string>) || {};
  const colors = (branding.colors as Record<string, string>) || {};

  if (loading) {
    return (
      <AdminShell title="Branding">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading...
        </div>
      </AdminShell>
    );
  }

  const updateBranding = (key: string, value: unknown) => {
    setSettings((prev) => ({
      ...prev,
      branding: { ...(prev?.branding as object), [key]: value },
    }));
  };

  const updateFonts = (key: string, value: unknown) => {
    updateBranding("fonts", { ...fonts, [key]: value });
  };

  return (
    <AdminShell
      title="Branding"
      description="Logos, colors and typography for the public site"
      actions={
        <AdminSaveButton saving={saving} onClick={() => save({ branding })} label="Save" />
      }
    >
      <div className="space-y-3">
        <AdminCard title="Logos & favicons">
          <AdminFormGrid>
            {(["websiteLogo", "websiteFavicon", "dashboardLogo", "dashboardFavicon"] as const).map(
              (field) => (
                <AdminField
                  key={field}
                  label={field.replace(/([A-Z])/g, " $1")}
                  wide={field.includes("Logo")}
                >
                  <MediaUpload
                    value={(branding[field] as string) || ""}
                    onChange={(url) => updateBranding(field, url)}
                    accept="image"
                    uploadType={field.toLowerCase().includes("favicon") ? "icon" : "image"}
                    {...(field.toLowerCase().includes("favicon")
                      ? IMAGE_PRESETS.favicon
                      : IMAGE_PRESETS.logo)}
                  />
                </AdminField>
              ),
            )}
          </AdminFormGrid>
        </AdminCard>

        <AdminCard title="Navbar">
          <AdminFormGrid>
            <AdminField label="Phone number" wide>
              <Input
                className="h-8 text-sm"
                value={(branding.navbarPhone as string) || ""}
                onChange={(e) => updateBranding("navbarPhone", e.target.value)}
                placeholder="90505 40505"
              />
              <p className="mt-1 text-[10px] text-slate-500">
                Shown as the call button in the website header. Leave blank to use Company phone.
              </p>
            </AdminField>
          </AdminFormGrid>
        </AdminCard>

        <AdminCard title="Colors">
          <AdminFormGrid>
            {Object.entries(colors).map(([key, value]) => (
              <AdminField key={key} label={key}>
                <div className="flex gap-1.5">
                  <Input
                    type="color"
                    className="h-7 w-10 p-0.5"
                    value={value}
                    onChange={(e) =>
                      updateBranding("colors", { ...colors, [key]: e.target.value })
                    }
                  />
                  <Input
                    className="h-7"
                    value={value}
                    onChange={(e) =>
                      updateBranding("colors", { ...colors, [key]: e.target.value })
                    }
                  />
                </div>
              </AdminField>
            ))}
          </AdminFormGrid>
        </AdminCard>

        <AdminCard title="Typography">
          <AdminFormGrid>
            <AdminField label="Primary Font (headings)">
              <Input
                value={(fonts.primaryFont as string) || "Oswald"}
                onChange={(e) => updateFonts("primaryFont", e.target.value)}
                placeholder="Oswald"
              />
            </AdminField>
            <AdminField label="Secondary Font">
              <Input
                value={(fonts.secondaryFont as string) || "Oswald"}
                onChange={(e) => updateFonts("secondaryFont", e.target.value)}
                placeholder="Oswald"
              />
            </AdminField>
            <AdminField label="Paragraph Font (body)">
              <Input
                value={(fonts.paragraphFont as string) || "Inter"}
                onChange={(e) => updateFonts("paragraphFont", e.target.value)}
                placeholder="Inter"
              />
            </AdminField>
          </AdminFormGrid>

          <div className="mt-3 space-y-2">
            <Label className="text-[10px] uppercase tracking-wide text-slate-500">Sizes & Weights</Label>
            {(["h1", "h2", "h3", "h4", "h5", "h6", "paragraph"] as const).map((tag) => (
              <div key={tag} className="flex flex-wrap items-center gap-2">
                <span className="w-16 text-[10px] font-medium uppercase text-slate-500">{tag}</span>
                <Input
                  className="h-7 w-24"
                  value={sizes[tag] || ""}
                  placeholder="1rem"
                  onChange={(e) =>
                    updateFonts("sizes", { ...sizes, [tag]: e.target.value })
                  }
                />
                <select
                  className="h-7 rounded border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                  value={weights[tag] || "400"}
                  onChange={(e) =>
                    updateFonts("weights", { ...weights, [tag]: e.target.value })
                  }
                >
                  {FONT_WEIGHTS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
