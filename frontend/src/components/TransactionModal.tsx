import React from "react";
import { Item } from "../types/Item";
import { Modal } from "./Modal";

interface Props {
  item: Item;
  type: "deposit" | "withdraw";
  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
  onSubmit: () => void;
  onClose: () => void;
}

export const TransactionModal = ({
  item,
  type,
  amount,
  setAmount,
  onSubmit,
  onClose,
}: Props) => {
  const handleSubmit = () => {
    if (amount <= 0) {
      alert("Amount must be greater than 0");
      return;
    }
    if (type === "withdraw" && amount > item.stock) {
      alert(`Cannot withdraw more than available stock (${item.stock})`);
      return;
    }
    onSubmit();
  };

  return (
    <Modal
      title={`${type === "deposit" ? "Deposit" : "Withdraw"} ${item.name}`}
      onClose={onClose}
      size="sm"
    >
      <div className="space-y-4">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter amount"
          />
        </div>

        {/* Stock info (for withdraw) */}
        {type === "withdraw" && (
          <p className="text-sm text-gray-500">
            Available Stock:{" "}
            <span className="font-semibold text-gray-700">{item.stock}</span>
          </p>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 rounded-lg text-white transition ${
              type === "deposit"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-amber-500 hover:bg-amber-600"
            }`}
          >
            {type === "deposit" ? "Deposit" : "Withdraw"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
