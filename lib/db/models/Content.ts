import mongoose, { Schema, type Document } from "mongoose"
import type { HomePageContent, AboutPageContent, ContactPageContent, FooterContent } from "@/types"

export interface ContentDocument extends Document {
  _id: mongoose.Types.ObjectId
  type: "home" | "about" | "contact" | "footer"
  data: HomePageContent | AboutPageContent | ContactPageContent | FooterContent
  updatedAt: Date
}

const ContentSchema = new Schema<ContentDocument>(
  {
    type: {
      type: String,
      required: true,
      unique: true,
      enum: ["home", "about", "contact", "footer"],
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export const ContentModel = mongoose.models.Content || mongoose.model<ContentDocument>("Content", ContentSchema)
