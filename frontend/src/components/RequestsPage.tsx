// frontend/src/components/RequestsPage.tsx
import React, { useEffect, useState } from "react";
import {
  getRequests,
  approveRequest,
  rejectRequest,
  createRequest,
} from "../api/requests";
import { getItems } from "../api/items";
import { Request } from "../types/request";
import { Item } from "../types/Item";

const RequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Form state
  const [newRequest, setNewRequest] = useState({
    userId: "",
    itemId: "",
    quantity: 1,
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch requests
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await getRequests();
      setRequests(data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch items for dropdown
  const fetchItems = async () => {
    try {
      const data = await getItems();
      setItems(data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchItems();
  }, []);

  // Handle approve
  const handleApprove = async (id: number) => {
    try {
      await approveRequest(id);
      fetchRequests();
    } catch (err) {
      console.error("Error approving request:", err);
    }
  };

  // Handle reject
  const handleReject = async (id: number) => {
    try {
      await rejectRequest(id);
      fetchRequests();
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  // Handle create new request
  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createRequest({
        userId: Number(newRequest.userId),
        itemId: Number(newRequest.itemId),
        quantity: Number(newRequest.quantity),
      });

      // Reset form
      setNewRequest({ userId: "", itemId: "", quantity: 1 });
      fetchRequests();
    } catch (err) {
      console.error("Error creating request:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter requests
  const filteredRequests = requests.filter(
    (req) =>
      req.userId.toString().includes(search) ||
      req.itemId.toString().includes(search) ||
      req.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>📑 Requests</h1>
        <input
          type="text"
          className="form-control w-25"
          placeholder="🔍 Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Create Request Form */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">➕ Create Request</h5>
          <form onSubmit={handleCreateRequest} className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="User ID"
                value={newRequest.userId}
                onChange={(e) =>
                  setNewRequest({ ...newRequest, userId: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={newRequest.itemId}
                onChange={(e) =>
                  setNewRequest({ ...newRequest, itemId: e.target.value })
                }
                required
              >
                <option value="">Select Item</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.quantity} left)
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                min="1"
                value={newRequest.quantity}
                onChange={(e) =>
                  setNewRequest({ ...newRequest, quantity: Number(e.target.value) })
                }
                required
              />
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-primary w-100"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Requests Table */}
      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Loading requests...</p>
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((req) => (
                    <tr key={req.id}>
                      <td>{req.id}</td>
                      <td>{req.userId}</td>
                      <td>
                        {items.find((i) => i.id === req.itemId)?.name || req.itemId}
                      </td>
                      <td>{req.quantity}</td>
                      <td>
                        <span
                          className={`badge px-3 py-2 ${
                            req.status === "approved"
                              ? "bg-success"
                              : req.status === "rejected"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td>
                        {req.status === "pending" ? (
                          <>
                            <button
                              className="btn btn-sm btn-outline-success me-2"
                              onClick={() => handleApprove(req.id)}
                            >
                              ✅ Approve
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleReject(req.id)}
                            >
                              ❌ Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-muted">No actions</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-4">
                      No requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsPage;
