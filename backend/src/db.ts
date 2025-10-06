// backend/src/db.ts
import mongoose from "mongoose";

const mongoURL = "mongodb://127.0.0.1:27017/inventorySystem"; // database name: inventorySystem

export async function connectDB() {
  try {
    await mongoose.connect(mongoURL);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}
