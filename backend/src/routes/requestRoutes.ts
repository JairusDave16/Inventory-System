import { Router } from "express";
import {
  getAllRequests,
  createRequest,
  getRequestById,
  updateRequest,
  deleteRequest,
} from "../controllers/requestController";

const router = Router();

// 🔹 Routes
router.get("/", getAllRequests);         // GET /requests
router.post("/", createRequest);         // POST /requests
router.get("/:id", getRequestById);      // GET /requests/:id
router.put("/:id", updateRequest);       // PUT /requests/:id
router.delete("/:id", deleteRequest);    // DELETE /requests/:id

export default router;
