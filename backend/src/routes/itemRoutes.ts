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

// Items
router.get("/", getAllItems);
router.get("/:id", getItemById);
router.post("/", createItem);
router.put("/:id", updateItemController);
router.delete("/:id", deleteItemController);

// Stock ops
router.post("/:id/deposit", depositItemController);
router.post("/:id/withdraw", withdrawItemController);

// Logs
router.get("/:id/logs", getItemLogs);

export default router;
