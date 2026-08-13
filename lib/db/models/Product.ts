import mongoose, { Schema, type Document } from "mongoose";
import type { Product as ProductType } from "@/types";

export interface ProductDocument extends Omit<ProductType, "id">, Document {
  _id: mongoose.Types.ObjectId;
}

const ProductSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String },
    category: { type: String }, // Fuel Handling, Ash Handling, etc.
    categoryId: { type: String }, // Reference to category ID
    description: { type: String },
    
    // Key features and details for industrial equipment
    productType: { type: String }, // e.g., "Rectangular"
    capacity: { type: String }, // e.g., "100 TPH"
    screenDimension: { type: String }, // e.g., "16 ft x 5 ft"
    numberOfDecks: { type: String }, // e.g., "2"
    motorPower: { type: String }, // e.g., "5 HP"
    gyratoryCircular: { type: String }, // e.g., "Special Features"
    specialFeatures: { type: String }, // e.g., "Ball / Slider Deck"
    availability: { type: String, default: "In Stock" }, // e.g., "In Stock"
    
    featured: { type: Boolean, default: false },
    
    // SEO fields
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: [{ type: String }],
  },
  {
    timestamps: true,
  },
);

// Add index for better performance when filtering by category
ProductSchema.index({ category: 1 });
ProductSchema.index({ categoryId: 1 });

export const ProductModel =
  mongoose.models.Product ||
  mongoose.model<ProductDocument>("Product", ProductSchema);
