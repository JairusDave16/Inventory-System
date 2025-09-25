// src/components/AddItemModal.tsx
import React, { useState } from "react";
import { Modal } from "./Modal";

export interface ItemFormState {
  name: string;
  category: string;
  stock: number;
  series?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newItem: ItemFormState) => void;
}

export const AddItemModal = ({ isOpen, onClose, onAdd }: Props) => {
  const [formState, setFormState] = useState<ItemFormState>({
    name: "",
    category: "",
    stock: 0,
    series: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.name || !formState.category || formState.stock < 0) {
      alert("Name, category, and stock are required");
      return;
    }

    onAdd(formState);
    setFormState({ name: "", category: "", stock: 0, series: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal title="Add Item" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Name"
          value={formState.name}
          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
          required
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Category"
          value={formState.category}
          onChange={(e) => setFormState({ ...formState, category: e.target.value })}
          required
        />
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Stock"
          value={formState.stock}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            setFormState({ ...formState, stock: isNaN(value) ? 0 : value });
          }}
          required
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Series"
          value={formState.series || ""}
          onChange={(e) => setFormState({ ...formState, series: e.target.value })}
        />
        <div className="mt-3 d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </div>
      </form>
    </Modal>
  );
};
