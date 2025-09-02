// src/components/EditItemModal.tsx
import { useState, useEffect } from "react";
import { updateItem } from "../api/items";
import { Item } from "../types/Item";

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
  onSave: (updatedItem: Item) => void;
}

export default function EditItemModal({ isOpen, onClose, item, onSave }: EditItemModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (item) {
      setName(item.name || "");
      setDescription(item.description || "");
      setUnit(item.unit || "");
      setCategory(item.category || "");
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedItem = await updateItem(item.id, {
      name,
      description,
      unit,
      category,
    });

    onSave(updatedItem); // notify parent with the updated item
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl mb-4">Edit Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              className="border p-2 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Description</label>
            <input
              className="border p-2 w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">Unit</label>
            <input
              className="border p-2 w-full"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">Category</label>
            <input
              className="border p-2 w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
