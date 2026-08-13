import mongoose, { Schema, type Document } from "mongoose"
import type { Category as CategoryType } from "@/types"

export interface CategoryDocument extends Omit<CategoryType, "id">, Document {
  _id: mongoose.Types.ObjectId
}

const CategorySchema = new Schema<CategoryDocument>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String },
  image: { type: String }, // Category thumbnail image
}, {
  timestamps: true,
})

export const CategoryModel = mongoose.models.Category || mongoose.model<CategoryDocument>("Category", CategorySchema)
