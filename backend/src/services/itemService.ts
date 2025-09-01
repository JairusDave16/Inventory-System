import { Item } from "../models/Item";
import { v4 as uuidv4 } from "uuid";

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
  return newItem;
},

update: (id: string, data: Partial<Omit<Item, "id" | "stock">>): Item | null => {
  const index = items.findIndex(i => i.id === id);
  if (index === -1) return null;

  const item = items[index]!; // ✅ safe because index !== -1

  if (data.name !== undefined) item.name = data.name;
  if (data.description !== undefined) item.description = data.description;
  if (data.unit !== undefined) item.unit = data.unit;
  if (data.category !== undefined) item.category = data.category;

  items[index] = item;
  return item;
},

  delete: (id: string): boolean => {
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return false;
    items.splice(index, 1);
    return true;
  },

  adjustStock: (id: string, quantity: number): Item | null => {
    const item = items.find(i => i.id === id);
    if (!item) return null;
    item.stock += quantity;
    return item;
  }
};
