"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Search, FolderTree, ImageIcon } from "lucide-react";
import type { Category } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToastContext } from "@/components/providers/toast-provider";
import { AccordionItem } from "@/components/admin/accordion-item";
import { MediaUpload } from "@/components/admin/media-upload";
import { AdminShell, AdminCard } from "@/components/admin/admin-shell";

export default function AdminCategoriesPage() {
  const { success, error } = useToastContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async () => {
    if (!formData.name || !formData.description) {
      error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const method = editingCategory ? "PUT" : "POST";
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save category");

      success(
        editingCategory
          ? "Category updated successfully"
          : "Category created successfully",
      );
      setDialogOpen(false);
      fetchCategories();
    } catch (err) {
      error("Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete category");
      success("Category deleted successfully");
      fetchCategories();
    } catch (err) {
      error("Failed to delete category");
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(search.toLowerCase()) ||
      category.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AdminShell
      title="Categories"
      description="Organize products into categories"
      actions={
        <button
          type="button"
          className="lp-btn lp-btn-save"
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: "", slug: "", image: "", description: "" });
            setDialogOpen(true);
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          Add category
        </button>
      }
    >
      <AdminCard>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              className="h-9 rounded-xl pl-9"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="lp-badge lp-badge-live">
            <FolderTree className="h-3 w-3" />
            {filteredCategories.length} categories
          </span>
        </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="lp-hint">Loading categories...</div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCategories.length === 0 ? (
            <Card className="p-12 text-center dark:bg-gray-800 dark:border-gray-700">
              <FolderTree className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No categories found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {search
                  ? "Try adjusting your search criteria"
                  : "Get started by adding your first category"}
              </p>
            </Card>
          ) : (
            filteredCategories.map((category) => (
              <AccordionItem
                key={category.id}
                id={category.id}
                title={category.name}
                summary={
                  <div className="flex items-center gap-4">
                    {category.image ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={category.image} alt={category.name} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <span className="text-gray-600 dark:text-gray-400 line-clamp-1">
                      {category.description.slice(0, 80)}...
                    </span>
                  </div>
                }
                details={
                  <div className="space-y-4">
                    {category.image && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Category Image
                        </h4>
                        <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                          <img src={category.image} alt={category.name} className="w-full h-full object-contain" />
                        </div>
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Description
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        {category.description}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 border-t pt-2">
                      Created:{" "}
                      {new Date(category.createdAt).toLocaleDateString()}
                      {category.updatedAt &&
                        category.updatedAt !== category.createdAt && (
                          <span className="ml-4">
                            Updated:{" "}
                            {new Date(category.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                    </div>
                  </div>
                }
                onEdit={() => {
                  setEditingCategory(category);
                  setFormData({
                    name: category.name,
                    slug: category.slug || "",
                    image: category.image || "",
                    description: category.description,
                  });
                  setDialogOpen(true);
                }}
                onDelete={() => handleDeleteCategory(category.id)}
              />
            ))
          )}
        </div>
      )}
      </AdminCard>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="overflow-hidden border-0 p-0 shadow-2xl">
          <div className="bg-gradient-to-r from-slate-900 via-teal-800 to-sky-600 px-5 py-4 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingCategory ? "Edit category" : "Create new category"}
              </DialogTitle>
              <DialogDescription className="text-teal-100">
                {editingCategory
                  ? "Update category information"
                  : "Add a new product category"}
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="grid gap-4 px-5 py-4">
            <div>
              <Label htmlFor="name">Category Name*</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter category name"
              />
            </div>
            <div>
              <Label htmlFor="description">Description*</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter category description"
                rows={3}
              />
            </div>
            <div>
              <Label className="mb-2 block">Category Image</Label>
              <MediaUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                accept="image"
                maxWidth={600}
                maxHeight={600}
                maxSizeMB={5}
                placeholder="Upload category image"
              />
              <p className="text-xs text-gray-500 mt-2">
                Recommended: Square or landscape image with transparent background (PNG)
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 border-t bg-slate-50 px-5 py-3">
            <button type="button" className="lp-btn lp-btn-danger" onClick={() => setDialogOpen(false)}>
              Cancel
            </button>
            <button type="button" className="lp-btn lp-btn-publish" onClick={handleSaveCategory} disabled={saving}>
              {saving
                ? "Saving..."
                : editingCategory
                  ? "Update Category"
                  : "Create Category"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
