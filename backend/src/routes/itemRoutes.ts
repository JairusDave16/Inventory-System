import { Router } from "express";
import {
  getAllItems,
  getItemById,
  createItem,
  depositItemController,
  withdrawItemController,
  updateItemController,
  deleteItemController,
} from "../controllers/itemController";

const router = Router();

// 📦 ITEM ROUTES
router.get("/", getAllItems);             // GET all items
router.get("/:id", getItemById);          // GET single item
router.post("/", createItem);             // CREATE new item
router.put("/:id/deposit", depositItemController);  // DEPOSIT stock
router.put("/:id/withdraw", withdrawItemController); // WITHDRAW stock
router.put("/:id", updateItemController); // UPDATE stock directly
router.delete("/:id", deleteItemController); // DELETE item

export default router;
