import { InventoryItem } from "../types/inventory";

let inventory: InventoryItem[] = [];
let currentId = 1;

export class InventoryService {
  static getAll(): InventoryItem[] {
    return inventory;
  }

static getById(id: number): InventoryItem | null {
  const item = inventory.find((item) => item.id === id);
  return item !== undefined ? item : null;
}

  static getByCategory(category: string): InventoryItem[] {
    return inventory.filter((item) => item.category === category);
  }

  static create(data: Omit<InventoryItem, "id">): InventoryItem {
    const newItem: InventoryItem = {
      id: currentId++,
      ...data,
    };
    inventory.push(newItem);
    return newItem;
  }

  static update(id: number, data: Partial<Omit<InventoryItem, "id">>): InventoryItem | null {
    const index = inventory.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const updated: InventoryItem = {
      ...inventory[index], // keep old values
      ...data,             // overwrite with new values
      id,                  // ensure id always exists
    };

    inventory[index] = updated;
    return updated;
  }

 static delete(id: number): InventoryItem | null {
  const index = inventory.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const [deleted] = inventory.splice(index, 1);
  return deleted ?? null;
}

}
