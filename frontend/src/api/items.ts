import api from "./axios";
import { Item, Log } from "../types";

// 🧩 Get all items
export const getItems = async (): Promise<Item[]> => {
  const res = await api.get("/items");
  return res.data.data; // ✅ unwrap .data from backend
};

// 🧾 Get logs for one item
export const getItemLogs = async (itemId: string): Promise<Log[]> => {
  const res = await api.get(`/items/${itemId}/logs`);
  return res.data.data || res.data; // ✅ fallback if backend doesn’t wrap logs
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
