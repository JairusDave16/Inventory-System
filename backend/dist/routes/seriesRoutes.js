"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_1 = require("../data/store");
const router = (0, express_1.Router)();
// Get all series
router.get("/", (_req, res) => {
    res.json(store_1.series);
});
// Create new series
router.post("/", (req, res) => {
    const { from, to } = req.body;
    if (!from || !to) {
        return res.status(400).json({ error: "Both 'from' and 'to' are required" });
    }
    const newSeries = {
        id: (0, store_1.getNextSeriesId)(), // ✅ now we call function
        from: String(from).padStart(5, "0"),
        to: String(to).padStart(5, "0"),
        status: "available",
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    store_1.series.push(newSeries);
    res.status(201).json(newSeries);
});
exports.default = router;
//# sourceMappingURL=seriesRoutes.js.map