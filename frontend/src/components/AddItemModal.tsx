// src/components/AddItemModal.tsx
import React from "react";
import { Item } from "../types/Item";
import { Modal } from "./Modal";

interface Props {
  newItem: Omit<Item, "id">;
  setNewItem: React.Dispatch<React.SetStateAction<Omit<Item, "id">>>;
  onAdd: () => void;
  onClose: () => void;
}

export const AddItemModal = ({ newItem, setNewItem, onAdd, onClose }: Props) => {
  return (
    <Modal title="Add Item" onClose={onClose}>
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
      <div className="mt-3 d-flex justify-content-end gap-2">
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={onAdd}>
          Add
        </button>
      </div>
    </Modal>
  );
};
