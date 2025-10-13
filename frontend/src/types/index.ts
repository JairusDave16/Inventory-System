// frontend/src/types/index.ts
export * from "./Item";
export * from "./Log";

export interface Activity {
  id: number;
  action: string;
  itemName: string;
  user?: string;
  date: string;
  type: "item" | "request";
}

export interface DashboardStats {
  totalItems: number;
  pendingRequests: number;
  lowStockItems: {
    id: number;
    name: string;
    stock: number;
    category?: string;
  }[];
  recentActivities: Activity[];
}
