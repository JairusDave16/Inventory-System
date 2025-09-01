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
    type: "deposit" | "withdraw" | "update",
    quantity: number,
    notes?: string
): Log => {
    const item = itemService.getById(itemId);
    if (!item) throw new Error("Item not found");

    if (type === "deposit") {
        itemService.adjustStock(itemId, quantity, "deposit");
    } else if (type === "withdraw") {
        itemService.adjustStock(itemId, quantity, "withdraw");
    }

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

    const log = logs[index]!;

    // Only rollback stock for deposit/withdraw logs
    if (log.type === "deposit") {
        itemService.adjustStock(log.itemId, -log.quantity, "deposit");
    } else if (log.type === "withdraw") {
        itemService.adjustStock(log.itemId, log.quantity, "withdraw");
    }

    logs.splice(index, 1);
    return true;
},


};
