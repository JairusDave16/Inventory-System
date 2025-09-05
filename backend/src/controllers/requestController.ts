import { Request as ExpressRequest, Response } from "express";
import { Request as RequestModel } from "../models/Request";

// In-memory storage for now
let requests: RequestModel[] = [];
let requestIdCounter = 1;

// Get all requests
export const getAllRequests = (req: ExpressRequest, res: Response) => {
  res.json(requests);
};

// Create new request
export const createRequest = (req: ExpressRequest, res: Response) => {
  const { userId, itemId, quantity } = req.body;

  const newRequest: RequestModel = {
    id: requestIdCounter++, // ✅ number id
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
  const id = Number(req.params.id); // ✅ convert param to number
  const request = requests.find((r) => r.id === id);

  if (!request) {
    return res.status(404).json({ error: "Request not found" });
  }

  res.json(request);
};

// Update request status
export const updateRequest = (req: ExpressRequest, res: Response) => {
  const id = Number(req.params.id); // ✅ convert param to number
  const request = requests.find((r) => r.id === id);

  if (!request) {
    return res.status(404).json({ error: "Request not found" });
  }

  const { status } = req.body;
  if (!["pending", "approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  request.status = status as "pending" | "approved" | "rejected";
  request.updatedAt = new Date();

  res.json(request);
};

// Delete request
export const deleteRequest = (req: ExpressRequest, res: Response) => {
  const id = Number(req.params.id); // ✅ convert param to number
  requests = requests.filter((r) => r.id !== id);
  res.status(204).send();
};
