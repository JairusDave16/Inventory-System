import React, { useEffect, useState } from "react";
import {
  getItems,
  getItemLogs,
  adjustStock,
  createItem,
  deleteItem,
} from "../api/items";
import EditItemModal from "./EditItemModal";
import DeleteItemModal from "./DeleteItemModal";
import { Item } from "../types/Item";
import { Log } from "../types/Log";

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);

  const [newItemName, setNewItemName] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("");
  const [newItemStock, setNewItemStock] = useState(0);

  // Edit/Delete modal states
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deletingItem, setDeletingItem] = useState<Item | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const data = await getItems();
    setItems(data);
  };

  const loadLogs = async (itemId: string) => {
  const data = await getItemLogs(itemId);

  // Sort logs by date descending (newest first)
  const sortedLogs = data.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  setLogs(sortedLogs);
};


  const handleAdjustStock = async (
  item: Item,
  type: "deposit" | "withdraw"
) => {
  const quantity = parseInt(prompt(`Enter quantity to ${type}:`) || "0");
  if (quantity <= 0) return;

  const notes = prompt("Enter notes (optional):") || undefined;

  await adjustStock(item.id, type, quantity, notes);
  await loadItems();

  if (selectedItem?.id === item.id) loadLogs(item.id);
};

  const handleCreateItem = async () => {
    if (!newItemName) return alert("Name is required");

    const newItem = await createItem({
      name: newItemName,
      unit: newItemUnit,
      category: newItemCategory,
      stock: newItemStock,
    });

    setItems((prev) => [...prev, newItem]);

    setNewItemName("");
    setNewItemUnit("");
    setNewItemCategory("");
    setNewItemStock(0);
  };

  const handleDeleteItem = async (id: string) => {
    await deleteItem(id);
    setItems((prev) => prev.filter((item) => item.id !== id));

    if (selectedItem?.id === id) {
      setSelectedItem(null);
      setLogs([]);
    }
  };

  return (
    <div>
      <h1>Inventory</h1>

      {/* Create Item Form */}
      <div
        style={{
          marginBottom: "20px",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        <h3>Create New Item</h3>
        <input
          type="text"
          placeholder="Name"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Unit"
          value={newItemUnit}
          onChange={(e) => setNewItemUnit(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category"
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value)}
        />
        <input
          type="number"
          placeholder="Initial Stock"
          value={newItemStock}
          onChange={(e) => setNewItemStock(Number(e.target.value))}
        />
        <button onClick={handleCreateItem}>Create Item</button>
      </div>

      {/* Inventory Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Stock</th>
            <th>Unit</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.stock}</td>
              <td>{item.unit}</td>
              <td>{item.category}</td>
              <td>
                <button onClick={() => handleAdjustStock(item, "deposit")}>
                  Deposit
                </button>
                <button onClick={() => handleAdjustStock(item, "withdraw")}>
                  Withdraw
                </button>
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    loadLogs(item.id);
                  }}
                >
                  View Logs
                </button>
                <button onClick={() => setEditingItem(item)}>Edit</button>
                <button
                  onClick={() => setDeletingItem(item)}
                  style={{ color: "red" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Logs */}
      {selectedItem && (
        <div>
          <h3>Logs for {selectedItem.name}</h3>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Quantity</th>
                <th>Notes</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.type}</td>
                  <td>{log.quantity}</td>
                  <td>{log.notes}</td>
                  <td>{new Date(log.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <EditItemModal
          isOpen={!!editingItem}
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={(updatedItem) => {
            setItems((prev) =>
              prev.map((it) => (it.id === updatedItem.id ? updatedItem : it))
            );
            if (selectedItem?.id === updatedItem.id) {
              loadLogs(updatedItem.id); // Refresh logs after editing
            }
            setEditingItem(null);
          }}
        />
      )}

      {/* Delete Modal */}
      {deletingItem && (
        <DeleteItemModal
          item={deletingItem}
          onClose={() => setDeletingItem(null)}
          onConfirm={(id) => {
            handleDeleteItem(id);
            setDeletingItem(null);
          }}
        />
      )}
    </div>
  );
}
