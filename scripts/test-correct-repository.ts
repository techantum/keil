import { getRepository } from "@/lib/repo"

async function testRepository() {
  try {
    console.log("🔍 Testing repository selection...")
    console.log("NODE_ENV:", process.env.NODE_ENV)
    console.log("USE_MONGODB:", process.env.USE_MONGODB)
    
    // Set environment variables for testing
    process.env.NODE_ENV = "production"
    process.env.USE_MONGODB = "true"
    
    console.log("After setting - NODE_ENV:", process.env.NODE_ENV)
    console.log("After setting - USE_MONGODB:", process.env.USE_MONGODB)
    
    const repo = getRepository()
    console.log("Repository type:", repo.constructor.name)
    
    const products = await repo.getAllProducts()
    const services = await repo.getAllServices()
    
    console.log(`\n📊 Data found:`)
    console.log(`   - Products: ${products.length}`)
    console.log(`   - Services: ${services.length}`)
    
    process.exit(0)
  } catch (error: any) {
    console.error("❌ Error:", error.message)
    process.exit(1)
  }
}

testRepository()
