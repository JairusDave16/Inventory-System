// backend/src/controllers/requestController.ts
import { Request, Response } from "express";
import {
  createRequest,
  approveRequest,
  fulfillRequest,
  getRequests,
  getRequestLogs,
} from "../services/requestService";

// Create request
export function createRequestController(req: Request, res: Response) {
  const { user, items, notes } = req.body;
  if (!user || !items) return res.status(400).json({ message: "User and items required" });

  const newReq = createRequest(user, items, notes);
  res.json(newReq);
}

// Approve or reject
export function approveRequestController(req: Request, res: Response) {
  const { id } = req.params;
  const { approver, approve, notes } = req.body;
  const updated = approveRequest(Number(id), approver, approve, notes);
  if (!updated) return res.status(404).json({ message: "Request not found" });
  res.json(updated);
}

// Fulfill
export function fulfillRequestController(req: Request, res: Response) {
  const { id } = req.params;
  const { actor, notes } = req.body;
  const fulfilled = fulfillRequest(Number(id), actor, notes);
  if (!fulfilled) return res.status(400).json({ message: "Request not found or not approved" });
  res.json(fulfilled);
}

// List requests
export function getRequestsController(_req: Request, res: Response) {
  res.json(getRequests());
}

// Request logs
export function getRequestLogsController(req: Request, res: Response) {
  const { id } = req.params;
  res.json(getRequestLogs(Number(id)));
}
