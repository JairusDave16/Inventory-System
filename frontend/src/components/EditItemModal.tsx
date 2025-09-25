// src/components/EditItemModal.tsx
import { useState, useEffect } from "react";
import { updateItem } from "../api/items";
import { Item, ItemFormState } from "../types/Item";

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
  onSave: (updatedItem: Item) => void;
}

export default function EditItemModal({ isOpen, onClose, item, onSave }: EditItemModalProps) {
  // Use the shared ItemFormState for local form state
  const [formState, setFormState] = useState<ItemFormState>({
    name: "",
    category: "",
    stock: 0,
    series: "",
  });

  useEffect(() => {
    if (item) {
      setFormState({
        name: item.name,
        category: item.category || "",
        stock: item.stock,
        series: item.series || "",
      });
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedItem = await updateItem(item.id.toString(), formState);
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
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Category</label>
            <input
              className="border p-2 w-full"
              value={formState.category}
              onChange={(e) => setFormState({ ...formState, category: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-1">Stock</label>
            <input
              type="number"
              className="border p-2 w-full"
              value={formState.stock}
              onChange={(e) =>
                setFormState({ ...formState, stock: parseInt(e.target.value) || 0 })
              }
              required
            />
          </div>

          <div>
            <label className="block mb-1">Series</label>
            <input
              className="border p-2 w-full"
              value={formState.series}
              onChange={(e) => setFormState({ ...formState, series: e.target.value })}
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
