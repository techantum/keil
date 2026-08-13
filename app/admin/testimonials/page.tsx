"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Search, MessageSquare, Star } from "lucide-react"
import type { Testimonial } from "@/types"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToastContext } from "@/components/providers/toast-provider"
import { AccordionItem } from "@/components/admin/accordion-item"
import { MediaUpload } from "@/components/admin/media-upload"
import { PageHeroSettings } from "@/components/admin/page-hero-settings"
import { AdminShell, AdminCard } from "@/components/admin/admin-shell"

export default function AdminTestimonialsPage() {
  const { success, error } = useToastContext()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState({ 
    name: "", 
    title: "",
    company: "",
    content: "",
    image: "",
    rating: 5,
    featured: false
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/admin/testimonials")
      const data = await response.json()
      setTestimonials(data)
    } catch (err) {
      error("Failed to fetch testimonials")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTestimonial = async () => {
    if (!formData.name || !formData.title || !formData.company || !formData.content) {
      error("Please fill in all required fields")
      return
    }

    setSaving(true)
    try {
      const method = editingTestimonial ? "PUT" : "POST"
      const url = editingTestimonial ? `/api/admin/testimonials/${editingTestimonial.id}` : "/api/admin/testimonials"
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to save testimonial")

      success(editingTestimonial ? "Testimonial updated successfully" : "Testimonial created successfully")
      setDialogOpen(false)
      fetchTestimonials()
    } catch (err) {
      error("Failed to save testimonial")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteTestimonial = async (testimonialId: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return

    try {
      const response = await fetch(`/api/admin/testimonials/${testimonialId}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete testimonial")
      success("Testimonial deleted successfully")
      fetchTestimonials()
    } catch (err) {
      error("Failed to delete testimonial")
    }
  }

  const filteredTestimonials = testimonials.filter(testimonial =>
    testimonial.name.toLowerCase().includes(search.toLowerCase()) ||
    testimonial.company.toLowerCase().includes(search.toLowerCase()) ||
    testimonial.content.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminShell
      title="Testimonials"
      description="Manage customer testimonials and reviews"
      actions={
        <button
          type="button"
          className="lp-btn lp-btn-save"
          onClick={() => {
            setEditingTestimonial(null)
            setFormData({ name: "", title: "", company: "", content: "", image: "", rating: 5, featured: false })
            setDialogOpen(true)
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          Add testimonial
        </button>
      }
    >
      <div className="mb-3">
        <PageHeroSettings pageKey="testimonials" pageTitle="Testimonials" />
      </div>

      <AdminCard>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              className="h-9 rounded-xl pl-9"
              placeholder="Search testimonials..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="lp-badge lp-badge-live">
            <MessageSquare className="h-3 w-3" />
            {filteredTestimonials.length} testimonials
          </span>
        </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="lp-hint">Loading testimonials...</div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTestimonials.length === 0 ? (
            <Card className="p-12 text-center dark:bg-gray-800 dark:border-gray-700">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No testimonials found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {search ? "Try adjusting your search criteria" : "Get started by adding your first testimonial"}
              </p>
            </Card>
          ) : (
            filteredTestimonials.map((testimonial) => (
              <AccordionItem
                key={testimonial.id}
                id={testimonial.id}
                title={testimonial.name}
                subtitle={`${testimonial.title} at ${testimonial.company}`}
                status={testimonial.featured ? {
                  label: "Featured",
                  variant: "success"
                } : undefined}
                summary={
                  <div className="flex items-center gap-4">
                    {testimonial.image && (
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <span className="text-gray-600 dark:text-gray-400 line-clamp-1">{testimonial.content.substring(0, 100)}...</span>
                    {testimonial.rating && (
                      <div className="flex items-center gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    )}
                  </div>
                }
                details={
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      {testimonial.image && (
                        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                          <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.title} at {testimonial.company}</p>
                        {testimonial.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < testimonial.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Testimonial</h4>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{testimonial.content}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Created: {new Date(testimonial.createdAt).toLocaleDateString()}
                      </div>
                      {testimonial.featured && (
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">Featured</span>
                      )}
                    </div>
                  </div>
                }
                onEdit={() => { 
                  setEditingTestimonial(testimonial); 
                  setFormData({ 
                    name: testimonial.name, 
                    title: testimonial.title,
                    company: testimonial.company,
                    content: testimonial.content,
                    image: testimonial.image || "",
                    rating: testimonial.rating || 5,
                    featured: testimonial.featured
                  }); 
                  setDialogOpen(true) 
                }}
                onDelete={() => handleDeleteTestimonial(testimonial.id)}
              />
            ))
          )}
        </div>
      )}
      </AdminCard>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden border-0 p-0 shadow-2xl">
          <div className="bg-gradient-to-r from-slate-900 via-teal-800 to-sky-600 px-5 py-4 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingTestimonial ? "Edit testimonial" : "Add testimonial"}
              </DialogTitle>
              <DialogDescription className="text-teal-100">
                {editingTestimonial ? "Update testimonial details" : "Add a new customer testimonial"}
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="grid max-h-[calc(90vh-10rem)] gap-4 overflow-y-auto px-5 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name*</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  placeholder="Customer name" 
                />
              </div>
              <div>
                <Label htmlFor="title">Title/Position*</Label>
                <Input 
                  id="title" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                  placeholder="e.g., Manager" 
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="company">Company*</Label>
              <Input 
                id="company" 
                value={formData.company} 
                onChange={(e) => setFormData({ ...formData, company: e.target.value })} 
                placeholder="Company name" 
              />
            </div>

            <div>
              <Label htmlFor="content">Testimonial Content*</Label>
              <Textarea 
                id="content" 
                value={formData.content} 
                onChange={(e) => setFormData({ ...formData, content: e.target.value })} 
                placeholder="Enter the testimonial text" 
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input 
                  id="rating" 
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating} 
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })} 
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
                />
                <Label htmlFor="featured">Featured Testimonial</Label>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">Customer Photo</Label>
              <MediaUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                accept="image"
                maxWidth={200}
                maxHeight={200}
                maxSizeMB={2}
                aspectRatio="1:1"
                uploadType="icon"
                placeholder="Upload customer photo"
              />
              <p className="text-xs text-gray-500 mt-2">
                Recommended: Square image, 200x200px
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 border-t bg-slate-50 px-5 py-3">
            <button type="button" className="lp-btn lp-btn-danger" onClick={() => setDialogOpen(false)}>
              Cancel
            </button>
            <button type="button" className="lp-btn lp-btn-publish" onClick={handleSaveTestimonial} disabled={saving}>
              {saving ? "Saving..." : editingTestimonial ? "Update" : "Create"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  )
}
