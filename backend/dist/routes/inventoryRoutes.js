"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inventoryController_1 = require("../controllers/inventoryController");
const router = (0, express_1.Router)();
// GET all items
router.get("/", inventoryController_1.getAllItems);
// GET items by category
router.get("/category/:category", inventoryController_1.getItemsByCategory);
// GET item by ID
router.get("/:id", inventoryController_1.getItemById);
// POST new item
router.post("/", inventoryController_1.createItem);
// PUT update item
router.put("/:id", inventoryController_1.updateItem);
// DELETE item
router.delete("/:id", inventoryController_1.deleteItem);
// POST deposit
router.post("/:id/deposit", inventoryController_1.depositItem);
// POST withdraw
router.post("/:id/withdraw", inventoryController_1.withdrawItem);
exports.default = router;
//# sourceMappingURL=inventoryRoutes.js.map