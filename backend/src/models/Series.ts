// backend/src/models/Series.ts
export interface Series {
  id: number;
  itemId: number;     // link to the Item
  from: number;       // starting series number
  to: number;         // ending series number
  status: "available" | "withdrawn"; // track usage
  createdAt: Date;
}
