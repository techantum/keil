import mongoose, { Schema, type Document } from "mongoose"
import type { GalleryItem as GalleryItemType } from "@/types"

export interface GalleryDocument extends Omit<GalleryItemType, "id">, Document {
  _id: mongoose.Types.ObjectId
}

const GallerySchema = new Schema<GalleryDocument>({
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String },
  order: { type: Number, default: 0 },
}, {
  timestamps: true,
})

// Index for ordering
GallerySchema.index({ order: 1 })

export const GalleryModel = mongoose.models.Gallery || mongoose.model<GalleryDocument>("Gallery", GallerySchema)
