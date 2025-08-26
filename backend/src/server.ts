import express from "express";

const app = express();
const PORT = process.env.PORT || 8888;

// Add a test route
app.get("/", (req, res) => {
  res.send("Hello from Inventory System API 🚀");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
