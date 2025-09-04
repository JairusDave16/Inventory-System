// frontend/src/types/Log.ts
export type Log = {
  id: number;
  itemId: number;
  type: "deposit" | "withdraw";
  amount: number;
  timestamp: string;
}