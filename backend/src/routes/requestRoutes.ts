import { Router } from "express";
import {
  getAllRequests,
  createRequest,
  getRequestById,
  deleteRequest,
  approveRequest,
  rejectRequest,   // ✅ new import
} from "../controllers/requestController";

const router = Router();

// 🔹 Routes
router.get("/", getAllRequests);         // GET /requests
router.post("/", createRequest);         // POST /requests
router.get("/:id", getRequestById);      // GET /requests/:id
router.delete("/:id", deleteRequest);    // DELETE /requests/:id

// ✅ Approve / Reject routes
router.put("/:id/approve", approveRequest);
router.put("/:id/reject", rejectRequest);

export default router;
