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
}) => prisma.requestLog.create({ data });

// =============================
// REQUESTS
// =============================
export const getAllRequests = () =>
  prisma.request.findMany({ include: { logs: true, item: true, user: true } });

export const getRequestById = (id: number) =>
  prisma.request.findUnique({ where: { id }, include: { logs: true, item: true, user: true } });

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
            notes: data.notes ?? null, // ✅ convert undefined to null
          },
        ],
      },
    },
    include: { logs: true },
  });

// =============================
// SERIES
// =============================

// Get all series
export const getAllSeries = () => prisma.series.findMany({
  include: { item: true }, // optional: include the related item
});

// Get series by item
export const getSeriesByItem = (itemId: number) =>
  prisma.series.findMany({
    where: { itemId },
    orderBy: { from: "asc" }, // optional, useful for range tracking
  });

// Create a new series range
export const createSeries = (data: {
  itemId: number;
  from: number;
  to: number;
}) => {
  // Optional: validate that 'to' is greater than or equal to 'from'
  if (data.to < data.from) {
    throw new Error("'to' series number must be greater than or equal to 'from'");
  }

  const prismaData: Prisma.SeriesCreateInput = {
    item: { connect: { id: data.itemId } },
    from: data.from,
    to: data.to,
  };

  return prisma.series.create({ data: prismaData });
};

// Optional: check available numbers in a series
export const getAvailableNumbersInSeries = async (itemId: number) => {
  const series = await prisma.series.findMany({ where: { itemId } });
  const available: number[] = [];
  series.forEach(s => {
    for (let n = s.from; n <= s.to; n++) {
      available.push(n);
    }
  });
  return available;
};
