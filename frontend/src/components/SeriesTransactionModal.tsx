// src/components/SeriesTransactionModal.tsx
import React, { useState } from "react";
import { Item } from "../types/Item";
import { Modal } from "./Modal";
import { depositSeries, withdrawSeries } from "../api/series";

interface Props {
  item: Item;
  type: "deposit" | "withdraw";
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SeriesTransactionModal = ({ item, type, isOpen, onClose, onSuccess }: Props) => {
  const [fromSeries, setFromSeries] = useState("");
  const [toSeries, setToSeries] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!fromSeries || !toSeries) {
      setError("Please provide both From Series and To Series.");
      return;
    }

    const qty = quantity || Number(toSeries) - Number(fromSeries) + 1;
    if (qty <= 0) {
      setError("Invalid quantity calculated from series range.");
      return;
    }

    if (type === "withdraw" && qty > item.stock) {
      setError(`Cannot withdraw more than available stock (${item.stock})`);
      return;
    }

    try {
      setLoading(true);
      if (type === "deposit") {
        await depositSeries({
          itemId: item.id,
          fromSeries,
          toSeries,
          quantity: qty,
        });
      } else {
        await withdrawSeries({
          itemId: item.id,
          fromSeries,
          toSeries,
          quantity: qty,
        });
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to process series transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`${type === "deposit" ? "Deposit" : "Withdraw"} Series - ${item.name}`} onClose={onClose} size="md" isOpen={isOpen}>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="space-y-3">
        <div>
          <label>From Series</label>
          <input
            type="text"
            value={fromSeries}
            onChange={(e) => setFromSeries(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g., 00001"
          />
        </div>

        <div>
          <label>To Series</label>
          <input
            type="text"
            value={toSeries}
            onChange={(e) => setToSeries(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g., 00010"
          />
        </div>

        <div>
          <label>Quantity (optional)</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
            placeholder="Auto-calculated from series range"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 text-white rounded ${
              type === "deposit" ? "bg-blue-600 hover:bg-blue-700" : "bg-amber-500 hover:bg-amber-600"
            }`}
            disabled={loading}
          >
            {loading ? "Processing..." : type === "deposit" ? "Deposit" : "Withdraw"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
