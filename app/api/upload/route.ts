import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // Check authentication
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = (formData.get("type") as string) || "image"; // Default to "image"
    const category = (formData.get("category") as string) || "general"; // products, services, gallery, etc.

    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }

    // Validate file type (allow .ico for favicons when type is "icon")
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      ...(type === "icon"
        ? ["image/x-icon", "image/vnd.microsoft.icon", "application/octet-stream"]
        : []),
    ];
    const isIcoByExtension = type === "icon" && /\.ico$/i.test(file.name);
    const typeOk = allowedTypes.includes(file.type) || isIcoByExtension;
    if (!typeOk) {
      return NextResponse.json(
        {
          error:
            type === "icon"
              ? "Invalid file type. Use PNG, ICO, or other image format for favicon."
              : "Invalid file type. Only images are allowed.",
        },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}_${originalName}`;

    // Determine upload path based on type and category
    let uploadDir: string;
    if (category === "general") {
      uploadDir = type === "icon" ? "icons" : "images";
    } else {
      uploadDir = type === "icon" ? `${category}/icons` : `${category}/images`;
    }
    
    const uploadPath = join(process.cwd(), "public", "uploads", uploadDir);
    
    // Ensure directory exists
    if (!existsSync(uploadPath)) {
      await mkdir(uploadPath, { recursive: true });
    }
    
    const filepath = join(uploadPath, filename);

    // Write file
    await writeFile(filepath, buffer);

    // Return the public URL
    // const publicUrl = `/api/uploads/${uploadDir}/${filename}`
    const publicUrl = `/uploads/${uploadDir}/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
      type: type,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}
