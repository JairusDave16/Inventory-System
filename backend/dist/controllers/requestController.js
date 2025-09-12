"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectRequest = exports.approveRequest = exports.deleteRequest = exports.getRequestById = exports.createRequest = exports.getAllRequests = void 0;
// 🔹 Import shared store
const store_1 = require("../data/store");
// In-memory storage for requests
let requests = [];
let requestIdCounter = 1;
// 🔹 Shared validation helper
function findAndValidateRequest(id) {
    const request = requests.find((r) => r.id === id);
    if (!request) {
        return { error: { status: 404, message: "Request not found" } };
    }
    if (request.status !== "pending") {
        return { error: { status: 400, message: "Request already processed" } };
    }
    return { request };
}
// Get all requests
const getAllRequests = (_req, res) => {
    res.json(requests);
};
exports.getAllRequests = getAllRequests;
// Create new request
const createRequest = (req, res) => {
    const { userId, itemId, quantity } = req.body;
    const newRequest = {
        id: requestIdCounter++,
        userId: Number(userId),
        itemId: Number(itemId),
        quantity: Number(quantity),
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    requests.push(newRequest);
    res.status(201).json(newRequest);
};
exports.createRequest = createRequest;
// Get single request
const getRequestById = (req, res) => {
    const id = Number(req.params.id);
    const request = requests.find((r) => r.id === id);
    if (!request) {
        return res.status(404).json({ error: "Request not found" });
    }
    res.json(request);
};
exports.getRequestById = getRequestById;
// Delete request
const deleteRequest = (req, res) => {
    const id = Number(req.params.id);
    requests = requests.filter((r) => r.id !== id);
    res.status(204).send();
};
exports.deleteRequest = deleteRequest;
// Approve request
const approveRequest = (req, res) => {
    const id = Number(req.params.id);
    const { request, error } = findAndValidateRequest(id);
    if (error)
        return res.status(error.status).json({ error: error.message });
    const item = store_1.items.find((i) => i.id === request.itemId);
    if (!item) {
        return res.status(404).json({ error: "Item not found" });
    }
    if (item.stock < request.quantity) {
        return res.status(400).json({ error: "Not enough stock" });
    }
    // ✅ Deduct stock
    item.stock -= request.quantity;
    // ✅ Update request
    request.status = "approved";
    request.updatedAt = new Date();
    res.json({
        message: "Request approved and stock updated successfully",
        request,
        item,
    });
};
exports.approveRequest = approveRequest;
// Reject request
const rejectRequest = (req, res) => {
    const id = Number(req.params.id);
    const { request, error } = findAndValidateRequest(id);
    if (error)
        return res.status(error.status).json({ error: error.message });
    request.status = "rejected";
    request.updatedAt = new Date();
    res.json({
        message: "Request rejected successfully",
        request,
    });
};
exports.rejectRequest = rejectRequest;
//# sourceMappingURL=requestController.js.map