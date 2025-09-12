"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requestController_1 = require("../controllers/requestController");
const router = (0, express_1.Router)();
// 🔹 Routes
router.get("/", requestController_1.getAllRequests); // GET /requests
router.post("/", requestController_1.createRequest); // POST /requests
router.get("/:id", requestController_1.getRequestById); // GET /requests/:id
router.delete("/:id", requestController_1.deleteRequest); // DELETE /requests/:id
// ✅ Approve / Reject routes
router.put("/:id/approve", requestController_1.approveRequest);
router.put("/:id/reject", requestController_1.rejectRequest);
exports.default = router;
//# sourceMappingURL=requestRoutes.js.map