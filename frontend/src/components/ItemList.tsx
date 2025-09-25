import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { Item } from "../types/Item";
import { Log } from "../types/Log";
import Layout from "./Layout";
import { LogsModal } from "./LogsModal";
import { TransactionModal } from "./TransactionModal";
import { AddItemModal } from "./AddItemModal";

interface ItemFormInput {
  name: string;
  category: string;
  stock: number;
  series: string;
}

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("");

  const [newItem, setNewItem] = useState<ItemFormInput>({
    name: "",
    category: "",
    stock: 0,
    series: "",
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [transactionItem, setTransactionItem] = useState<Item | null>(null);
  const [transactionType, setTransactionType] = useState<"deposit" | "withdraw">("deposit");
  const [transactionAmount, setTransactionAmount] = useState<number>(0);
  const [logItem, setLogItem] = useState<Item | null>(null);
  const [isLogsLoading, setIsLogsLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get("/inventory");
      setItems(Array.isArray(res.data.data) ? res.data.data : []);
    } catch {
      setItems([]);
    }
  };

  const fetchLogs = async (item: Item) => {
    setLogItem(item);
    setIsLogsLoading(true);
    setLogs([]);
    try {
      const res = await axios.get(`/inventory/${item.id}/logs`);
      const rawLogs = res.data.data || res.data;
      setLogs(
        rawLogs.map((l: any) => ({
          id: Number(l.id),
          itemId: Number(l.itemId),
          type: l.type,
          amount: l.quantity,
          timestamp: new Date(l.date).toISOString(),
        }))
      );
    } catch {
      setLogs([]);
    } finally {
      setIsLogsLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.category || newItem.stock === undefined) {
      alert("Name, category, and stock are required");
      return;
    }

    try {
      const res = await axios.post("/inventory", newItem);
      setItems([...items, res.data.data]);
      setNewItem({ name: "", category: "", stock: 0, series: "" });
      setShowAddModal(false);
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this item?")) return;
    await axios.delete(`/inventory/${id}`);
    setItems(items.filter((it) => it.id !== id));
  };

  const handleTransaction = async () => {
    if (!transactionItem) return;

    if (transactionType === "withdraw" && transactionAmount > transactionItem.stock) {
      alert(`Not enough stock. Available: ${transactionItem.stock}`);
      return;
    }

    try {
      // ✅ Use deposit/withdraw endpoint matching backend
      const res = await axios.post(
        `/inventory/${transactionItem.id}/${transactionType}`,
        { amount: transactionAmount }
      );
      const updatedItem = res.data.data || res.data;
      setItems(items.map((it) => (it.id === updatedItem.id ? updatedItem : it)));
      setTransactionItem(null);
      setTransactionAmount(0);
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
          <label className="form-label fw-bold">Filter by Category:</label>
          <select
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

        {/* Items Table */}
        <div className="card shadow-sm">
          <div className="card-body">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Stock</th>
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
                      <td>
                        <span className="badge bg-info text-dark">{item.category}</span>
                      </td>
                      <td>{item.stock}</td>
                      <td>{item.series}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              setTransactionItem(item);
                              setTransactionType("deposit");
                              setTransactionAmount(0);
                            }}
                          >
                            Deposit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => {
                              setTransactionItem(item);
                              setTransactionType("withdraw");
                              setTransactionAmount(0);
                            }}
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
          <AddItemModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddItem} // already gets the form data from the modal
          />
        )}


        {/* Transaction Modal */}
        {transactionItem && (
          <TransactionModal
            item={transactionItem}
            type={transactionType}
            amount={transactionAmount}
            setAmount={setTransactionAmount}
            onSubmit={handleTransaction}
            onClose={() => setTransactionItem(null)}
          />
        )}

        {/* Logs Modal */}
        {logItem && (
          <LogsModal
            logs={logs}
            item={logItem}
            isLoading={isLogsLoading}
            onClose={() => {
              setLogItem(null);
              setLogs([]);
            }}
          />
        )}
      </div>
    </Layout>
  );
}
