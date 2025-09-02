// src/components/DeleteItemModal.tsx
import React from "react";
import { Item } from "../types/Item";

interface DeleteItemModalProps {
  item: Item | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

const DeleteItemModal: React.FC<DeleteItemModalProps> = ({ item, onClose, onConfirm }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
        <p className="mb-6">
          Are you sure you want to delete <strong>{item.name}</strong>?
          <br />
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={() => onConfirm(item.id!)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteItemModal;
