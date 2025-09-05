import express from "express";
import cors from "cors";
import inventoryRoutes from "./routes/inventoryRoutes";
import logRoutes from "./routes/logRoutes";
import requestRoutes from "./routes/requestRoutes";

const app = express();

app.use(cors({
  origin: "http://localhost:3000", // allow your frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());

// Base route
app.get("/", (_req, res) => res.send("Inventory System API 🚀"));

// Inventory routes
app.use("/api/inventory", inventoryRoutes);

// Logs API
app.use("/api/logs", logRoutes);

// Requests routes
app.use("/api/requests", requestRoutes);

export default app;
