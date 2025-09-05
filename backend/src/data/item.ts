// backend/src/data/items.ts
import { Item } from "../models/Item";
import { Log } from "../models/Log";

// In-memory storage
export let items: Item[] = [];
export let logs: Log[] = [];

let itemIdCounter = 1;
let logIdCounter = 1;

// Generate next item ID
export function nextItemId(): number {
  return itemIdCounter++;
}

// Utility: add a log entry
export function addLog(
  itemId: number,
  type: "deposit" | "withdraw" | "update",
  quantity: number,
  notes?: string
) {
  logs.push({
    id: logIdCounter++,
    itemId,
    type,
    quantity,
    notes: notes ?? "",
    date: new Date().toISOString(),
  });
}
