// frontend/src/types/Item.ts
export interface Item {
  id: string;
  name: string;
  stock: number;
  description?: string;  // ✅ add this to match backend
  unit?: string;
  category?: string;
}
