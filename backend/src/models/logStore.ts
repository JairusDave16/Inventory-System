import { Log } from "./Log";

let logs: Log[] = [];

export function addLog(log: Omit<Log, "id" | "date">): Log {
  const newLog: Log = {
    id: crypto.randomUUID(),
    date: new Date(),
    ...log,
  };
  logs.push(newLog);
  return newLog;
}

export function listLogs(): Log[] {
  return logs;
}

export function findLogsByItemId(itemId: string): Log[] {
  return logs.filter(log => log.itemId === itemId);
}
