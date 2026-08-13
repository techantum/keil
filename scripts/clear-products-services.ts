import connectDB from "@/lib/db/mongodb"
import { ProductModel } from "@/lib/db/models/Product"
import { ServiceModel } from "@/lib/db/models/Service"

async function clearProductsAndServices() {
  try {
    console.log("🔄 Connecting to MongoDB Atlas...")
    await connectDB()
    console.log("✅ Connected successfully!")

    // Count existing data
    const productCount = await ProductModel.countDocuments()
    const serviceCount = await ServiceModel.countDocuments()
    
    console.log(`\n📊 Current data:`)
    console.log(`   - Products: ${productCount}`)
    console.log(`   - Services: ${serviceCount}`)
    
    // Clear products
    if (productCount > 0) {
      await ProductModel.deleteMany({})
      console.log("🗑️ ✅ All products cleared")
    } else {
      console.log("📝 No products to clear")
    }
    
    // Clear services
    if (serviceCount > 0) {
      await ServiceModel.deleteMany({})
      console.log("🗑️ ✅ All services cleared")
    } else {
      console.log("📝 No services to clear")
    }

    console.log("\n🎉 Database cleared successfully!")
    console.log("🆕 Ready to create fresh products and services!")
    
    // Verify cleanup
    const finalProductCount = await ProductModel.countDocuments()
    const finalServiceCount = await ServiceModel.countDocuments()
    
    console.log(`\n✓ Verification:`)
    console.log(`   - Products remaining: ${finalProductCount}`)
    console.log(`   - Services remaining: ${finalServiceCount}`)
    
    process.exit(0)
  } catch (error: any) {
    console.error("❌ Error clearing database:", error.message)
    process.exit(1)
  }
}

clearProductsAndServices()
