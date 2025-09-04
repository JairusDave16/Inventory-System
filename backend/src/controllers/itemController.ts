// src/controllers/itemController.ts
import { Request, Response } from "express";
import {
  getItems,
  addItem,
  depositItem,
  withdrawItem,
  updateItemStock,
  getLogs,
} from "../services/itemService";
import { Item } from "../types/Item";

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
export const getAllItems = (_req: Request, res: Response) => {
  const items = getItems();
  sendResponse(res, 200, true, "Items retrieved successfully", items);
};

// GET item by ID
export const getItemById = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return sendResponse(res, 400, false, "Invalid item ID");

  const item = getItems().find((i) => i.id === id);
  if (!item) return sendResponse(res, 404, false, "Item not found");

  sendResponse(res, 200, true, "Item retrieved successfully", item);
};

// CREATE new item
export const createItem = (req: Request, res: Response) => {
  const { name, stock, unit, category, description } = req.body;

  if (!name || stock === undefined) {
    return sendResponse(res, 400, false, "Name and stock are required");
  }

  const newItem: Item = {
    id: Date.now(), // or use a UUID if you prefer
    name,
    stock: Number(stock),
    unit,
    category,
    description,
  };

  const added = addItem(newItem);
  sendResponse(res, 201, true, "Item created successfully", added);
};

// DEPOSIT item
export const depositItemController = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const quantity = Number(req.body.quantity);
  const notes = req.body.notes;

  if (isNaN(id) || isNaN(quantity) || quantity <= 0) {
    return sendResponse(res, 400, false, "Invalid ID or quantity");
  }

  const updated = depositItem(id, quantity, notes);
  if (!updated) return sendResponse(res, 404, false, "Item not found");

  sendResponse(res, 200, true, `Deposited ${quantity} successfully`, updated);
};

// WITHDRAW item
export const withdrawItemController = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const quantity = Number(req.body.quantity);
  const notes = req.body.notes;

  if (isNaN(id) || isNaN(quantity) || quantity <= 0) {
    return sendResponse(res, 400, false, "Invalid ID or quantity");
  }

  try {
    const updated = withdrawItem(id, quantity, notes);
    if (!updated) return sendResponse(res, 404, false, "Item not found");
    sendResponse(res, 200, true, `Withdrew ${quantity} successfully`, updated);
  } catch (err: any) {
    sendResponse(res, 400, false, err.message);
  }
};

// UPDATE item stock directly
export const updateItemController = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const newStock = Number(req.body.stock);
  const notes = req.body.notes;

  if (isNaN(id) || isNaN(newStock) || newStock < 0) {
    return sendResponse(res, 400, false, "Invalid ID or stock");
  }

  const updated = updateItemStock(id, newStock, notes);
  if (!updated) return sendResponse(res, 404, false, "Item not found");

  sendResponse(res, 200, true, "Stock updated successfully", updated);
};

// GET logs for an item
export const getItemLogs = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return sendResponse(res, 400, false, "Invalid item ID");

  const itemLogs = getLogs().filter((log) => log.itemId === id);
  sendResponse(res, 200, true, "Logs retrieved successfully", itemLogs);
};

// DELETE item
export const deleteItemController = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return sendResponse(res, 400, false, "Invalid item ID");

  const allItems = getItems();
  const index = allItems.findIndex((i) => i.id === id);
  if (index === -1) return sendResponse(res, 404, false, "Item not found");

  allItems.splice(index, 1);
  sendResponse(res, 200, true, "Item deleted successfully");
};
