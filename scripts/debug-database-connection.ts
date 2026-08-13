import mongoose from "mongoose";
import { ContentModel } from "@/lib/db/models/Content";

const ATLAS_URI =
  "mongodb+srv://kkengineering:KKEngg%40123@kkengineering.fz1z9yb.mongodb.net/kkengineering?retryWrites=true&w=majority";

async function debugDatabaseConnection() {
  try {
    console.log("🔍 Debugging database connection...");

    await mongoose.connect(ATLAS_URI, {
      bufferCommands: false,
    });

    console.log("✅ Connected to Atlas!");
    console.log("🗄️ Database:", mongoose.connection.name);
    console.log("🔗 Host:", mongoose.connection.host);

    // Check content directly
    const content = await ContentModel.find({});
    console.log(`\n📊 Content found: ${content.length}`);

    content.forEach((item) => {
      console.log(`   - Type: ${item.type}`);
    });

    // Test specific content queries
    const homeContent = await ContentModel.findOne({ type: "home" });
    const footerContent = await ContentModel.findOne({ type: "footer" });

    console.log(`\n🏠 Home content exists: ${!!homeContent}`);
    console.log(`🦶 Footer content exists: ${!!footerContent}`);

    if (homeContent) {
      console.log(
        `📝 Home content data keys: ${Object.keys(homeContent.data || {})}`,
      );
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

debugDatabaseConnection();
