// backend/src/services/itemService.ts
import { v4 as uuidv4 } from "uuid";
import { Item } from "../types/Item";
import { Log } from "../types/Log";

// In-memory storage (replace later with DB or JSON persistence)
let items: Item[] = [];
let logs: Log[] = [];

// Utility: add a log entry
function addLog(itemId: string, type: Log["type"], quantity: number, notes?: string): void {
  const log: Log = {
  id: uuidv4(),
  itemId,
  type,
  quantity,
  date: new Date().toISOString(),
  ...(notes ? { notes } : {}), // ✅ only include notes if provided
};
  logs.push(log);
}

// Get all items
export function getItems(): Item[] {
  return items;
}

// Add a new item
export function addItem(item: Item): Item {
  items.push(item);
  addLog(item.id, "deposit", item.stock, "Initial stock");
  return item;
}

// Deposit stock
export function depositItem(itemId: string, quantity: number, notes?: string): Item | null {
  const item = items.find(i => i.id === itemId);
  if (!item) return null;

  item.stock += quantity;
  addLog(item.id, "deposit", quantity, notes);
  return item;
}

// Withdraw stock
export function withdrawItem(itemId: string, quantity: number, notes?: string): Item | null {
  const item = items.find(i => i.id === itemId);
  if (!item) return null;

  if (item.stock < quantity) throw new Error("Not enough stock");
  item.stock -= quantity;
  addLog(item.id, "withdraw", quantity, notes);
  return item;
}

// Update stock directly (manual correction)
export function updateItemStock(itemId: string, newStock: number, notes?: string): Item | null {
  const item = items.find(i => i.id === itemId);
  if (!item) return null;

  const diff = newStock - item.stock;
  item.stock = newStock;
  addLog(item.id, "update", diff, notes || "Manual adjustment");
  return item;
}

// Get logs
export function getLogs(): Log[] {
  return logs;
}
