"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Example route
router.get("/", (req, res) => {
    res.json({ message: "Welcome to the Inventory System API 🚀" });
});
exports.default = router;
//# sourceMappingURL=index.js.map