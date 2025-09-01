// src/models/Log.ts
export interface Log {
  id: string;
  itemId: string;
  type: "deposit" | "withdraw"; // instead of action
  quantity: number;
  notes?: string;
  date: Date;
}
