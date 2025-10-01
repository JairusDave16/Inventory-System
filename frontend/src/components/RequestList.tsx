// src/components/RequestList.tsx
import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { Item } from "../types/Item";

type Request = {
  id: number;
  itemId: number;
  quantity: number;
  requester: string;
  approver?: string;
  status: "pending" | "approved" | "rejected" | "fulfilled";
  date: string;
  fulfilledBy?: string;
};

export default function RequestList() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [newRequest, setNewRequest] = useState({ itemId: "", quantity: 0, requester: "" });

  useEffect(() => {
    fetchRequests();
    fetchItems();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("/requests");
      setRequests(res.data);
    } catch {
      setRequests([]);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await axios.get("/items");
      setItems(res.data);
    } catch {
      setItems([]);
    }
  };

  const handleCreate = async () => {
    if (!newRequest.itemId || newRequest.quantity <= 0 || !newRequest.requester) {
      alert("Fill out all fields");
      return;
    }
    try {
      await axios.post("/requests", {
        itemId: Number(newRequest.itemId),
        quantity: Number(newRequest.quantity),
        requester: newRequest.requester,
      });
      setNewRequest({ itemId: "", quantity: 0, requester: "" });
      fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await axios.post(`/requests/${id}/approve`, { approver: "Manager" });
      fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await axios.post(`/requests/${id}/reject`, { approver: "Manager" });
      fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleFulfill = async (id: number) => {
    try {
      await axios.post(`/requests/${id}/fulfill`, { fulfilledBy: "Storekeeper" });
      fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container py-4">
      <h2>📋 Requests</h2>

      {/* New Request Form */}
      <div className="card p-3 mb-4 shadow-sm">
        <h5>Create New Request</h5>
        <div className="row g-2">
          <div className="col-md-3">
            <select
              className="form-select"
              value={newRequest.itemId}
              onChange={(e) => setNewRequest({ ...newRequest, itemId: e.target.value })}
            >
              <option value="">Select Item</option>
              {items.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.name} (Stock: {it.stock})
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Quantity"
              value={newRequest.quantity || ""}
              onChange={(e) => setNewRequest({ ...newRequest, quantity: Number(e.target.value) })}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Requester"
              value={newRequest.requester}
              onChange={(e) => setNewRequest({ ...newRequest, requester: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100" onClick={handleCreate}>
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Requester</th>
                <th>Status</th>
                <th>Approver</th>
                <th>Fulfilled By</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{items.find((i) => i.id === r.itemId)?.name || r.itemId}</td>
                  <td>{r.quantity}</td>
                  <td>{r.requester}</td>
                  <td>
                    <span
                      className={`badge ${
                        r.status === "approved"
                          ? "bg-success"
                          : r.status === "rejected"
                          ? "bg-danger"
                          : r.status === "fulfilled"
                          ? "bg-primary"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td>{r.approver || "-"}</td>
                  <td>{r.fulfilledBy || "-"}</td>
                  <td>{new Date(r.date).toLocaleString()}</td>
                  <td>
                    {r.status === "pending" && (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => handleApprove(r.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleReject(r.id)}
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {r.status === "approved" && (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleFulfill(r.id)}
                        >
                          Fulfill
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
