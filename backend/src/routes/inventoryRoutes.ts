// backend/src/routes/inventoryRoutes.ts
import { Router } from "express";
import {
  getAllItems,
  getItemById,
  createItem,
  depositItemController,
  withdrawItemController,
  updateItemController,
  getItemLogs,
  deleteItemController,
} from "../controllers/itemController";

const router = Router();

// GET all items
router.get("/", getAllItems);

// GET item by ID
router.get("/:id", getItemById);

// CREATE new item
router.post("/", createItem);

// DEPOSIT item
router.post("/:id/deposit", depositItemController);

// WITHDRAW item
router.post("/:id/withdraw", withdrawItemController);

// UPDATE stock directly
router.put("/:id", updateItemController);

// GET logs for an item
router.get("/:id/logs", getItemLogs);

// DELETE item
router.delete("/:id", deleteItemController);

export default router;
