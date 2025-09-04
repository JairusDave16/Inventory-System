// backend/src/types/Log.ts
export type Log = {
  id: number; // now number
  itemId: number; // now number
  type: "deposit" | "withdraw" | "update";
  quantity: number;
  notes?: string;
  date: string; // ISO string from backend
};
