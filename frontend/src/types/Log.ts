// frontend/src/types/Log.ts
export type Log = {
  id: number;
  itemId: number;
  type: "deposit" | "withdraw" | "update"; // include update since backend supports it
  stock: number;   // ✅ standardized from 'amount'
  date: string;    // ✅ standardized from 'timestamp'
};
