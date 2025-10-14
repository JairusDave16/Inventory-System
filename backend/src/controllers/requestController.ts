// backend/src/controllers/requestController.ts
import { Request, Response } from "express";
import prisma from "../prismaClient";

// -----------------------------
// ✅ Utility for consistent responses
// -----------------------------
const sendResponse = (
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data?: any
) => {
  res.status(status).json({ success, message, data });
};

// -----------------------------
// Create a new request
// -----------------------------
export const createRequestController = async (req: Request, res: Response) => {
  try {
    const { userId, itemId, quantity, notes } = req.body;

    if (!userId || !itemId || !quantity) {
      return sendResponse(res, 400, false, "userId, itemId, and quantity are required");
    }

    // Validate user & item existence
    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
    if (!user) return sendResponse(res, 404, false, "User not found");

    const item = await prisma.item.findUnique({ where: { id: Number(itemId) } });
    if (!item) return sendResponse(res, 404, false, "Item not found");

    const request = await prisma.request.create({
      data: {
        userId: user.id,
        itemId: item.id,
        quantity: Number(quantity),
        status: "pending",
        notes,
      },
    });

    // Log the creation
    await prisma.requestLog.create({
      data: {
        requestId: request.id,
        action: "Created",
        user: user.name,
        notes: notes || "New request created",
      },
    });

    sendResponse(res, 201, true, "Request created successfully", request);
  } catch (error) {
    console.error("❌ createRequestController error:", error);
    sendResponse(res, 500, false, "Failed to create request", error);
  }
};

// -----------------------------
// Approve or Reject a request
// -----------------------------
export const approveRequestController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { approve, approver, notes } = req.body;

    if (typeof approve !== "boolean") {
      return sendResponse(res, 400, false, "Approve must be true or false");
    }

    const request = await prisma.request.findUnique({ where: { id } });
    if (!request) return sendResponse(res, 404, false, "Request not found");

    const updatedRequest = await prisma.request.update({
      where: { id },
      data: {
        status: approve ? "approved" : "rejected",
        approver: approver || "System",
      },
    });

    // Log the approval/rejection
    await prisma.requestLog.create({
      data: {
        requestId: id,
        action: approve ? "Approved" : "Rejected",
        user: approver || "System",
        notes: notes || "",
      },
    });

    sendResponse(
      res,
      200,
      true,
      `Request ${approve ? "approved" : "rejected"} successfully`,
      updatedRequest
    );
  } catch (error) {
    console.error("❌ approveRequestController error:", error);
    sendResponse(res, 500, false, "Failed to approve request", error);
  }
};

// -----------------------------
// Fulfill request (auto-withdraw inventory)
// -----------------------------
export const fulfillRequestController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { actor, notes } = req.body;

    const request = await prisma.request.findUnique({ where: { id } });
    if (!request) return sendResponse(res, 404, false, "Request not found");
    if (request.status !== "approved") {
      return sendResponse(res, 400, false, "Request is not approved");
    }

    const item = await prisma.item.findUnique({ where: { id: request.itemId } });
    if (!item) return sendResponse(res, 404, false, "Item not found");
    if (item.stock < request.quantity) {
      return sendResponse(res, 400, false, "Not enough stock to fulfill request");
    }

    // Fulfill the request and adjust stock
    const [updatedItem, updatedRequest] = await prisma.$transaction([
      prisma.item.update({
        where: { id: item.id },
        data: { stock: { decrement: request.quantity } },
      }),
      prisma.request.update({
        where: { id },
        data: { status: "fulfilled" },
      }),
    ]);

    await prisma.requestLog.create({
      data: {
        requestId: id,
        action: "Fulfilled",
        user: actor || "System",
        notes: notes || `Fulfilled ${request.quantity} units`,
      },
    });

    sendResponse(res, 200, true, "Request fulfilled successfully", {
      request: updatedRequest,
      item: updatedItem,
    });
  } catch (error) {
    console.error("❌ fulfillRequestController error:", error);
    sendResponse(res, 500, false, "Failed to fulfill request", error);
  }
};

