"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Globe,
  Loader2,
  Rocket,
  Save,
  Sparkles,
  Trash2,
  Plus,
} from "lucide-react";
import { MediaUpload } from "@/components/admin/media-upload";
import { IMAGE_PRESETS } from "@/lib/cms/image-presets";
import { Switch } from "@/components/ui/switch";
import { useToastContext } from "@/components/providers/toast-provider";
import { LandingFooterEditor } from "@/components/admin/cms/landing-footer-editor";
import type { LandingPage, LandingSection, LandingSectionType, LandingCtaAction } from "@/types/landing-page";
import {
  DEFAULT_LANDING_BRANDING,
  DEFAULT_LANDING_REDIRECT,
  LANDING_CTA_ACTIONS,
} from "@/types/landing-page";

const SECTION_TYPES: LandingSectionType[] = [
  "hero",
  "about",
  "team",
  "features",
  "leaders",
  "solutions",
  "benefits",
  "applications",
  "process",
  "gallery",
  "cta",
  "text",
  "cards",
  "custom",
];

function newSection(type: LandingSectionType = "custom"): LandingSection {
  return {
    id: crypto.randomUUID(),
    type,
    enabled: true,
    label: type,
    title: "",
    subtitle: "",
    description: "",
    image: "",
    items: [],
  };
}

