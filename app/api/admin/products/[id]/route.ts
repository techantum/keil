import { type NextRequest, NextResponse } from "next/server";
import { getRepository } from "@/lib/repo";
import { getSession } from "@/lib/auth";
import { generateSlug } from "@/lib/validations";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return await updateProduct(request, params);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return await updateProduct(request, params);
}

async function updateProduct(request: NextRequest, params: Promise<{ id: string }>) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await request.json();

    if (!data.name) {
      return NextResponse.json(
        { error: "Missing required field: name" },
        { status: 400 },
      );
    }

    let categoryName = data.category;
    if (data.categoryId) {
      const repo = getRepository();
      const categories = await repo.getAllCategories();
      const category = categories.find((c) => c.id === data.categoryId);
      if (category) {
        categoryName = category.name;
      }
    }

    const slug = generateSlug(data.slug || data.name);

    const updateData = {
      name: data.name,
      description: data.description || "",
      category: categoryName,
      categoryId: data.categoryId || undefined,
      image: data.image || undefined,
      slug,
      detailsSectionTitle: data.detailsSectionTitle || undefined,
      details: Array.isArray(data.details) ? data.details : undefined,
      metaTitle: data.metaTitle || undefined,
      metaDescription: data.metaDescription || undefined,
      metaKeywords: data.metaKeywords || [],
    };

    const repo = getRepository();
    const product = await repo.updateProduct(id, updateData);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update product";
    console.error("Failed to update product:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const repo = getRepository();
    const success = await repo.deleteProduct(id);

    if (!success) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete product";
    console.error("Failed to delete product:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
