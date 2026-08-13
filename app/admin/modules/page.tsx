"use client";

import { useEffect, useState } from "react";
import { AdminShell, AdminCard } from "@/components/admin/admin-shell";
import { MODULES, MODULE_KEYS, type ModuleKey } from "@/lib/modules/registry";
import { CMS_MODULE_KEYS } from "@/lib/cms/nav";
import { NAV_REGISTRY, type NavKey } from "@/lib/nav/registry";
import type { SiteNavItem } from "@/lib/nav/default-nav-items";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, Save } from "lucide-react";
import { toast } from "sonner";
import type { AdminRole } from "@/lib/auth";
import { SuperAdminPasswordSettings } from "@/components/admin/password-settings";

export default function ModulesPage() {
  const [modules, setModules] = useState<Record<string, boolean>>({});
  const [navItems, setNavItems] = useState<SiteNavItem[]>([]);
  const [navDraft, setNavDraft] = useState<SiteNavItem[]>([]);
  const [role, setRole] = useState<AdminRole | null>(null);
  const [canManage, setCanManage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [savingNav, setSavingNav] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/admin/modules").then((r) => r.json()),
      fetch("/api/admin/nav").then((r) => r.json()),
    ])
      .then(([modulesData, navData]) => {
        setModules(modulesData.modules || {});
        setRole(modulesData.role || null);
        setCanManage(Boolean(modulesData.canManage));
        const items = navData.items || [];
        setNavItems(items);
        setNavDraft(items);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const toggleModule = async (key: ModuleKey, enabled: boolean) => {
    setSaving(key);
    try {
      const res = await fetch("/api/admin/modules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modules: { [key]: enabled } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setModules(data.modules || {});
      toast.success(`${MODULES[key].label} ${enabled ? "enabled" : "disabled"}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
      load();
    } finally {
      setSaving(null);
    }
  };

  const toggleNavItem = async (key: NavKey, enabled: boolean) => {
    setSaving(`nav-${key}`);
    try {
      const res = await fetch("/api/admin/nav", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ key, enabled }] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setNavItems(data.items || []);
      setNavDraft(data.items || []);
      toast.success(`${NAV_REGISTRY[key].defaultLabel} menu ${enabled ? "enabled" : "disabled"}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
      load();
    } finally {
      setSaving(null);
    }
  };

  const updateNavDraft = (key: NavKey, field: "label" | "slug", value: string) => {
    setNavDraft((prev) =>
      prev.map((item) => (item.key === key ? { ...item, [field]: value } : item)),
    );
  };

  const saveNavChanges = async () => {
    setSavingNav(true);
    try {
      const res = await fetch("/api/admin/nav", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: navDraft.map((item) => ({
            key: item.key,
            label: item.label,
            slug: item.slug,
            enabled: item.enabled,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setNavItems(data.items || []);
      setNavDraft(data.items || []);
      toast.success("Navigation menu updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSavingNav(false);
    }
  };

  const navDirty =
    JSON.stringify(navDraft) !== JSON.stringify(navItems);

  const cmsModuleKeys = MODULE_KEYS.filter((key) => CMS_MODULE_KEYS.has(key));
  const otherModuleKeys = MODULE_KEYS.filter((key) => !CMS_MODULE_KEYS.has(key));

  const renderModuleRow = (key: ModuleKey) => {
    const isEnabled = modules[key] !== false;
    const isSaving = saving === key;

    return (
      <div
        key={key}
        className="flex items-center justify-between rounded border border-slate-100 px-3 py-2 text-sm dark:border-slate-800"
      >
        <div>
          <span className="text-xs font-medium">{MODULES[key].label}</span>
          {!canManage && (
            <p className="text-[10px] text-slate-500">
              {isEnabled ? "Active" : "Disabled"}
            </p>
          )}
        </div>

        {canManage ? (
          <Switch
            checked={isEnabled}
            disabled={isSaving}
            onCheckedChange={(checked) => toggleModule(key, checked)}
          />
        ) : (
          <Badge variant={isEnabled ? "default" : "secondary"} className="text-[10px]">
            {isEnabled ? "Enabled" : "Disabled"}
          </Badge>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <AdminShell title="Modules">
        <Loader2 className="h-4 w-4 animate-spin" />
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Modules & Navigation"
      description={
        canManage
          ? "Enable or disable features and manage the public navigation menu."
          : "View which features and menu items are active on this site."
      }
      actions={
        role === "super_admin" ? (
          <Badge variant="default" className="h-7 gap-1 text-[10px]">
            <Shield className="h-3 w-3" />
            Super Admin
          </Badge>
        ) : undefined
      }
    >
      <div className="space-y-4">
        {canManage ? (
          <AdminCard
            title="Accounts & passwords"
            description="Change the site admin or super admin password. Both require your current super admin password."
          >
            <SuperAdminPasswordSettings />
          </AdminCard>
        ) : null}

        <AdminCard title="Feature modules">
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                CMS
              </p>
              <div className="space-y-2">{cmsModuleKeys.map(renderModuleRow)}</div>
            </div>

            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Other modules
              </p>
              <div className="space-y-2">{otherModuleKeys.map(renderModuleRow)}</div>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            {canManage
              ? "Disabling a module hides its admin pages and can hide linked menu items."
              : "Only a super admin can change module settings."}
          </p>
        </AdminCard>

        <AdminCard title="Navigation menu">
          <div className="space-y-3">
            {navDraft.map((item) => {
              const isSaving = saving === `nav-${item.key}`;
              const moduleLabel = item.moduleKey
                ? MODULES[item.moduleKey]?.label
                : null;

              return (
                <div
                  key={item.key}
                  className="rounded border border-slate-100 p-3 dark:border-slate-800"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium capitalize">{item.key}</p>
                      {moduleLabel && (
                        <p className="text-[10px] text-slate-500">
                          Linked module: {moduleLabel}
                        </p>
                      )}
                    </div>
                    {canManage ? (
                      <Switch
                        checked={item.enabled}
                        disabled={isSaving}
                        onCheckedChange={(checked) => toggleNavItem(item.key, checked)}
                      />
                    ) : (
                      <Badge
                        variant={item.enabled ? "default" : "secondary"}
                        className="text-[10px]"
                      >
                        {item.enabled ? "Visible" : "Hidden"}
                      </Badge>
                    )}
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <Label htmlFor={`nav-label-${item.key}`} className="text-[10px]">
                        Menu label
                      </Label>
                      <Input
                        id={`nav-label-${item.key}`}
                        value={item.label}
                        disabled={!canManage}
                        onChange={(e) => updateNavDraft(item.key, "label", e.target.value)}
                        placeholder="Menu label"
                        className="mt-1 h-8 text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`nav-slug-${item.key}`} className="text-[10px]">
                        URL slug
                      </Label>
                      <Input
                        id={`nav-slug-${item.key}`}
                        value={item.slug}
                        disabled={!canManage || item.key === "home"}
                        onChange={(e) => updateNavDraft(item.key, "slug", e.target.value)}
                        placeholder="/products"
                        className="mt-1 h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {canManage && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="lp-btn lp-btn-save"
                onClick={saveNavChanges}
                disabled={!navDirty || savingNav}
              >
                {savingNav ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                Save menu changes
              </button>
            </div>
          )}

          <p className="mt-3 text-xs text-slate-500">
            {canManage
              ? "Edit menu labels and URL slugs, then save. Custom slugs rewrite to the underlying pages automatically."
              : "Only a super admin can edit navigation menu settings."}
          </p>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
