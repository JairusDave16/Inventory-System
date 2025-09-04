// backend/src/services/itemService.ts
import { v4 as uuidv4 } from "uuid";
import { Item } from "../types/Item";
import { Log } from "../types/Log";

// In-memory storage (replace later with DB or JSON persistence)
let items: Item[] = [];
let logs: Log[] = [];
let logId = 1; // global counter

// Utility: add a log entry
function addLog(itemId: number, type: Log["type"], quantity: number, notes?: string): void {
  const log: Log = {
    id: logId++, // number, auto-increment
    itemId,      // already number
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
export function depositItem(itemId: number, quantity: number, notes?: string): Item | null {
  const item = items.find(i => i.id === itemId);
  if (!item) return null;

  const q = Number(quantity);
  item.stock += q;
  addLog(item.id, "deposit", q, notes);
  console.log(`Deposited ${q} to ${item.name}, new stock: ${item.stock}`);
  return item;
}

export function withdrawItem(itemId: number, quantity: number, notes?: string): Item | null {
  const item = items.find(i => i.id === itemId);
  if (!item) return null;

  const q = Number(quantity);
  if (item.stock < q) throw new Error("Not enough stock");

  item.stock -= q;
  addLog(item.id, "withdraw", q, notes);
  console.log(`Withdrew ${q} from ${item.name}, new stock: ${item.stock}`);
  return item;
}

export function updateItemStock(itemId: number, newStock: number, notes?: string): Item | null {
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
