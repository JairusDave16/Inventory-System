// backend/src/services/logService.ts
import { Log } from "../types/Log";

let logs: Log[] = [];
let logId = 1;

export function addLog(
  itemId: number,
  type: "deposit" | "withdraw" | "update", // 👈 include update
  stock: number,
  notes?: string
): Log {
  const log: Log = {
    id: logId++,
    itemId,
    type,
    stock,
    date: new Date().toISOString(),
    ...(notes ? { notes } : {}), // optional notes
  };
  logs.push(log);
  return log;
}

export function getLogs(): Log[] {
  return logs;
}

export function getLogsByItem(itemId: number): Log[] {
  return logs.filter((log) => log.itemId === itemId);
}

export const logService = {
  addLog,
  getLogs,
  getLogsByItem,
};
