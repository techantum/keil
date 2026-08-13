"use client"

import { useState } from "react"
import { FileUpload } from "@/components/ui/file-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { COMMON_ASPECT_RATIOS } from "@/lib/file-utils"

// Example: Product form with enhanced upload
export function ProductFormWithUpload() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null as File | null,
    thumbnail: null as File | null,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission here
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add Product with Enhanced Upload</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* Main product image */}
          <FileUpload
            label="Product Image"
            description="Upload a high-quality image of the product"
            value={formData.image}
            onChange={(file) => setFormData(prev => ({ ...prev, image: file }))}
            maxSize={5}
            allowedTypes={["image/jpeg", "image/png", "image/webp"]}
            maxWidth={2000}
            maxHeight={2000}
            preview={true}
          />

          {/* Thumbnail with square aspect ratio */}
          <FileUpload
            label="Product Thumbnail"
            description="Square thumbnail for catalog display"
            value={formData.thumbnail}
            onChange={(file) => setFormData(prev => ({ ...prev, thumbnail: file }))}
            maxSize={2}
            allowedTypes={["image/jpeg", "image/png", "image/webp"]}
            aspectRatio={COMMON_ASPECT_RATIOS.SQUARE}
            maxWidth={800}
            maxHeight={800}
            preview={true}
          />

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              Save Product
            </Button>
            <Button type="button" variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Example: User profile form
export function UserProfileWithUpload() {
  const [avatar, setAvatar] = useState<File | null>(null)
  const [coverImage, setCoverImage] = useState<File | null>(null)

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar upload */}
        <FileUpload
          label="Profile Avatar"
          description="Square profile picture for your account"
          value={avatar}
          onChange={setAvatar}
          maxSize={2}
          aspectRatio={COMMON_ASPECT_RATIOS.SQUARE}
          maxWidth={500}
          maxHeight={500}
          allowedTypes={["image/jpeg", "image/png", "image/webp"]}
          preview={true}
        />

        {/* Cover image upload */}
        <FileUpload
          label="Cover Image"
          description="Wide banner image for your profile"
          value={coverImage}
          onChange={setCoverImage}
          maxSize={5}
          aspectRatio={COMMON_ASPECT_RATIOS.WIDESCREEN}
          maxWidth={1920}
          maxHeight={1080}
          allowedTypes={["image/jpeg", "image/png", "image/webp"]}
          preview={true}
        />

        <Button className="w-full">Update Profile</Button>
      </CardContent>
    </Card>
  )
}

// Example: Document upload
export function DocumentUploadExample() {
  const [document, setDocument] = useState<File | null>(null)

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Document Upload</CardTitle>
      </CardHeader>
      <CardContent>
        <FileUpload
          label="Upload Document"
          description="Upload images or PDF documents"
          value={document}
          onChange={setDocument}
          maxSize={10}
          allowedTypes={[
            "image/jpeg",
            "image/png", 
            "image/webp",
            "application/pdf"
          ]}
          preview={true}
        />

        <Button className="w-full mt-4" disabled={!document}>
          Submit Document
        </Button>
      </CardContent>
    </Card>
  )
}
