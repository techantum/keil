import connectDB from "../lib/db/mongodb"
import { ProductModel } from "../lib/db/models/Product"
import { CategoryModel } from "../lib/db/models/Category"
import { ServiceModel } from "../lib/db/models/Service"
import { ContentModel } from "../lib/db/models/Content"
import { seedProducts, seedCategories, seedServices } from "../lib/repo/seed-data"
import {
  seedHomePageContent,
  seedAboutPageContent,
  seedContactPageContent,
  seedFooterContent,
} from "../lib/repo/seed-content"

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...")
    await connectDB()
    console.log("Connected to MongoDB successfully!")

    // Clear existing data
    console.log("\nClearing existing data...")
    await ProductModel.deleteMany({})
    await CategoryModel.deleteMany({})
    await ServiceModel.deleteMany({})
    await ContentModel.deleteMany({})
    console.log("Existing data cleared!")

    // Seed Categories
    console.log("\nSeeding categories...")
    const categories = await CategoryModel.insertMany(seedCategories)
    console.log(`✓ Seeded ${categories.length} categories`)

    // Seed Products
    console.log("\nSeeding products...")
    const products = await ProductModel.insertMany(seedProducts)
    console.log(`✓ Seeded ${products.length} products`)

    // Seed Services
    console.log("\nSeeding services...")
    const services = await ServiceModel.insertMany(seedServices)
    console.log(`✓ Seeded ${services.length} services`)

    // Seed CMS Content
    console.log("\nSeeding CMS content...")
    await ContentModel.create([
      { type: "home", data: seedHomePageContent },
      { type: "about", data: seedAboutPageContent },
      { type: "contact", data: seedContactPageContent },
      { type: "footer", data: seedFooterContent },
    ])
    console.log("✓ Seeded CMS content (home, about, contact, footer)")

    console.log("\n✅ Database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
