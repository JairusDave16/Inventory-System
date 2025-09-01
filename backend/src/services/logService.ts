import { v4 as uuidv4 } from "uuid";
import { itemService } from "./itemService";
import { Log } from "../models/Log";

let logs: Log[] = [];

export const logService = {
  getAll: (): Log[] => logs,

  getByItem: (itemId: string): Log[] =>
    logs.filter(log => log.itemId === itemId),

  create: (
    itemId: string,
    type: "deposit" | "withdraw",
    quantity: number,
    notes?: string
  ): Log => {
    const item = itemService.getById(itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    if (type === "withdraw" && item.stock < quantity) {
      throw new Error("Insufficient stock to withdraw");
    }

    // Adjust stock (positive for deposit, negative for withdraw)
    itemService.adjustStock(itemId, type === "deposit" ? quantity : -quantity);

    const log: Log = {
      id: uuidv4(),
      itemId,
      type,
      quantity,
      notes: notes || "",
      date: new Date(),
    };

    logs.push(log);
    return log;
  },

  delete: (id: string): boolean => {
  const index = logs.findIndex(l => l.id === id);
  if (index === -1) return false;

  // Rollback stock when a log is deleted
  const log = logs[index]!; // non-null assertion, safe because of check above
  itemService.adjustStock(
    log.itemId,
    log.type === "deposit" ? -log.quantity : log.quantity
  );

  logs.splice(index, 1);
  return true;
},

};
