// backend/src/types/Log.ts
export type Log = {
  id: string;
  itemId: string;
  type: "deposit" | "withdraw" | "update";
  quantity: number;
  notes?: string;
  date: string; // serialized ISO string from backend
};
