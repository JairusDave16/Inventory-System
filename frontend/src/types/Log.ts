// frontend/src/types/Log.ts
export type Log = {
  id: number;
  itemId: number;
  type: "deposit" | "withdraw" | "update";
  stock: number;   // standardized from 'amount'
  date: string;    // standardized from 'timestamp'
};

