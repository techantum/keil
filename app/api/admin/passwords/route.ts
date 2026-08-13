import { NextResponse } from "next/server";
import { requireSuperAdminApi } from "@/lib/auth";
import {
  getEnvCredentials,
  passwordMatches,
  setPassword,
  type PasswordTarget,
} from "@/lib/auth-credentials";

export async function GET() {
  const auth = await requireSuperAdminApi();
  if (auth instanceof NextResponse) return auth;

  const { adminUsername, superAdminUsername } = getEnvCredentials();
  return NextResponse.json({ adminUsername, superAdminUsername });
}

export async function PUT(request: Request) {
  const auth = await requireSuperAdminApi();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const target = body.target as PasswordTarget;
    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");
    const confirmPassword = String(body.confirmPassword || "");

    if (target !== "admin" && target !== "super_admin") {
      return NextResponse.json({ error: "Invalid account target" }, { status: 400 });
    }
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Current password, new password, and confirmation are required" },
        { status: 400 },
      );
    }
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 },
      );
    }
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "New password and confirmation do not match" },
        { status: 400 },
      );
    }

    const currentOk = await passwordMatches("super_admin", currentPassword);
    if (!currentOk) {
      return NextResponse.json(
        { error: "Current super admin password is incorrect" },
        { status: 401 },
      );
    }

    if (target === "super_admin" && newPassword === currentPassword) {
      return NextResponse.json(
        { error: "New password must be different from the current password" },
        { status: 400 },
      );
    }

    await setPassword(target, newPassword);
    return NextResponse.json({
      success: true,
      message:
        target === "super_admin"
          ? "Super admin password updated"
          : "Admin password updated",
    });
  } catch (error) {
    console.error("Failed to update password:", error);
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}
