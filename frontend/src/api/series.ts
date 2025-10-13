// frontend/src/api/series.ts
import axios from "./axios"; // assuming you have a preconfigured axios instance

interface SeriesPayload {
  itemId: number;
  fromSeries: string;
  toSeries: string;
  quantity: number;
}

// Deposit series
export const depositSeries = async (payload: SeriesPayload) => {
  const res = await axios.post("/series", { ...payload, type: "deposit" });
  return res.data;
};

// Withdraw series
export const withdrawSeries = async (payload: SeriesPayload) => {
  const res = await axios.post("/series", { ...payload, type: "withdraw" });
  return res.data;
};

// Get series for a specific item
export const getSeriesByItem = async (itemId: number) => {
  const res = await axios.get(`/series/item/${itemId}`);
  return res.data;
};
