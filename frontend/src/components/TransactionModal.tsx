// src/components/TransactionModal.tsx
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

export const TransactionModal = ({ item, type, amount, setAmount, onSubmit, onClose }: Props) => {
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
    <Modal title={`${type === "deposit" ? "Deposit" : "Withdraw"} ${item.name}`} onClose={onClose}>
      <div className="mb-3">
        <label className="form-label">Amount</label>
        <input
          type="number"
          className="form-control"
          min={1}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>

      {type === "withdraw" && (
        <p className="text-muted">Available Stock: {item.stock}</p>
      )}

      <div className="mt-3 d-flex justify-content-end gap-2">
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button
          className={`btn ${type === "deposit" ? "btn-success" : "btn-warning"}`}
          onClick={handleSubmit}
        >
          {type === "deposit" ? "Deposit" : "Withdraw"}
        </button>
      </div>
    </Modal>
  );
};
