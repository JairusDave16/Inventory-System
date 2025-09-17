// backend/src/data/store.ts
import { Item } from "../types/Item";
import { Log } from "../types/Log";
import { Request as RequestModel } from "../models/Request";
import { Series } from "../types/Series";

// Shared in-memory storage
export let items: Item[] = [];
export let logs: Log[] = [];
export let requests: RequestModel[] = [];
export let series: Series[] = [];

// Auto-increment counters (internal only)
let itemIdCounter = 1;
let logIdCounter = 1;
let requestIdCounter = 1;
let seriesIdCounter = 1;

// ✅ ID generator functions
export function getNextItemId() {
  return itemIdCounter++;
}

export function getNextLogId() {
  return logIdCounter++;
}

export function getNextRequestId() {
  return requestIdCounter++;
}

export function getNextSeriesId() {
  return seriesIdCounter++;
}
