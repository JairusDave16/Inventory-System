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
    <Modal title="Add New Item" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            placeholder="Enter item name"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            type="text"
            placeholder="Enter category"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none"
            value={formState.category}
            onChange={(e) =>
              setFormState({ ...formState, category: e.target.value })
            }
            required
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock
          </label>
          <input
            type="number"
            min={0}
            placeholder="Enter stock quantity"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            value={formState.stock}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setFormState({ ...formState, stock: isNaN(value) ? 0 : value });
            }}
            required
          />
        </div>

        {/* Series (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Series (Optional)
          </label>
          <input
            type="text"
            placeholder="Enter series (if any)"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none"
            value={formState.series || ""}
            onChange={(e) =>
              setFormState({ ...formState, series: e.target.value })
            }
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition"
          >
            Add Item
          </button>
        </div>
      </form>
    </Modal>
  );
};
