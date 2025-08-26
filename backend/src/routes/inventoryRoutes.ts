import { Router } from "express";
import {
  getAllItems,
  getItemById,
  getItemsByCategory,
  createItem,
  updateItem,
  deleteItem
} from "../controllers/inventoryController";

const router = Router();

// GET all items
router.get("/", getAllItems);

// GET item by ID
router.get("/:id", getItemById);

// GET items by category
router.get("/category/:category", getItemsByCategory);

// POST new item
router.post("/", createItem);

// PUT update item
router.put("/:id", updateItem);

// DELETE item
router.delete("/:id", deleteItem);

export default router;
