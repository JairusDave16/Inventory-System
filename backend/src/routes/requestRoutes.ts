import { Router } from "express";
import {
  createRequestController,
  approveRequestController,
  fulfillRequestController,
  getRequestsController,
  getRequestLogsController,
} from "../controllers/requestController";

const router = Router();

// Create request
router.post("/", createRequestController);

// Get all requests
router.get("/", getRequestsController);

// Approve / reject
router.post("/:id/approve", approveRequestController);

// Fulfill (auto-withdraw inventory)
router.post("/:id/fulfill", fulfillRequestController);

// Logs
router.get("/:id/logs", getRequestLogsController);

export default router;
