"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload, LinkIcon, X } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  label: string
  value: string
  onChange: (value: string) => void
  accept?: string
}

export function ImageUpload({ label, value, onChange, accept = "image/*" }: ImageUploadProps) {
  const [uploadMode, setUploadMode] = useState<"url" | "file">("url")
  const [previewUrl, setPreviewUrl] = useState(value)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create a preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setPreviewUrl(result)
      onChange(result)
    }
    reader.readAsDataURL(file)
  }

  const handleUrlChange = (url: string) => {
    setPreviewUrl(url)
    onChange(url)
  }

  const clearImage = () => {
    setPreviewUrl("")
    onChange("")
  }

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={uploadMode === "url" ? "default" : "outline"}
          size="sm"
          onClick={() => setUploadMode("url")}
          className="flex items-center gap-2"
        >
          <LinkIcon className="h-4 w-4" />
          URL
        </Button>
        <Button
          type="button"
          variant={uploadMode === "file" ? "default" : "outline"}
          size="sm"
          onClick={() => setUploadMode("file")}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload
        </Button>
      </div>

      {/* Input based on mode */}
      {uploadMode === "url" ? (
        <Input
          type="url"
          placeholder="Enter image URL"
          value={value}
          onChange={(e) => handleUrlChange(e.target.value)}
        />
      ) : (
        <div className="flex items-center gap-2">
          <Input type="file" accept={accept} onChange={handleFileChange} className="flex-1" />
        </div>
      )}

      {/* Preview */}
      {previewUrl && (
        <div className="relative inline-block">
          <div className="relative w-32 h-32 border rounded-lg overflow-hidden bg-gray-50">
            <Image src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={clearImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  )
}
