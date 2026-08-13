import mongoose from "mongoose";

const ATLAS_URI =
  "mongodb+srv://kkengineering:KKEngg%40123@kkengineering.fz1z9yb.mongodb.net/kkengineering?retryWrites=true&w=majority";

async function checkCollections() {
  try {
    console.log("🔍 Checking collections...");

    await mongoose.connect(ATLAS_URI, {
      bufferCommands: false,
    });

    console.log("✅ Connected to Atlas!");
    console.log("🗄️ Database:", mongoose.connection.name);

    const collections = await mongoose.connection.db
      ?.listCollections()
      .toArray();
    console.log(`\n📊 Collections found: ${collections?.length || 0}`);

    if (collections && collections.length > 0) {
      for (const collection of collections) {
        const count = await mongoose.connection.db
          ?.collection(collection.name)
          .countDocuments();
        console.log(`   - ${collection.name}: ${count} documents`);
      }
    } else {
      console.log("📝 No collections found");
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

checkCollections();
