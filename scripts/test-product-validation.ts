import { productSchema } from "@/lib/validations"

const testData = {
  name: "Test Product Name",
  description: "This is a test description for the product that is long enough to meet requirements",
  casNumber: "123-45-6",
  category: "Analgesics",
  inStock: true
}

try {
  const validated = productSchema.parse(testData)
  console.log("✅ Validation successful!")
  console.log("Generated slug:", validated.slug)
  console.log("Full validated data:", JSON.stringify(validated, null, 2))
} catch (error: any) {
  console.error("❌ Validation failed:", error.message)
  if (error.issues) {
    console.error("Issues:", JSON.stringify(error.issues, null, 2))
  }
}
