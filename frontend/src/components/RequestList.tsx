// src/components/RequestList.tsx
import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { Item } from "../types/Item";
import { FileText, Check, X, Package } from "lucide-react";

type Request = {
  id: number;
  userId: number;
  itemId: number;
  quantity: number;
  notes?: string;
  approver?: string;
  status: "pending" | "approved" | "rejected" | "fulfilled";
  createdAt: string;
  updatedAt: string;
};

type RequestLog = {
  id: number;
  requestId: number;
  action: "pending" | "approved" | "rejected" | "fulfilled";
  user: string;
  notes?: string;
  date: string;
};

export default function RequestList() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [showLogsFor, setShowLogsFor] = useState<number | null>(null);

  const [newRequest, setNewRequest] = useState<{
    userId: number;
    itemId: number;
    quantity: number;
    notes?: string;
  }>({
    userId: 0,
    itemId: 0,
    quantity: 0,
    notes: "",
  });

  useEffect(() => {
    // Fetch items
    axios
      .get("/items")
      .then((res) => {
        console.log("Fetched items:", res.data.data);
        setItems(res.data.data);
      })
      .catch((err) => console.error("Error fetching items:", err));

    // Fetch requests
    fetchRequests();
  }, []);
  

  const fetchRequests = async () => {
  try {
    const res = await axios.get("/requests");
    const normalized = res.data.data.map((r: Request) => ({
      ...r,
      status: r.status?.toLowerCase() || "pending",
    }));
    setRequests(normalized);
  } catch {
    setRequests([]);
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
    if (!newRequest.userId || !newRequest.itemId || newRequest.quantity <= 0) {
      alert("Fill out all fields");
      return;
    }
    try {
      await axios.post("/requests", {
        userId: newRequest.userId,
        itemId: newRequest.itemId,
        quantity: newRequest.quantity,
        notes: newRequest.notes,
      });
      setNewRequest({
        userId: 0,
        itemId: 0,
        quantity: 0,
        notes: "",
      });
      fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleApprove = async (id: number, approve: boolean) => {
    if (!window.confirm(approve ? "Approve this request?" : "Reject this request?")) return;
    try {
      await axios.put(`/requests/${id}/approve`, {
        approve,
        approver: "Manager",
        notes: "",
      });
      fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleFulfill = async (id: number) => {
    if (!window.confirm("Fulfill this request? This will deduct from inventory.")) return;
    try {
      await axios.put(`/requests/${id}/fulfill`, { actor: "Manager", notes: "" });
      fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="w-7 h-7 text-blue-600" /> Requests
        </h1>
      </div>

      {/* New Request Form */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Create New Request</h2>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input
            type="number"
            placeholder="User ID"
            value={newRequest.userId || ""}
            onChange={(e) => setNewRequest({ ...newRequest, userId: Number(e.target.value) })}
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Notes (optional)"
            value={newRequest.notes || ""}
            onChange={(e) => setNewRequest({ ...newRequest, notes: e.target.value })}
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <select
            value={newRequest.itemId || ""}
            onChange={(e) => setNewRequest({ ...newRequest, itemId: Number(e.target.value) })}
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Item</option>
            {items.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name} (Stock: {i.stock})
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Quantity"
            value={newRequest.quantity || ""}
            onChange={(e) => setNewRequest({ ...newRequest, quantity: Number(e.target.value) })}
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Submit Request
        </button>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 mb-8 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Approver</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{r.id}</td>
                <td className="px-4 py-3">{r.userId}</td>
                <td className="px-4 py-3">
                  {items.find((i) => i.id === r.itemId)?.name || r.itemId} × {r.quantity}
                </td>
                <td className="px-4 py-3">{r.notes || "-"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      r.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : r.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : r.status === "fulfilled"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3">{r.approver || "-"}</td>
                <td className="px-4 py-3">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 flex-wrap">
                    {r.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(r.id, true)}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition"
                        >
                          <Check className="w-4 h-4 inline mr-1" /> Approve
                        </button>
                        <button
                          onClick={() => handleApprove(r.id, false)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
                        >
                          <X className="w-4 h-4 inline mr-1" /> Reject
                        </button>
                      </>
                    )}
                    
                    {r.status === "approved" && (
                      <button
                        onClick={() => handleFulfill(r.id)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
                      >
                        <Package className="w-4 h-4 inline mr-1" /> Fulfill
                      </button>
                    )}
                    <button
                      onClick={() => fetchLogs(r.id)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
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

      {/* Logs Section */}
      {showLogsFor && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Logs for Request #{showLogsFor}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Action</th>
                  <th className="px-4 py-2">User</th>
                  <th className="px-4 py-2">Notes</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{log.id}</td>
                    <td className="px-4 py-2">{log.action}</td>
                    <td className="px-4 py-2">{log.user}</td>
                    <td className="px-4 py-2">{log.notes || "-"}</td>
                    <td className="px-4 py-2">{new Date(log.date).toLocaleString()}</td>
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
