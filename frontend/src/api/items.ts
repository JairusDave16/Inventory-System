import api from "./axios";
import { Item, Log } from "../types";

export const getItems = async (): Promise<Item[]> => {
  const res = await api.get("/items");
  return res.data;
};

export const getItemLogs = async (itemId: string): Promise<Log[]> => {
  const res = await api.get(`/items/${itemId}/logs`);
  return res.data;
};

export const createItem = async (data: Partial<Item>): Promise<Item> => {
  const res = await api.post("/items", data);
  return res.data;
};

export const updateItem = async (id: string, data: Partial<Item>): Promise<Item> => {
  const res = await api.put(`/items/${id}`, data);
  return res.data;
};

// Adjust stock for an item (deposit or withdraw)
export const adjustStock = async (
  id: string,
  type: "deposit" | "withdraw",
  quantity: number,
  notes?: string
): Promise<Item> => {
  try {
    const res = await api.post(`/items/${id}/adjust`, { type, quantity, notes });
    return res.data;
  } catch (error: any) {
    // Pass along backend error to frontend handler
    throw error.response?.data || error;
  }
};


export const deleteItem = async (id: string) => {
  const res = await api.delete(`/items/${id}`);
  return res.data;
};
