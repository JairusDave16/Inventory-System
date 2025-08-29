import express from "express";
import cors from "cors";
import inventoryRoutes from "./routes/inventoryRoutes";
import logRoutes from "./routes/logRoutes";

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

export default app;
