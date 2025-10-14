import api from "./axios";
import { Item, Log } from "../types";

// 🧩 Get all items with pagination
export const getItems = async (page: number = 1, limit: number = 10): Promise<{ items: Item[], pagination: any }> => {
  const res = await api.get(`/items?page=${page}&limit=${limit}`);
  return res.data.data; // ✅ unwrap .data from backend
};

// 🧾 Get logs for one item
export const getItemLogs = async (itemId: string): Promise<Log[]> => {
  const res = await api.get(`/logs/${itemId}`);
  return res.data; // ✅ logs endpoint returns data directly
};

// ➕ Create new item
export const createItem = async (data: Partial<Item>): Promise<Item> => {
  const res = await api.post("/items", data);
  return res.data.data; // ✅ unwrap .data
};

// ✏️ Update existing item
export const updateItem = async (id: string, data: Partial<Item>): Promise<Item> => {
  const res = await api.put(`/items/${id}`, data);
  return res.data.data; // ✅ unwrap .data
};

// 🔁 Deposit or Withdraw stock
export const adjustStock = async (
  id: string,
  type: "deposit" | "withdraw",
  quantity: number,
  notes?: string
): Promise<Item> => {
  try {
    const endpoint = type === "deposit"
      ? `/items/${id}/deposit`
      : `/items/${id}/withdraw`;

    const res = await api.put(endpoint, { quantity, notes });
    return res.data.data; // ✅ unwrap .data
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// ❌ Delete item
export const deleteItem = async (id: string) => {
  const res = await api.delete(`/items/${id}`);
  return res.data;
};

// 🗑️ Bulk delete items
export const bulkDeleteItems = async (ids: number[]) => {
  const res = await api.delete("/items/bulk", { data: { ids } });
  return res.data;
};
