"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logs = void 0;
exports.addLog = addLog;
exports.getLogs = getLogs;
// in-memory store
exports.logs = [];
// simple auto-increment for id
let nextLogId = 1;
function addLog(itemId, type, quantity, notes) {
    const log = {
        id: nextLogId++,
        itemId,
        type,
        quantity,
        date: new Date().toISOString(),
        ...(notes !== undefined ? { notes } : {}), // ✅ only include if provided
    };
    exports.logs.push(log);
    return log;
}
function getLogs() {
    return exports.logs;
}
//# sourceMappingURL=logStore.js.map