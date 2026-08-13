import { getRepository } from "@/lib/repo"

async function debugLiveRepository() {
  try {
    console.log("🔍 Testing live repository...")
    console.log("Environment variables:")
    console.log("- NODE_ENV:", process.env.NODE_ENV)
    console.log("- USE_MONGODB:", process.env.USE_MONGODB)
    console.log("- MONGODB_URI:", process.env.MONGODB_URI ? "Set" : "Not set")
    
    const repo = getRepository()
    console.log("Repository type:", repo.constructor.name)
    
    const products = await repo.getAllProducts()
    const categories = await repo.getAllCategories()
    
    console.log(`\n📊 Current data:`)
    console.log(`- Products: ${products.length}`)
    console.log(`- Categories: ${categories.length}`)
    
    if (products.length > 0) {
      console.log(`\n📝 First 3 products:`)
      products.slice(0, 3).forEach((p, i) => {
        console.log(`${i + 1}. ${p.name} (ID: ${p.id})`)
      })
    }
    
    if (categories.length > 0) {
      console.log(`\n📂 Categories:`)
      categories.forEach((c, i) => {
        console.log(`${i + 1}. ${c.name} (ID: ${c.id})`)
      })
    }
    
  } catch (error: any) {
    console.error("❌ Error:", error.message)
  }
}

debugLiveRepository()
