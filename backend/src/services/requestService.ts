// backend/src/services/requestService.ts
import { Request, RequestItem, RequestLog } from "../types/request";
import { withdrawItem } from "./itemService"; // already working

let requests: Request[] = [];
let requestLogs: RequestLog[] = [];
let requestId = 1;
let logId = 1;

// Create a request
export function createRequest(user: string, items: RequestItem[], notes?: string): Request {
  const req: Request = {
    id: requestId++,
    user,
    items,
    status: "submitted",
    createdAt: new Date().toISOString(),
  };
  requests.push(req);

  const log: RequestLog = {
    id: logId++,
    requestId: req.id,
    action: "submitted",
    user,
    date: new Date().toISOString(),
    ...(notes !== undefined ? { notes } : {}),
  };
  requestLogs.push(log);

  return req;
}

// Approve or reject a request
export function approveRequest(id: number, approver: string, approve: boolean, notes?: string): Request | null {
  const req = requests.find(r => r.id === id);
  if (!req) return null;

  req.status = approve ? "approved" : "rejected";

  const log: RequestLog = {
    id: logId++,
    requestId: req.id,
    action: approve ? "approved" : "rejected",
    user: approver,
    date: new Date().toISOString(),
    ...(notes !== undefined ? { notes } : {}),
  };
  requestLogs.push(log);

  return req;
}

// Fulfill request (auto-withdraw)
export function fulfillRequest(id: number, actor: string, notes?: string): Request | null {
  const req = requests.find(r => r.id === id);
  if (!req || req.status !== "approved") return null;

  // Try withdrawing stock for each item
  for (const item of req.items) {
    withdrawItem(item.itemId, item.quantity, `Request #${req.id}`);
  }

  req.status = "fulfilled";

  const log: RequestLog = {
    id: logId++,
    requestId: req.id,
    action: "fulfilled",
    user: actor,
    date: new Date().toISOString(),
    ...(notes !== undefined ? { notes } : {}),
  };
  requestLogs.push(log);

  return req;
}

// Fetch requests
export function getRequests(): Request[] {
  return requests;
}

// Fetch logs for a request
export function getRequestLogs(id: number): RequestLog[] {
  return requestLogs.filter(l => l.requestId === id);
}
