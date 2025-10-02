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

  if (!user) {
    return res.status(400).json({ message: "User is required" });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "At least one item is required" });
  }

  try {
    const newReq = createRequest(user, items, notes || undefined);
    return res.status(201).json(newReq);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create request", error });
  }
}

// Approve or reject a request
export function approveRequestController(req: Request, res: Response) {
  const { id } = req.params;
  const { approver, approve, notes } = req.body;

  if (!approver) {
    return res.status(400).json({ message: "Approver is required" });
  }
  if (typeof approve !== "boolean") {
    return res.status(400).json({ message: "Approve must be a boolean (true or false)" });
  }

  const updated = approveRequest(Number(id), approver, approve, notes || undefined);

  if (!updated) {
    return res.status(404).json({ message: "Request not found" });
  }

  return res.json(updated);
}

// Fulfill
export function fulfillRequestController(req: Request, res: Response) {
  const { id } = req.params;
  const { actor, notes } = req.body;

  if (!actor) {
    return res.status(400).json({ message: "Actor is required to fulfill a request" });
  }

  const fulfilled = fulfillRequest(Number(id), actor, notes || undefined);

  if (!fulfilled) {
    return res
      .status(400)
      .json({ message: "Request not found, not approved, or unable to fulfill" });
  }

  return res.json(fulfilled);
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
