// src/components/ItemList.tsx
import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { Item } from "../types/Item";
import { Log } from "../types/Log";


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

  // Fetch items
const fetchItems = async () => {
  try {
    const res = await axios.get("/inventory");
    console.log("API response:", res.data); // debug output

    // Backend sends { success, message, data }
    if (res.data && Array.isArray(res.data.data)) {
      setItems(res.data.data);
    } else if (Array.isArray(res.data)) {
      setItems(res.data);
    } else {
      console.warn("Unexpected API response format:", res.data);
      setItems([]);
    }
  } catch (err: any) {
    console.error("Failed to fetch items:", err);
    setItems([]);
  }
};

// ---------------- new state ----------------
const [isLogsLoading, setIsLogsLoading] = useState(false);

// ---------------- fetchLogs ----------------
const fetchLogs = async (item: Item) => {
  setLogItem(item); // open modal immediately
  setIsLogsLoading(true);
  setLogs([]); // clear previous logs

  try {
    const res = await axios.get(`/logs/${item.id}`);
    const rawLogs = res.data.data || res.data;

    // Map backend Log fields to frontend Log type
    const mappedLogs: Log[] = rawLogs.map((l: any) => ({
      id: Number(l.id),
      itemId: Number(l.itemId),
      type: l.type,
      amount: l.quantity, // map quantity -> amount
      timestamp: new Date(l.date).toISOString(), // map date -> timestamp
    }));

    setLogs(mappedLogs);
  } catch (err: any) {
    console.error("Failed to fetch logs:", err);
    setLogs([]);
  } finally {
    setIsLogsLoading(false);
  }
};



  // Handle Add Item
  const handleAddItem = async () => {
  try {
    const res = await axios.post("/inventory", newItem);
    // ✅ unwrap data property
    setItems([...items, res.data.data]);
    setNewItem({ name: "", category: "", quantity: 0, series: "" });
    setShowAddModal(false);
    alert("✅ Item added!");
  } catch (err: any) {
    alert(err.response?.data?.message || err.message);
  }
};


  // Handle Delete
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this item?")) return;
    await axios.delete(`/inventory/${id}`);
    setItems(items.filter((it) => it.id !== id));
  };

  // Open Deposit/Withdraw modal
  const openTransactionModal = (item: Item, type: "deposit" | "withdraw") => {
    setTransactionItem(item);
    setTransactionType(type);
    setTransactionAmount(0);
    setShowTransactionModal(true);
  };

  // Handle Deposit/Withdraw
const handleTransaction = async () => {
  if (!transactionItem) return;

  // always use the latest item from state
  const latestItem = items.find(it => it.id === transactionItem.id);
  if (!latestItem) return;

  if (transactionType === "withdraw" && transactionAmount > latestItem.quantity) {
    alert(
      `Not enough stock to withdraw. Available: ${latestItem.quantity}, Requested: ${transactionAmount}`
    );
    return;
  }

  try {
    const res = await axios.post(
      `/inventory/${transactionItem.id}/${transactionType}`,
      { amount: transactionAmount }
    );

    const updatedItem = res.data.data || res.data;

    // update items state
    setItems(items.map(it => (it.id === updatedItem.id ? updatedItem : it)));

    // close modal
    setShowTransactionModal(false);
    setTransactionItem(null);
    setTransactionAmount(0);
  } catch (err: any) {
    alert(err.response?.data?.message || err.message);
  }
};


  return (
    <div>
      {/* ---------------- Filter ---------------- */}
      <div className="mb-3">
        <label htmlFor="categoryFilter" className="form-label">
          Filter by Category:
        </label>
        <select
          id="categoryFilter"
          className="form-select"
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

      {/* ---------------- Add Item ---------------- */}
      <button className="btn btn-primary mb-3" onClick={() => setShowAddModal(true)}>
        ➕ Add Item
      </button>

      {/* ---------------- Items Table ---------------- */}
      <table className="table table-bordered">
        <thead>
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
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>{item.series}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => openTransactionModal(item, "deposit")}
                  >
                    Deposit
                  </button>
                  <button
                    className="btn btn-sm btn-secondary me-2"
                    onClick={() => openTransactionModal(item, "withdraw")}
                  >
                    Withdraw
                  </button>
                  <button
                    className="btn btn-sm btn-success me-2"
                    onClick={() => fetchLogs(item)}
                  >
                    Logs
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* ---------------- Add Modal ---------------- */}
      {showAddModal && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Add Item</h5>
                <button className="btn-close" onClick={() => setShowAddModal(false)} />
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Category"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                />
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Quantity"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })
                  }
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Series"
                  value={newItem.series}
                  onChange={(e) => setNewItem({ ...newItem, series: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleAddItem}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Transaction Modal ---------------- */}
      {showTransactionModal && transactionItem && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>
                  {transactionType === "deposit" ? "Deposit" : "Withdraw"} {transactionItem.name}
                </h5>
                <button className="btn-close" onClick={() => setShowTransactionModal(false)} />
              </div>
              <div className="modal-body">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Amount"
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowTransactionModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleTransaction}>
                  {transactionType === "deposit" ? "Deposit" : "Withdraw"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Logs Modal ---------------- */}
      {logItem && (
        <div className="modal show d-block">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Logs for {logItem.name}</h5>
                <button className="btn-close" onClick={() => setLogItem(null)} />
              </div>
              <div className="modal-body">
                {isLogsLoading ? (
                  <p>⏳ Fetching logs...</p>
                ) : logs.length > 0 ? (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log.id}>
                          <td>{log.id}</td>
                          <td>{log.type}</td>
                          <td>{log.amount}</td>
                          <td>{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No logs found.</p>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setLogItem(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
