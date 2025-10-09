// backend/src/services/requestService.ts
import prisma from "../prismaClient";

// -----------------------------
// Create a new request
// -----------------------------
export async function createRequest(
  userId: number,
  itemId: number,
  quantity: number,
  notes: string
) {
  // Ensure user exists
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  // Ensure item exists
  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item) throw new Error("Item not found");

  // Create request
  const request = await prisma.request.create({
    data: {
      userId,
      itemId,
      quantity,
      status: "pending",
      notes,
    },
  });

  // Create initial log
  await prisma.requestLog.create({
    data: {
      requestId: request.id,
      action: "Created",
      user: user.name,
      notes: notes || "Request created",
    },
  });

  return request;
}

// -----------------------------
// Approve or reject a request
// -----------------------------
export async function approveRequest(
  requestId: number,
  approver: string,
  approve: boolean,
  notes: string
) {
  const request = await prisma.request.findUnique({ where: { id: requestId } });
  if (!request) return null;

  const updatedRequest = await prisma.request.update({
    where: { id: requestId },
    data: {
      status: approve ? "approved" : "rejected",
      approver,
    },
  });

  await prisma.requestLog.create({
    data: {
      requestId,
      action: approve ? "Approved" : "Rejected",
      user: approver,
      notes,
    },
  });

  return updatedRequest;
}

// -----------------------------
// Fulfill request (withdraw stock)
// -----------------------------
export async function fulfillRequest(
  requestId: number,
  actor: string,
  notes: string
) {
  const request = await prisma.request.findUnique({ where: { id: requestId } });
  if (!request || request.status !== "approved") return null;

  const item = await prisma.item.findUnique({ where: { id: request.itemId } });
  if (!item) throw new Error("Item not found");
  if (item.stock < request.quantity) throw new Error("Insufficient stock");

  const [updatedItem, updatedRequest] = await prisma.$transaction([
    prisma.item.update({
      where: { id: item.id },
      data: { stock: { decrement: request.quantity } },
    }),
    prisma.request.update({
      where: { id: requestId },
      data: { status: "fulfilled" },
    }),
  ]);

  await prisma.requestLog.create({
    data: {
      requestId,
      action: "Fulfilled",
      user: actor,
      notes: notes || `Fulfilled ${request.quantity} units`,
    },
  });

  return { request: updatedRequest, item: updatedItem };
}

// -----------------------------
// Get all requests
// -----------------------------
export async function getRequests() {
  return prisma.request.findMany({
    include: { user: true, item: true },
  });
}

// -----------------------------
// Get logs for a specific request
// -----------------------------
export async function getRequestLogs(requestId: number) {
  return prisma.requestLog.findMany({
    where: { requestId },
    orderBy: { date: "asc" },
  });
}
