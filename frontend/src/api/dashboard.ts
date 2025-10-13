import axios from "./axios";

export const getDashboardStats = async () => {
  const response = await axios.get("/dashboard/stats");
  return response.data;
};
