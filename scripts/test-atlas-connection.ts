import connectDB from "@/lib/db/mongodb"

async function testAtlasConnection() {
  try {
    console.log("🔄 Testing MongoDB Atlas connection...")
    console.log("URI:", process.env.MONGODB_URI)
    
    const mongoose = await connectDB()
    console.log("✅ Successfully connected to MongoDB Atlas!")
    console.log("📊 Connection state:", mongoose.connection.readyState)
    console.log("🗄️ Database name:", mongoose.connection.name)
    
    // List collections
    const collections = await mongoose.connection.db?.listCollections().toArray()
    console.log(`📋 Found ${collections?.length || 0} collections`)
    
    if (collections && collections.length > 0) {
      console.log("📝 Collections:", collections.map(c => c.name))
    } else {
      console.log("🆕 Database is clean - ready for fresh data!")
    }
    
    process.exit(0)
  } catch (error: any) {
    console.error("❌ Connection failed:", error.message)
    process.exit(1)
  }
}

testAtlasConnection()
