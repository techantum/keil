import connectDB from "@/lib/db/mongodb"
import { ContentModel } from "@/lib/db/models/Content"
import { CategoryModel } from "@/lib/db/models/Category"
import {
  seedHomePageContent,
  seedAboutPageContent,
  seedContactPageContent,
  seedFooterContent,
} from "@/lib/repo/seed-content"
import { seedCategories } from "@/lib/repo/seed-data"

async function seedContentOnly() {
  try {
    console.log("🔄 Connecting to MongoDB Atlas...")
    await connectDB()
    console.log("✅ Connected successfully!")

    // Check existing content
    const existingContent = await ContentModel.countDocuments()
    const existingCategories = await CategoryModel.countDocuments()
    
    console.log(`\n📊 Current state:`)
    console.log(`   - Content items: ${existingContent}`)
    console.log(`   - Categories: ${existingCategories}`)

    // Seed content if missing
    if (existingContent === 0) {
      console.log("\n📝 Seeding CMS content...")
      await ContentModel.create([
        { type: "home", data: seedHomePageContent },
        { type: "about", data: seedAboutPageContent },
        { type: "contact", data: seedContactPageContent },
        { type: "footer", data: seedFooterContent },
      ])
      console.log("✅ CMS content seeded successfully!")
    } else {
      console.log("📋 Content already exists, skipping...")
    }

    // Seed categories if missing (needed for products)
    if (existingCategories === 0) {
      console.log("\n📂 Seeding categories...")
      const categories = await CategoryModel.insertMany(seedCategories.map(cat => ({
        ...cat,
        icon: cat.icon || "📦" // Add default icon if missing
      })))
      console.log(`✅ Seeded ${categories.length} categories`)
    } else {
      console.log("📂 Categories already exist, skipping...")
    }

    // Verify final state
    const finalContent = await ContentModel.countDocuments()
    const finalCategories = await CategoryModel.countDocuments()
    
    console.log(`\n✅ Final state:`)
    console.log(`   - Content items: ${finalContent}`)
    console.log(`   - Categories: ${finalCategories}`)
    console.log(`   - Products: 0 (ready for fresh data)`)
    console.log(`   - Services: 0 (ready for fresh data)`)

    console.log("\n🎉 Content setup completed!")
    console.log("🚀 Application should now work without errors!")
    
    process.exit(0)
  } catch (error: any) {
    console.error("❌ Error seeding content:", error.message)
    process.exit(1)
  }
}

seedContentOnly()
