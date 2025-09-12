"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/logRoutes.ts
const express_1 = require("express");
const logController_1 = require("../controllers/logController");
const router = (0, express_1.Router)();
// Get all logs
router.get("/", logController_1.logController.getAllLogs);
// Get logs by itemId
router.get("/:itemId", logController_1.logController.getLogsByItem);
// Add a log for a specific item
router.post("/:itemId", logController_1.logController.addLog);
exports.default = router;
//# sourceMappingURL=logRoutes.js.map