export default function EditLandingPageAdmin() {
  const params = useParams();
  const id = String(params.id || "");
  const { success, error } = useToastContext();
  const [page, setPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/landing-pages/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.error) throw new Error(data.error);
        setPage({
          ...data,
          redirect: data.redirect || DEFAULT_LANDING_REDIRECT,
          branding: { ...DEFAULT_LANDING_BRANDING, ...(data.branding || {}) },
        });
        const first = data.sections?.[0]?.id;
        if (first) setOpenSections({ [first]: true });
      })
      .catch(() => error("Failed to load landing page"))
      .finally(() => setLoading(false));
  }, [id]);

  const patch = (partial: Partial<LandingPage>) => {
    if (!page) return;
    setPage({ ...page, ...partial });
  };

  const updateSection = (index: number, partial: Partial<LandingSection>) => {
    if (!page) return;
    const sections = [...page.sections];
    sections[index] = { ...sections[index], ...partial };
    patch({ sections });
  };

  const persist = async (next?: LandingPage, toastMsg?: string) => {
    const payload = next || page;
    if (!payload) return null;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/landing-pages/${payload.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: payload.title,
          slug: payload.slug,
          designImage: payload.designImage,
          sections: payload.sections,
          seo: payload.seo,
          branding: payload.branding || DEFAULT_LANDING_BRANDING,
          status: payload.status,
          redirect: payload.redirect || DEFAULT_LANDING_REDIRECT,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setPage(data);
      success(toastMsg || "Landing page saved");
      return data as LandingPage;
    } catch (err) {
      error(err instanceof Error ? err.message : "Failed to save");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handlePublishToggle = async () => {
    if (!page) return;
    const nextStatus = page.status === "published" ? "draft" : "published";
    const next = { ...page, status: nextStatus as LandingPage["status"] };
    setPage(next);
    await persist(
      next,
      nextStatus === "published"
        ? `Published! Live at /lp/${page.slug}`
        : "Moved back to draft",
    );
  };

  const handleReanalyze = async () => {
    if (!page?.designImage) {
      error("Upload a design image first");
      return;
    }
    if (!confirm("Re-analyze the design image? This will replace current sections.")) return;

    setReanalyzing(true);
    try {
      const res = await fetch("/api/admin/landing-pages/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ designImage: page.designImage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analyze failed");
      patch({ sections: data.sections });
      success(data.message || "Sections updated from design");
    } catch (err) {
      error(err instanceof Error ? err.message : "Failed to analyze");
    } finally {
      setReanalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="cms-studio lp-studio">
        <div className="lp-panel">
          <div className="lp-panel-body lp-hint">Loading landing page…</div>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="cms-studio lp-studio">
        <div className="lp-panel">
          <div className="lp-panel-body">
            <p>Landing page not found.</p>
            <Link href="/admin/cms/landing-pages" className="lp-btn lp-btn-accent mt-3">
              Back to list
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isLive = page.status === "published";

  return (
    <div className="cms-studio lp-studio">
      <div className="lp-studio-header">
        <div>
          <div className="lp-studio-title">Landing Page Studio</div>
          <div className="lp-studio-sub">
            {page.title} · /lp/{page.slug}
          </div>
        </div>
        <div className="cms-studio-actions">
          <span className={`lp-badge ${isLive ? "lp-badge-live" : "lp-badge-draft"}`}>
            <Globe className="h-3 w-3" />
            {isLive ? "Published" : "Draft"}
          </span>
          <Link href="/admin/cms/landing-pages" className="lp-btn lp-btn-ghost">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
          {isLive && (
            <a href={`/lp/${page.slug}`} target="_blank" rel="noreferrer" className="lp-btn lp-btn-ghost">
              <ExternalLink className="h-3.5 w-3.5" />
              View live
            </a>
          )}
          <button
            type="button"
            className={`lp-btn ${isLive ? "lp-btn-unpublish" : "lp-btn-publish"}`}
            onClick={handlePublishToggle}
            disabled={saving}
          >
            <Rocket className="h-3.5 w-3.5" />
            {isLive ? "Unpublish" : "Publish now"}
          </button>
          <button
            type="button"
            className="lp-btn lp-btn-save"
            onClick={() => persist()}
            disabled={saving}
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save
          </button>
        </div>
      </div>

      <div className="cms-studio-body">

      {!isLive && (
        <div className="lp-panel mb-3 border-l-4 border-l-orange-400">
          <div className="lp-panel-body flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">This page is still a draft</div>
              <p className="lp-hint mt-0.5">
                Click <strong>Publish now</strong> to make it live at{" "}
                <code className="rounded bg-orange-50 px-1 py-0.5 text-orange-700">/lp/{page.slug}</code>
              </p>
            </div>
            <button
              type="button"
              className="lp-btn lp-btn-publish"
              onClick={handlePublishToggle}
              disabled={saving}
            >
              <Rocket className="h-3.5 w-3.5" />
              Publish now
            </button>
          </div>
        </div>
      )}

      <div className="lp-panel mb-3">
        <div className="lp-panel-head">
          <h3>Page redirect</h3>
        </div>
        <div className="lp-panel-body space-y-3">
          <p className="lp-hint">
            Control how site visitors are routed to this landing page. Navbar on the landing page
            always uses section titles (not the main website menu).
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {(
              [
                {
                  mode: "all_pages_active" as const,
                  title: "All pages active",
                  desc: "No redirects. Landing only at /lp/slug. Other site pages stay available.",
                },
                {
                  mode: "any_slug" as const,
                  title: "Any slug → this page",
                  desc: "Redirect every public path to this landing page.",
                },
                {
                  mode: "specific_pages" as const,
                  title: "Specific page redirects",
                  desc: "Only redirect the paths you list below.",
                },
              ] as const
            ).map((opt) => {
              const active =
                (page.redirect?.mode || "all_pages_active") === opt.mode;
              return (
                <button
                  key={opt.mode}
                  type="button"
                  className={`rounded-xl border p-3 text-left transition ${
                    active
                      ? "border-teal-500 bg-teal-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-teal-200"
                  }`}
                  onClick={() =>
                    patch({
                      redirect: {
                        mode: opt.mode,
                        paths: page.redirect?.paths || [],
                      },
                    })
                  }
                >
                  <div className="text-xs font-bold text-slate-900">{opt.title}</div>
                  <p className="mt-1 text-[11px] leading-snug text-slate-500">{opt.desc}</p>
                </button>
              );
            })}
          </div>

          {(page.redirect?.mode || "all_pages_active") === "specific_pages" && (
            <div className="lp-field">
              <label>Redirect paths (one per line)</label>
              <textarea
                rows={4}
                placeholder={"/\n/about\n/home"}
                value={(page.redirect?.paths || []).join("\n")}
                onChange={(e) =>
                  patch({
                    redirect: {
                      mode: "specific_pages",
                      paths: e.target.value
                        .split("\n")
                        .map((p) => p.trim())
                        .filter(Boolean),
                    },
                  })
                }
              />
              <p className="lp-hint">
                Example: <code>/</code> makes the homepage open this landing page.
              </p>
            </div>
          )}

          {(page.redirect?.mode || "all_pages_active") === "any_slug" && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
              Warning: every public URL (except /lp, /admin, /api) will redirect to{" "}
              <strong>/lp/{page.slug}</strong>. Use only when this should be the whole site.
            </div>
          )}
        </div>
      </div>

      <div className="lp-panel mb-3">
        <div className="lp-panel-head">
          <h3>Branding</h3>
        </div>
        <div className="lp-panel-body">
          <p className="lp-hint mb-3">
            Logos, colors and share assets for this landing page only. Leave blank to use
            defaults / site-wide branding.
          </p>
          <div className="lp-grid mb-3">
            <div className="lp-field lp-col-6">
              <label>Primary color</label>
              <p className="lp-hint mb-1">Headings, trust bar icons/text, outline buttons</p>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="h-9 w-12 cursor-pointer rounded border border-slate-200 bg-white p-0.5"
                  value={page.branding?.primaryColor || DEFAULT_LANDING_BRANDING.primaryColor}
                  onChange={(e) =>
                    patch({
                      branding: {
                        ...DEFAULT_LANDING_BRANDING,
                        ...page.branding,
                        primaryColor: e.target.value,
                      },
                    })
                  }
                />
                <input
                  value={page.branding?.primaryColor || DEFAULT_LANDING_BRANDING.primaryColor}
                  onChange={(e) =>
                    patch({
                      branding: {
                        ...DEFAULT_LANDING_BRANDING,
                        ...page.branding,
                        primaryColor: e.target.value,
                      },
                    })
                  }
                  placeholder="#002B5B"
                />
              </div>
            </div>
            <div className="lp-field lp-col-6">
              <label>Secondary color</label>
              <p className="lp-hint mb-1">Primary CTAs, phone button, accents</p>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="h-9 w-12 cursor-pointer rounded border border-slate-200 bg-white p-0.5"
                  value={
                    page.branding?.secondaryColor || DEFAULT_LANDING_BRANDING.secondaryColor
                  }
                  onChange={(e) =>
                    patch({
                      branding: {
                        ...DEFAULT_LANDING_BRANDING,
                        ...page.branding,
                        secondaryColor: e.target.value,
                      },
                    })
                  }
                />
                <input
                  value={
                    page.branding?.secondaryColor || DEFAULT_LANDING_BRANDING.secondaryColor
                  }
                  onChange={(e) =>
                    patch({
                      branding: {
                        ...DEFAULT_LANDING_BRANDING,
                        ...page.branding,
                        secondaryColor: e.target.value,
                      },
                    })
                  }
                  placeholder="#E31C23"
                />
              </div>
            </div>
          </div>
          <div className="lp-field">
            <label>Navbar phone</label>
            <p className="lp-hint mb-1">
              Call button in this landing page header. Leave blank to use Branding / Company phone.
            </p>
            <input
              value={page.branding?.navbarPhone || ""}
              onChange={(e) =>
                patch({
                  branding: {
                    ...DEFAULT_LANDING_BRANDING,
                    ...page.branding,
                    navbarPhone: e.target.value,
                  },
                })
              }
              placeholder="90505 40505"
            />
          </div>
          <div className="lp-grid">
            {(
              [
                {
                  key: "navbarLogo" as const,
                  label: "Navbar logo",
                  preset: IMAGE_PRESETS.logo,
                  uploadType: "image" as const,
                },
                {
                  key: "footerLogo" as const,
                  label: "Footer logo",
                  preset: IMAGE_PRESETS.logo,
                  uploadType: "image" as const,
                },
                {
                  key: "favicon" as const,
                  label: "Favicon",
                  preset: IMAGE_PRESETS.favicon,
                  uploadType: "icon" as const,
                },
                {
                  key: "ogImage" as const,
                  label: "OG image (social share)",
                  preset: IMAGE_PRESETS.hero,
                  uploadType: "image" as const,
                },
              ] as const
            ).map((field) => (
              <div key={field.key} className="lp-field lp-col-6">
                <label>{field.label}</label>
                <MediaUpload
                  value={page.branding?.[field.key] || ""}
                  onChange={(url) =>
                    patch({
                      branding: {
                        ...DEFAULT_LANDING_BRANDING,
                        ...page.branding,
                        [field.key]: url,
                      },
                    })
                  }
                  accept="image"
                  uploadType={field.uploadType}
                  {...field.preset}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <LandingFooterEditor />

      <div className="lp-card-row">
        <div className="lp-panel">
          <div className="lp-panel-head">
            <h3>Page settings</h3>
          </div>
          <div className="lp-panel-body">
            <div className="lp-grid">
              <div className="lp-field lp-col-8">
                <label>Title</label>
                <input value={page.title} onChange={(e) => patch({ title: e.target.value })} />
              </div>
              <div className="lp-field lp-col-4">
                <label>Slug</label>
                <input value={page.slug} onChange={(e) => patch({ slug: e.target.value })} />
              </div>
              <div className="lp-field lp-col-6">
                <label>SEO title</label>
                <input
                  value={page.seo?.title || ""}
                  onChange={(e) => patch({ seo: { ...page.seo, title: e.target.value } })}
                />
              </div>
              <div className="lp-field lp-col-6">
                <label>Status</label>
                <select
                  value={page.status}
                  onChange={(e) =>
                    patch({ status: e.target.value as LandingPage["status"] })
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="lp-field lp-col-12">
                <label>SEO description</label>
                <textarea
                  rows={2}
                  value={page.seo?.description || ""}
                  onChange={(e) =>
                    patch({ seo: { ...page.seo, description: e.target.value } })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lp-panel">
          <div className="lp-panel-head">
            <h3>Design reference</h3>
            <button
              type="button"
              className="lp-btn lp-btn-accent"
              onClick={handleReanalyze}
              disabled={reanalyzing}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {reanalyzing ? "Detecting…" : "Re-detect sections"}
            </button>
          </div>
          <div className="lp-panel-body">
            <p className="lp-hint mb-2">
              Upload the full UI mock. Use re-detect after replacing the image.
            </p>
            <MediaUpload
              value={page.designImage}
              onChange={(url) => patch({ designImage: url })}
              accept="image"
              {...IMAGE_PRESETS.hero}
            />
          </div>
        </div>
      </div>

      <div className="mb-2 mt-4 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Sections</h2>
          <p className="lp-hint">{page.sections.length} blocks · click a row to expand</p>
        </div>
        <button
          type="button"
          className="lp-btn lp-btn-accent"
          onClick={() => {
            const section = newSection("custom");
            patch({ sections: [...page.sections, section] });
            setOpenSections((s) => ({ ...s, [section.id]: true }));
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          Add section
        </button>
      </div>

      {page.sections.map((section, index) => {
        const open = !!openSections[section.id];
        return (
          <div
            key={section.id}
            className="lp-section-card"
            data-accent={String(index % 6)}
          >
            <div className="lp-section-toggle">
              <button
                type="button"
                className="lp-section-toggle-main"
                onClick={() =>
                  setOpenSections((s) => ({ ...s, [section.id]: !s[section.id] }))
                }
              >
                <div className="lp-section-meta">
                  <span className="lp-section-index">{index + 1}</span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">
                      {section.label || section.type}
                    </div>
                    <div className="truncate text-[11px] text-slate-500">
                      {section.type}
                      {section.title ? ` · ${section.title}` : ""}
                    </div>
                  </div>
                </div>
                {open ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                )}
              </button>
              <div className="lp-section-toggle-controls">
                <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                  Nav
                  <Switch
                    checked={section.showInNav !== false}
                    onCheckedChange={(showInNav) => updateSection(index, { showInNav })}
                  />
                </label>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                  {section.enabled ? "On" : "Off"}
                  <Switch
                    checked={section.enabled}
                    onCheckedChange={(enabled) => updateSection(index, { enabled })}
                  />
                </div>
              </div>
            </div>

            {open && (
              <div className="border-t border-slate-100 px-3 py-3">
                <div className="mb-2 flex justify-end">
                  <button
                    type="button"
                    className="lp-btn lp-btn-danger"
                    onClick={() =>
                      patch({
                        sections: page.sections.filter((_, i) => i !== index),
                      })
                    }
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>

                <div className="lp-grid">
                  <div className="lp-field lp-col-3">
                    <label>Type</label>
                    <select
                      value={section.type}
                      onChange={(e) =>
                        updateSection(index, {
                          type: e.target.value as LandingSectionType,
                          label: section.label || e.target.value,
                        })
                      }
                    >
                      {SECTION_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="lp-field lp-col-3">
                    <label>Admin label</label>
                    <input
                      value={section.label || ""}
                      onChange={(e) => updateSection(index, { label: e.target.value })}
                    />
                  </div>
                  <div className="lp-field lp-col-3">
                    <label>Navbar label</label>
                    <input
                      value={section.navLabel || ""}
                      placeholder={section.label || section.title || section.type}
                      onChange={(e) => updateSection(index, { navLabel: e.target.value })}
                    />
                  </div>
                  <div className="lp-field lp-col-6">
                    <label>Title</label>
                    <input
                      value={section.title || ""}
                      onChange={(e) => updateSection(index, { title: e.target.value })}
                    />
                  </div>
                  <div className="lp-field lp-col-6">
                    <label>Subtitle</label>
                    <input
                      value={section.subtitle || ""}
                      onChange={(e) => updateSection(index, { subtitle: e.target.value })}
                    />
                  </div>
                  <div className="lp-field lp-col-6">
                    <label>Badge text</label>
                    <input
                      value={section.badgeText || ""}
                      onChange={(e) => updateSection(index, { badgeText: e.target.value })}
                    />
                  </div>
                  <div className="lp-field lp-col-12">
                    <label>Description</label>
                    <textarea
                      rows={2}
                      value={section.description || ""}
                      onChange={(e) => updateSection(index, { description: e.target.value })}
                    />
                  </div>
                  <div className="lp-field lp-col-12">
                    <label>Description (secondary)</label>
                    <textarea
                      rows={2}
                      value={section.descriptionSecondary || ""}
                      placeholder="Second paragraph for Why KEIL"
                      onChange={(e) =>
                        updateSection(index, { descriptionSecondary: e.target.value })
                      }
                    />
                  </div>
                  <div className="lp-field lp-col-12">
                    <label>Sub heading</label>
                    <input
                      value={section.subHeading || ""}
                      placeholder="e.g. From Concept to Commissioning"
                      onChange={(e) => updateSection(index, { subHeading: e.target.value })}
                    />
                  </div>
                  {section.type === "features" && (
                    <>
                      <div className="lp-field lp-col-6">
                        <label>Promise title</label>
                        <input
                          value={section.promiseTitle || ""}
                          placeholder="Our Promise"
                          onChange={(e) =>
                            updateSection(index, { promiseTitle: e.target.value })
                          }
                        />
                      </div>
                      <div className="lp-field lp-col-6">
                        <label>Promise image (optional)</label>
                        <MediaUpload
                          value={section.promiseImage || ""}
                          onChange={(url) => updateSection(index, { promiseImage: url })}
                          accept="image"
                          {...IMAGE_PRESETS.section}
                        />
                      </div>
                      <div className="lp-field lp-col-12">
                        <label>Promise items (one per line)</label>
                        <textarea
                          rows={3}
                          value={(section.promiseItems || []).join("\n")}
                          placeholder={"Better Control.\nBetter Performance.\nBetter Farm Efficiency."}
                          onChange={(e) =>
                            updateSection(index, {
                              promiseItems: e.target.value
                                .split("\n")
                                .map((line) => line.trim())
                                .filter(Boolean),
                            })
                          }
                        />
                      </div>
                    </>
                  )}
                  <div className="lp-field lp-col-3">
                    <label>Primary button</label>
                    <input
                      value={section.buttonText || ""}
                      placeholder="Get a Project Consultation"
                      onChange={(e) => updateSection(index, { buttonText: e.target.value })}
                    />
                  </div>
                  <div className="lp-field lp-col-3">
                    <label>Primary action</label>
                    <select
                      value={section.buttonAction || "modal"}
                      onChange={(e) =>
                        updateSection(index, {
                          buttonAction: e.target.value as LandingCtaAction,
                        })
                      }
                    >
                      {LANDING_CTA_ACTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="lp-field lp-col-6">
                    <label>
                      Primary link
                      {(section.buttonAction || "modal") === "modal"
                        ? " (unused for modal)"
                        : section.buttonAction === "section"
                          ? " (#section-id)"
                          : section.buttonAction === "external"
                            ? " (https://…)"
                            : " (/path)"}
                    </label>
                    <input
                      value={section.buttonLink || ""}
                      placeholder={
                        (section.buttonAction || "modal") === "section"
                          ? "#solutions-3"
                          : section.buttonAction === "external"
                            ? "https://example.com"
                            : "/contact"
                      }
                      disabled={(section.buttonAction || "modal") === "modal"}
                      onChange={(e) => updateSection(index, { buttonLink: e.target.value })}
                    />
                  </div>
                  <div className="lp-field lp-col-3">
                    <label>Secondary button</label>
                    <input
                      value={section.secondaryButtonText || ""}
                      onChange={(e) =>
                        updateSection(index, { secondaryButtonText: e.target.value })
                      }
                    />
                  </div>
                  <div className="lp-field lp-col-3">
                    <label>Secondary action</label>
                    <select
                      value={section.secondaryButtonAction || "section"}
                      onChange={(e) =>
                        updateSection(index, {
                          secondaryButtonAction: e.target.value as LandingCtaAction,
                        })
                      }
                    >
                      {LANDING_CTA_ACTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="lp-field lp-col-6">
                    <label>Secondary link</label>
                    <input
                      value={section.secondaryButtonLink || ""}
                      placeholder="#solutions or https://…"
                      disabled={section.secondaryButtonAction === "modal"}
                      onChange={(e) =>
                        updateSection(index, { secondaryButtonLink: e.target.value })
                      }
                    />
                  </div>
                  <div className="lp-field lp-col-12">
                    <label>Section image</label>
                    <MediaUpload
                      value={section.image || ""}
                      onChange={(url) => updateSection(index, { image: url })}
                      accept="image"
                      {...IMAGE_PRESETS.section}
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Items / cards ({section.items?.length || 0})
                  </div>
                  <button
                    type="button"
                    className="lp-btn lp-btn-accent"
                    onClick={() =>
                      updateSection(index, {
                        items: [
                          ...(section.items || []),
                          { title: "", description: "", image: "", icon: "" },
                        ],
                      })
                    }
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add item
                  </button>
                </div>

                {(section.items || []).map((item, itemIndex) => (
                  <div key={itemIndex} className="lp-item-card">
                    <div className="mb-2 flex justify-end">
                      <button
                        type="button"
                        className="lp-btn lp-btn-danger"
                        onClick={() =>
                          updateSection(index, {
                            items: (section.items || []).filter((_, i) => i !== itemIndex),
                          })
                        }
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="lp-grid">
                      <div className="lp-field lp-col-4">
                        <label>Title</label>
                        <input
                          value={item.title}
                          onChange={(e) => {
                            const items = [...(section.items || [])];
                            items[itemIndex] = { ...items[itemIndex], title: e.target.value };
                            updateSection(index, { items });
                          }}
                        />
                      </div>
                      <div className="lp-field lp-col-4">
                        <label>Role</label>
                        <input
                          value={item.role || ""}
                          onChange={(e) => {
                            const items = [...(section.items || [])];
                            items[itemIndex] = { ...items[itemIndex], role: e.target.value };
                            updateSection(index, { items });
                          }}
                        />
                      </div>
                      <div className="lp-field lp-col-4">
                        <label>Icon</label>
                        <input
                          value={item.icon || ""}
                          placeholder="settings"
                          onChange={(e) => {
                            const items = [...(section.items || [])];
                            items[itemIndex] = { ...items[itemIndex], icon: e.target.value };
                            updateSection(index, { items });
                          }}
                        />
                      </div>
                      <div className="lp-field lp-col-12">
                        <label>Description</label>
                        <textarea
                          rows={2}
                          value={item.description || ""}
                          onChange={(e) => {
                            const items = [...(section.items || [])];
                            items[itemIndex] = {
                              ...items[itemIndex],
                              description: e.target.value,
                            };
                            updateSection(index, { items });
                          }}
                        />
                      </div>
                      <div className="lp-field lp-col-12">
                        <label>Image</label>
                        <MediaUpload
                          value={item.image || ""}
                          onChange={(url) => {
                            const items = [...(section.items || [])];
                            items[itemIndex] = { ...items[itemIndex], image: url };
                            updateSection(index, { items });
                          }}
                          accept="image"
                          {...IMAGE_PRESETS.square}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      </div>

      <div className="cms-studio-footer">
        <button
          type="button"
          className={`lp-btn ${isLive ? "lp-btn-unpublish" : "lp-btn-publish"}`}
          onClick={handlePublishToggle}
          disabled={saving}
        >
          <Rocket className="h-3.5 w-3.5" />
          {isLive ? "Unpublish" : "Publish now"}
        </button>
        <button
          type="button"
          className="lp-btn lp-btn-save"
          onClick={() => persist()}
          disabled={saving}
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Save changes
        </button>
      </div>
    </div>
  );
}
