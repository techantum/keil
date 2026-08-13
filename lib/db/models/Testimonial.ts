import mongoose, { Schema, type Document } from "mongoose"
import type { Testimonial as TestimonialType } from "@/types"

export interface TestimonialDocument extends Omit<TestimonialType, "id">, Document {
  _id: mongoose.Types.ObjectId
}

const TestimonialSchema = new Schema<TestimonialDocument>({
  name: { type: String, required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  featured: { type: Boolean, default: false },
}, {
  timestamps: true,
})

// Index for featured testimonials
TestimonialSchema.index({ featured: -1, createdAt: -1 })

export const TestimonialModel = mongoose.models.Testimonial || mongoose.model<TestimonialDocument>("Testimonial", TestimonialSchema)
