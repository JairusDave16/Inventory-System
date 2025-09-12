// backend/src/data/store.ts
import { Item } from "../types/Item";
import { Log } from "../types/Log";
import { Request as RequestModel } from "../models/Request";
import { Series } from "../types/Series"; // 🔹 new type

// Shared in-memory storage
export let items: Item[] = [];
export let logs: Log[] = [];
export let requests: RequestModel[] = [];
export let series: Series[] = []; // 🔹 new

// Auto-increment counters
export let itemIdCounter = 1;
export let logIdCounter = 1;
export let requestIdCounter = 1;
export let seriesIdCounter = 1; // 🔹 new
