// types/inventory.ts
export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  series?: string;
}
