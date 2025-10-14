// src/components/RequestList.tsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "../api/axios";
import { Item } from "../types/Item";
import { FileText, Check, X, Package, Search, Filter, RefreshCw } from "lucide-react";

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
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

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
    fetchItems();
    fetchRequests();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get("/items");
      setItems(res.data.data || []);
    } catch (err) {
      console.error("Error fetching items:", err);
      setItems([]);
    }
  };

  const fetchRequests = async (page: number = currentPage) => {
    setLoading(true);
    try {
      const res = await axios.get(`/requests?page=${page}&limit=10`);
      const normalized = res.data.data.requests.map((r: Request) => ({
        ...r,
        status: r.status?.toLowerCase() || "pending",
      }));
      setRequests(normalized);
      setPagination(res.data.data.pagination);
      setTotalPages(res.data.data.pagination.totalPages);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async (id: number) => {
    try {
      const res = await axios.get(`/requests/${id}/logs`);
      setLogs(res.data.data || []);
      setShowLogsFor(id);
    } catch (err) {
      console.error("Error fetching logs:", err);
      setLogs([]);
      setShowLogsFor(id);
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesSearch =
        r.id.toString().includes(searchTerm) ||
        r.userId.toString().includes(searchTerm) ||
        items.find((i) => i.id === r.itemId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchTerm, statusFilter, items]);

  const handleCreate = async () => {
    if (!newRequest.userId || !newRequest.itemId || newRequest.quantity <= 0) {
      alert("Please fill in all required fields correctly.");
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
      alert(err.response?.data?.message || "Failed to create request.");
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
      alert(err.response?.data?.message || "Failed to update request.");
    }
  };

  const handleFulfill = async (id: number) => {
    if (!window.confirm("Fulfill this request? This will deduct from inventory.")) return;
    try {
      await axios.put(`/requests/${id}/fulfill`, { actor: "Manager", notes: "" });
      fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to fulfill request.");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="w-7 h-7 text-blue-600" /> Requests
        </h1>
        <button
          onClick={() => fetchRequests()}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl shadow-md mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by ID, User ID, or Item name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="fulfilled">Fulfilled</option>
            </select>
          </div>
        </div>
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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading requests...</span>
          </div>
        ) : (
          <>
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {filteredRequests.length} of {requests.length} requests (Page {currentPage} of {totalPages})
              </p>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Notes</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Approver</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      No requests found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{r.id}</td>
                      <td className="px-4 py-3">{r.userId}</td>
                      <td className="px-4 py-3">
                        {items.find((i) => i.id === r.itemId)?.name || `Item ${r.itemId}`}
                      </td>
                      <td className="px-4 py-3">{r.quantity}</td>
                      <td className="px-4 py-3 max-w-xs truncate" title={r.notes || ""}>
                        {r.notes || "-"}
                      </td>
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
                                className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition text-xs"
                              >
                                <Check className="w-3 h-3 inline mr-1" /> Approve
                              </button>
                              <button
                                onClick={() => handleApprove(r.id, false)}
                                className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition text-xs"
                              >
                                <X className="w-3 h-3 inline mr-1" /> Reject
                              </button>
                            </>
                          )}

                          {r.status === "approved" && (
                            <button
                              onClick={() => handleFulfill(r.id)}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition text-xs"
                            >
                              <Package className="w-3 h-3 inline mr-1" /> Fulfill
                            </button>
                          )}
                          <button
                            onClick={() => fetchLogs(r.id)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-xs"
                          >
                            Logs
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mb-8">
          <button
            onClick={() => fetchRequests(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => fetchRequests(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Logs Section */}
      {showLogsFor && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Logs for Request #{showLogsFor}
            </h3>
            <button
              onClick={() => setShowLogsFor(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No logs found for this request.</p>
            ) : (
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}
