// src/components/CreateRequestForm.tsx
import React, { useState } from "react";
import { createRequest } from "../api/requests";
import { Request } from "../types/request";

interface Props {
  onRequestCreated: (req: Request) => void;
}

const CreateRequestForm: React.FC<Props> = ({ onRequestCreated }) => {
  const [userId, setUserId] = useState("");
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Use API call instead of addRequest
    const newRequest = await createRequest({
      userId: Number(userId),
      itemId: Number(itemId),
      quantity: Number(quantity),
    });

    onRequestCreated(newRequest);

    // reset form
    setUserId("");
    setItemId("");
    setQuantity("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-white rounded shadow">
      <div>
        <label>User ID:</label>
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border p-1 w-full"
          required
        />
      </div>
      <div>
        <label>Item ID:</label>
        <input
          type="number"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          className="border p-1 w-full"
          required
        />
      </div>
      <div>
        <label>Quantity:</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border p-1 w-full"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Create Request
      </button>
    </form>
  );
};

export default CreateRequestForm;
