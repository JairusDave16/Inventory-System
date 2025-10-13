import { Request, Response } from "express";
import prisma from "../prismaClient";

// Utility for consistent responses
const sendResponse = (res: Response, status: number, success: boolean, message: string, data?: any) => {
  res.status(status).json({ success, message, data });
};

// GET dashboard stats
export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    // Total active items
    const totalItems = await prisma.item.count({
      where: { deletedAt: null },
    });

    // Pending requests
    const pendingRequests = await prisma.request.count({
      where: { status: "pending" },
    });

    // Low stock items (stock < 10)
    const lowStockItems = await prisma.item.findMany({
      where: {
        deletedAt: null,
        stock: { lt: 10 },
      },
      select: {
        id: true,
        name: true,
        stock: true,
        category: true,
      },
    });

    // Recent activities: Last 10 combined ItemLog and RequestLog
    const itemLogs = await prisma.itemLog.findMany({
      take: 10,
      orderBy: { date: "desc" },
      include: {
        item: {
          select: { name: true },
        },
      },
    });

    const requestLogs = await prisma.requestLog.findMany({
      take: 10,
      orderBy: { date: "desc" },
      include: {
        request: {
          include: {
            item: {
              select: { name: true },
            },
          },
        },
      },
    });

    // Merge and sort by date
    const recentActivities = [
      ...itemLogs.map((log) => ({
        id: log.id,
        action: log.action,
        itemName: log.item.name,
        user: "System", // ItemLogs are system actions
        date: log.date.toISOString(),
        type: "item" as const,
      })),
      ...requestLogs.map((log) => ({
        id: log.id,
        action: log.action,
        itemName: log.request.item.name,
        user: log.user,
        date: log.date.toISOString(),
        type: "request" as const,
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    const stats = {
      totalItems,
      pendingRequests,
      lowStockItems,
      recentActivities,
    };

    sendResponse(res, 200, true, "Dashboard stats retrieved successfully", stats);
  } catch (err) {
    console.error("Dashboard stats error:", err);
    sendResponse(res, 500, false, "Failed to retrieve dashboard stats", err);
  }
};
