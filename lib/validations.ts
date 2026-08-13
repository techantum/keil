import { z } from "zod"

// Helper function to generate slug from name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Helper to handle null/undefined strings
const optionalString = z.string().optional().nullable().transform(val => val || undefined)

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: optionalString,
  description: optionalString,
  category: optionalString,
  categoryId: optionalString,
  image: optionalString,
  detailsSectionTitle: optionalString,
  details: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    )
    .optional(),
  productType: optionalString,
  capacity: optionalString,
  screenDimension: optionalString,
  numberOfDecks: optionalString,
  motorPower: optionalString,
  gyratoryCircular: optionalString,
  specialFeatures: optionalString,
  availability: optionalString,
  featured: z.boolean().default(false),
}).transform((data) => ({
  ...data,
  slug: data.slug || generateSlug(data.name),
}))

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required").optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
}).transform((data) => ({
  ...data,
  slug: data.slug || generateSlug(data.name),
}))

export const enquirySchema = z.object({
  type: z.enum(["general", "product", "general_product", "bulk", "service"]),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  productName: z.string().optional(),
  productCategory: z.string().optional(),
  selectedProductId: z.string().optional(),
  message: z.string().optional(),
})

export type ProductInput = z.infer<typeof productSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type EnquiryInput = z.infer<typeof enquirySchema>
