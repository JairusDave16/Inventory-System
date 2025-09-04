// src/services/inventoryService.ts
import { InventoryItem, NewInventoryItem } from "../types/inventory";
import { logService } from "./logService";

let items: InventoryItem[] = [];
let nextId = 1;

export const InventoryService = {
  getAll() {
    return items;
  },

  getById(id: number) {
    return items.find((item) => item.id === id);
  },

  create(data: NewInventoryItem) {
    const newItem: InventoryItem = { id: nextId++, ...data };
    items.push(newItem);

    // Log creation as a "deposit"
    logService.addLog(newItem.id, "deposit", data.quantity);

    return newItem;
  },

  deposit(id: number, amount: number) {
    const item = this.getById(id);
    if (!item) throw new Error("Item not found");

    item.quantity += amount;
    logService.addLog(item.id, "deposit", amount);

    return item;
  },

  withdraw(id: number, amount: number) {
    const item = this.getById(id);
    if (!item) throw new Error("Item not found");
    if (item.quantity < amount) throw new Error("Insufficient stock");

    item.quantity -= amount;
    logService.addLog(item.id, "withdraw", amount);

    return item;
  },

  getByCategory(category: string) {
  return items.filter(item => item.category === category);
},

update(id: number, data: Partial<NewInventoryItem>) {
  const item = this.getById(id);
  if (!item) return null;

  Object.assign(item, data);
  if (data.quantity !== undefined) {
    logService.addLog(item.id, "update", data.quantity);
  }

  return item;
},

delete(id: number) {
  const index = items.findIndex(i => i.id === id);
  if (index === -1) return null;
  const [deleted] = items.splice(index, 1);
  return deleted;
}

  
};
