import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { sendConsultationNotification } from "@/lib/services/email-service";
import { getRepository } from "@/lib/repo";

export const runtime = "nodejs";

const MAX_SOIL_BYTES = 8 * 1024 * 1024;

function requiredString(form: FormData, key: string) {
  const value = String(form.get(key) || "").trim();
  return value;
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();

    const name = requiredString(form, "name");
    const phone = requiredString(form, "phone");
    const shedDimension = requiredString(form, "shedDimension");
    const shedUnit = requiredString(form, "shedUnit") || "Feet";
    const kindOfShed = requiredString(form, "kindOfShed");
    const roofPuff = requiredString(form, "roofPuff");
    const wallPuff = requiredString(form, "wallPuff");
    const civilRequired = requiredString(form, "civilRequired");
    const designRequired = requiredString(form, "designRequired");
    const subsidy = requiredString(form, "subsidy");
    const soil = form.get("soilReport");

    const missing: string[] = [];
    if (!name) missing.push("name");
    if (!phone) missing.push("phone");
    if (!shedDimension) missing.push("shedDimension");
    if (!kindOfShed) missing.push("kindOfShed");
    if (!roofPuff) missing.push("roofPuff");
    if (!civilRequired) missing.push("civilRequired");
    if (!designRequired) missing.push("designRequired");

    if (missing.length) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 },
      );
    }

    let soilReportUrl = "";
    let soilReportName = "";

    if (soil && soil instanceof File && soil.size > 0) {
      if (soil.size > MAX_SOIL_BYTES) {
        return NextResponse.json(
          { error: "Soil report must be under 8MB" },
          { status: 400 },
        );
      }

      const allowed =
        soil.type === "application/pdf" ||
        soil.type.startsWith("image/") ||
        /\.(pdf|png|jpe?g|webp)$/i.test(soil.name);

      if (!allowed) {
        return NextResponse.json(
          { error: "Soil report must be a PDF or image" },
          { status: 400 },
        );
      }

      const uploadDir = join(process.cwd(), "public", "uploads", "consultation");
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const safeName = soil.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filename = `${Date.now()}_${safeName}`;
      const buffer = Buffer.from(await soil.arrayBuffer());
      await writeFile(join(uploadDir, filename), buffer);
      soilReportUrl = `/uploads/consultation/${filename}`;
      soilReportName = soil.name;
    }

    const payload = {
      name,
      phone,
      shedDimension,
      shedUnit,
      kindOfShed,
      roofPuff,
      wallPuff: wallPuff || "Not specified",
      civilRequired,
      designRequired,
      subsidy: subsidy || "Not specified",
      soilReportUrl,
      soilReportName,
    };

    // Persist as enquiry (phone-led; email optional placeholder for schema)
    try {
      const repo = getRepository();
      await repo.createEnquiry({
        type: "general",
        name,
        email: `consultation+${phone.replace(/\D/g, "")}@keil.local`,
        phone,
        company: kindOfShed,
        status: "pending",
        source: "landing-consultation",
        message: [
          `Shed Dimension (L × W × H): ${shedDimension} ${shedUnit}`,
          `Kind of Shed: ${kindOfShed}`,
          `Roof PUF: ${roofPuff}`,
          `Wall PUF: ${payload.wallPuff}`,
          `Civil Required: ${civilRequired}`,
          `Design Required: ${designRequired}`,
          `Subsidy: ${payload.subsidy}`,
          soilReportUrl ? `Soil Report: ${soilReportUrl}` : "Soil Report: —",
        ].join("\n"),
      });
    } catch (err) {
      console.error("Failed to store consultation enquiry:", err);
    }

    const emailResult = await sendConsultationNotification(payload);
    if (!emailResult.success) {
      console.warn("Consultation email not sent:", emailResult);
    }

    return NextResponse.json({
      ok: true,
      emailed: Boolean(emailResult.success),
    });
  } catch (error) {
    console.error("Consultation submit failed:", error);
    return NextResponse.json(
      { error: "Failed to submit consultation" },
      { status: 500 },
    );
  }
}
