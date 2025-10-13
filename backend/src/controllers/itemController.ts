import { Request, Response } from "express";
import prisma from "../prismaClient";

// Utility for consistent responses
const sendResponse = (res: Response, status: number, success: boolean, message: string, data?: any) => {
  res.status(status).json({ success, message, data });
};

// -------------------
// 📦 Item CRUD
// -------------------

// GET all items
export const getAllItems = async (_req: Request, res: Response) => {
  try {
    const items = await prisma.item.findMany({ where: { deletedAt: null } });
    sendResponse(res, 200, true, "Items retrieved successfully", items);
  } catch (err) {
    sendResponse(res, 500, false, "Failed to retrieve items", err);
  }
};

// GET item by ID
export const getItemById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return sendResponse(res, 400, false, "Invalid item ID");

  try {
    const item = await prisma.item.findUnique({ where: { id } });
    if (!item || item.deletedAt) return sendResponse(res, 404, false, "Item not found");

    sendResponse(res, 200, true, "Item retrieved successfully", item);
  } catch (err) {
    sendResponse(res, 500, false, "Failed to retrieve item", err);
  }
};

// CREATE new item
export const createItem = async (req: Request, res: Response) => {
  const { name, stock, unit, category, description } = req.body;
  if (!name || stock === undefined) return sendResponse(res, 400, false, "Name and stock are required");

  try {
    // Create item
    const item = await prisma.item.create({
      data: { name, stock: Number(stock), unit, category, description },
    });

    // Create initial request and log
    const systemUser = await prisma.user.upsert({
      where: { email: "system@example.com" },
      update: {},
      create: { name: "System User", email: "system@example.com", password: "password123" },
    });

    const request = await prisma.request.create({
      data: {
        userId: systemUser.id,
        itemId: item.id,
        quantity: Number(stock),
        status: "completed",
      },
    });

    await prisma.requestLog.create({
      data: { action: "Created Item", user: "System", notes: `Initial stock: ${stock}`, requestId: request.id },
    });

    sendResponse(res, 201, true, "Item created successfully", item);
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, false, "Failed to create item", err);
  }
};

// -------------------
// 💰 Stock operations
// -------------------

export const depositItemController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const quantity = Number(req.body.quantity);
  const notes = req.body.notes || "Stock deposit";

  if (isNaN(id) || isNaN(quantity) || quantity <= 0)
    return sendResponse(res, 400, false, "Invalid ID or quantity");

  try {
    const item = await prisma.item.findUnique({ where: { id } });
    if (!item || item.deletedAt) return sendResponse(res, 404, false, "Item not found");

    const updated = await prisma.item.update({
      where: { id },
      data: { stock: { increment: quantity } },
    });

    // Log as a Request + RequestLog
    const systemUser = await prisma.user.findUnique({ where: { email: "system@example.com" } });
    if (!systemUser) throw new Error("System user not found");

    const request = await prisma.request.create({
      data: { userId: systemUser.id, itemId: id, quantity, status: "completed" },
    });

    await prisma.requestLog.create({
      data: { action: "deposit", user: "System", notes, requestId: request.id },
    });

    sendResponse(res, 200, true, `Deposited ${quantity} successfully`, updated);
  } catch (err) {
    sendResponse(res, 500, false, "Deposit failed", err);
  }
};

export const withdrawItemController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const quantity = Number(req.body.quantity);
  const notes = req.body.notes || "Stock withdrawal";

  if (isNaN(id) || isNaN(quantity) || quantity <= 0)
    return sendResponse(res, 400, false, "Invalid ID or quantity");

  try {
    const item = await prisma.item.findUnique({ where: { id } });
    if (!item || item.deletedAt) return sendResponse(res, 404, false, "Item not found");
    if (item.stock < quantity) return sendResponse(res, 400, false, "Not enough stock");

    const updated = await prisma.item.update({
      where: { id },
      data: { stock: { decrement: quantity } },
    });

    const systemUser = await prisma.user.findUnique({ where: { email: "system@example.com" } });
    if (!systemUser) throw new Error("System user not found");

    const request = await prisma.request.create({
      data: { userId: systemUser.id, itemId: id, quantity, status: "completed" },
    });

    await prisma.requestLog.create({
      data: { action: "withdraw", user: "System", notes, requestId: request.id },
    });

    sendResponse(res, 200, true, `Withdrew ${quantity} successfully`, updated);
  } catch (err) {
    sendResponse(res, 500, false, "Withdrawal failed", err);
  }
};

// -------------------
// ⚙️ Update / Soft Delete
// -------------------

export const updateItemController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const stock = Number(req.body.stock);
  const notes = req.body.notes || "Manual adjustment";

  if (isNaN(id) || isNaN(stock) || stock < 0) return sendResponse(res, 400, false, "Invalid ID or stock");

  try {
    const updated = await prisma.item.update({ where: { id }, data: { stock } });

    const systemUser = await prisma.user.findUnique({ where: { email: "system@example.com" } });
    if (!systemUser) throw new Error("System user not found");

    const request = await prisma.request.create({
      data: { userId: systemUser.id, itemId: id, quantity: stock, status: "completed" },
    });

    await prisma.requestLog.create({
      data: { action: "update", user: "System", notes, requestId: request.id },
    });

    sendResponse(res, 200, true, "Stock updated successfully", updated);
  } catch (err) {
    sendResponse(res, 500, false, "Failed to update item", err);
  }
};

export const deleteItemController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return sendResponse(res, 400, false, "Invalid item ID");

  try {
    await prisma.item.update({ where: { id }, data: { deletedAt: new Date() } });
    sendResponse(res, 200, true, "Item soft-deleted successfully");
  } catch (err) {
    sendResponse(res, 500, false, "Failed to delete item", err);
  }
};

// Bulk delete items
export const bulkDeleteItemsController = async (req: Request, res: Response) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return sendResponse(res, 400, false, "IDs array is required and cannot be empty");
  }

  const invalidIds = ids.filter(id => isNaN(Number(id)));
  if (invalidIds.length > 0) {
    return sendResponse(res, 400, false, "All IDs must be valid numbers");
  }

  try {
    const numericIds = ids.map(id => Number(id));
    await prisma.item.updateMany({
      where: { id: { in: numericIds } },
      data: { deletedAt: new Date() }
    });
    sendResponse(res, 200, true, `${numericIds.length} items soft-deleted successfully`);
  } catch (err) {
    sendResponse(res, 500, false, "Failed to bulk delete items", err);
  }
};
