// backend/src/routes/itemRoutes.ts
import { Router } from "express";
import { Item } from "../types/Item";
import { Log } from "../types/Log";


// In-memory storage
export let items: Item[] = [];  // 🔹 export items so other modules can access
let logs: Log[] = [];
let itemIdCounter = 1;
let logIdCounter = 1;
const router = Router();

// Utility: add a log entry
function addLog(
  itemId: number,
  type: "deposit" | "withdraw" | "update",
  quantity: number,
  notes?: string
) {
  logs.push({
    id: logIdCounter++, // number
    itemId,             // number
    type,
    quantity,
    notes: notes ?? "",
    date: new Date().toISOString(),
  });
}

// ✅ Get logs for an item
router.get("/:id/logs", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const itemLogs = logs.filter((log) => log.itemId === id);
  res.json(itemLogs);
});

// Get all items
router.get("/", (req, res) => {
  res.json(items);
});

// Add new item
router.post("/", (req, res) => {
  const newItem: Item = {
    id: itemIdCounter++, // number
    name: req.body.name,
    stock: req.body.stock || 0,
    unit: req.body.unit,
    category: req.body.category,
    description: req.body.description || "",
  };

  items.push(newItem);

  // Log initial stock
  addLog(newItem.id, "deposit", newItem.stock, "Initial stock");

  res.status(201).json(newItem);
});

// Adjust stock: deposit or withdraw
router.post("/:id/adjust", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const { type, quantity, notes } = req.body;
  const item = items.find((i) => i.id === id);
  if (!item) return res.status(404).json({ error: "Item not found" });

  const qty = Number(quantity);
  if (isNaN(qty) || qty <= 0) {
    return res.status(400).json({ error: "Invalid quantity" });
  }

  if (type === "deposit") {
    item.stock += qty;
  } else if (type === "withdraw") {
    if (item.stock < qty) return res.status(400).json({ error: "Insufficient stock" });
    item.stock -= qty;
  } else {
    return res.status(400).json({ error: "Invalid type" });
  }

  addLog(item.id, type, qty, notes);

  res.json(item);
});

// Update item
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return res.status(404).json({ error: "Item not found" });

  items[index] = { ...items[index], ...req.body };
  res.json(items[index]);
});

// Delete item
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return res.status(404).json({ error: "Item not found" });

  items.splice(index, 1);
  res.status(204).send();
});

export default router;
