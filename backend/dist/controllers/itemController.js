"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItemController = exports.getItemLogs = exports.updateItemController = exports.withdrawItemController = exports.depositItemController = exports.createItem = exports.getItemById = exports.getAllItems = void 0;
const itemService_1 = require("../services/itemService");
// ✅ Utility for consistent responses
const sendResponse = (res, status, success, message, data) => {
    res.status(status).json({ success, message, data });
};
// GET all items
const getAllItems = (_req, res) => {
    const items = (0, itemService_1.getItems)();
    sendResponse(res, 200, true, "Items retrieved successfully", items);
};
exports.getAllItems = getAllItems;
// GET item by ID
const getItemById = (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return sendResponse(res, 400, false, "Invalid item ID");
    const item = (0, itemService_1.getItems)().find((i) => i.id === id);
    if (!item)
        return sendResponse(res, 404, false, "Item not found");
    sendResponse(res, 200, true, "Item retrieved successfully", item);
};
exports.getItemById = getItemById;
// CREATE new item
const createItem = (req, res) => {
    const { name, stock, unit, category, description } = req.body;
    if (!name || stock === undefined) {
        return sendResponse(res, 400, false, "Name and stock are required");
    }
    const newItem = {
        id: Date.now(), // or use a UUID if you prefer
        name,
        stock: Number(stock),
        unit,
        category,
        description,
    };
    const added = (0, itemService_1.addItem)(newItem);
    sendResponse(res, 201, true, "Item created successfully", added);
};
exports.createItem = createItem;
// DEPOSIT item
const depositItemController = (req, res) => {
    const id = Number(req.params.id);
    const quantity = Number(req.body.quantity);
    const notes = req.body.notes;
    if (isNaN(id) || isNaN(quantity) || quantity <= 0) {
        return sendResponse(res, 400, false, "Invalid ID or quantity");
    }
    const updated = (0, itemService_1.depositItem)(id, quantity, notes);
    if (!updated)
        return sendResponse(res, 404, false, "Item not found");
    sendResponse(res, 200, true, `Deposited ${quantity} successfully`, updated);
};
exports.depositItemController = depositItemController;
// WITHDRAW item
const withdrawItemController = (req, res) => {
    const id = Number(req.params.id);
    const quantity = Number(req.body.quantity);
    const notes = req.body.notes;
    if (isNaN(id) || isNaN(quantity) || quantity <= 0) {
        return sendResponse(res, 400, false, "Invalid ID or quantity");
    }
    try {
        const updated = (0, itemService_1.withdrawItem)(id, quantity, notes);
        if (!updated)
            return sendResponse(res, 404, false, "Item not found");
        sendResponse(res, 200, true, `Withdrew ${quantity} successfully`, updated);
    }
    catch (err) {
        sendResponse(res, 400, false, err.message);
    }
};
exports.withdrawItemController = withdrawItemController;
// UPDATE item stock directly
const updateItemController = (req, res) => {
    const id = Number(req.params.id);
    const newStock = Number(req.body.stock);
    const notes = req.body.notes;
    if (isNaN(id) || isNaN(newStock) || newStock < 0) {
        return sendResponse(res, 400, false, "Invalid ID or stock");
    }
    const updated = (0, itemService_1.updateItemStock)(id, newStock, notes);
    if (!updated)
        return sendResponse(res, 404, false, "Item not found");
    sendResponse(res, 200, true, "Stock updated successfully", updated);
};
exports.updateItemController = updateItemController;
// GET logs for an item
const getItemLogs = (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return sendResponse(res, 400, false, "Invalid item ID");
    const itemLogs = (0, itemService_1.getLogs)().filter((log) => log.itemId === id);
    sendResponse(res, 200, true, "Logs retrieved successfully", itemLogs);
};
exports.getItemLogs = getItemLogs;
// DELETE item
const deleteItemController = (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return sendResponse(res, 400, false, "Invalid item ID");
    const allItems = (0, itemService_1.getItems)();
    const index = allItems.findIndex((i) => i.id === id);
    if (index === -1)
        return sendResponse(res, 404, false, "Item not found");
    allItems.splice(index, 1);
    sendResponse(res, 200, true, "Item deleted successfully");
};
exports.deleteItemController = deleteItemController;
//# sourceMappingURL=itemController.js.map