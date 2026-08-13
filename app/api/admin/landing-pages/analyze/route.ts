import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { analyzeLandingDesign } from "@/lib/landing-pages/analyze";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const designImage = String(body.designImage || "").trim();
    if (!designImage) {
      return NextResponse.json({ error: "designImage is required" }, { status: 400 });
    }

    const result = await analyzeLandingDesign(designImage);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to analyze design" }, { status: 500 });
  }
}
