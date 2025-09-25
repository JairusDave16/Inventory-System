// src/types/inventory.ts
export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;       // ✅ renamed from quantity → stock
  series?: string;     // still optional
}

// For creating a new item (id is auto-generated)
export type NewInventoryItem = Omit<InventoryItem, "id">;

// For updating (all fields optional)
export type UpdateInventoryItem = Partial<Omit<InventoryItem, "id">>;
