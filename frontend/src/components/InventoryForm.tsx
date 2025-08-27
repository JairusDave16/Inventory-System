import { useState } from "react";
import api from "../api/axios";

interface Props {
  onAdd: () => void;
}

export default function InventoryForm({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [series, setSeries] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/inventory", {
      name,
      category,
      quantity,
      series: series ? series.split(",") : [],
    });
    setName("");
    setCategory("");
    setQuantity(0);
    setSeries("");
    onAdd();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Item Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={e => setCategory(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={e => setQuantity(Number(e.target.value))}
        required
      />
      <input
        type="text"
        placeholder="Series (comma separated)"
        value={series}
        onChange={e => setSeries(e.target.value)}
      />
      <button type="submit">Add Item</button>
    </form>
  );
}
