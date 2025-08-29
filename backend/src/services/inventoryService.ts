import { InventoryItem } from "../types/inventory";

let inventory: InventoryItem[] = [];
let currentId = 1;

export class InventoryService {
  static getAll(): InventoryItem[] {
    // return shallow copy so external code can’t mutate internal state
    return [...inventory];
  }

  static getById(id: number): InventoryItem | null {
    const item = inventory.find((item) => item.id === id);
    // return a shallow copy if found
    return item ? { ...item } : null;
  }

  static getByCategory(category: string): InventoryItem[] {
    return inventory
      .filter((item) => item.category === category)
      .map((item) => ({ ...item })); // return copies
  }

 static create(data: Omit<InventoryItem, "id">): InventoryItem {
  const quantity = data.quantity ?? 0; // default to 0 if undefined

  if (quantity < 0) {
    throw new Error("Quantity cannot be negative");
  }

  const newItem: InventoryItem = {
    id: currentId++,
    ...data,
    quantity, // override with ensured value
  };

  inventory.push(newItem);
  return { ...newItem }; // return copy
}

  static update(id: number, data: Partial<Omit<InventoryItem, "id">>): InventoryItem | null {
  const item = inventory.find((i) => i.id === id);
  if (!item) return null;

  if (data.name !== undefined) {
    item.name = data.name;
  }

  if (data.quantity !== undefined) {
    const newQuantity = data.quantity ?? 0; // default to 0
    if (newQuantity < 0) {
      throw new Error("Quantity cannot be negative");
    }
    item.quantity = newQuantity;
  }

  return { ...item }; // return a copy
}

  static delete(id: number): InventoryItem {
  const index = inventory.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error(`Item with id ${id} not found`);
  }

  const [deleted] = inventory.splice(index, 1);

  if (!deleted) {
    throw new Error(`Unexpected error: failed to delete item with id ${id}`);
  }

  return { ...deleted }; // now guaranteed to be InventoryItem
}

static deposit(id: number, amount: number): InventoryItem {
    if (amount <= 0) {
      throw new Error("Deposit amount must be greater than zero");
    }

    const item = this.getById(id);
    if (!item) throw new Error(`Item with id ${id} not found`);

    item.quantity = (item.quantity ?? 0) + amount;

    return { ...item }; // return copy
  }

  static withdraw(id: number, amount: number): InventoryItem {
    if (amount <= 0) {
      throw new Error("Withdraw amount must be greater than zero");
    }

    const item = this.getById(id);
    if (!item) throw new Error(`Item with id ${id} not found`);

    if ((item.quantity ?? 0) < amount) {
      throw new Error(
        `Not enough stock to withdraw. Available: ${item.quantity}, Requested: ${amount}`
      );
    }

    item.quantity -= amount;

    return { ...item }; // return copy
  }

}
