import { getRepository } from "@/lib/repo/InMemoryRepository"

async function debugRepository() {
  try {
    console.log("🔍 Debugging repository configuration...")
    console.log("NODE_ENV:", process.env.NODE_ENV)
    console.log("USE_MONGODB:", process.env.USE_MONGODB)
    console.log("MONGODB_URI:", process.env.MONGODB_URI)
    
    const repo = getRepository()
    console.log("Repository type:", repo.constructor.name)
    
    const products = await repo.getAllProducts()
    const services = await repo.getAllServices()
    
    console.log(`\n📊 Data found:`)
    console.log(`   - Products: ${products.length}`)
    console.log(`   - Services: ${services.length}`)
    
    if (products.length > 0) {
      console.log(`\n📝 Sample products:`)
      products.slice(0, 3).forEach(p => console.log(`   - ${p.name}`))
    }
    
    if (services.length > 0) {
      console.log(`\n🔧 Sample services:`)
      services.slice(0, 3).forEach(s => console.log(`   - ${s.title}`))
    }
    
    process.exit(0)
  } catch (error: any) {
    console.error("❌ Error:", error.message)
    process.exit(1)
  }
}

debugRepository()
