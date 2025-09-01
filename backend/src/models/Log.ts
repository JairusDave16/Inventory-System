export interface Log {
  id: string;
  itemId: string;
  type: "deposit" | "withdraw" | "update"; // add "update"
  quantity: number;
  notes?: string;
  date: Date;
}
