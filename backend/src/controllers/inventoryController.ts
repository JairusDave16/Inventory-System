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
    const { name, category, stock, series } = req.body;

    if (!name || !category || stock === undefined) {
      return sendResponse(res, 400, false, "Name, category, and stock are required");
    }

    const newItem = InventoryService.create({ name, category, stock, series });
    sendResponse(res, 201, true, "Item created successfully", newItem);
  } catch (error: any) {
    sendResponse(res, 500, false, error.message || "Failed to create item");
  }
};


// UPDATE item
export const updateItem = async (req: Request, res: Response) => {
  try {
    const { name, category, stock, series } = req.body;

    const updatedItem = InventoryService.update(Number(req.params.id), {
      name,
      category,
      stock,
      series,
    });

    if (!updatedItem) {
      return sendResponse(res, 404, false, "Item not found");
    }

    sendResponse(res, 200, true, "Item updated successfully", updatedItem);
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

// DEPOSIT item
export const depositItem = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const amount = Number(req.body.amount);

  if (isNaN(id) || isNaN(amount)) {
    return sendResponse(res, 400, false, "Invalid ID or amount");
  }

  try {
    const updatedItem = InventoryService.deposit(id, amount);
    sendResponse(res, 200, true, `Deposited ${amount} to item ${id}`, updatedItem);
  } catch (err: any) {
    sendResponse(res, 400, false, err.message);
  }
};

// WITHDRAW item
export const withdrawItem = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const amount = Number(req.body.amount);

  if (isNaN(id) || isNaN(amount)) {
    return sendResponse(res, 400, false, "Invalid ID or amount");
  }

  try {
    const updatedItem = InventoryService.withdraw(id, amount);
    sendResponse(res, 200, true, `Withdrew ${amount} from item ${id}`, updatedItem);
  } catch (err: any) {
    sendResponse(res, 400, false, err.message);
  }
};

