import { Request as ExpressRequest, Response } from "express";
import { Request as RequestModel } from "../models/Request";
import { Item } from "../types/Item";

// 🔹 Import shared store
import { items, requests, getNextRequestId } from "../data/store";

// 🔹 Shared validation helper
function findAndValidateRequest(id: number) {
  const request = requests.find((r) => r.id === id);

  if (!request) {
    return { error: { status: 404, message: "Request not found" } };
  }

  if (request.status !== "pending") {
    return { error: { status: 400, message: "Request already processed" } };
  }

  return { request };
}

// Get all requests
export const getAllRequests = (_req: ExpressRequest, res: Response) => {
  res.json(requests);
};

// Create new request
export const createRequest = (req: ExpressRequest, res: Response) => {
  const { userId, itemId, quantity } = req.body;

  const newRequest: RequestModel = {
    id: getNextRequestId(),   // ✅ use global generator
    userId: Number(userId),
    itemId: Number(itemId),
    quantity: Number(quantity),
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  requests.push(newRequest);
  res.status(201).json(newRequest);
};

// Get single request
export const getRequestById = (req: ExpressRequest, res: Response) => {
  const id = Number(req.params.id);
  const request = requests.find((r) => r.id === id);

  if (!request) {
    return res.status(404).json({ error: "Request not found" });
  }

  res.json(request);
};

// Delete request
export const deleteRequest = (req: ExpressRequest, res: Response) => {
  const id = Number(req.params.id);
  const index = requests.findIndex((r) => r.id === id);
  if (index === -1) return res.status(404).json({ error: "Request not found" });

  requests.splice(index, 1);
  res.status(204).send();
};

// Approve request
export const approveRequest = (req: ExpressRequest, res: Response) => {
  const id = Number(req.params.id);
  const { request, error } = findAndValidateRequest(id);
  if (error) return res.status(error.status).json({ error: error.message });

  const item = items.find((i: Item) => i.id === request!.itemId);
  if (!item) {
    return res.status(404).json({ error: "Item not found" });
  }
  if (item.stock < request!.quantity) {
    return res.status(400).json({ error: "Not enough stock" });
  }

  // ✅ Deduct stock
  item.stock -= request!.quantity;

  // ✅ Update request
  request!.status = "approved";
  request!.updatedAt = new Date();

  res.json({
    message: "Request approved and stock updated successfully",
    request,
    item,
  });
};

// Reject request
export const rejectRequest = (req: ExpressRequest, res: Response) => {
  const id = Number(req.params.id);
  const { request, error } = findAndValidateRequest(id);
  if (error) return res.status(error.status).json({ error: error.message });

  request!.status = "rejected";
  request!.updatedAt = new Date();

  res.json({
    message: "Request rejected successfully",
    request,
  });
};
