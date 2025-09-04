// frontend/src/types/Item.ts
export interface Item {
  id: number;
  name: string;
  description?: string;
  unit?: string;
  category?: string;
  quantity: number;
  series?: string;
}
