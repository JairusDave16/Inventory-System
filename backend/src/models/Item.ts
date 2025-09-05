// backend/src/models/Item.ts
export interface Item {
  id: number; // ✅ now a number
  name: string;
  description?: string;
  unit?: string;
  category?: string;
  stock: number;
}
