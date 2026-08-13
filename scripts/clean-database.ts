import connectDB from "@/lib/db/mongodb"
import { ProductModel } from "@/lib/db/models/Product"
import { CategoryModel } from "@/lib/db/models/Category"
import { ServiceModel } from "@/lib/db/models/Service"
import { ContentModel } from "@/lib/db/models/Content"

async function cleanDatabase() {
  try {
    console.log("🔄 Connecting to MongoDB...")
    await connectDB()
    console.log("✅ Connected successfully!")

    // Clear all collections
    console.log("\n🗑️ Cleaning all collections...")
    
    const productCount = await ProductModel.countDocuments()
    const categoryCount = await CategoryModel.countDocuments()
    const serviceCount = await ServiceModel.countDocuments()
    const contentCount = await ContentModel.countDocuments()
    
    console.log(`📊 Found: ${productCount} products, ${categoryCount} categories, ${serviceCount} services, ${contentCount} content items`)
    
    await ProductModel.deleteMany({})
    console.log("🗑️ Cleared all products")
    
    await CategoryModel.deleteMany({})
    console.log("🗑️ Cleared all categories")
    
    await ServiceModel.deleteMany({})
    console.log("🗑️ Cleared all services")
    
    await ContentModel.deleteMany({})
    console.log("🗑️ Cleared all content")

    console.log("\n✅ Database cleaned successfully!")
    console.log("🆕 Ready for fresh data uploads!")
    
    process.exit(0)
  } catch (error: any) {
    console.error("❌ Error cleaning database:", error.message)
    process.exit(1)
  }
}

cleanDatabase()
