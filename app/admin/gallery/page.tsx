"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Search, Image as ImageIcon } from "lucide-react"
import type { GalleryItem } from "@/types"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToastContext } from "@/components/providers/toast-provider"
import { AccordionItem } from "@/components/admin/accordion-item"
import { MediaUpload } from "@/components/admin/media-upload"
import { PageHeroSettings } from "@/components/admin/page-hero-settings"
import { AdminShell, AdminCard } from "@/components/admin/admin-shell"

export default function AdminGalleryPage() {
  const { success, error } = useToastContext()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [formData, setFormData] = useState({ 
    name: "", 
    image: "",
    category: "",
    order: 0
  })

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/admin/gallery")
      const data = await response.json()
      setItems(data)
    } catch (err) {
      error("Failed to fetch gallery items")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveItem = async () => {
    if (!formData.name || !formData.image) {
      error("Please fill in all required fields")
      return
    }

    setSaving(true)
    try {
      const method = editingItem ? "PUT" : "POST"
      const url = editingItem ? `/api/admin/gallery/${editingItem.id}` : "/api/admin/gallery"
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to save gallery item")

      success(editingItem ? "Gallery item updated successfully" : "Gallery item created successfully")
      setDialogOpen(false)
      fetchItems()
    } catch (err) {
      error("Failed to save gallery item")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return

    try {
      const response = await fetch(`/api/admin/gallery/${itemId}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete gallery item")
      success("Gallery item deleted successfully")
      fetchItems()
    } catch (err) {
      error("Failed to delete gallery item")
    }
  }

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <AdminShell
      title="Gallery"
      description="Manage gallery images for the public site"
      actions={
        <button
          type="button"
          className="lp-btn lp-btn-save"
          onClick={() => {
            setEditingItem(null)
            setFormData({ name: "", image: "", category: "", order: 0 })
            setDialogOpen(true)
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          Add gallery item
        </button>
      }
    >
      <div className="mb-3">
        <PageHeroSettings pageKey="gallery" pageTitle="Gallery" />
      </div>

      <AdminCard>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              className="h-9 rounded-xl pl-9"
              placeholder="Search gallery..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="lp-badge lp-badge-live">
            <ImageIcon className="h-3 w-3" />
            {filteredItems.length} items
          </span>
        </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="lp-hint">Loading gallery...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.length === 0 ? (
            <Card className="col-span-full p-12 text-center dark:bg-gray-800 dark:border-gray-700">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No gallery items found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {search ? "Try adjusting your search criteria" : "Get started by adding your first gallery item"}
              </p>
            </Card>
          ) : (
            filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                <div className="aspect-square relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">{item.name}</h3>
                  {item.category && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.category}</p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => { 
                        setEditingItem(item); 
                        setFormData({ 
                          name: item.name, 
                          image: item.image,
                          category: item.category || "",
                          order: item.order || 0
                        }); 
                        setDialogOpen(true) 
                      }}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
      </AdminCard>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl overflow-hidden border-0 p-0 shadow-2xl">
          <div className="bg-gradient-to-r from-slate-900 via-teal-800 to-sky-600 px-5 py-4 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingItem ? "Edit gallery item" : "Add gallery item"}
              </DialogTitle>
              <DialogDescription className="text-teal-100">
                {editingItem ? "Update gallery item details" : "Add a new image to the gallery"}
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="grid gap-4 px-5 py-4">
            <div className="lp-field">
              <label>Name*</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter item name"
              />
            </div>
            <div className="lp-field">
              <label>Category</label>
              <input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Enter category (optional)"
              />
            </div>
            <div className="lp-field">
              <label>Display order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
            <div className="lp-field">
              <label>Image*</label>
              <MediaUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                accept="image"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 border-t bg-slate-50 px-5 py-3">
            <button type="button" className="lp-btn lp-btn-danger" onClick={() => setDialogOpen(false)}>
              Cancel
            </button>
            <button type="button" className="lp-btn lp-btn-publish" onClick={handleSaveItem} disabled={saving}>
              {saving ? "Saving..." : editingItem ? "Update" : "Create"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  )
}
