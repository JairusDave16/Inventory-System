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

export const TransactionModal = ({
  item,
  type,
  amount,
  setAmount,
  onSubmit,
  onClose,
}: Props) => {
  return (
    <Modal title={`${type === "deposit" ? "Deposit" : "Withdraw"} ${item.name}`} onClose={onClose}>
      <input
        type="number"
        className="form-control"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
      />
      <div className="mt-3 d-flex justify-content-end gap-2">
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={onSubmit}>
          {type === "deposit" ? "Deposit" : "Withdraw"}
        </button>
      </div>
    </Modal>
  );
};
