"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// 🔹 Import shared store instead of defining new arrays
const store_1 = require("../data/store");
const router = (0, express_1.Router)();
// Utility: add a log entry
function addLog(itemId, type, quantity, notes) {
    store_1.logs.push({
        id: store_1.logIdCounter++, // number
        itemId, // number
        type,
        quantity,
        notes: notes ?? "",
        date: new Date().toISOString(),
    });
}
// ✅ Get logs for an item
router.get("/:id/logs", (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: "Invalid ID" });
    const itemLogs = store_1.logs.filter((log) => log.itemId === id);
    res.json(itemLogs);
});
// Get all items
router.get("/", (_req, res) => {
    res.json(store_1.items);
});
// Add new item
router.post("/", (req, res) => {
    const newItem = {
        id: store_1.itemIdCounter++, // number
        name: req.body.name,
        stock: req.body.stock || 0,
        unit: req.body.unit,
        category: req.body.category,
        description: req.body.description || "",
    };
    store_1.items.push(newItem);
    // Log initial stock
    addLog(newItem.id, "deposit", newItem.stock, "Initial stock");
    res.status(201).json(newItem);
});
// Adjust stock: deposit or withdraw
router.post("/:id/adjust", (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: "Invalid ID" });
    const { type, quantity, notes } = req.body;
    const item = store_1.items.find((i) => i.id === id);
    if (!item)
        return res.status(404).json({ error: "Item not found" });
    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({ error: "Invalid quantity" });
    }
    if (type === "deposit") {
        item.stock += qty;
    }
    else if (type === "withdraw") {
        if (item.stock < qty)
            return res.status(400).json({ error: "Insufficient stock" });
        item.stock -= qty;
    }
    else {
        return res.status(400).json({ error: "Invalid type" });
    }
    addLog(item.id, type, qty, notes);
    res.json(item);
});
// Update item
router.put("/:id", (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: "Invalid ID" });
    const index = store_1.items.findIndex((item) => item.id === id);
    if (index === -1)
        return res.status(404).json({ error: "Item not found" });
    store_1.items[index] = { ...store_1.items[index], ...req.body };
    res.json(store_1.items[index]);
});
// Delete item
router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: "Invalid ID" });
    const index = store_1.items.findIndex((item) => item.id === id);
    if (index === -1)
        return res.status(404).json({ error: "Item not found" });
    store_1.items.splice(index, 1);
    res.status(204).send();
});
exports.default = router;
//# sourceMappingURL=itemRoutes.js.map