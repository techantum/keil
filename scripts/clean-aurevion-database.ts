import mongoose from "mongoose";
import { ProductModel } from "@/lib/db/models/Product";
import { ServiceModel } from "@/lib/db/models/Service";
import { CategoryModel } from "@/lib/db/models/Category";
import { ContentModel } from "@/lib/db/models/Content";
import { EnquiryModel } from "@/lib/db/models/Enquiry";

const ATLAS_URI =
  "mongodb+srv://kkengineering:KKEngg%40123@kkengineering.fz1z9yb.mongodb.net/kkengineering?retryWrites=true&w=majority";

async function cleankkengineeringDatabase() {
  try {
    console.log("🔄 Connecting to MongoDB Atlas kkengineering database...");

    await mongoose.connect(ATLAS_URI, {
      bufferCommands: false,
    });

    console.log("✅ Connected to Atlas cluster!");
    console.log("🗄️ Database:", mongoose.connection.name);
    console.log("🔗 Host:", mongoose.connection.host);

    // Count existing data
    const productCount = await ProductModel.countDocuments();
    const serviceCount = await ServiceModel.countDocuments();
    const categoryCount = await CategoryModel.countDocuments();
    const contentCount = await ContentModel.countDocuments();
    const enquiryCount = await EnquiryModel.countDocuments();

    console.log(`\n📊 Current data in kkengineering database:`);
    console.log(`   - Products: ${productCount}`);
    console.log(`   - Services: ${serviceCount}`);
    console.log(`   - Categories: ${categoryCount}`);
    console.log(`   - Content: ${contentCount}`);
    console.log(`   - Enquiries: ${enquiryCount}`);

    // Show sample products if they exist
    if (productCount > 0) {
      const sampleProducts = await ProductModel.find({}, "name").limit(3);
      console.log(`\n📝 Sample products found:`);
      sampleProducts.forEach((p) => console.log(`   - ${p.name}`));
    }

    // Clear all collections
    console.log(`\n🗑️ Clearing all data from kkengineering database...`);

    if (productCount > 0) {
      await ProductModel.deleteMany({});
      console.log("✅ Products cleared");
    }

    if (serviceCount > 0) {
      await ServiceModel.deleteMany({});
      console.log("✅ Services cleared");
    }

    if (categoryCount > 0) {
      await CategoryModel.deleteMany({});
      console.log("✅ Categories cleared");
    }

    if (contentCount > 0) {
      await ContentModel.deleteMany({});
      console.log("✅ Content cleared");
    }

    if (enquiryCount > 0) {
      await EnquiryModel.deleteMany({});
      console.log("✅ Enquiries cleared");
    }

    // Verify cleanup
    const finalProductCount = await ProductModel.countDocuments();
    const finalServiceCount = await ServiceModel.countDocuments();
    const finalCategoryCount = await CategoryModel.countDocuments();
    const finalContentCount = await ContentModel.countDocuments();
    const finalEnquiryCount = await EnquiryModel.countDocuments();

    console.log(`\n✓ Final verification - Remaining data:`);
    console.log(`   - Products: ${finalProductCount}`);
    console.log(`   - Services: ${finalServiceCount}`);
    console.log(`   - Categories: ${finalCategoryCount}`);
    console.log(`   - Content: ${finalContentCount}`);
    console.log(`   - Enquiries: ${finalEnquiryCount}`);

    console.log(`\n🎉 kkengineering database completely cleaned!`);
    console.log(`🆕 Ready for fresh data creation!`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

cleankkengineeringDatabase();
