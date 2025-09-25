// src/services/logService.ts
import { Log } from "../types/Log";

let logs: Log[] = [];
let logId = 1;

export const logService = {
  getAllLogs() {
    return logs;
  },

  getLogsByItem(itemId: number) {
    return logs.filter((log) => log.itemId === itemId);
  },

addLog(itemId: number, type: "deposit" | "withdraw" | "update", stock: number) {
  const newLog: Log = {
    id: logId++,
    itemId,
    type,                       
    stock,                   
    date: new Date().toISOString(),
  };

  logs.push(newLog);
  return newLog;
},


};
