import { Request, Response } from "express";
import { logService } from "../services/logService";


export const logController = {
  getLogsByItem(req: Request, res: Response) {
    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({ error: "Missing itemId" });
    }

    const parsedId = parseInt(itemId, 10);
    if (isNaN(parsedId)) {
      return res.status(400).json({ error: "Invalid itemId" });
    }

    const logs = logService.getLogsByItem(parsedId);
    res.json(logs);
  },

  addLog(req: Request, res: Response) {
    const { itemId } = req.params;
    const { action, amount } = req.body;

    if (!itemId) {
      return res.status(400).json({ error: "Missing itemId" });
    }

    const parsedId = parseInt(itemId, 10);
    if (isNaN(parsedId) || !["deposit", "withdraw"].includes(action) || typeof amount !== "number") {
      return res.status(400).json({ error: "Invalid request" });
    }

    const newLog = logService.addLog(parsedId, action, amount);
    res.status(201).json(newLog);
  },

  getAllLogs(req: Request, res: Response) {
    res.json(logService.getLogs());
  },
};
