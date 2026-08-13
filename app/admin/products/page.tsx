"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Plus,
  Search,
  Package,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import type { Product, Category } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToastContext } from "@/components/providers/toast-provider";
import { AccordionItem } from "@/components/admin/accordion-item";
import { Badge } from "@/components/ui/badge";
import { PageHeroSettings } from "@/components/admin/page-hero-settings";
import { PageHeader } from "@/components/admin/page-header";
import {
  EntitySeoFields,
  formatMetaKeywords,
  parseMetaKeywords,
  type EntitySeoValues,
} from "@/components/admin/entity-seo-fields";
import { MediaUpload } from "@/components/admin/media-upload";
import {
  DEFAULT_DETAILS_SECTION_TITLE,
  productDetailsFromLegacy,
} from "@/lib/products/product-details";
import { generateSlug } from "@/lib/validations";
import type { ProductDetailItem } from "@/types";

export default function AdminProductsPage() {
  const { success, error } = useToastContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set(),
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDeleteMode, setIsBulkDeleteMode] = useState(false);
  const [stats, setStats] = useState<{
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
    categoryStats: Array<{
      categoryId: string;
      categoryName: string;
      totalProducts: number;
      activeProducts: number;
      inactiveProducts: number;
    }>;
  } | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 10;

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category: "",
    image: "",
    detailsSectionTitle: DEFAULT_DETAILS_SECTION_TITLE,
    details: [] as ProductDetailItem[],
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();

    fetchStats();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products?limit=1000");
      const data = await response.json();
      setProducts(data.products || data);
      fetchStats();
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/products/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleDeleteCategory = async (categoryName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete ALL products in category "${categoryName}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setDeletingCategory(categoryName);
    try {
      const response = await fetch("/api/admin/products/bulk-delete-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryName }),
      });

      const data = await response.json();

      if (response.ok) {
        success(data.message);
        await fetchProducts();
        await fetchStats();
      } else {
        error(data.error || "Failed to delete products");
      }
    } catch (err) {
      error("Failed to delete products by category");
      console.error(err);
    } finally {
      setDeletingCategory(null);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      category: "",
      image: "",
      detailsSectionTitle: DEFAULT_DETAILS_SECTION_TITLE,
      details: [{ title: "", description: "" }],
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
    });
    setDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    const details =
      product.details?.length
        ? product.details
        : productDetailsFromLegacy(product);

    setFormData({
      name: product.name,
      slug: product.slug || "",
      description: product.description || "",
      category: product.categoryId || product.category || "",
      image: product.image || "",
      detailsSectionTitle:
        product.detailsSectionTitle || DEFAULT_DETAILS_SECTION_TITLE,
      details: details.length ? details : [{ title: "", description: "" }],
      metaTitle: product.metaTitle || "",
      metaDescription: product.metaDescription || "",
      metaKeywords: formatMetaKeywords(product.metaKeywords),
    });
    setDialogOpen(true);
  };

  const handleAddDetail = () => {
    setFormData({
      ...formData,
      details: [...formData.details, { title: "", description: "" }],
    });
  };

  const handleRemoveDetail = (index: number) => {
    setFormData({
      ...formData,
      details: formData.details.filter((_, i) => i !== index),
    });
  };

  const handleUpdateDetail = (
    index: number,
    field: keyof ProductDetailItem,
    value: string,
  ) => {
    const next = [...formData.details];
    next[index] = { ...next[index], [field]: value };
    setFormData({ ...formData, details: next });
  };

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.category) {
      error("Please fill in all required fields");
      return;
    }

    // Find the category name from the selected category ID
    const selectedCategory = categories.find(cat => cat.id === formData.category);
    const categoryName = selectedCategory?.name || formData.category;

    setSaving(true);
    try {
      const method = editingProduct ? "PUT" : "POST";
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products";

      const cleanedDetails = formData.details.filter(
        (item) => item.title.trim() || item.description.trim(),
      );

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug || generateSlug(formData.name),
          description: formData.description || null,
          category: categoryName,
          categoryId: formData.category,
          image: formData.image || null,
          detailsSectionTitle: formData.detailsSectionTitle.trim() || null,
          details: cleanedDetails,
          metaTitle: formData.metaTitle || null,
          metaDescription: formData.metaDescription || null,
          metaKeywords: parseMetaKeywords(formData.metaKeywords),
        }),
      });

      if (!response.ok) throw new Error("Failed to save product");

      success(
        editingProduct
          ? "Product updated successfully"
          : "Product created successfully",
      );
      setDialogOpen(false);
      fetchProducts();
    } catch (err) {
      error("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");

      success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      error("Failed to delete product");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) {
      error("Please select at least one product to delete");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete ${selectedProducts.size} product${selectedProducts.size !== 1 ? "s" : ""}?`,
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch("/api/admin/products/bulk-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productIds: Array.from(selectedProducts) }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete products");
      }

      const result = await response.json();
      success(result.message);
      setSelectedProducts(new Set());
      setIsBulkDeleteMode(false);
      fetchProducts();
    } catch (err: any) {
      error(err.message || "Failed to delete products");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleProductSelection = (id: string) => {
    const newSelection = new Set(selectedProducts);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedProducts(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedProducts.size === paginatedProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(paginatedProducts.map((p) => p.id)));
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      (product.category && product.category.toLowerCase().includes(search.toLowerCase())),
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const getCategoryName = (product: Product) => {
    if (product.categoryId) {
      return (
        categories.find((cat) => cat.id === product.categoryId)?.name ||
        "Unknown"
      );
    }
    return product.category || "Unknown";
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="cms-studio">
      <PageHeader
        title="Products"
        description="Manage products and catalog items"
        actions={
          <button type="button" onClick={handleCreateProduct} className="lp-btn lp-btn-save">
            <Plus className="h-3.5 w-3.5" />
            Add product
          </button>
        }
      />

      <div className="cms-studio-body">
      <div className="mb-3">
        <PageHeroSettings pageKey="products" pageTitle="Products" />
      </div>

      <div className="mb-4">
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Products
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.totalProducts}
                  </p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Products
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                    {stats.activeProducts}
                  </p>
                </div>
                <Badge variant="default" className="bg-green-500">
                  In Stock
                </Badge>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Out of Stock
                  </p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                    {stats.inactiveProducts}
                  </p>
                </div>
                <Badge variant="destructive">Out of Stock</Badge>
              </div>
            </Card>
          </div>
        )}

        {/* Category Stats - Show as compact cards in grid */}
        {stats && stats.categoryStats.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Products by Category
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {stats.categoryStats.map((categoryStat) => (
                <Card key={categoryStat.categoryId} className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate text-sm">
                        {categoryStat.categoryName}
                      </p>
                      <div className="flex gap-3 mt-1 text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          <span className="font-semibold">
                            {categoryStat.totalProducts}
                          </span>{" "}
                          total
                        </span>
                        <span className="text-green-600 dark:text-green-400">
                          <span className="font-semibold">
                            {categoryStat.activeProducts}
                          </span>{" "}
                          active
                        </span>
                        <span className="text-red-600 dark:text-red-400">
                          <span className="font-semibold">
                            {categoryStat.inactiveProducts}
                          </span>{" "}
                          out
                        </span>
                      </div>
                    </div>
                    {categoryStat.totalProducts > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDeleteCategory(categoryStat.categoryName)
                        }
                        disabled={
                          deletingCategory === categoryStat.categoryName
                        }
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Package className="h-4 w-4" />
              {filteredProducts.length} products
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isBulkDeleteMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBulkDeleteMode(true)}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Bulk Delete
              </Button>
            )}

            {isBulkDeleteMode && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsBulkDeleteMode(false);
                    setSelectedProducts(new Set());
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={isDeleting || selectedProducts.size === 0}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete{" "}
                  {selectedProducts.size > 0 ? selectedProducts.size : ""}{" "}
                  selected
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Select All - only show in bulk delete mode */}
        {isBulkDeleteMode && paginatedProducts.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <Checkbox
              id="select-all-products"
              checked={
                selectedProducts.size === paginatedProducts.length &&
                paginatedProducts.length > 0
              }
              onCheckedChange={toggleSelectAll}
            />
            <label
              htmlFor="select-all-products"
              className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
            >
              Select all on this page ({paginatedProducts.length})
            </label>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            Loading products...
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-2 mb-6">
            {paginatedProducts.length === 0 ? (
              <Card className="p-12 text-center dark:bg-gray-800 dark:border-gray-700">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {search
                    ? "Try adjusting your search criteria"
                    : "Get started by adding your first product"}
                </p>
              </Card>
            ) : (
              paginatedProducts.map((product) => (
                <div key={product.id} className="flex items-start gap-2">
                  {isBulkDeleteMode && (
                    <div className="pt-3">
                      <Checkbox
                        checked={selectedProducts.has(product.id)}
                        onCheckedChange={() =>
                          toggleProductSelection(product.id)
                        }
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <AccordionItem
                      id={product.id}
                      title={product.name}
                      subtitle={getCategoryName(product)}
                      status={{
                        label: product.availability || "In Stock",
                        variant: product.availability === "Out of Stock" ? "destructive" : "success",
                      }}
                      summary={
                        <div className="flex items-center gap-4">
                          <span>{getCategoryName(product)}</span>
                          {product.productType && (
                            <>
                              <span>•</span>
                              <span className="text-xs">
                                {product.productType}
                              </span>
                            </>
                          )}
                        </div>
                      }
                      details={
                        <div className="space-y-4">
                          {product.description && (
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                Description
                              </h4>
                              <p className="text-gray-700 dark:text-gray-300">
                                {product.description}
                              </p>
                            </div>
                          )}

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Category
                              </h5>
                              <p className="text-sm text-gray-900 dark:text-white">
                                {getCategoryName(product)}
                              </p>
                            </div>

                            {product.productType && (
                              <div>
                                <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                  Product Type
                                </h5>
                                <p className="text-sm text-gray-900 dark:text-white">
                                  {product.productType}
                                </p>
                              </div>
                            )}

                            {product.capacity && (
                              <div>
                                <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                  Capacity
                                </h5>
                                <p className="text-sm text-gray-900 dark:text-white">
                                  {product.capacity}
                                </p>
                              </div>
                            )}

                            {product.motorPower && (
                              <div>
                                <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                  Motor Power
                                </h5>
                                <p className="text-sm text-gray-900 dark:text-white">
                                  {product.motorPower}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Created:{" "}
                              {new Date(product.createdAt).toLocaleDateString()}
                              {product.updatedAt &&
                                product.updatedAt !== product.createdAt && (
                                  <span className="ml-4">
                                    Updated:{" "}
                                    {new Date(
                                      product.updatedAt,
                                    ).toLocaleDateString()}
                                  </span>
                                )}
                            </div>
                            <Badge
                              variant={
                                product.availability === "Out of Stock" ? "destructive" : "success"
                              }
                            >
                              {product.availability || "In Stock"}
                            </Badge>
                          </div>
                        </div>
                      }
                      onEdit={() => handleEditProduct(product)}
                      onDelete={() => handleDeleteProduct(product.id)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {startIndex + 1}-
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)}{" "}
                of {filteredProducts.length} products
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(totalPages, 10) },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent fullscreen>
          <DialogHeader className="shrink-0 border-b px-6 py-4 text-left">
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Create New Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="mx-auto grid w-full max-w-4xl gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Product Name*</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: editingProduct
                        ? formData.slug
                        : generateSlug(e.target.value),
                    })
                  }
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <Label htmlFor="slug">Page Slug*</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: generateSlug(e.target.value) })
                  }
                  placeholder="product-url-slug"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Public URL: /products/{formData.slug || "your-slug"}
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="category">Category*</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter product description"
                rows={3}
              />
            </div>

            <div>
              <Label>Product Image</Label>
              <MediaUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                accept="image"
                maxWidth={1200}
                maxHeight={1200}
                maxSizeMB={5}
                uploadType="image"
                placeholder="Upload product image"
              />
            </div>

            {/* Key Features and Details */}
            <div className="border-t pt-4 mt-2">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Key Features and Details
                </h4>
                <Button type="button" variant="outline" size="sm" onClick={handleAddDetail}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Detail
                </Button>
              </div>

              <div className="mb-4">
                <Label htmlFor="detailsSectionTitle">Section Title</Label>
                <Input
                  id="detailsSectionTitle"
                  value={formData.detailsSectionTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, detailsSectionTitle: e.target.value })
                  }
                  placeholder="Key Features and Details"
                />
              </div>

              <div className="space-y-3">
                {formData.details.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No detail rows yet. Click Add Detail to create one.
                  </p>
                )}

                {formData.details.map((detail, index) => (
                  <div
                    key={index}
                    className="grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_1fr_auto]"
                  >
                    <div>
                      <Label htmlFor={`detail-title-${index}`}>Custom Title</Label>
                      <Input
                        id={`detail-title-${index}`}
                        value={detail.title}
                        onChange={(e) =>
                          handleUpdateDetail(index, "title", e.target.value)
                        }
                        placeholder="e.g., Capacity"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`detail-description-${index}`}>
                        Custom Description
                      </Label>
                      <Input
                        id={`detail-description-${index}`}
                        value={detail.description}
                        onChange={(e) =>
                          handleUpdateDetail(index, "description", e.target.value)
                        }
                        placeholder="e.g., 100 TPH"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddDetail}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveDetail(index)}
                        disabled={formData.details.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <EntitySeoFields
              values={{
                metaTitle: formData.metaTitle,
                metaDescription: formData.metaDescription,
                metaKeywords: formData.metaKeywords,
              }}
              onChange={(seo: EntitySeoValues) =>
                setFormData({ ...formData, ...seo })
              }
            />
              </div>
            </div>

            <DialogFooter className="shrink-0 border-t px-6 py-4 sm:justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProduct} disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingProduct
                    ? "Update Product"
                    : "Create Product"}
              </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
