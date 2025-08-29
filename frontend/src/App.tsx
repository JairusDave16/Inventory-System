import React, { useState, useEffect } from "react";
import axios from "axios";

interface Item {
  id: number;
  name: string;
  category?: string;
  quantity: number;
  series?: string;
}

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState<Omit<Item, "id">>({
    name: "",
    category: "",
    quantity: 0,
    series: "",
  });
 
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [transactionItem, setTransactionItem] = useState<Item | null>(null);
  const [transactionAmount, setTransactionAmount] = useState<number>(0);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState<"deposit" | "withdraw">("deposit");

const openTransactionModal = (item: Item, type: "deposit" | "withdraw") => {
  setTransactionItem(item);
  setTransactionType(type);
  setTransactionAmount(0);
  setShowTransactionModal(true);
};

const handleTransaction = async () => {
  if (!transactionItem) return;

  try {
    const url =
      `http://localhost:8888/api/inventory/${transactionItem.id}/` +
      (transactionType === "deposit" ? "deposit" : "withdraw");

    const res = await axios.post(url, { amount: transactionAmount });

    const { success, message, data } = res.data;

    if (success) {
      // ✅ show confirmation
      alert(message);

      // ✅ update items list with updated item from backend
      setItems(items.map(it => it.id === transactionItem.id ? data : it));

      // ✅ reset modal state
      setShowTransactionModal(false);
      setTransactionItem(null);
      setTransactionAmount(0);
    } else {
      // Backend returned success:false
      alert(`❌ ${message}`);
    }
  } catch (err: any) {
    alert(err.response?.data?.message || err.message);
  }
};


  const fetchItems = async () => {
  try {
    const res = await axios.get("http://localhost:8888/api/inventory");

    const { success, message, data } = res.data;

    if (success) {
      setItems(data);
    } else {
      alert(`❌ ${message}`);
    }
  } catch (err: any) {
    alert(err.response?.data?.message || err.message);
  }
};


  const handleDelete = async (id: number) => {
  if (!window.confirm("Are you sure you want to delete this item?")) return;

  try {
    const res = await axios.delete(`http://localhost:8888/api/inventory/${id}`);
    const { success, message } = res.data;

    if (success) {
      setItems(items.filter((item) => item.id !== id));
      alert("✅ Item deleted successfully!");
    } else {
      alert(`❌ ${message}`);
    }
  } catch (err: any) {
    alert(err.response?.data?.message || err.message);
  }
};


  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editingItem) return;
    await axios.put(`http://localhost:8888/api/inventory/${editingItem.id}`, editingItem);
    setItems(items.map((it) => (it.id === editingItem.id ? editingItem : it)));
    setShowEditModal(false);
  };

  // ---------------- Add Item ----------------
  const handleAddItem = async () => {
  try {
    const res = await axios.post("http://localhost:8888/api/inventory", newItem);
    const { success, message, data } = res.data;

    if (success) {
      setItems([...items, data]); // add the new item from API response
      setNewItem({ name: "", category: "", quantity: 0, series: "" });
      setShowAddModal(false);
      alert("✅ Item added successfully!");
    } else {
      alert(`❌ ${message}`);
    }
  } catch (err: any) {
    alert(err.response?.data?.message || err.message);
  }
};


return (
  <>
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
        <option value="">All Categories</option>
        {[...new Set(items.map((item) => item.category).filter((cat): cat is string => !!cat))].map(
          (cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          )
        )}
      </select>
    </div>

    {/* ---------------- Inventory Table ---------------- */}
    <div className="container mt-4">
      <h1>📦 Inventory</h1>

      {/* Add Item Button */}
      <button className="btn btn-primary mb-3" onClick={() => setShowAddModal(true)}>
        ➕ Add Item
      </button>

      {/* Inventory Table */}
      <table className="table table-bordered mt-3">
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
            .filter((item) => !filterCategory || item.category === filterCategory)
            .map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>{item.series}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="btn btn-sm btn-info me-2" onClick={() => openTransactionModal(item, "deposit")}>Deposit</button>
                  <button className="btn btn-sm btn-secondary me-2" onClick={() => openTransactionModal(item, "withdraw")}>Withdraw</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* ---------------- Add Modal ---------------- */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Item</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body">
                <input type="text" className="form-control mb-2" placeholder="Name"
                  value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
                <input type="text" className="form-control mb-2" placeholder="Category"
                  value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} />
                <input type="number" className="form-control mb-2" placeholder="Quantity"
                  value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })} />
                <input type="text" className="form-control" placeholder="Series (optional)"
                  value={newItem.series} onChange={(e) => setNewItem({ ...newItem, series: e.target.value })} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleAddItem}>Add Item</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Edit Modal ---------------- */}
      {showEditModal && editingItem && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Item</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <input type="text" className="form-control mb-2" value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} />
                <input type="text" className="form-control mb-2" value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })} />
                <input type="number" className="form-control mb-2" value={editingItem.quantity}
                  onChange={(e) => setEditingItem({ ...editingItem, quantity: parseInt(e.target.value) || 0 })} />
                <input type="text" className="form-control" value={editingItem.series}
                  onChange={(e) => setEditingItem({ ...editingItem, series: e.target.value })} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleUpdate}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Transaction Modal ---------------- */}
      {showTransactionModal && transactionItem && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {transactionType === "deposit" ? "Deposit" : "Withdraw"} for {transactionItem.name}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowTransactionModal(false)}></button>
              </div>
              <div className="modal-body">
                <input type="number" className="form-control" placeholder="Amount"
                  value={transactionAmount} onChange={(e) => setTransactionAmount(parseInt(e.target.value) || 0)} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowTransactionModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleTransaction}>
                  {transactionType === "deposit" ? "Deposit" : "Withdraw"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </>
);

}

export default App;
