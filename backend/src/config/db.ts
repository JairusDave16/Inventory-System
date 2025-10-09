// backend/src/db.ts
import mongoose from "mongoose";

export async function connectDB() {
  try {
    const uri = "mongodb://127.0.0.1:27017/inventory_system"; // local MongoDB
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected successfully!");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}
