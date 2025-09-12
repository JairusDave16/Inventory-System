"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logController = void 0;
const logService_1 = require("../services/logService");
exports.logController = {
    getLogsByItem(req, res) {
        const { itemId } = req.params;
        if (!itemId) {
            return res.status(400).json({ error: "Missing itemId" });
        }
        const parsedId = parseInt(itemId, 10);
        if (isNaN(parsedId)) {
            return res.status(400).json({ error: "Invalid itemId" });
        }
        const logs = logService_1.logService.getLogsByItem(parsedId);
        res.json(logs);
    },
    addLog(req, res) {
        const { itemId } = req.params;
        const { action, amount } = req.body;
        if (!itemId) {
            return res.status(400).json({ error: "Missing itemId" });
        }
        const parsedId = parseInt(itemId, 10);
        if (isNaN(parsedId) || !["deposit", "withdraw"].includes(action) || typeof amount !== "number") {
            return res.status(400).json({ error: "Invalid request" });
        }
        const newLog = logService_1.logService.addLog(parsedId, action, amount);
        res.status(201).json(newLog);
    },
    getAllLogs(req, res) {
        res.json(logService_1.logService.getAllLogs());
    },
};
//# sourceMappingURL=logController.js.map