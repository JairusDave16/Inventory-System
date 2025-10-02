// src/components/RequestList.tsx
import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { Item } from "../types/Item";

type Request = {
  id: number;
  user: string;
  items: { itemId: number; quantity: number }[];
  notes?: string;
  approver?: string;
  status: "pending" | "approved" | "rejected" | "fulfilled";
  date: string;
};

type RequestLog = {
  id: number;
  requestId: number;
  action: "submitted" | "approved" | "rejected" | "fulfilled";
  user: string;
  notes?: string;
  date: string;
};

export default function RequestList() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [showLogsFor, setShowLogsFor] = useState<number | null>(null);

  const [newRequest, setNewRequest] = useState<Request>({
    id: 0,
    user: "",
    items: [{ itemId: 0, quantity: 0 }],
    notes: "",
    status: "pending",
    date: new Date().toISOString(),
  });

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
    setItems(res.data.items || []); // ✅ explicitly grab the array
  } catch {
    setItems([]);
  }
};


  const fetchLogs = async (id: number) => {
    try {
      const res = await axios.get(`/requests/${id}/logs`);
      setLogs(res.data);
      setShowLogsFor(id);
    } catch {
      setLogs([]);
      setShowLogsFor(id);
    }
  };

  const handleCreate = async () => {
    if (!newRequest.user || newRequest.items.length === 0 || newRequest.items[0].quantity <= 0) {
      alert("Fill out all fields");
      return;
    }
    try {
      await axios.post("/requests", {
        user: newRequest.user,
        items: newRequest.items.map((it) => ({
          itemId: Number(it.itemId),
          quantity: Number(it.quantity),
        })),
        notes: newRequest.notes,
      });
      setNewRequest({
        id: 0,
        user: "",
        items: [{ itemId: 0, quantity: 0 }],
        notes: "",
        status: "pending",
        date: new Date().toISOString(),
      });
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
      await axios.post(`/requests/${id}/fulfill`, { actor: "Manager" });
      fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  // Update single item in the request
  const updateItemField = (index: number, field: "itemId" | "quantity", value: string | number) => {
    const updatedItems = [...newRequest.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setNewRequest({ ...newRequest, items: updatedItems });
  };

  const addItemField = () => {
    setNewRequest({ ...newRequest, items: [...newRequest.items, { itemId: 0, quantity: 0 }] });
  };

  return (
    <div className="container py-4">
      <h2>📋 Requests</h2>

      {/* New Request Form */}
      <div className="card p-3 mb-4 shadow-sm">
        <h5>Create New Request</h5>
        <div className="row g-2 mb-2">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="User"
              value={newRequest.user}
              onChange={(e) => setNewRequest({ ...newRequest, user: e.target.value })}
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Notes (optional)"
              value={newRequest.notes || ""}
              onChange={(e) => setNewRequest({ ...newRequest, notes: e.target.value })}
            />
          </div>
        </div>

        {newRequest.items.map((it, idx) => (
          <div key={idx} className="row g-2 mb-2">
            <div className="col-md-4">
              <select
                className="form-select"
                value={it.itemId || ""}
                onChange={(e) => updateItemField(idx, "itemId", Number(e.target.value))}
              >
                <option value="">Select Item</option>
                {items.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name} (Stock: {i.stock})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <input
                type="number"
                className="form-control"
                placeholder="Quantity"
                value={it.quantity || ""}
                onChange={(e) => updateItemField(idx, "quantity", Number(e.target.value))}
              />
            </div>
          </div>
        ))}

        <div className="row g-2">
          <div className="col-md-3">
            <button className="btn btn-outline-secondary w-100" onClick={addItemField}>
              ➕ Add Item
            </button>
          </div>
          <div className="col-md-3">
            <button className="btn btn-primary w-100" onClick={handleCreate}>
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Items</th>
                <th>Notes</th>
                <th>Status</th>
                <th>Approver</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.user}</td>
                  <td>
                    {r.items.map((it, idx) => (
                      <div key={idx}>
                        {items.find((i) => i.id === it.itemId)?.name || it.itemId} × {it.quantity}
                      </div>
                    ))}
                  </td>
                  <td>{r.notes || "-"}</td>
                  <td>
                    <span
                      className={`badge ${
                        r.status === "approved"
                          ? "bg-success"
                          : r.status === "rejected"
                          ? "bg-danger"
                          : r.status === "fulfilled"
                          ? "bg-info"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td>{r.approver || "-"}</td>
                  <td>{new Date(r.date).toLocaleString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      {r.status === "pending" && (
                        <>
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
                        </>
                      )}
                      {r.status === "approved" && (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleFulfill(r.id)}
                        >
                          Fulfill
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => fetchLogs(r.id)}
                      >
                        Logs
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Logs Section */}
      {showLogsFor && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h5>Logs for Request #{showLogsFor}</h5>
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Action</th>
                  <th>User</th>
                  <th>Notes</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td>{log.action}</td>
                    <td>{log.user}</td>
                    <td>{log.notes || "-"}</td>
                    <td>{new Date(log.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
