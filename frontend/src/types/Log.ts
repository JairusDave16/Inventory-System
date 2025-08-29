// frontend/src/types/Log.ts
export type Log = {
  id: number;
  itemId: number;
  action: "deposit" | "withdraw";
  amount: number;
  createdAt: string;
};
