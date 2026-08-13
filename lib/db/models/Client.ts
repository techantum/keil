import mongoose, { Schema, type Document } from "mongoose"
import type { Client as ClientType } from "@/types"

export interface ClientDocument extends Omit<ClientType, "id">, Document {
  _id: mongoose.Types.ObjectId
}

const ClientSchema = new Schema<ClientDocument>({
  name: { type: String, required: true },
  logo: { type: String, required: true },
  website: { type: String },
  order: { type: Number, default: 0 },
}, {
  timestamps: true,
})

// Index for ordering
ClientSchema.index({ order: 1 })

export const ClientModel = mongoose.models.Client || mongoose.model<ClientDocument>("Client", ClientSchema)
