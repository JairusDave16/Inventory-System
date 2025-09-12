"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawItem = exports.depositItem = exports.deleteItem = exports.updateItem = exports.createItem = exports.getItemsByCategory = exports.getItemById = exports.getAllItems = void 0;
const inventoryService_1 = require("../services/inventoryService");
// ✅ Utility for consistent responses
const sendResponse = (res, status, success, message, data) => {
    res.status(status).json({ success, message, data });
};
// GET all items
const getAllItems = async (_req, res) => {
    try {
        const items = inventoryService_1.InventoryService.getAll();
        sendResponse(res, 200, true, "Items retrieved successfully", items);
    }
    catch (error) {
        sendResponse(res, 500, false, error.message || "Failed to fetch items");
    }
};
exports.getAllItems = getAllItems;
// GET item by ID
const getItemById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id))
            return sendResponse(res, 400, false, "Invalid item ID");
        const item = inventoryService_1.InventoryService.getById(id);
        if (!item)
            return sendResponse(res, 404, false, "Item not found");
        sendResponse(res, 200, true, "Item retrieved successfully", item);
    }
    catch (error) {
        sendResponse(res, 500, false, error.message || "Failed to fetch item");
    }
};
exports.getItemById = getItemById;
// GET items by category
const getItemsByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        if (!category) {
            return sendResponse(res, 400, false, "Category is required");
        }
        const items = inventoryService_1.InventoryService.getByCategory(category);
        sendResponse(res, 200, true, "Items retrieved successfully", items);
    }
    catch (error) {
        sendResponse(res, 500, false, error.message || "Failed to fetch items");
    }
};
exports.getItemsByCategory = getItemsByCategory;
// CREATE new item
const createItem = async (req, res) => {
    try {
        const { name, category, quantity, series } = req.body;
        if (!name || !category || quantity === undefined) {
            return sendResponse(res, 400, false, "Name, category, and quantity are required");
        }
        const newItem = inventoryService_1.InventoryService.create({ name, category, quantity, series });
        sendResponse(res, 201, true, "Item created successfully", newItem);
    }
    catch (error) {
        sendResponse(res, 500, false, error.message || "Failed to create item");
    }
};
exports.createItem = createItem;
// UPDATE item
const updateItem = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id))
            return sendResponse(res, 400, false, "Invalid item ID");
        const updated = inventoryService_1.InventoryService.update(id, req.body);
        if (!updated)
            return sendResponse(res, 404, false, "Item not found");
        sendResponse(res, 200, true, "Item updated successfully", updated);
    }
    catch (error) {
        sendResponse(res, 500, false, error.message || "Failed to update item");
    }
};
exports.updateItem = updateItem;
// DELETE item
const deleteItem = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id))
            return sendResponse(res, 400, false, "Invalid item ID");
        const deleted = inventoryService_1.InventoryService.delete(id);
        if (!deleted)
            return sendResponse(res, 404, false, "Item not found");
        sendResponse(res, 200, true, "Item deleted successfully", deleted);
    }
    catch (error) {
        sendResponse(res, 500, false, error.message || "Failed to delete item");
    }
};
exports.deleteItem = deleteItem;
// DEPOSIT item
const depositItem = (req, res) => {
    const id = Number(req.params.id);
    const amount = Number(req.body.amount);
    if (isNaN(id) || isNaN(amount)) {
        return sendResponse(res, 400, false, "Invalid ID or amount");
    }
    try {
        const updatedItem = inventoryService_1.InventoryService.deposit(id, amount);
        sendResponse(res, 200, true, `Deposited ${amount} to item ${id}`, updatedItem);
    }
    catch (err) {
        sendResponse(res, 400, false, err.message);
    }
};
exports.depositItem = depositItem;
// WITHDRAW item
const withdrawItem = (req, res) => {
    const id = Number(req.params.id);
    const amount = Number(req.body.amount);
    if (isNaN(id) || isNaN(amount)) {
        return sendResponse(res, 400, false, "Invalid ID or amount");
    }
    try {
        const updatedItem = inventoryService_1.InventoryService.withdraw(id, amount);
        sendResponse(res, 200, true, `Withdrew ${amount} from item ${id}`, updatedItem);
    }
    catch (err) {
        sendResponse(res, 400, false, err.message);
    }
};
exports.withdrawItem = withdrawItem;
//# sourceMappingURL=inventoryController.js.map