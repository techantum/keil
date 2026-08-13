import { NextResponse } from "next/server";
import {
  getAnalyticsSettings,
  updateAnalyticsSettings,
} from "@/lib/db/settings-service";

export async function GET() {
  try {
    const analytics = await getAnalyticsSettings();
    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Failed to fetch analytics settings:", error);
    return NextResponse.json(
      { googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || "", enabled: false },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await updateAnalyticsSettings({
      googleAnalyticsId: body.googleAnalyticsId || "",
      enabled: Boolean(body.enabled),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update analytics:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
