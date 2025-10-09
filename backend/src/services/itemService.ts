// backend/src/services/itemService.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🟩 Get all items
export async function getItems() {
  return prisma.item.findMany({
    orderBy: { createdAt: "desc" },
  });
}

// 🟩 Add a new item
export async function addItem(name: string, stock: number, unit?: string, description?: string, category?: string) {
  const item = await prisma.item.create({
    data: {
      name,
      stock,
      unit,
      description,
      category,
    },
  });

  // Log the initial stock
  await prisma.requestLog.create({
    data: {
      requestId: 0, // 0 means system log (not tied to request)
      action: "deposit",
      user: "System",
      notes: `Initial stock: ${stock}`,
    },
  });

  return item;
}

// 🟩 Deposit stock
export async function depositItem(itemId: number, quantity: number, notes?: string) {
  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item) return null;

  const updated = await prisma.item.update({
    where: { id: itemId },
    data: { stock: item.stock + quantity },
  });

  await prisma.requestLog.create({
    data: {
      requestId: 0,
      action: "deposit",
      user: "System",
      notes: notes || `Deposited ${quantity} to ${item.name}`,
    },
  });

  console.log(`Deposited ${quantity} to ${item.name}, new stock: ${updated.stock}`);
  return updated;
}

// 🟩 Withdraw stock
export async function withdrawItem(itemId: number, quantity: number, notes?: string) {
  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item) return null;

  if (item.stock < quantity) throw new Error("Not enough stock");

  const updated = await prisma.item.update({
    where: { id: itemId },
    data: { stock: item.stock - quantity },
  });

  await prisma.requestLog.create({
    data: {
      requestId: 0,
      action: "withdraw",
      user: "System",
      notes: notes || `Withdrew ${quantity} from ${item.name}`,
    },
  });

  console.log(`Withdrew ${quantity} from ${item.name}, new stock: ${updated.stock}`);
  return updated;
}

// 🟩 Update stock manually
export async function updateItemStock(itemId: number, newStock: number, notes?: string) {
  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item) return null;

  const diff = newStock - item.stock;

  const updated = await prisma.item.update({
    where: { id: itemId },
    data: { stock: newStock },
  });

  await prisma.requestLog.create({
    data: {
      requestId: 0,
      action: "update",
      user: "System",
      notes: notes || `Manual adjustment: ${diff >= 0 ? "+" : ""}${diff}`,
    },
  });

  console.log(`Adjusted ${item.name} stock by ${diff}, new stock: ${updated.stock}`);
  return updated;
}

// 🟩 Get all logs
export async function getLogs() {
  return prisma.requestLog.findMany({
    orderBy: { date: "desc" },
  });
}
