// backend/src/data/store.ts
import { Prisma } from "@prisma/client";
import prisma from "../prismaClient";

// =============================
// ITEMS
// =============================
export const getAllItems = () => prisma.item.findMany();

export const getItemById = (id: number) =>
  prisma.item.findUnique({ where: { id } });

export const createItem = (data: {
  name: string;
  stock: number;
  unit?: string;
  category?: string;
  description?: string;
}) => prisma.item.create({ data });

// =============================
// LOGS
// =============================
export const getLogsByItem = (itemId: number) =>
  prisma.requestLog.findMany({
    where: { request: { itemId } },
    orderBy: { date: "desc" },
  });

export const createLog = (data: {
  action: string;
  user: string;
  notes?: string;
  requestId?: number;
}) =>
  prisma.requestLog.create({
    data: {
      ...data,
      notes: data.notes ?? null, // ✅ Normalize undefined → null
    },
  });

// =============================
// REQUESTS
// =============================
export const getAllRequests = () =>
  prisma.request.findMany({
    include: { logs: true, item: true, user: true },
  });

export const getRequestById = (id: number) =>
  prisma.request.findUnique({
    where: { id },
    include: { logs: true, item: true, user: true },
  });

export const createRequest = (data: {
  userId: number;
  itemId: number;
  quantity: number;
  notes?: string;
}) =>
  prisma.request.create({
    data: {
      ...data,
      status: "pending",
      logs: {
        create: [
          {
            action: "pending",
            user: `User #${data.userId}`,
            notes: data.notes ?? null,
          },
        ],
      },
    },
    include: { logs: true },
  });

// =============================
// SERIES (Series-based Deposits / Withdrawals)
// =============================

/**
 * Create a new series (deposit or withdraw)
 * - Automatically adjusts item stock
 * - Logs action in ItemLog
 * - Prevents overlapping series ranges
 */
export async function createSeriesWithStock(data: {
  itemId: number;
  fromSeries: number | string;
  toSeries: number | string;
  quantity: number;
  type: "deposit" | "withdraw";
}) {
  // ✅ Force conversion to string immediately
  const fromSeriesStr = String(data.fromSeries); // ⬅ changed
  const toSeriesStr = String(data.toSeries);     // ⬅ changed

  // ✅ Use numeric comparison for validation only
  const fromNum = Number(fromSeriesStr);
  const toNum = Number(toSeriesStr);
  if (!isNaN(fromNum) && !isNaN(toNum) && toNum < fromNum) {
    throw new Error("'toSeries' must be greater than or equal to 'fromSeries'");
  }

  return await prisma.$transaction(async (tx) => {
    // 1️⃣ Prevent overlapping series ranges for the same item
    const overlap = await tx.series.findFirst({
      where: {
        itemId: data.itemId,
        OR: [
          {
            fromSeries: { lte: toSeriesStr },
            toSeries: { gte: fromSeriesStr },
          },
        ],
      },
    });

    if (overlap) {
      throw new Error(
        `❌ Overlapping range detected (${fromSeriesStr}–${toSeriesStr}).`
      );
    }

    // 2️⃣ Validate the item exists
    const currentItem = await tx.item.findUnique({
      where: { id: data.itemId },
    });
    if (!currentItem) throw new Error("❌ Item not found.");

    // 3️⃣ Validate stock availability for withdrawals
    if (data.type === "withdraw" && currentItem.stock < data.quantity) {
      throw new Error("❌ Not enough stock to withdraw that quantity.");
    }

    // 4️⃣ Create the series entry (preserves exact formatting)
    const series = await tx.series.create({
      data: {
        itemId: data.itemId,
        fromSeries: fromSeriesStr, // ✅ always string
        toSeries: toSeriesStr,     // ✅ always string
        quantity: data.quantity,
        type: data.type,
      },
    });

    // 5️⃣ Adjust stock (increase or decrease)
    const item = await tx.item.update({
      where: { id: data.itemId },
      data: {
        stock: {
          increment: data.type === "deposit" ? data.quantity : -data.quantity,
        },
      },
    });

    // 6️⃣ Log entry with preserved format
    await tx.itemLog.create({
      data: {
        itemId: data.itemId,
        action: data.type,
        quantity: data.quantity,
        notes:
          data.type === "deposit"
            ? `Deposited series ${fromSeriesStr}–${toSeriesStr}`
            : `Withdrew series ${fromSeriesStr}–${toSeriesStr}`,
      },
    });

    return { series, item };
  });
}


// =============================
// SERIES UTILITIES
// =============================

export const getAllSeries = () => {
  return prisma.series.findMany({
    include: { item: true },
    orderBy: { id: "desc" },
  });
};

export const getSeriesByItem = (itemId: number) => {
  return prisma.series.findMany({
    where: { itemId },
    include: { item: true },
    orderBy: { id: "desc" },
  });
};

export const deleteSeries = async (seriesId: number) => {
  return await prisma.$transaction(async (tx) => {
    // 1️⃣ Find the series entry
    const series = await tx.series.findUnique({ where: { id: seriesId } });
    if (!series) throw new Error("❌ Series not found.");

    // 2️⃣ Find the related item
    const item = await tx.item.findUnique({ where: { id: series.itemId } });
    if (!item) throw new Error("❌ Related item not found.");

    // 3️⃣ Reverse stock adjustment (deposit ➜ subtract, withdraw ➜ add)
    const adjustment =
      series.type === "deposit" ? -series.quantity : series.quantity;

    await tx.item.update({
      where: { id: series.itemId },
      data: {
        stock: { increment: adjustment },
      },
    });

    // 4️⃣ Delete the series record
    await tx.series.delete({ where: { id: seriesId } });

    // 5️⃣ Log the deletion (preserve original formatting)
    await tx.itemLog.create({
      data: {
        itemId: series.itemId,
        action: "delete-series",
        quantity: series.quantity,
        notes: `🗑️ Removed ${series.type} series ${series.fromSeries}–${series.toSeries}`,
      },
    });

    return {
      message: `✅ Series (${series.fromSeries}–${series.toSeries}) deleted and stock adjusted.`,
    };
  });
};
