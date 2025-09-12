"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logService = void 0;
let logs = [];
let logId = 1;
exports.logService = {
    getAllLogs() {
        return logs;
    },
    getLogsByItem(itemId) {
        return logs.filter((log) => log.itemId === itemId);
    },
    addLog(itemId, type, quantity) {
        const newLog = {
            id: logId++,
            itemId,
            type,
            quantity,
            date: new Date().toISOString(),
        };
        logs.push(newLog);
        return newLog;
    },
};
//# sourceMappingURL=logService.js.map