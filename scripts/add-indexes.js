const mongoose = require("mongoose");

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://kkengineering:KKEngg%40123@kkengineering.fz1z9yb.mongodb.net/kkengineering?retryWrites=true&w=majority";

async function addIndexes() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;

    // Add indexes to products collection
    const productsCollection = db.collection("products");

    console.log("Creating indexes on products collection...");

    // Index for category filtering (most common query)
    await productsCollection.createIndex({ category: 1 }, { background: true });
    console.log("✓ Created index on category");

    // Index for search queries
    await productsCollection.createIndex({ name: 1 }, { background: true });
    console.log("✓ Created index on name");

    await productsCollection.createIndex(
      { casNumber: 1 },
      { background: true },
    );
    console.log("✓ Created index on casNumber");

    // Compound index for category + inStock (for filtered queries)
    await productsCollection.createIndex(
      { category: 1, inStock: 1 },
      { background: true },
    );
    console.log("✓ Created compound index on category + inStock");

    // Index for sorting by createdAt
    await productsCollection.createIndex(
      { createdAt: -1 },
      { background: true },
    );
    console.log("✓ Created index on createdAt");

    // Text index for full-text search
    await productsCollection.createIndex(
      { name: "text", description: "text", casNumber: "text" },
      { background: true, weights: { name: 10, casNumber: 5, description: 1 } },
    );
    console.log("✓ Created text index for search");

    console.log("\nAll indexes created successfully!");

    // List all indexes
    const indexes = await productsCollection.indexes();
    console.log("\nCurrent indexes:", JSON.stringify(indexes, null, 2));
  } catch (error) {
    console.error("Error creating indexes:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\nDisconnected from MongoDB");
  }
}

addIndexes();
