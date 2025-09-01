import { Request, Response } from "express";
import { itemService } from "../services/itemService";

export const itemController = {
  getAll: (req: Request, res: Response) => {
    res.json(itemService.getAll());
  },

  getById: (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "ID is required" });

  const item = itemService.getById(id);
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json(item);
},

  create: (req: Request, res: Response) => {
    const { name, description, unit, category } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const newItem = itemService.create({ name, description, unit, category });
    res.status(201).json(newItem);
  },

  update: (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "ID is required" });

  const updatedItem = itemService.update(id, req.body);
  if (!updatedItem) return res.status(404).json({ message: "Item not found" });
  res.json(updatedItem);
},

  delete: (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "ID is required" });

  const success = itemService.delete(id);
  if (!success) return res.status(404).json({ message: "Item not found" });
  res.status(204).send();
}

};
