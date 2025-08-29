// src/routes/logRoutes.ts
import { Router } from "express";
import { logController } from "../controllers/logController";

const router = Router();

// Get all logs
router.get("/", logController.getAllLogs);

// Get logs by itemId
router.get("/:itemId", logController.getLogsByItem);

// Add a log for a specific item
router.post("/:itemId", logController.addLog);

export default router;
