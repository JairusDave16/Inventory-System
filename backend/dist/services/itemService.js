"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItems = getItems;
exports.addItem = addItem;
exports.depositItem = depositItem;
exports.withdrawItem = withdrawItem;
exports.updateItemStock = updateItemStock;
exports.getLogs = getLogs;
// In-memory storage (replace later with DB or JSON persistence)
let items = [];
let logs = [];
let logId = 1; // global counter
// Utility: add a log entry
function addLog(itemId, type, quantity, notes) {
    const log = {
        id: logId++, // number, auto-increment
        itemId, // already number
        type,
        quantity,
        date: new Date().toISOString(),
        ...(notes ? { notes } : {}), // ✅ only include notes if provided
    };
    logs.push(log);
}
// Get all items
function getItems() {
    return items;
}
// Add a new item
function addItem(item) {
    items.push(item);
    addLog(item.id, "deposit", item.stock, "Initial stock");
    return item;
}
// Deposit stock
function depositItem(itemId, quantity, notes) {
    const item = items.find(i => i.id === itemId);
    if (!item)
        return null;
    const q = Number(quantity);
    item.stock += q;
    addLog(item.id, "deposit", q, notes);
    console.log(`Deposited ${q} to ${item.name}, new stock: ${item.stock}`);
    return item;
}
function withdrawItem(itemId, quantity, notes) {
    const item = items.find(i => i.id === itemId);
    if (!item)
        return null;
    const q = Number(quantity);
    if (item.stock < q)
        throw new Error("Not enough stock");
    item.stock -= q;
    addLog(item.id, "withdraw", q, notes);
    console.log(`Withdrew ${q} from ${item.name}, new stock: ${item.stock}`);
    return item;
}
function updateItemStock(itemId, newStock, notes) {
    const item = items.find(i => i.id === itemId);
    if (!item)
        return null;
    const diff = newStock - item.stock;
    item.stock = newStock;
    addLog(item.id, "update", diff, notes || "Manual adjustment");
    return item;
}
// Get logs
function getLogs() {
    return logs;
}
//# sourceMappingURL=itemService.js.map