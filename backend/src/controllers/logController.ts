import { Request, Response } from "express";
import prisma from "../prismaClient";

export const logController = {
  async getLogsByItem(req: Request, res: Response) {
    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({ error: "Missing itemId" });
    }

    const parsedId = parseInt(itemId, 10);
    if (isNaN(parsedId)) {
      return res.status(400).json({ error: "Invalid itemId" });
    }

    try {
      console.log('Fetching item logs for itemId:', itemId, 'parsedId:', parsedId);
      // Get logs from ItemLog (for item operations like deposit/withdraw)
      const itemLogs = await prisma.itemLog.findMany({
        where: {
          itemId: parsedId
        },
        orderBy: {
          date: 'desc'
        }
      });

      console.log('itemLogs length:', itemLogs.length);
      // Format logs
      const formattedLogs = itemLogs.map(il => ({
        id: il.id,
        itemId: parsedId,
        type: il.action,
        stock: il.quantity,
        date: il.date.toISOString(),
        notes: il.notes
      }));

      console.log('formattedLogs length:', formattedLogs.length);
      res.json(formattedLogs);
    } catch (error) {
      console.error('Error fetching item logs:', error);
      res.status(500).json({ error: "Failed to fetch item logs" });
    }
  },

  addLog(req: Request, res: Response) {
    // This method is no longer used since logs are created via item operations
    res.status(501).json({ error: "Not implemented" });
  },

  async getAllLogs(req: Request, res: Response) {
    try {
      const requestLogs = await prisma.requestLog.findMany({
        include: {
          request: {
            include: {
              item: true
            }
          }
        },
        orderBy: {
          request: {
            createdAt: 'desc'
          }
        }
      });

      const logs = requestLogs.map(rl => ({
        id: rl.id,
        itemId: rl.request.itemId,
        type: rl.action,
        stock: rl.request.quantity,
        date: rl.request.createdAt.toISOString(),
        notes: rl.notes
      }));

      res.json(logs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch logs" });
    }
  },
};
