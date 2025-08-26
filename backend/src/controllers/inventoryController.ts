import { Request, Response } from "express";
import { InventoryService } from "../services/inventoryService";

export const getAllItems = (_req: Request, res: Response) => {
  res.json(InventoryService.getAll());
};

export const getItemById = (req: Request, res: Response) => {
  const item = InventoryService.getById(Number(req.params.id));
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json(item);
};

export const getItemsByCategory = (req: Request, res: Response) => {
  res.json(InventoryService.getByCategory(req.params.category));
};

export const createItem = (req: Request, res: Response) => {
  const { name, category, quantity, series } = req.body;
  const newItem = InventoryService.create({ name, category, quantity, series });
  res.status(201).json(newItem);
};

export const updateItem = (req: Request, res: Response) => {
  const updated = InventoryService.update(Number(req.params.id), req.body);
  if (!updated) return res.status(404).json({ message: "Item not found" });
  res.json(updated);
};

export const deleteItem = (req: Request, res: Response) => {
  const deleted = InventoryService.delete(Number(req.params.id));
  if (!deleted) return res.status(404).json({ message: "Item not found" });
  res.json(deleted);
};
