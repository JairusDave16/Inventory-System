import { Log } from "../types/Log";

let logs: Log[] = [];
let nextId = 1;

export const logService = {
  getLogsByItem(itemId: number): Log[] {
    return logs.filter(log => log.itemId === itemId);
  },

  addLog(itemId: number, action: "deposit" | "withdraw", amount: number): Log {
    const newLog: Log = {
      id: nextId++,
      itemId,
      action,
      amount,
      createdAt: new Date(),
    };
    logs.push(newLog);
    return newLog;
  },

  getAllLogs(): Log[] {
    return logs;
  },
};
