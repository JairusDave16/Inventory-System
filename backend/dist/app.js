"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const inventoryRoutes_1 = __importDefault(require("./routes/inventoryRoutes"));
const logRoutes_1 = __importDefault(require("./routes/logRoutes"));
const requestRoutes_1 = __importDefault(require("./routes/requestRoutes"));
const itemRoutes_1 = __importDefault(require("./routes/itemRoutes")); // ✅ import itemRoutes
const seriesRoutes_1 = __importDefault(require("./routes/seriesRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:3000", // allow your frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use(express_1.default.json());
// Base route
app.get("/", (_req, res) => res.send("Inventory System API 🚀"));
// Inventory routes
app.use("/api/inventory", inventoryRoutes_1.default);
// Items routes ✅
app.use("/api/items", itemRoutes_1.default);
// Logs API
app.use("/api/logs", logRoutes_1.default);
// Requests routes
app.use("/api/requests", requestRoutes_1.default);
// Series routes
app.use("/api/series", seriesRoutes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map