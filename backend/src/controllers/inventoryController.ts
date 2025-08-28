// src/controllers/inventoryController.ts
import { Request, Response } from "express";
import { InventoryService } from "../services/inventoryService";

// ✅ Utility for consistent responses
const sendResponse = (
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data?: any
) => {
  res.status(status).json({ success, message, data });
};

// GET all items
export const getAllItems = async (_req: Request, res: Response) => {
  try {
    const items = InventoryService.getAll();
    sendResponse(res, 200, true, "Items retrieved successfully", items);
  } catch (error: any) {
    sendResponse(res, 500, false, error.message || "Failed to fetch items");
  }
};

// GET item by ID
export const getItemById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return sendResponse(res, 400, false, "Invalid item ID");

    const item = InventoryService.getById(id);
    if (!item) return sendResponse(res, 404, false, "Item not found");

    sendResponse(res, 200, true, "Item retrieved successfully", item);
  } catch (error: any) {
    sendResponse(res, 500, false, error.message || "Failed to fetch item");
  }
};

// GET items by category
export const getItemsByCategory = async (req: Request, res: Response) => {
  try {
    const category = req.params.category;
    if (!category) {
      return sendResponse(res, 400, false, "Category is required");
    }

    const items = InventoryService.getByCategory(category);
    sendResponse(res, 200, true, "Items retrieved successfully", items);
  } catch (error: any) {
    sendResponse(res, 500, false, error.message || "Failed to fetch items");
  }
};

// CREATE new item
export const createItem = async (req: Request, res: Response) => {
  try {
    const { name, category, quantity, series } = req.body;

    if (!name || !category || quantity === undefined) {
      return sendResponse(res, 400, false, "Name, category, and quantity are required");
    }

    const newItem = InventoryService.create({ name, category, quantity, series });
    sendResponse(res, 201, true, "Item created successfully", newItem);
  } catch (error: any) {
    sendResponse(res, 500, false, error.message || "Failed to create item");
  }
};

// UPDATE item
export const updateItem = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return sendResponse(res, 400, false, "Invalid item ID");

    const updated = InventoryService.update(id, req.body);
    if (!updated) return sendResponse(res, 404, false, "Item not found");

    sendResponse(res, 200, true, "Item updated successfully", updated);
  } catch (error: any) {
    sendResponse(res, 500, false, error.message || "Failed to update item");
  }
};

// DELETE item
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return sendResponse(res, 400, false, "Invalid item ID");

    const deleted = InventoryService.delete(id);
    if (!deleted) return sendResponse(res, 404, false, "Item not found");

    sendResponse(res, 200, true, "Item deleted successfully", deleted);
  } catch (error: any) {
    sendResponse(res, 500, false, error.message || "Failed to delete item");
  }
};
