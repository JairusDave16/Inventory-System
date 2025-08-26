import express from "express";
import cors from "cors";
import inventoryRoutes from "./routes/inventoryRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// Base route
app.get("/", (_req, res) => res.send("Inventory System API 🚀"));

// Inventory routes
app.use("/api/inventory", inventoryRoutes);

export default app;
