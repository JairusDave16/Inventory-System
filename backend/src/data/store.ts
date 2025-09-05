// backend/src/data/store.ts
import { Item } from "../types/Item";
import { Log } from "../types/Log";

// Shared in-memory storage
export let items: Item[] = [];
export let logs: Log[] = [];

export let itemIdCounter = 1;
export let logIdCounter = 1;
