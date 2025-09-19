// src/components/ItemList.tsx
import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { Item } from "../types/Item";
import { Log } from "../types/Log";
import Layout from "./Layout"; // ✅ Import Layout

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("");

  const [newItem, setNewItem] = useState<Omit<Item, "id">>({
    name: "",
    category: "",
    quantity: 0,
    series: "",
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [transactionItem, setTransactionItem] = useState<Item | null>(null);
  const [transactionType, setTransactionType] = useState<"deposit" | "withdraw">("deposit");
  const [transactionAmount, setTransactionAmount] = useState<number>(0);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [logItem, setLogItem] = useState<Item | null>(null);

  const [isLogsLoading, setIsLogsLoading] = useState(false);

  // Fetch items
  const fetchItems = async () => {
    try {
      const res = await axios.get("/inventory");
      if (res.data && Array.isArray(res.data.data)) {
        setItems(res.data.data);
      } else if (Array.isArray(res.data)) {
        setItems(res.data);
      } else {
        setItems([]);
      }
    } catch (err) {
      setItems([]);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch logs
  const fetchLogs = async (item: Item) => {
    setLogItem(item);
    setIsLogsLoading(true);
    setLogs([]);
    try {
      const res = await axios.get(`/logs/${item.id}`);
      const rawLogs = res.data.data || res.data;
      const mappedLogs: Log[] = rawLogs.map((l: any) => ({
        id: Number(l.id),
        itemId: Number(l.itemId),
        type: l.type,
        amount: l.quantity,
        timestamp: new Date(l.date).toISOString(),
      }));
      setLogs(mappedLogs);
    } catch {
      setLogs([]);
    } finally {
      setIsLogsLoading(false);
    }
  };

  // Add Item
  const handleAddItem = async () => {
    try {
      const res = await axios.post("/inventory", newItem);
      setItems([...items, res.data.data]);
      setNewItem({ name: "", category: "", quantity: 0, series: "" });
      setShowAddModal(false);
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  // Delete
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this item?")) return;
    await axios.delete(`/inventory/${id}`);
    setItems(items.filter((it) => it.id !== id));
  };

  // Transaction modal
  const openTransactionModal = (item: Item, type: "deposit" | "withdraw") => {
    setTransactionItem(item);
    setTransactionType(type);
    setTransactionAmount(0);
    setShowTransactionModal(true);
  };

  const handleTransaction = async () => {
    if (!transactionItem) return;
    const latestItem = items.find((it) => it.id === transactionItem.id);
    if (!latestItem) return;

    if (transactionType === "withdraw" && transactionAmount > latestItem.quantity) {
      alert(`Not enough stock. Available: ${latestItem.quantity}`);
      return;
    }

    try {
      const res = await axios.post(
        `/inventory/${transactionItem.id}/${transactionType}`,
        { amount: transactionAmount }
      );
      const updatedItem = res.data.data || res.data;
      setItems(items.map((it) => (it.id === updatedItem.id ? updatedItem : it)));
      setShowTransactionModal(false);
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <Layout>
      <div className="container py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>📦 Inventory</h2>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            ➕ Add Item
          </button>
        </div>

        {/* Filter */}
        <div className="mb-3">
          <label htmlFor="categoryFilter" className="form-label fw-bold">
            Filter by Category:
          </label>
          <select
            id="categoryFilter"
            className="form-select w-auto"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All</option>
            {[...new Set(items.map((i) => i.category).filter(Boolean))].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Items */}
        <div className="card shadow-sm">
          <div className="card-body">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Series</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items
                  .filter((it) => !filterCategory || it.category === filterCategory)
                  .map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td className="fw-semibold">{item.name}</td>
                      <td>
                        <span className="badge bg-info text-dark">{item.category}</span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            item.quantity > 10 ? "bg-success" : "bg-warning text-dark"
                          }`}
                        >
                          {item.quantity}
                        </span>
                      </td>
                      <td>{item.series}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openTransactionModal(item, "deposit")}
                          >
                            Deposit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => openTransactionModal(item, "withdraw")}
                          >
                            Withdraw
                          </button>
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => fetchLogs(item)}
                          >
                            Logs
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Item Modal */}
{showAddModal && (
  <div className="modal d-block" tabIndex={-1} role="dialog">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">➕ Add New Item</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowAddModal(false)}
          ></button>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={newItem.name}
              onChange={(e) =>
                setNewItem({ ...newItem, name: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Category</label>
            <input
              type="text"
              className="form-control"
              value={newItem.category}
              onChange={(e) =>
                setNewItem({ ...newItem, category: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              className="form-control"
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: Number(e.target.value) })
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Series</label>
            <input
              type="text"
              className="form-control"
              value={newItem.series}
              onChange={(e) =>
                setNewItem({ ...newItem, series: e.target.value })
              }
            />
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowAddModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddItem}
          >
            Save Item
          </button>
        </div>
      </div>
    </div>
  </div>
)}
{/* Transaction Modal */}
{showTransactionModal && transactionItem && (
  <div className="modal d-block" tabIndex={-1} role="dialog">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">
            {transactionType === "deposit" ? "💰 Deposit" : "📤 Withdraw"} Item
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowTransactionModal(false)}
          ></button>
        </div>
        <div className="modal-body">
          <p className="fw-bold mb-2">Item: {transactionItem.name}</p>
          <p className="mb-3">
            Current Stock:{" "}
            <span className="badge bg-info">{transactionItem.quantity}</span>
          </p>

          <div className="mb-3">
            <label className="form-label">
              {transactionType === "deposit" ? "Deposit Amount" : "Withdraw Amount"}
            </label>
            <input
              type="number"
              min="1"
              className="form-control"
              value={transactionAmount}
              onChange={(e) => setTransactionAmount(Number(e.target.value))}
              required
            />
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowTransactionModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`btn ${
              transactionType === "deposit" ? "btn-success" : "btn-warning"
            }`}
            onClick={handleTransaction}
          >
            {transactionType === "deposit" ? "Confirm Deposit" : "Confirm Withdraw"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      </div>
    </Layout>
  );
}
