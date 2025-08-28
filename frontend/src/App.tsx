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


  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await axios.get("http://localhost:8888/api/inventory");
    setItems(res.data);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    await axios.delete(`http://localhost:8888/api/inventory/${id}`);
    setItems(items.filter((item) => item.id !== id));
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
    const res = await axios.post("http://localhost:8888/api/inventory", newItem);
    setItems([...items, res.data]);
    setNewItem({ name: "", category: "", quantity: 0, series: "" });
    setShowAddModal(false);
  };

  return (
    
    <><div className="mb-3">
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
        {/* Dynamically populate unique categories */}
        {[...new Set(items.map((item) => item.category).filter((cat): cat is string => !!cat))].map((cat) => (
  <option key={cat} value={cat}>
    {cat}
  </option>
        ))}
      </select>
    </div><div className="container mt-4">
        <h1>📦 Inventory</h1>
        <button className="btn btn-primary mb-3" onClick={() => setShowAddModal(true)}>
          ➕ Add Item
        </button>

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
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Category"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} />
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Quantity"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })} />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Series (optional)"
                    value={newItem.series}
                    onChange={(e) => setNewItem({ ...newItem, series: e.target.value })} />
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
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} />
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })} />
                  <input
                    type="number"
                    className="form-control mb-2"
                    value={editingItem.quantity}
                    onChange={(e) => setEditingItem({ ...editingItem, quantity: parseInt(e.target.value) || 0 })} />
                  <input
                    type="text"
                    className="form-control"
                    value={editingItem.series}
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
      </div></>
  );
}

export default App;
