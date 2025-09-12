"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seriesIdCounter = exports.requestIdCounter = exports.logIdCounter = exports.itemIdCounter = exports.series = exports.requests = exports.logs = exports.items = void 0;
// Shared in-memory storage
exports.items = [];
exports.logs = [];
exports.requests = [];
exports.series = []; // 🔹 new
// Auto-increment counters
exports.itemIdCounter = 1;
exports.logIdCounter = 1;
exports.requestIdCounter = 1;
exports.seriesIdCounter = 1; // 🔹 new
//# sourceMappingURL=store.js.map