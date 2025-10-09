import { Router } from "express";
import {
  getAllSeries,
  getSeriesByItem,
  createSeriesWithStock,
  deleteSeries,
} from "../data/store";

const router = Router();

/**
 * ============================
 * SERIES ROUTES (DB-backed)
 * ============================
 */

// GET /api/series → all series (with item info)
router.get("/", async (_req, res) => {
  try {
    const data = await getAllSeries();
    res.json(data);
  } catch (error) {
    console.error("Error fetching all series:", error);
    res.status(500).json({ error: "Failed to fetch series data." });
  }
});

// GET /api/series/item/:itemId → all series for a specific item
router.get("/item/:itemId", async (req, res) => {
  try {
    const itemId = Number(req.params.itemId);
    if (isNaN(itemId)) return res.status(400).json({ error: "Invalid itemId" });

    const data = await getSeriesByItem(itemId);
    res.json(data);
  } catch (error) {
    console.error("Error fetching item series:", error);
    res.status(500).json({ error: "Failed to fetch item series." });
  }
});

// POST /api/series → deposit or withdraw (series-based)
router.post("/", async (req, res) => {
  try {
    const { itemId, fromSeries, toSeries, quantity, type } = req.body;

    if (!itemId || !fromSeries || !toSeries || !quantity || !type) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    if (!["deposit", "withdraw"].includes(type)) {
      return res
        .status(400)
        .json({ error: "Invalid type — must be 'deposit' or 'withdraw'." });
    }

    // ✅ Normalize inputs to ensure strings, regardless of input type
    const normalizedFrom = String(fromSeries).replace(/\D/g, "");
    const normalizedTo = String(toSeries).replace(/\D/g, "");

    const result = await createSeriesWithStock({
      itemId: Number(itemId),
      fromSeries: normalizedFrom,
      toSeries: normalizedTo,
      quantity: Number(quantity),
      type,
    });

    res.status(201).json({
      message: `✅ ${type.toUpperCase()} successful.`,
      data: result,
    });
  } catch (error: any) {
    console.error("Error creating series:", error);
    res.status(400).json({ error: error.message || "Failed to create series." });
  }
});

// DELETE /api/series/:id → delete a specific series entry
// seriesRoutes.ts
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID." });

    await deleteSeries(id);
    res.status(204).send();
  } catch (error: any) {
    console.error("❌ Prisma Delete Error:", error);
    res.status(500).json({ error: error.message || "Failed to delete series." });
  }
});


export default router;
