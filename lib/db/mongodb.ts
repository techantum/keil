import dns from "dns";
import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var myMongoose: MongooseCache;
}

const cached: MongooseCache = global.myMongoose || {
  conn: null,
  promise: null,
};

if (!global.myMongoose) {
  global.myMongoose = cached;
}

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  // mongodb+srv:// requires SRV DNS lookups; many Windows routers refuse them (querySrv ECONNREFUSED)
  if (MONGODB_URI.startsWith("mongodb+srv://")) {
    const servers = process.env.DNS_SERVERS?.split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    dns.setServers(servers?.length ? servers : ["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log(
      "🔗 Connecting to MongoDB:",
      MONGODB_URI.replace(/\/\/[^@]+@/, "//[credentials]@"),
    );
    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
    console.log(
      "✅ MongoDB connected successfully to:",
      cached.conn.connection.name,
    );
  } catch (e) {
    cached.promise = null;
    console.error("❌ MongoDB connection failed:", e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;
