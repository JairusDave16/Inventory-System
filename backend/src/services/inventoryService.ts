import { InventoryItem } from "../models/inventoryItem";

// In-memory store (replace with DB later)
let inventory: InventoryItem[] = [];

export const InventoryService = {
  getAll: () => inventory,

  getById: (id: number) => inventory.find(item => item.id === id),

  getByCategory: (category: string) =>
    inventory.filter(item => item.category === category),

  create: (data: Omit<InventoryItem, "id">) => {
    const newItem: InventoryItem = {
      id: inventory.length + 1,
      ...data,
    };
    inventory.push(newItem);
    return newItem;
  },

  update: (id: number, data: Partial<InventoryItem>) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return null;
    Object.assign(item, data);
    return item;
  },

  delete: (id: number) => {
    const index = inventory.findIndex(i => i.id === id);
    if (index === -1) return null;
    return inventory.splice(index, 1)[0];
  },
};
