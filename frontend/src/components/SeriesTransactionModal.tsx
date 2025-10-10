// src/components/SeriesTransactionModal.tsx
import React, { useState } from "react";
import { Item } from "../types/Item";
import { Modal } from "./Modal";
import { depositSeries, withdrawSeries } from "../api/series";

interface Props {
  item: Item;
  type: "deposit" | "withdraw";
  onClose: () => void;
  onSuccess?: () => void;
}

export const SeriesTransactionModal = ({ item, type, onClose, onSuccess }: Props) => {
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

    const fromNum = Number(fromSeries);
    const toNum = Number(toSeries);
    if (isNaN(fromNum) || isNaN(toNum)) {
      setError("Series must be valid numbers.");
      return;
    }

    if (fromNum > toNum) {
      setError("From Series cannot be greater than To Series.");
      return;
    }

    const qty = quantity !== "" ? quantity : toNum - fromNum + 1;
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
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to process series transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`${type === "deposit" ? "Deposit" : "Withdraw"} Series - ${item.name}`}
      onClose={onClose}
      size="md"
    >
      {error && <div className="alert alert-danger mb-3">{error}</div>}

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">From Series</label>
          <input
            type="text"
            value={fromSeries}
            onChange={(e) => setFromSeries(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g., 00001"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">To Series</label>
          <input
            type="text"
            value={toSeries}
            onChange={(e) => setToSeries(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g., 00010"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Quantity (optional)</label>
          <input
            type="number"
            step={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
            placeholder="Auto-calculated from series range"
            disabled={loading}
          />
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled={loading}
          >
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
