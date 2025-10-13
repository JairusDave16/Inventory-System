// frontend/src/api/requests.ts
import api from "./axios";
import { Request } from "../types/request";

// Get all requests
export const getRequests = async (): Promise<Request[]> => {
  const res = await api.get("/requests");
  return res.data;
};

// Get single request
export const getRequestById = async (id: number): Promise<Request> => {
  const res = await api.get(`/requests/${id}`);
  return res.data;
};

// Create new request
export const createRequest = async (data: Partial<Request>): Promise<Request> => {
  const res = await api.post("/requests", data);
  return res.data;
};

// Delete a request
export const deleteRequest = async (id: number) => {
  const res = await api.delete(`/requests/${id}`);
  return res.data;
};

// Approve request
export const approveRequest = async (id: number): Promise<Request> => {
  const res = await api.put(`/requests/${id}/approve`);
  return res.data;
};

// Reject request
export const rejectRequest = async (id: number): Promise<Request> => {
  const res = await api.put(`/requests/${id}/reject`);
  return res.data;
};

// Bulk approve requests
export const bulkApproveRequests = async (ids: number[], approver?: string, notes?: string) => {
  const res = await api.put("/requests/bulk/approve", { ids, approver, notes });
  return res.data;
};

// Bulk reject requests
export const bulkRejectRequests = async (ids: number[], approver?: string, notes?: string) => {
  const res = await api.put("/requests/bulk/reject", { ids, approver, notes });
  return res.data;
};
