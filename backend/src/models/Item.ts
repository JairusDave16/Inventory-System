// item.ts

// 1. Item interface
export interface Item {
  id: string;          // required
  name: string;        // required
  description?: string;
  stock: number;       // required
  unit?: string;
  category?: string;
}

// 2. Helper function to create items with auto-generated IDs
export function createItem(data: Omit<Item, "id">): Item {
  return {
    id: crypto.randomUUID(), // auto-generate a unique ID
    ...data,
  };
}

// 3. In-memory inventory store
let inventory: Item[] = [];

// 4. Functions to manage inventory
export function addItem(data: Omit<Item, "id">): Item {
  const item = createItem(data);
  inventory.push(item);
  return item;
}

export function listItems(): Item[] {
  return inventory;
}

export function findItemById(id: string): Item | undefined {
  return inventory.find(item => item.id === id);
}

export function updateItem(id: string, updates: Partial<Omit<Item, "id">>): Item | undefined {
  const item = findItemById(id);
  if (item) {
    Object.assign(item, updates);
    return item;
  }
  return undefined;
}

export function removeItem(id: string): boolean {
  const index = inventory.findIndex(item => item.id === id);
  if (index !== -1) {
    inventory.splice(index, 1);
    return true;
  }
  return false;
}
