// backend/src/types/Request.ts

export interface RequestItem {
  itemId: number;
  quantity: number;
}

export interface Request {
  id: number;
  user: string;
  items: RequestItem[];
  status: "pending" | "approved" | "rejected" | "fulfilled";
  createdAt: string;
}

export interface RequestLog {
  id: number;
  requestId: number;
  action: "pending" | "approved" | "rejected" | "fulfilled";
  user: string;
  notes?: string;
  date: string;
}
