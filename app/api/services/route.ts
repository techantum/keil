import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repo";
import { isDbConnectionError } from "@/lib/db/db-error";

export async function GET() {
  try {
    const repository = getRepository();
    const services = await repository.getAllServices();
    return NextResponse.json(services);
  } catch (error) {
    console.error("Failed to fetch services:", error);
    if (isDbConnectionError(error)) {
      return NextResponse.json([]);
    }
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}
