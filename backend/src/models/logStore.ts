// backend/src/data/logStore.ts
import { Log } from "../types/Log";

// in-memory store
export const logs: Log[] = [];

// simple auto-increment for id
let nextLogId = 1;

export function addLog(itemId: number, type: Log["type"], quantity: number, notes?: string): Log {
  const log: Log = {
    id: nextLogId++,
    itemId,
    type,
    quantity,
    date: new Date().toISOString(),
    ...(notes !== undefined ? { notes } : {}), // ✅ only include if provided
  };

  logs.push(log);
  return log;
}


export function getLogs(): Log[] {
  return logs;
}
