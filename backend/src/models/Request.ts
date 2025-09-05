export interface Request {
  id: number; // ✅ now number
  userId: number;
  itemId: number;
  quantity: number;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}
