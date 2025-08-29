// backend/src/types/Log.ts

export type Log = {
  id: number;
  itemId: number;         // foreign key to inventory
  action: "deposit" | "withdraw";
  amount: number;
  createdAt: Date;        // real Date object in backend
};
