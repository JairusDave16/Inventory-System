import { Router } from "express";

const router = Router();

// Example route
router.get("/", (req, res) => {
  res.json({ message: "Welcome to the Inventory System API 🚀" });
});

export default router;
