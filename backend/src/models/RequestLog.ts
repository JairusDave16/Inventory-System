// backend/src/models/RequestLog.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IRequestLog extends Document {
  requestId: mongoose.Types.ObjectId;
  action: "pending" | "approved" | "rejected" | "fulfilled";
  user: string;
  date: Date;
  notes?: string;
}

const RequestLogSchema = new Schema<IRequestLog>({
  requestId: { type: Schema.Types.ObjectId, ref: "Request", required: true },
  action: { type: String, required: true },
  user: { type: String, required: true },
  date: { type: Date, default: Date.now },
  notes: { type: String },
});

export default mongoose.model<IRequestLog>("RequestLog", RequestLogSchema);
