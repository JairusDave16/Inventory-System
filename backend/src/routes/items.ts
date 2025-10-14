import express from "express";
import {
  getAllItems,
  getItemById,
  createItem,
  depositItemController,
  withdrawItemController,
  updateItemController,
  deleteItemController,
  bulkDeleteItemsController,
} from "../controllers/itemController";
import { logController } from "../controllers/logController";

const router = express.Router();

// GET /api/items - Get all items
router.get("/", getAllItems);

// GET /api/items/:id - Get item by ID
router.get("/:id", getItemById);

// GET /api/items/:id/logs - Get logs for an item
router.get("/:id/logs", logController.getLogsByItem);

// POST /api/items - Create new item
router.post("/", createItem);

// PUT /api/items/:id/deposit - Deposit stock
router.put("/:id/deposit", depositItemController);

// PUT /api/items/:id/withdraw - Withdraw stock
router.put("/:id/withdraw", withdrawItemController);

// PUT /api/items/:id - Update item stock
router.put("/:id", updateItemController);

// DELETE /api/items/bulk - Bulk delete items
router.delete("/bulk", bulkDeleteItemsController);

// DELETE /api/items/:id - Delete item
router.delete("/:id", deleteItemController);

export default router;
