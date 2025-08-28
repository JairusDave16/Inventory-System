export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  series?: string; // this one can remain optional
}
