// backend/src/types/Item.ts
export interface Item {
  id: number;
  name: string;
  description?: string;
  unit?: string;
  category?: string;
  stock: number;
  series?: string; // 👈 add this
}
