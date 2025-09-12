"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logs = exports.items = void 0;
exports.nextItemId = nextItemId;
exports.addLog = addLog;
// In-memory storage
exports.items = [];
exports.logs = [];
let itemIdCounter = 1;
let logIdCounter = 1;
// Generate next item ID
function nextItemId() {
    return itemIdCounter++;
}
// Utility: add a log entry
function addLog(itemId, type, quantity, notes) {
    exports.logs.push({
        id: logIdCounter++,
        itemId,
        type,
        quantity,
        notes: notes ?? "",
        date: new Date().toISOString(),
    });
}
//# sourceMappingURL=item.js.map