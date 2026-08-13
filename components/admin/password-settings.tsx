"use client";

import { useEffect, useState } from "react";
import { Loader2, KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Target = "admin" | "super_admin";

function PasswordForm({
  target,
  title,
  username,
  description,
}: {
  target: Target;
  title: string;
  username: string;
  description: string;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/passwords", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target,
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      toast.success(data.message || "Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded border border-slate-100 p-3 dark:border-slate-800">
      <div>
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{title}</p>
        <p className="mt-0.5 text-[10px] text-slate-500">{description}</p>
        {username ? (
          <p className="mt-1 text-[10px] text-slate-500">
            Username: <span className="font-medium text-slate-700 dark:text-slate-300">{username}</span>
          </p>
        ) : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <Label htmlFor={`${target}-current`} className="text-[10px]">
            Current super admin password
          </Label>
          <Input
            id={`${target}-current`}
            type="password"
            autoComplete="current-password"
            className="mt-1 h-8 text-xs"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor={`${target}-new`} className="text-[10px]">
            New password
          </Label>
          <Input
            id={`${target}-new`}
            type="password"
            autoComplete="new-password"
            className="mt-1 h-8 text-xs"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>
        <div>
          <Label htmlFor={`${target}-confirm`} className="text-[10px]">
            Confirm new password
          </Label>
          <Input
            id={`${target}-confirm`}
            type="password"
            autoComplete="new-password"
            className="mt-1 h-8 text-xs"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button type="submit" className="lp-btn lp-btn-save w-full sm:w-auto" disabled={saving}>
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <KeyRound className="h-3.5 w-3.5" />}
          Update password
        </button>
      </div>
    </form>
  );
}

export function SuperAdminPasswordSettings() {
  const [adminUsername, setAdminUsername] = useState("admin");
  const [superAdminUsername, setSuperAdminUsername] = useState("superadmin");

  useEffect(() => {
    fetch("/api/admin/passwords")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        if (data.adminUsername) setAdminUsername(data.adminUsername);
        if (data.superAdminUsername) setSuperAdminUsername(data.superAdminUsername);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-3">
      <PasswordForm
        target="admin"
        title="Site admin password"
        username={adminUsername}
        description="Change the regular admin login. Confirm with your current super admin password."
      />
      <PasswordForm
        target="super_admin"
        title="Super admin password"
        username={superAdminUsername}
        description="Change your own super admin password. Confirm with your current password."
      />
    </div>
  );
}
