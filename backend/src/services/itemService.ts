import { Item } from "../models/Item";
import { v4 as uuidv4 } from "uuid";
import { logService } from "./logService";

let items: Item[] = [];

export const itemService = {
  getAll: (): Item[] => items,

  getById: (id: string): Item | undefined => items.find(i => i.id === id),

  create: (data: Omit<Item, "id" | "stock">): Item => {
    const newItem: Item = {
      id: uuidv4(),
      name: data.name,
      description: data.description ?? "",
      stock: 0,
      ...(data.unit ? { unit: data.unit } : {}),
      ...(data.category ? { category: data.category } : {}),
    };
    items.push(newItem);

    // Log creation
    logService.create(newItem.id, "deposit", 0, "Initial creation");

    return newItem;
  },

  update: (id: string, data: Partial<Omit<Item, "id" | "stock">>): Item | null => {
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return null;

    const item = items[index]!; // non-null assertion

    if (data.name !== undefined) item.name = data.name;
    if (data.description !== undefined) item.description = data.description;
    if (data.unit !== undefined) item.unit = data.unit;
    if (data.category !== undefined) item.category = data.category;

    items[index] = item;

    // Log update
    logService.create(item.id, "update", 0, "Item details updated");

    return item;
  },

  adjustStock: (id: string, quantity: number, type: "deposit" | "withdraw"): Item | null => {
    const item = items.find(i => i.id === id);
    if (!item) return null;

    if (type === "withdraw" && item.stock < quantity) {
      throw new Error("Insufficient stock to withdraw");
    }

    item.stock += type === "deposit" ? quantity : -quantity;

    // Log the stock change
    logService.create(item.id, type, quantity);

    return item;
  },

  delete: (id: string): boolean => {
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return false;

    const item = items[index]!;

    // Rollback stock for all logs of this item (optional)
    const itemLogs = logService.getByItem(item.id);
    itemLogs.forEach(log => {
      item.stock -= log.type === "deposit" ? log.quantity : -log.quantity;
    });

    items.splice(index, 1);
    return true;
  },
};
