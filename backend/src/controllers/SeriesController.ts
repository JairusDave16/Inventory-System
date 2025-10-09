import { Request, Response } from "express";
import {
  createSeriesWithStock,
  getAllSeries,
  getSeriesByItem,
} from "../data/store";

// =============================
// SERIES CONTROLLER
// =============================
export class SeriesController {
  /**
   * GET /series
   * Fetch all series entries with related item data
   */
  static async index(req: Request, res: Response) {
    try {
      const seriesList = await getAllSeries();
      res.status(200).json(seriesList);
    } catch (error) {
      console.error("Error fetching series:", error);
      res.status(500).json({ message: "Failed to fetch series data." });
    }
  }

  /**
   * GET /series/item/:itemId
   * Fetch all series for a specific item
   */
  static async getByItem(req: Request, res: Response) {
    try {
      const itemId = Number(req.params.itemId);
      if (isNaN(itemId)) return res.status(400).json({ message: "Invalid item ID." });

      const seriesList = await getSeriesByItem(itemId);
      res.status(200).json(seriesList);
    } catch (error) {
      console.error("Error fetching item series:", error);
      res.status(500).json({ message: "Failed to fetch series for item." });
    }
  }

  /**
   * POST /series
   * Create a new series entry (deposit or withdraw)
   */
  static async create(req: Request, res: Response) {
    try {
      const { itemId, fromSeries, toSeries, quantity, type } = req.body;

      // Basic validation
      if (!itemId || !fromSeries || !toSeries || !quantity || !type) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      if (!["deposit", "withdraw"].includes(type)) {
        return res.status(400).json({ message: "Invalid type (must be deposit or withdraw)." });
      }

      // Call the store logic (transaction handles overlap + stock + logging)
      const result = await createSeriesWithStock({
        itemId: Number(itemId),
        fromSeries: Number(fromSeries),
        toSeries: Number(toSeries),
        quantity: Number(quantity),
        type,
      });

      res.status(201).json({
        message: `✅ Series ${type} successful.`,
        data: result,
      });
    } catch (error: any) {
      console.error("Error creating series:", error);
      res.status(400).json({ message: error.message || "Failed to create series." });
    }
  }
}
