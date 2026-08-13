"use client";

import { AdminShell, AdminCard } from "@/components/admin/admin-shell";
import { AdminSaveButton } from "@/components/admin/admin-form";
import { useAdminSettings } from "@/hooks/use-admin-settings";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function CompanyPage() {
  const { settings, setSettings, loading, saving, save } = useAdminSettings();
  const company = (settings?.company as Record<string, unknown>) || {};
  const address = (company.address as Record<string, string>) || {};
  const social = (company.socialMedia as Record<string, string>) || {};

  if (loading) {
    return (
      <AdminShell title="Company">
        <Loader2 className="h-4 w-4 animate-spin" />
      </AdminShell>
    );
  }

  const setCompany = (patch: Record<string, unknown>) => {
    setSettings((prev) => ({ ...prev, company: { ...company, ...patch } }));
  };

  return (
    <AdminShell
      title="Company"
      description="Contact details shown on the public site and in emails."
      actions={
        <AdminSaveButton saving={saving} onClick={() => save({ company })} label="Save" />
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <AdminCard title="General">
          <div className="space-y-2">
            <div className="space-y-1">
              <Label className="text-xs">Company name</Label>
              <Input className="h-8 text-sm" value={(company.name as string) || ""} onChange={(e) => setCompany({ name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Email</Label>
              <Input className="h-8 text-sm" value={(company.email as string) || ""} onChange={(e) => setCompany({ email: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Phone</Label>
              <Input className="h-8 text-sm" value={(company.phone as string) || ""} onChange={(e) => setCompany({ phone: e.target.value })} />
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Address">
          <div className="grid grid-cols-2 gap-2">
            {(["street", "city", "state", "zipCode", "country"] as const).map((field) => (
              <div key={field} className="space-y-1">
                <Label className="text-xs capitalize">{field}</Label>
                <Input
                  className="h-8 text-sm"
                  value={address[field] || ""}
                  onChange={(e) =>
                    setCompany({ address: { ...address, [field]: e.target.value } })
                  }
                />
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Social links" className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {(["facebook", "twitter", "linkedin", "youtube", "instagram", "whatsapp"] as const).map((field) => (
              <div key={field} className="space-y-1">
                <Label className="text-xs capitalize">{field}</Label>
                <Input
                  className="h-8 text-sm"
                  value={social[field] || ""}
                  onChange={(e) =>
                    setCompany({ socialMedia: { ...social, [field]: e.target.value } })
                  }
                />
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
