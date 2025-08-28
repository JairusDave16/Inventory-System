import { Router } from "express";

const router = Router();

// Mock inventory (temporary until DB)
let items: any[] = [];

// Get all items
router.get("/", (req, res) => {
  res.json(items);
});

// Add new item
router.post("/", (req, res) => {
  const newItem = { id: Date.now(), ...req.body };
  items.push(newItem);
  res.status(201).json(newItem);
});

// Update item
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const index = items.findIndex((item) => item.id === parseInt(id));
  if (index === -1) return res.status(404).json({ error: "Item not found" });

  items[index] = { ...items[index], ...req.body };
  res.json(items[index]);
});

// Delete item
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  items = items.filter((item) => item.id !== parseInt(id));
  res.status(204).send();
});

export default router;