// -----------------------------
// Get all requests with pagination
// -----------------------------
export const getRequestsController = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      prisma.request.findMany({
        skip: offset,
        take: limit,
        include: {
          user: true,
          item: true,
        },
        orderBy: { id: 'asc' }
      }),
      prisma.request.count()
    ]);

    const totalPages = Math.ceil(total / limit);

    sendResponse(res, 200, true, "Requests retrieved successfully", {
      requests,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("❌ getRequestsController error:", error);
    sendResponse(res, 500, false, "Failed to fetch requests", error);
  }
};

// -----------------------------
// Get request logs
// -----------------------------
export const getRequestLogsController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const logs = await prisma.requestLog.findMany({
      where: { requestId: id },
      orderBy: { date: "asc" },
    });

    if (!logs.length) return sendResponse(res, 200, true, "No logs found for this request", []);

    sendResponse(res, 200, true, "Logs retrieved successfully", logs);
  } catch (error) {
    console.error("❌ getRequestLogsController error:", error);
    sendResponse(res, 500, false, "Failed to fetch logs", error);
  }
};

// -----------------------------
// Bulk approve requests
// -----------------------------
export const bulkApproveRequestsController = async (req: Request, res: Response) => {
  try {
    const { ids, approver, notes } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return sendResponse(res, 400, false, "IDs array is required and cannot be empty");
    }

    const invalidIds = ids.filter(id => isNaN(Number(id)));
    if (invalidIds.length > 0) {
      return sendResponse(res, 400, false, "All IDs must be valid numbers");
    }

    const numericIds = ids.map(id => Number(id));

    // Check if all requests are pending
    const requests = await prisma.request.findMany({
      where: { id: { in: numericIds } }
    });

    const nonPendingRequests = requests.filter(r => r.status !== "pending");
    if (nonPendingRequests.length > 0) {
      return sendResponse(res, 400, false, "All selected requests must be in pending status");
    }

    // Bulk update requests to approved
    await prisma.request.updateMany({
      where: { id: { in: numericIds } },
      data: {
        status: "approved",
        approver: approver || "System",
      },
    });

    // Create logs for each request
    const logsData = numericIds.map(id => ({
      requestId: id,
      action: "Approved",
      user: approver || "System",
      notes: notes || "Bulk approved",
    }));

    await prisma.requestLog.createMany({
      data: logsData,
    });

    sendResponse(res, 200, true, `${numericIds.length} requests approved successfully`);
  } catch (error) {
    console.error("❌ bulkApproveRequestsController error:", error);
    sendResponse(res, 500, false, "Failed to bulk approve requests", error);
  }
};

// -----------------------------
// Bulk reject requests
// -----------------------------
export const bulkRejectRequestsController = async (req: Request, res: Response) => {
  try {
    const { ids, approver, notes } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return sendResponse(res, 400, false, "IDs array is required and cannot be empty");
    }

    const invalidIds = ids.filter(id => isNaN(Number(id)));
    if (invalidIds.length > 0) {
      return sendResponse(res, 400, false, "All IDs must be valid numbers");
    }

    const numericIds = ids.map(id => Number(id));

    // Check if all requests are pending
    const requests = await prisma.request.findMany({
      where: { id: { in: numericIds } }
    });

    const nonPendingRequests = requests.filter(r => r.status !== "pending");
    if (nonPendingRequests.length > 0) {
      return sendResponse(res, 400, false, "All selected requests must be in pending status");
    }

    // Bulk update requests
    await prisma.request.updateMany({
      where: { id: { in: numericIds } },
      data: {
        status: "rejected",
        approver: approver || "System",
      },
    });

    // Create logs for each request
    const logsData = numericIds.map(id => ({
      requestId: id,
      action: "Rejected",
      user: approver || "System",
      notes: notes || "Bulk rejected",
    }));

    await prisma.requestLog.createMany({
      data: logsData,
    });

    sendResponse(res, 200, true, `${numericIds.length} requests rejected successfully`);
  } catch (error) {
    console.error("❌ bulkRejectRequestsController error:", error);
    sendResponse(res, 500, false, "Failed to bulk reject requests", error);
  }
};
