// backend/src/routes/seriesRoutes.ts
import { Router } from "express";
import { series, getNextSeriesId, items } from "../data/store";
import { Series } from "../types/Series";
import { Item } from "../types/Item";

const router = Router();

// helpers
function normalizeSeriesString(s: unknown, pad = 5) {
  return String(s).replace(/\D/g, "").padStart(pad, "0");
}
function toNum(s: string) {
  return parseInt(s, 10);
}

// GET /api/series - all series
router.get("/", (_req, res) => {
  res.json(series);
});

// GET /api/series/item/:itemId - series for a given item
router.get("/item/:itemId", (req, res) => {
  const itemId = Number(req.params.itemId);
  if (isNaN(itemId)) return res.status(400).json({ error: "Invalid itemId" });

  const results = series.filter((s) => s.itemId === itemId);
  res.json(results);
});

// POST /api/series
router.post("/", (req, res) => {
  const { itemId, from, to } = req.body;

  if (itemId === undefined || from === undefined || to === undefined) {
    return res.status(400).json({ error: "Missing itemId, from or to" });
  }

  const item = items.find((i: Item) => i.id === Number(itemId));
  if (!item) return res.status(404).json({ error: "Item not found" });

  const normFrom = normalizeSeriesString(from);
  const normTo = normalizeSeriesString(to);

  const fromNum = toNum(normFrom);
  const toNumVal = toNum(normTo);

  if (isNaN(fromNum) || isNaN(toNumVal) || fromNum > toNumVal) {
    return res.status(400).json({ error: "Invalid series range" });
  }

  // overlap check
  const overlap = series.some((s) => {
    if (s.itemId !== item.id) return false;
    const sFrom = toNum(s.from);
    const sTo = toNum(s.to);
    return !(sTo < fromNum || sFrom > toNumVal);
  });

  if (overlap) {
    return res.status(400).json({ error: "Series overlaps with existing series for this item" });
  }

  const newSeries: Series = {
    id: getNextSeriesId(),
    itemId: item.id,
    from: normFrom,
    to: normTo,
    status: "available",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  series.push(newSeries);

  if (!Array.isArray((item as any).series)) {
    (item as any).series = [];
  }
  (item as any).series.push(newSeries);

  const added = toNumVal - fromNum + 1;
  item.stock = (item.stock ?? 0) + added;

  res.status(201).json({ series: newSeries, item });
});

// DELETE /api/series/:id
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const idx = series.findIndex((s) => s.id === id);
  if (idx === -1) return res.status(404).json({ error: "Series not found" });

  const s = series[idx];
  if (!s) return res.status(404).json({ error: "Series not found" });

  const item = items.find((i: Item) => i.id === s.itemId);

  if (item && s.status === "available") {
    const count = toNum(s.to) - toNum(s.from) + 1;
    item.stock = Math.max(0, (item.stock ?? 0) - count);

    if (Array.isArray((item as any).series)) {
      (item as any).series = (item as any).series.filter(
        (ss: Series) => ss.id !== id
      );
    }
  }

  series.splice(idx, 1);
  res.status(204).send();
});

export default router;
