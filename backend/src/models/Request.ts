// backend/src/models/Request.ts
import mongoose, { Schema, Document } from "mongoose";

// 1️⃣ Define the interface for TypeScript
export interface Request extends Document {
  userId: number;
  itemId: number;
  quantity: number;
  status: "pending" | "approved" | "rejected" | "fulfilled";
  approver?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2️⃣ Define the schema
const RequestSchema = new Schema<Request>({
  userId: { type: Number, required: true },
  itemId: { type: Number, required: true },
  quantity: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "fulfilled"],
    default: "pending",
  },
  approver: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// 3️⃣ Automatically update `updatedAt` before saving
RequestSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// 4️⃣ Export model
const RequestModel = mongoose.model<Request>("Request", RequestSchema);

export default RequestModel;
