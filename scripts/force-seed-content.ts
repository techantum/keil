import mongoose from "mongoose";
import { ContentModel } from "@/lib/db/models/Content";
import {
  seedHomePageContent,
  seedAboutPageContent,
  seedContactPageContent,
  seedFooterContent,
} from "@/lib/repo/seed-content";

const ATLAS_URI =
  "mongodb+srv://kkengineering:KKEngg%40123@kkengineering.fz1z9yb.mongodb.net/kkengineering?retryWrites=true&w=majority";

async function forceSeedContent() {
  try {
    console.log("🔄 Connecting to MongoDB Atlas...");
    await mongoose.connect(ATLAS_URI, {
      bufferCommands: false,
    });
    console.log("✅ Connected successfully!");

    // Clear existing content first
    console.log("🗑️ Clearing existing content...");
    await ContentModel.deleteMany({});

    console.log("📝 Creating new content...");

    try {
      const homeContent = await ContentModel.create({
        type: "home",
        data: seedHomePageContent,
      });
      console.log("✅ Home content created:", homeContent._id);
    } catch (error: any) {
      console.error("❌ Home content error:", error.message);
    }

    try {
      const aboutContent = await ContentModel.create({
        type: "about",
        data: seedAboutPageContent,
      });
      console.log("✅ About content created:", aboutContent._id);
    } catch (error: any) {
      console.error("❌ About content error:", error.message);
    }

    try {
      const contactContent = await ContentModel.create({
        type: "contact",
        data: seedContactPageContent,
      });
      console.log("✅ Contact content created:", contactContent._id);
    } catch (error: any) {
      console.error("❌ Contact content error:", error.message);
    }

    try {
      const footerContent = await ContentModel.create({
        type: "footer",
        data: seedFooterContent,
      });
      console.log("✅ Footer content created:", footerContent._id);
    } catch (error: any) {
      console.error("❌ Footer content error:", error.message);
    }

    // Verify creation
    const finalCount = await ContentModel.countDocuments();
    console.log(`\n📊 Final content count: ${finalCount}`);

    const allContent = await ContentModel.find({});
    console.log(
      "📋 Content types:",
      allContent.map((c) => c.type),
    );

    await mongoose.connection.close();
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

forceSeedContent();
