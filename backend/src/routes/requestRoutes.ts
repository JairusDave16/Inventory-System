import { Router } from "express";
import {
  createRequestController,
  approveRequestController,
  fulfillRequestController,
  getRequestsController,
  getRequestLogsController,
} from "../controllers/requestController";

const router = Router();

// 🟩 Get all requests
router.get("/", getRequestsController);

// 🟩 Create a new request
router.post("/", createRequestController);

// 🟩 Approve or reject a request
router.put("/:id/approve", approveRequestController);

// 🟩 Fulfill (withdraw inventory automatically)
router.put("/:id/fulfill", fulfillRequestController);

// 🟩 Get logs for a specific request
router.get("/:id/logs", getRequestLogsController);

export default router;
