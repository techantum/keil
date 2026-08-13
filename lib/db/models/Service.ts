import mongoose, { Schema, type Document } from "mongoose"
import type { Service as ServiceType } from "@/types"

export interface ServiceDocument extends Omit<ServiceType, "id">, Document {
  _id: mongoose.Types.ObjectId
}

// Force deletion of existing model to clear cache
if (mongoose.models.Service) {
  delete mongoose.models.Service
}

const ServiceSchema = new Schema<ServiceDocument>({
  title: { type: String, required: true },
  subtitle: String, // Make optional
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: String, // Make optional
  image: String, // Make optional
  features: [String],
  featured: { type: Boolean, default: false }, // Add featured field
  
  // SEO fields
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: [{ type: String }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export const ServiceModel = mongoose.model<ServiceDocument>("Service", ServiceSchema)
