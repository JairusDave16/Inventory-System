import express from "express";
import cors from "cors";
import logRoutes from "./routes/logRoutes";
import requestRoutes from "./routes/requestRoutes";
import itemRoutes from "./routes/itemRoutes";
import seriesRoutes from "./routes/seriesRoutes";

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

// 🔹 Routes
app.use("/api/items", itemRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/series", seriesRoutes);

export default app;
