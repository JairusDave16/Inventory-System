import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { Item } from "../types/Item";
import { Log } from "../types/Log";
import Layout from "./Layout";
import { LogsModal } from "./LogsModal";
import { TransactionModal } from "./TransactionModal";
import { AddItemModal, ItemFormState } from "./AddItemModal";

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactionItem, setTransactionItem] = useState<Item | null>(null);
  const [transactionType, setTransactionType] = useState<"deposit" | "withdraw">("deposit");
  const [transactionAmount, setTransactionAmount] = useState<number>(0);
  const [logItem, setLogItem] = useState<Item | null>(null);
  const [isLogsLoading, setIsLogsLoading] = useState(false);
  const [newItem, setNewItem] = useState<ItemFormState>({
    name: "",
    category: "",
    stock: 0,
    series: "",
  });

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
          stock: Number(l.stock),
          date: new Date(l.date).toISOString(),
        }))
      );
    } catch {
      setLogs([]);
    } finally {
      setIsLogsLoading(false);
    }
  };

  const handleAddItem = async (newItem: ItemFormState) => {
    if (!newItem.name || !newItem.category || newItem.stock < 0) {
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
    try {
      await axios.delete(`/inventory/${id}`);
      setItems(items.filter((it) => it.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleTransaction = async () => {
    if (!transactionItem) return;

    if (transactionType === "withdraw" && transactionAmount > transactionItem.stock) {
      alert(`Not enough stock. Available: ${transactionItem.stock}`);
      return;
    }

    try {
      const res = await axios.post(`/inventory/${transactionItem.id}/${transactionType}`, {
        quantity: transactionAmount,
      });
      const updatedItem = res.data.data || res.data;
      setItems(items.map((it) => (it.id === updatedItem.id ? updatedItem : it)));
      setTransactionItem(null);
      setTransactionAmount(0);
      fetchLogs(updatedItem);
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            📦 Inventory
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            ➕ Add Item
          </button>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Filter by Category:
          </label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 w-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Series</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items
                .filter((it) => !filterCategory || it.category === filterCategory)
                .map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{item.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">{item.stock}</td>
                    <td className="px-4 py-3 text-gray-600">{item.series}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-md hover:bg-green-200 transition"
                          onClick={() => {
                            setTransactionItem(item);
                            setTransactionType("deposit");
                            setTransactionAmount(0);
                          }}
                        >
                          Deposit
                        </button>
                        <button
                          className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md hover:bg-yellow-200 transition"
                          onClick={() => {
                            setTransactionItem(item);
                            setTransactionType("withdraw");
                            setTransactionAmount(0);
                          }}
                        >
                          Withdraw
                        </button>
                        <button
                          className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 transition"
                          onClick={() => fetchLogs(item)}
                        >
                          Logs
                        </button>
                        <button
                          className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition"
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

        {/* Modals */}
        <AddItemModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddItem}
        />

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
