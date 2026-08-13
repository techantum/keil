import connectDB from "@/lib/db/mongodb"
import { ProductModel } from "@/lib/db/models/Product"
import { ServiceModel } from "@/lib/db/models/Service"
import { CategoryModel } from "@/lib/db/models/Category"

async function checkCurrentDatabase() {
  try {
    console.log("🔄 Checking current database connection...")
    console.log("MONGODB_URI:", process.env.MONGODB_URI)
    console.log("USE_MONGODB:", process.env.USE_MONGODB)
    
    const mongoose = await connectDB()
    console.log("✅ Connected to:", mongoose.connection.host)
    console.log("📊 Database name:", mongoose.connection.name)
    
    // Count all data
    const productCount = await ProductModel.countDocuments()
    const serviceCount = await ServiceModel.countDocuments()
    const categoryCount = await CategoryModel.countDocuments()
    
    console.log(`\n📊 Current data in database:`)
    console.log(`   - Products: ${productCount}`)
    console.log(`   - Services: ${serviceCount}`)
    console.log(`   - Categories: ${categoryCount}`)
    
    if (productCount > 0) {
      const products = await ProductModel.find({}, 'name').limit(5)
      console.log(`\n📝 Sample products:`)
      products.forEach(p => console.log(`   - ${p.name}`))
      if (productCount > 5) {
        console.log(`   ... and ${productCount - 5} more`)
      }
    }
    
    process.exit(0)
  } catch (error: any) {
    console.error("❌ Error checking database:", error.message)
    process.exit(1)
  }
}

checkCurrentDatabase()
