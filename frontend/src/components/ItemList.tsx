import React, { useState, useEffect, useCallback } from "react";
import { Item } from "../types/Item";
import { Log } from "../types/Log";
import Layout from "./Layout";
import { LogsModal } from "./LogsModal";
import { TransactionModal } from "./TransactionModal";
import { AddItemModal, ItemFormState } from "./AddItemModal";
import { SeriesTransactionModal } from "./SeriesTransactionModal";
import { getItems, getItemLogs, createItem, adjustStock, deleteItem, bulkDeleteItems } from "../api/items";
import { Search, Plus, Trash2, Package, TrendingUp, TrendingDown, BarChart3, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import toast from 'react-hot-toast';

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  const [transactionItem, setTransactionItem] = useState<Item | null>(null);
  const [transactionType, setTransactionType] = useState<"deposit" | "withdraw">("deposit");
  const [transactionAmount, setTransactionAmount] = useState<number>(0);

  const [logItem, setLogItem] = useState<Item | null>(null);
  const [isLogsLoading, setIsLogsLoading] = useState(false);

  // Series transaction state
  const [seriesModalItem, setSeriesModalItem] = useState<Item | null>(null);
  const [seriesType, setSeriesType] = useState<"deposit" | "withdraw">("deposit");

  const [newItem, setNewItem] = useState<ItemFormState>({
    name: "",
    category: "",
    stock: 0,
    series: "",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = useCallback(async (page: number = currentPage) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getItems(page, 10);
      setItems(response.items);
      setPagination(response.pagination);
      setTotalPages(response.pagination.totalPages);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err.message || "Failed to fetch items");
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  const fetchLogs = useCallback(async (item: Item) => {
    setLogItem(item);
    setIsLogsLoading(true);
    setLogs([]);
    try {
      const fetchedLogs = await getItemLogs(item.id.toString());
      setLogs(fetchedLogs);
    } catch {
      setLogs([]);
    } finally {
      setIsLogsLoading(false);
    }
  }, []);

  const handleAddItem = useCallback(async (newItem: ItemFormState) => {
    if (!newItem.name || !newItem.category || newItem.stock < 0) {
      toast.error("Name, category, and stock are required");
      return;
    }
    try {
      const createdItem = await createItem(newItem);
      setItems([...items, createdItem]);
      setNewItem({ name: "", category: "", stock: 0, series: "" });
      setShowAddModal(false);
      toast.success("Item created successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    }
  }, [items]);

  const handleDelete = useCallback(async (id: number) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await deleteItem(id.toString());
      setItems(items.filter((it) => it.id !== id));
      toast.success("Item deleted successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    }
  }, [items]);

  const handleTransaction = useCallback(async () => {
    if (!transactionItem) return;

    if (transactionType === "withdraw" && transactionAmount > transactionItem.stock) {
      alert(`Not enough stock. Available: ${transactionItem.stock}`);
      return;
    }

    try {
      const updatedItem = await adjustStock(transactionItem.id.toString(), transactionType, transactionAmount);
      setItems(items.map((it) => (it.id === updatedItem.id ? updatedItem : it)));
      setTransactionItem(null);
      setTransactionAmount(0);
      fetchLogs(updatedItem);
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  }, [transactionItem, transactionType, transactionAmount, items, fetchLogs]);

  const handleSeriesSuccess = () => {
    // Refresh the inventory list after a series deposit/withdraw
    fetchItems();
    setSeriesModalItem(null);
  };

  const handleBulkDelete = useCallback(async () => {
    if (!window.confirm(`Delete ${selectedItems.length} selected items?`)) return;
    try {
      await bulkDeleteItems(selectedItems);
      setItems(items.filter((item) => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      toast.success(`${selectedItems.length} items deleted successfully`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    }
  }, [selectedItems, items]);

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="w-8 h-8" />
            Inventory Management
          </h2>
          <div className="flex gap-2">
            {selectedItems.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected ({selectedItems.length})
              </button>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>
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
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === items.filter(it => !filterCategory || it.category === filterCategory).length && selectedItems.length > 0}
                    onChange={(e) => {
                      const filteredItems = items.filter(it => !filterCategory || it.category === filterCategory);
                      if (e.target.checked) {
                        setSelectedItems(filteredItems.map(item => item.id));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                  />
                </th>
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
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems([...selectedItems, item.id]);
                          } else {
                            setSelectedItems(selectedItems.filter(id => id !== item.id));
                          }
                        }}
                      />
                    </td>
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
                        {/* Normal transactions */}
                        <button
                          className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-md hover:bg-green-200 transition flex items-center gap-1"
                          onClick={() => {
                            setTransactionItem(item);
                            setTransactionType("deposit");
                            setTransactionAmount(0);
                          }}
                        >
                          <TrendingUp className="w-3 h-3" />
                          Deposit
                        </button>
                        <button
                          className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md hover:bg-yellow-200 transition flex items-center gap-1"
                          onClick={() => {
                            setTransactionItem(item);
                            setTransactionType("withdraw");
                            setTransactionAmount(0);
                          }}
                        >
                          <TrendingDown className="w-3 h-3" />
                          Withdraw
                        </button>

                        {/* Series transactions */}
                        <button
                          className="text-sm bg-green-200 text-green-800 px-3 py-1 rounded-md hover:bg-green-300 transition flex items-center gap-1"
                          onClick={() => {
                            setSeriesModalItem(item);
                            setSeriesType("deposit");
                          }}
                        >
                          <TrendingUp className="w-3 h-3" />
                          Series
                        </button>
                        <button
                          className="text-sm bg-yellow-200 text-yellow-800 px-3 py-1 rounded-md hover:bg-yellow-300 transition flex items-center gap-1"
                          onClick={() => {
                            setSeriesModalItem(item);
                            setSeriesType("withdraw");
                          }}
                        >
                          <TrendingDown className="w-3 h-3" />
                          Series
                        </button>

                        <button
                          className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 transition flex items-center gap-1"
                          onClick={() => fetchLogs(item)}
                        >
                          <BarChart3 className="w-3 h-3" />
                          Logs
                        </button>
                        <button
                          className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition flex items-center gap-1"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => fetchItems(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={() => fetchItems(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

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

        {seriesModalItem && (
          <SeriesTransactionModal
            item={seriesModalItem}
            type={seriesType}
            onClose={() => setSeriesModalItem(null)}
            onSuccess={handleSeriesSuccess}
          />
        )}
      </div>
    </Layout>
  );
}
