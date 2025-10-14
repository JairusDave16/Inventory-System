import express from "express";
import cors from "cors";
import logRoutes from "./routes/logRoutes";
import requestRoutes from "./routes/requestRoutes";
import itemRoutes from "./routes/itemRoutes";
import seriesRoutes from "./routes/seriesRoutes";
import authRoutes from "./routes/authRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import { authenticateToken } from "./middleware/auth";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // allow frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// 🏠 Base route
app.get("/", (_req, res) => res.send("Inventory System API 🚀"));

// Welcome endpoint with logging
app.get("/welcome", (req, res) => {
  console.log(`Request: ${req.method} ${req.path}`);
  res.json({ message: "Welcome to the Inventory System API!" });
});

// 🔹 Auth routes (public)
app.use("/api/auth", authRoutes);

// 🔹 Protected routes (require authentication)
app.use("/api/items", authenticateToken, itemRoutes);
app.use("/api/logs", authenticateToken, logRoutes);
app.use("/api/requests", authenticateToken, requestRoutes);
app.use("/api/series", authenticateToken, seriesRoutes);
app.use("/api/dashboard", authenticateToken, dashboardRoutes);

export default app;
