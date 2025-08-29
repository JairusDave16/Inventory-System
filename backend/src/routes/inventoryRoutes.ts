import { Router } from "express";
import {
  getAllItems,
  getItemById,
  getItemsByCategory,
  createItem,
  updateItem,
  deleteItem,
  depositItem,
  withdrawItem,
} from "../controllers/inventoryController";

const router = Router();

// GET all items
router.get("/", getAllItems);

// GET items by category
router.get("/category/:category", getItemsByCategory);

// GET item by ID
router.get("/:id", getItemById);

// POST new item
router.post("/", createItem);

// PUT update item
router.put("/:id", updateItem);

// DELETE item
router.delete("/:id", deleteItem);

// POST deposit
router.post("/:id/deposit", depositItem);

// POST withdraw
router.post("/:id/withdraw", withdrawItem);


export default router;
